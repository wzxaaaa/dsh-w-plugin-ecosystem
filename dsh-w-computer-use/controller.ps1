# dsh-w-computer-use controller - physical-pixel input, overlay, and interrupt state.
# ASCII-only because Windows PowerShell 5.1 reads BOM-less scripts as ANSI.
param(
  [Parameter(Mandatory = $true)][string]$CtrlDir,
  [int]$ResumeMs = 2000,
  [int]$IdleMs = 90000
)
$ErrorActionPreference = 'Stop'

# Enable physical virtual-desktop coordinates before loading WinForms.
$dpiSrc = @"
using System;
using System.Runtime.InteropServices;
public static class CUDpi {
    [DllImport("user32.dll", SetLastError=true)]
    private static extern bool SetProcessDpiAwarenessContext(IntPtr value);
    [DllImport("user32.dll", SetLastError=true)]
    private static extern bool SetProcessDPIAware();
    public static void Enable() {
        try {
            if (SetProcessDpiAwarenessContext(new IntPtr(-4))) return;
        } catch (EntryPointNotFoundException) {}
        try { SetProcessDPIAware(); } catch (EntryPointNotFoundException) {}
    }
}
"@
Add-Type -TypeDefinition $dpiSrc
[CUDpi]::Enable()

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$inputSrc = @"
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;

public static class CUInput {
    [StructLayout(LayoutKind.Sequential)]
    public struct POINT { public int X; public int Y; }

    [StructLayout(LayoutKind.Sequential)]
    public struct MOUSEINPUT {
        public int dx;
        public int dy;
        public uint mouseData;
        public uint dwFlags;
        public uint time;
        public UIntPtr dwExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct KEYBDINPUT {
        public ushort wVk;
        public ushort wScan;
        public uint dwFlags;
        public uint time;
        public UIntPtr dwExtraInfo;
    }

    [StructLayout(LayoutKind.Explicit)]
    public struct INPUTUNION {
        [FieldOffset(0)] public MOUSEINPUT mi;
        [FieldOffset(0)] public KEYBDINPUT ki;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct INPUT {
        public uint type;
        public INPUTUNION U;
    }

    [DllImport("user32.dll", SetLastError=true)]
    private static extern uint SendInput(uint count, INPUT[] inputs, int size);
    [DllImport("user32.dll", SetLastError=true)]
    public static extern bool SetCursorPos(int x, int y);
    [DllImport("user32.dll", SetLastError=true)]
    public static extern bool GetCursorPos(out POINT point);
    [DllImport("user32.dll")]
    public static extern short VkKeyScan(char value);

    private static void Send(INPUT input) {
        INPUT[] inputs = new INPUT[] { input };
        if (SendInput(1, inputs, Marshal.SizeOf(typeof(INPUT))) != 1)
            throw new Win32Exception(Marshal.GetLastWin32Error(), "SendInput failed");
    }

    public static void Mouse(uint flags, int data) {
        INPUT input = new INPUT();
        input.type = 0;
        input.U.mi.mouseData = unchecked((uint)data);
        input.U.mi.dwFlags = flags;
        Send(input);
    }

    public static void Key(ushort vk, bool up) {
        INPUT input = new INPUT();
        input.type = 1;
        input.U.ki.wVk = vk;
        input.U.ki.dwFlags = up ? 0x0002u : 0u;
        Send(input);
    }
}
"@
Add-Type -TypeDefinition $inputSrc

$windowSrc = @"
using System;
using System.Text;
using System.Runtime.InteropServices;

public static class CUWin {
    public delegate bool EnumProc(IntPtr hWnd, IntPtr lParam);
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr lParam);
    [DllImport("user32.dll")] public static extern bool IsWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool IsZoomed(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern int GetWindowTextLength(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder value, int count);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);
    [DllImport("user32.dll", SetLastError=true)] public static extern bool SetWindowPos(IntPtr hWnd, IntPtr after, int x, int y, int cx, int cy, uint flags);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int command);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, IntPtr processId);
    [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();
    [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool attach);
    [DllImport("user32.dll")] public static extern int GetWindowLong(IntPtr hWnd, int index);
    [DllImport("user32.dll")] public static extern int SetWindowLong(IntPtr hWnd, int index, int value);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left, Top, Right, Bottom; }

    public static bool ForceForeground(IntPtr hWnd) {
        ShowWindow(hWnd, 9);
        uint current = GetCurrentThreadId();
        uint target = GetWindowThreadProcessId(hWnd, IntPtr.Zero);
        bool attached = target != 0 && target != current && AttachThreadInput(current, target, true);
        try {
            BringWindowToTop(hWnd);
            return SetForegroundWindow(hWnd);
        } finally {
            if (attached) AttachThreadInput(current, target, false);
        }
    }
}
"@
Add-Type -TypeDefinition $windowSrc

$stateFile = Join-Path $CtrlDir 'state.json'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$script:mode = 'idle'
$script:lastX = 0
$script:lastY = 0
$script:hasAgentCursor = $false
$script:userX = 0
$script:userY = 0
$script:userTick = [DateTime]::MinValue
$script:lastCmdTick = [DateTime]::Now
$script:banner = $null
$script:frames = @()

function Get-Cursor {
  $point = New-Object CUInput+POINT
  if (-not [CUInput]::GetCursorPos([ref]$point)) { throw 'GetCursorPos failed' }
  return @([int]$point.X, [int]$point.Y)
}

function Get-VirtualBounds {
  return [System.Windows.Forms.SystemInformation]::VirtualScreen
}

function Convert-Integer([object]$value, [string]$name) {
  if ($null -eq $value) { throw "missing coordinate: $name" }
  $number = [double]$value
  if ([double]::IsNaN($number) -or [double]::IsInfinity($number)) { throw "invalid coordinate: $name" }
  return [int][math]::Round($number)
}

function Assert-Point([object]$x, [object]$y) {
  $px = Convert-Integer $x 'x'
  $py = Convert-Integer $y 'y'
  $bounds = Get-VirtualBounds
  if ($px -lt $bounds.Left -or $px -ge $bounds.Right -or $py -lt $bounds.Top -or $py -ge $bounds.Bottom) {
    throw "point ($px,$py) is outside the physical virtual desktop [$($bounds.X),$($bounds.Y) $($bounds.Width)x$($bounds.Height)]"
  }
  return @($px, $py)
}

function Assert-WindowRect([object]$x, [object]$y, [object]$width, [object]$height) {
  $left = Convert-Integer $x 'x'
  $top = Convert-Integer $y 'y'
  $w = Convert-Integer $width 'width'
  $h = Convert-Integer $height 'height'
  if ($w -le 0 -or $h -le 0 -or $w -gt 32767 -or $h -gt 32767) { throw "invalid window size: $($w)x$($h)" }
  $bounds = Get-VirtualBounds
  if (($left + $w) -le $bounds.Left -or $left -ge $bounds.Right -or ($top + $h) -le $bounds.Top -or $top -ge $bounds.Bottom) {
    throw "window rectangle [$left,$top $($w)x$($h)] does not intersect the physical virtual desktop"
  }
  return @($left, $top, $w, $h)
}

function Move-Cursor([object]$x, [object]$y) {
  $point = Assert-Point $x $y
  if (-not [CUInput]::SetCursorPos($point[0], $point[1])) { throw "SetCursorPos failed for ($($point[0]),$($point[1]))" }
  $script:lastX = $point[0]
  $script:lastY = $point[1]
  $script:hasAgentCursor = $true
}

function Write-JsonAtomic([string]$path, [object]$value) {
  $temp = $path + '.' + $PID + '.' + [Guid]::NewGuid().ToString('N') + '.tmp'
  try {
    [System.IO.File]::WriteAllText($temp, ($value | ConvertTo-Json -Compress -Depth 8), $utf8NoBom)
    if ([System.IO.File]::Exists($path)) {
      [System.IO.File]::Replace($temp, $path, $null)
    } else {
      [System.IO.File]::Move($temp, $path)
    }
  } finally {
    if ([System.IO.File]::Exists($temp)) { [System.IO.File]::Delete($temp) }
  }
}

function Write-State {
  try {
    $cursor = Get-Cursor
    Write-JsonAtomic $stateFile ([ordered]@{
      mode = $script:mode
      x = $cursor[0]
      y = $cursor[1]
      coordinateSpace = 'physical-virtual-desktop'
    })
  } catch {}
}

function Make-ClickThrough($form) {
  $handle = $form.Handle
  $style = [CUWin]::GetWindowLong($handle, -20)
  [CUWin]::SetWindowLong($handle, -20, ($style -bor 0x20 -bor 0x80 -bor 0x08000000)) | Out-Null
}

function Show-NoActivate($form) {
  $handle = $form.Handle
  Make-ClickThrough $form
  if (-not [CUWin]::SetWindowPos($handle, [IntPtr](-1), 0, 0, 0, 0, 0x0053)) {
    throw 'failed to show control overlay'
  }
}

function Show-Overlay {
  if ($script:banner -ne $null) { return }
  $edge = 6
  $bannerHeight = 40
  $primary = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds

  $banner = New-Object System.Windows.Forms.Form
  $banner.AutoScaleMode = [System.Windows.Forms.AutoScaleMode]::None
  $banner.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::None
  $banner.StartPosition = [System.Windows.Forms.FormStartPosition]::Manual
  $banner.Bounds = New-Object System.Drawing.Rectangle($primary.X, $primary.Y, $primary.Width, $bannerHeight)
  $banner.ShowInTaskbar = $false
  $banner.BackColor = [System.Drawing.Color]::FromArgb(255, 135, 206, 250)

  $label = New-Object System.Windows.Forms.Label
  $label.Text = 'DeepSeek Harness is controlling this computer - move the mouse to pause'
  $label.Font = New-Object System.Drawing.Font('Segoe UI', 10, [System.Drawing.FontStyle]::Bold)
  $label.ForeColor = [System.Drawing.Color]::FromArgb(255, 0, 40, 90)
  $label.AutoSize = $false
  $label.Dock = [System.Windows.Forms.DockStyle]::Fill
  $label.TextAlign = [System.Drawing.ContentAlignment]::MiddleCenter
  $banner.Controls.Add($label)
  Show-NoActivate $banner

  $frames = @()
  foreach ($screen in [System.Windows.Forms.Screen]::AllScreens) {
    $bounds = $screen.Bounds
    $frame = New-Object System.Windows.Forms.Form
    $frame.AutoScaleMode = [System.Windows.Forms.AutoScaleMode]::None
    $frame.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::None
    $frame.StartPosition = [System.Windows.Forms.FormStartPosition]::Manual
    $frame.Bounds = $bounds
    $frame.ShowInTaskbar = $false
    $frame.BackColor = [System.Drawing.Color]::FromArgb(255, 173, 216, 230)

    $outer = New-Object System.Drawing.Rectangle(0, 0, $bounds.Width, $bounds.Height)
    $innerWidth = [math]::Max(0, $bounds.Width - (2 * $edge))
    $innerHeight = [math]::Max(0, $bounds.Height - (2 * $edge))
    $inner = New-Object System.Drawing.Rectangle($edge, $edge, $innerWidth, $innerHeight)
    $region = New-Object System.Drawing.Region($outer)
    if ($innerWidth -gt 0 -and $innerHeight -gt 0) { $region.Exclude($inner) }
    $frame.Region = $region
    Show-NoActivate $frame
    $frames += $frame
  }

  $script:banner = $banner
  $script:frames = $frames
}

function Hide-Overlay {
  foreach ($form in @($script:banner) + @($script:frames)) {
    if ($form -ne $null) {
      try { $form.Close() } catch {}
      try { $form.Dispose() } catch {}
    }
  }
  $script:banner = $null
  $script:frames = @()
}

function Set-Mode([string]$nextMode) {
  if ($nextMode -eq $script:mode) { return }
  $script:mode = $nextMode
  if ($nextMode -eq 'controlling') { Show-Overlay } else { Hide-Overlay }
  Write-State
}

function Get-VirtualKey([string]$name) {
  switch ($name) {
    'ENTER' { return 0x0D }
    'TAB' { return 0x09 }
    'ESC' { return 0x1B }
    'ESCAPE' { return 0x1B }
    'BACKSPACE' { return 0x08 }
    'DELETE' { return 0x2E }
    'INSERT' { return 0x2D }
    'HOME' { return 0x24 }
    'END' { return 0x23 }
    'UP' { return 0x26 }
    'DOWN' { return 0x28 }
    'LEFT' { return 0x25 }
    'RIGHT' { return 0x27 }
    'PGUP' { return 0x21 }
    'PAGEUP' { return 0x21 }
    'PGDN' { return 0x22 }
    'PAGEDOWN' { return 0x22 }
    'SPACE' { return 0x20 }
    'LWIN' { return 0x5B }
    'RWIN' { return 0x5C }
    'APPS' { return 0x5D }
    default {
      if ($name -match '^F([1-9]|1[0-9]|2[0-4])$') { return 0x6F + [int]$Matches[1] }
      return 0
    }
  }
}

function Send-Key([string]$keys) {
  if ([string]::IsNullOrWhiteSpace($keys)) { throw 'keys must not be empty' }
  $control = $false
  $alt = $false
  $shift = $false
  $rest = $keys
  while ($rest.Length -gt 0) {
    $prefix = $rest[0]
    if ($prefix -eq '^') { $control = $true; $rest = $rest.Substring(1); continue }
    if ($prefix -eq '%') { $alt = $true; $rest = $rest.Substring(1); continue }
    if ($prefix -eq '+') { $shift = $true; $rest = $rest.Substring(1); continue }
    break
  }
  if ($rest.Length -eq 0) { throw "missing key after modifiers: $keys" }

  $virtualKey = 0
  if ($rest.StartsWith('{')) {
    if (-not $rest.EndsWith('}') -or $rest.IndexOf('}') -ne ($rest.Length - 1)) { throw "invalid key expression: $keys" }
    $virtualKey = Get-VirtualKey $rest.Substring(1, $rest.Length - 2).ToUpperInvariant()
    if ($virtualKey -le 0) { throw "unknown key: $keys" }
  } else {
    if ($rest.Length -ne 1) { throw "keyboard_press accepts one key plus modifiers: $keys" }
    $mapping = [int][CUInput]::VkKeyScan([char]$rest[0])
    if ($mapping -eq -1) { throw "unsupported key: $keys" }
    $virtualKey = $mapping -band 0xFF
    $mappingModifiers = ($mapping -shr 8) -band 0xFF
    if (($mappingModifiers -band 1) -ne 0) { $shift = $true }
    if (($mappingModifiers -band 2) -ne 0) { $control = $true }
    if (($mappingModifiers -band 4) -ne 0) { $alt = $true }
  }

  try {
    if ($control) { [CUInput]::Key(0x11, $false) }
    if ($alt) { [CUInput]::Key(0x12, $false) }
    if ($shift) { [CUInput]::Key(0x10, $false) }
    [CUInput]::Key([uint16]$virtualKey, $false)
    [CUInput]::Key([uint16]$virtualKey, $true)
  } finally {
    if ($shift) { try { [CUInput]::Key(0x10, $true) } catch {} }
    if ($alt) { try { [CUInput]::Key(0x12, $true) } catch {} }
    if ($control) { try { [CUInput]::Key(0x11, $true) } catch {} }
  }
}

function Set-ClipboardWithRetry([object]$value, [bool]$persist) {
  $lastError = $null
  for ($attempt = 0; $attempt -lt 8; $attempt++) {
    try {
      if ($null -eq $value) {
        [System.Windows.Forms.Clipboard]::Clear()
      } elseif ($value -is [string]) {
        [System.Windows.Forms.Clipboard]::SetText([string]$value)
      } else {
        [System.Windows.Forms.Clipboard]::SetDataObject($value, $persist)
      }
      return
    } catch {
      $lastError = $_
      Start-Sleep -Milliseconds 40
    }
  }
  throw $lastError
}

function Do-Type([string]$text) {
  if ($text.Length -eq 0) { return }
  $previous = $null
  $hadPrevious = $false
  try {
    $previous = [System.Windows.Forms.Clipboard]::GetDataObject()
    $hadPrevious = $null -ne $previous
  } catch {}

  try {
    Set-ClipboardWithRetry $text $false
    Start-Sleep -Milliseconds 50
    Send-Key '^v'
    Start-Sleep -Milliseconds 160
  } finally {
    try {
      if ($hadPrevious) { Set-ClipboardWithRetry $previous $true }
      else { Set-ClipboardWithRetry $null $false }
    } catch {}
  }
}

function Get-WindowTitle([IntPtr]$handle) {
  $length = [CUWin]::GetWindowTextLength($handle)
  if ($length -le 0) { return '' }
  $builder = New-Object System.Text.StringBuilder ($length + 1)
  [CUWin]::GetWindowText($handle, $builder, $builder.Capacity) | Out-Null
  return $builder.ToString()
}

function Resolve-Window([string]$title, [string]$handleText) {
  if (-not [string]::IsNullOrWhiteSpace($handleText)) {
    $hex = $handleText.Trim() -replace '^0[xX]', ''
    if ($hex -notmatch '^[0-9a-fA-F]+$') { throw "invalid window handle: $handleText" }
    $handle = [IntPtr]([Convert]::ToInt64($hex, 16))
    if (-not [CUWin]::IsWindow($handle)) { throw "window handle no longer exists: $handleText" }
    return $handle
  }
  if ([string]::IsNullOrWhiteSpace($title)) { throw 'title or handle is required' }

  $script:windowNeedle = $title
  $script:windowMatches = New-Object System.Collections.Generic.List[object]
  $callback = [CUWin+EnumProc]{ param($handle, $unused)
    try {
      if ([CUWin]::IsWindowVisible($handle)) {
        $candidate = Get-WindowTitle $handle
        if ($candidate.Length -gt 0 -and $candidate.IndexOf($script:windowNeedle, [StringComparison]::OrdinalIgnoreCase) -ge 0) {
          $script:windowMatches.Add([pscustomobject]@{ Handle = $handle; Title = $candidate })
        }
      }
    } catch {}
    return $true
  }
  [CUWin]::EnumWindows($callback, [IntPtr]::Zero) | Out-Null

  $exact = @($script:windowMatches | Where-Object { [string]::Equals($_.Title, $title, [StringComparison]::OrdinalIgnoreCase) })
  if ($exact.Count -eq 1) { return [IntPtr]$exact[0].Handle }
  if ($script:windowMatches.Count -eq 1) { return [IntPtr]$script:windowMatches[0].Handle }
  if ($script:windowMatches.Count -eq 0) { throw "window not found: $title" }
  $examples = @($script:windowMatches | Select-Object -First 4 | ForEach-Object { $_.Title }) -join ' | '
  throw "window title is ambiguous ($($script:windowMatches.Count) matches): $title. Use the handle from list_windows. Matches: $examples"
}

function Get-ScreenLayout {
  $virtual = Get-VirtualBounds
  $monitors = @([System.Windows.Forms.Screen]::AllScreens | ForEach-Object {
    [ordered]@{
      device = $_.DeviceName
      primary = [bool]$_.Primary
      x = [int]$_.Bounds.X
      y = [int]$_.Bounds.Y
      width = [int]$_.Bounds.Width
      height = [int]$_.Bounds.Height
      workX = [int]$_.WorkingArea.X
      workY = [int]$_.WorkingArea.Y
      workWidth = [int]$_.WorkingArea.Width
      workHeight = [int]$_.WorkingArea.Height
    }
  })
  return [ordered]@{
    x = [int]$virtual.X
    y = [int]$virtual.Y
    width = [int]$virtual.Width
    height = [int]$virtual.Height
    coordinateSpace = 'physical-virtual-desktop'
    monitors = $monitors
  }
}

function Process-One([string]$path) {
  $name = [System.IO.Path]::GetFileName($path)
  $responsePath = Join-Path $CtrlDir ($name -replace '^cmd-', 'resp-')
  $response = $null
  try {
    $script:lastCmdTick = [DateTime]::Now
    $command = ([System.IO.File]::ReadAllText($path) | ConvertFrom-Json)
    $response = [ordered]@{ ok = $true }

    switch ($command.op) {
      'screen_size' {
        $primary = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
        $response.x = [int]$primary.X
        $response.y = [int]$primary.Y
        $response.width = [int]$primary.Width
        $response.height = [int]$primary.Height
        $response.coordinateSpace = 'physical-virtual-desktop'
      }
      'screen_layout' {
        $layout = Get-ScreenLayout
        foreach ($key in $layout.Keys) { $response[$key] = $layout[$key] }
      }
      'cursor_position' {
        $cursor = Get-Cursor
        $response.x = $cursor[0]
        $response.y = $cursor[1]
        $response.coordinateSpace = 'physical-virtual-desktop'
      }
      'start' {
        $cursor = Get-Cursor
        $script:lastX = $cursor[0]
        $script:lastY = $cursor[1]
        $script:hasAgentCursor = $true
        Set-Mode 'controlling'
      }
      'stop' { Set-Mode 'idle' }
      'move' {
        Move-Cursor $command.x $command.y
        Set-Mode 'controlling'
      }
      'click' {
        Move-Cursor $command.x $command.y
        Start-Sleep -Milliseconds 70
        $button = if ($command.button) { [string]$command.button } else { 'left' }
        $down = 0x0002
        $up = 0x0004
        switch ($button) {
          'left' {}
          'right' { $down = 0x0008; $up = 0x0010 }
          'middle' { $down = 0x0020; $up = 0x0040 }
          default { throw "unsupported mouse button: $button" }
        }
        $clicks = if ($command.clicks) { [int]$command.clicks } else { 1 }
        if ($clicks -lt 1 -or $clicks -gt 2) { throw 'clicks must be 1 or 2' }
        for ($index = 0; $index -lt $clicks; $index++) {
          [CUInput]::Mouse($down, 0)
          Start-Sleep -Milliseconds 35
          [CUInput]::Mouse($up, 0)
          if ($index + 1 -lt $clicks) { Start-Sleep -Milliseconds 80 }
        }
        Set-Mode 'controlling'
      }
      'drag' {
        $start = Assert-Point $command.x1 $command.y1
        $finish = Assert-Point $command.x2 $command.y2
        $button = if ($command.button) { [string]$command.button } else { 'left' }
        if ($button -eq 'left') { $down = 0x0002; $up = 0x0004 }
        elseif ($button -eq 'right') { $down = 0x0008; $up = 0x0010 }
        else { throw "unsupported drag button: $button" }
        $duration = if ($command.durationMs) { [int]$command.durationMs } else { 300 }
        if ($duration -lt 80 -or $duration -gt 5000) { throw 'durationMs must be between 80 and 5000' }
        $distance = [math]::Sqrt([math]::Pow($finish[0] - $start[0], 2) + [math]::Pow($finish[1] - $start[1], 2))
        $steps = [int][math]::Max(2, [math]::Min(120, [math]::Ceiling($distance / 8)))
        $delay = [int][math]::Max(1, [math]::Round($duration / $steps))
        Move-Cursor $start[0] $start[1]
        Start-Sleep -Milliseconds 60
        [CUInput]::Mouse($down, 0)
        try {
          for ($index = 1; $index -le $steps; $index++) {
            $ratio = $index / [double]$steps
            $nextX = [int][math]::Round($start[0] + (($finish[0] - $start[0]) * $ratio))
            $nextY = [int][math]::Round($start[1] + (($finish[1] - $start[1]) * $ratio))
            Move-Cursor $nextX $nextY
            Start-Sleep -Milliseconds $delay
          }
        } finally {
          [CUInput]::Mouse($up, 0)
        }
        Set-Mode 'controlling'
      }
      'scroll' {
        Move-Cursor $command.x $command.y
        $amount = [int]$command.amount
        if ($amount -eq 0 -or [math]::Abs([long]$amount) -gt 12000) { throw 'scroll amount must be between -12000 and 12000 and not zero' }
        Start-Sleep -Milliseconds 50
        [CUInput]::Mouse(0x0800, $amount)
        Set-Mode 'controlling'
      }
      'type' {
        Do-Type ([string]$command.text)
        Set-Mode 'controlling'
      }
      'key' {
        Send-Key ([string]$command.keys)
        Set-Mode 'controlling'
      }
      'list_windows' {
        $script:listNeedle = if ($command.title) { [string]$command.title } else { '' }
        $script:windowRows = New-Object System.Collections.Generic.List[object]
        $foreground = [CUWin]::GetForegroundWindow()
        $callback = [CUWin+EnumProc]{ param($handle, $unused)
          try {
            if ([CUWin]::IsWindowVisible($handle)) {
              $title = Get-WindowTitle $handle
              if ($title.Length -gt 0 -and ($script:listNeedle.Length -eq 0 -or $title.IndexOf($script:listNeedle, [StringComparison]::OrdinalIgnoreCase) -ge 0)) {
                $rect = New-Object CUWin+RECT
                if ([CUWin]::GetWindowRect($handle, [ref]$rect)) {
                  $script:windowRows.Add([ordered]@{
                    title = $title
                    handle = ('0x{0:X}' -f $handle.ToInt64())
                    foreground = ($foreground -eq $handle)
                    minimized = [CUWin]::IsIconic($handle)
                    maximized = [CUWin]::IsZoomed($handle)
                    x = [int]$rect.Left
                    y = [int]$rect.Top
                    width = [int]($rect.Right - $rect.Left)
                    height = [int]($rect.Bottom - $rect.Top)
                  })
                }
              }
            }
          } catch {}
          return $true
        }
        [CUWin]::EnumWindows($callback, [IntPtr]::Zero) | Out-Null
        $response.windows = $script:windowRows.ToArray()
        $response.coordinateSpace = 'physical-virtual-desktop'
      }
      'move_window' {
        $handle = Resolve-Window ([string]$command.title) ([string]$command.handle)
        $rect = Assert-WindowRect $command.x $command.y $command.width $command.height
        [CUWin]::ShowWindow($handle, 9) | Out-Null
        if (-not [CUWin]::SetWindowPos($handle, [IntPtr]::Zero, $rect[0], $rect[1], $rect[2], $rect[3], 0x0040)) {
          throw 'SetWindowPos failed'
        }
        $response.foregrounded = [CUWin]::ForceForeground($handle)
        $response.moved = $true
      }
      'foreground_window' {
        $handle = Resolve-Window ([string]$command.title) ([string]$command.handle)
        $response.foregrounded = [CUWin]::ForceForeground($handle)
      }
      default { throw "unknown op: $($command.op)" }
    }
  } catch {
    $response = [ordered]@{ ok = $false; error = $_.Exception.Message }
  } finally {
    try { Write-JsonAtomic $responsePath $response } catch {}
    Remove-Item -LiteralPath $path -Force -ErrorAction SilentlyContinue
  }
}

function Process-Commands {
  Get-ChildItem -LiteralPath $CtrlDir -Filter 'cmd-*.json' -ErrorAction SilentlyContinue |
    Sort-Object Name |
    ForEach-Object { Process-One $_.FullName }
}

function Tick {
  Process-Commands
  if ($script:mode -ne 'idle' -and ((([DateTime]::Now) - $script:lastCmdTick).TotalMilliseconds -ge $IdleMs)) {
    Set-Mode 'idle'
  }

  $cursor = Get-Cursor
  if ($script:mode -eq 'controlling') {
    if ($script:hasAgentCursor -and ($cursor[0] -ne $script:lastX -or $cursor[1] -ne $script:lastY)) {
      $script:userX = $cursor[0]
      $script:userY = $cursor[1]
      $script:userTick = [DateTime]::Now
      Set-Mode 'interrupted'
    }
  } elseif ($script:mode -eq 'interrupted') {
    $still = $cursor[0] -eq $script:userX -and $cursor[1] -eq $script:userY
    if (-not $still) {
      $script:userX = $cursor[0]
      $script:userY = $cursor[1]
      $script:userTick = [DateTime]::Now
    } elseif ((([DateTime]::Now) - $script:userTick).TotalMilliseconds -ge $ResumeMs) {
      $script:lastX = $cursor[0]
      $script:lastY = $cursor[1]
      $script:hasAgentCursor = $true
      Set-Mode 'controlling'
    }
  }
  Write-State
}

$initialCursor = Get-Cursor
$script:lastX = $initialCursor[0]
$script:lastY = $initialCursor[1]
Write-State

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 120
$timer.Add_Tick({
  try { Tick } catch {
    try { Write-JsonAtomic (Join-Path $CtrlDir 'controller-error.json') ([ordered]@{ error = $_.Exception.Message }) } catch {}
  }
})
$timer.Start()

# No visible anchor form: starting the controller must not steal keyboard focus.
[System.Windows.Forms.Application]::Run()
