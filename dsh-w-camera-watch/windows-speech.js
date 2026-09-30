import { spawn as spawnProcess } from 'node:child_process'

const CULTURES = new Map([
  ['zh-CN', 'zh-CN'],
  ['zh-TW', 'zh-TW'],
  ['en-US', 'en-US'],
  ['ja-JP', 'ja-JP'],
  ['ko-KR', 'ko-KR'],
])

export function speechCulture(language) {
  return CULTURES.get(String(language || '').trim()) || 'zh-CN'
}

export function windowsSpeechScript(language) {
  const culture = speechCulture(language)
  return [
    "$ErrorActionPreference = 'Stop'",
    '[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)',
    '$recognizer = $null',
    '$subscription = $null',
    'try {',
    '  Add-Type -AssemblyName System.Speech',
    `  $culture = [Globalization.CultureInfo]::GetCultureInfo('${culture}')`,
    '  $recognizer = New-Object System.Speech.Recognition.SpeechRecognitionEngine($culture)',
    '  $recognizer.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar))',
    '  $recognizer.SetInputToDefaultAudioDevice()',
    "  $subscription = Register-ObjectEvent -InputObject $recognizer -EventName SpeechRecognized -SourceIdentifier 'DshCameraWatchSpeech'",
    '  $recognizer.RecognizeAsync([System.Speech.Recognition.RecognizeMode]::Multiple)',
    `  [Console]::WriteLine(([ordered]@{ type = 'ready'; culture = '${culture}' } | ConvertTo-Json -Compress))`,
    '  [Console]::Out.Flush()',
    '  while ($true) {',
    "    $speechEvent = Wait-Event -SourceIdentifier 'DshCameraWatchSpeech' -Timeout 1",
    '    if ($null -eq $speechEvent) { continue }',
    '    $result = $speechEvent.SourceEventArgs.Result',
    '    if ($null -ne $result -and -not [String]::IsNullOrWhiteSpace($result.Text)) {',
    "      [Console]::WriteLine(([ordered]@{ type = 'result'; text = $result.Text; confidence = [Math]::Round($result.Confidence, 4) } | ConvertTo-Json -Compress))",
    '      [Console]::Out.Flush()',
    '    }',
    '    Remove-Event -EventIdentifier $speechEvent.EventIdentifier -ErrorAction SilentlyContinue',
    '  }',
    '} catch {',
    "  [Console]::WriteLine(([ordered]@{ type = 'error'; message = $_.Exception.Message } | ConvertTo-Json -Compress))",
    '  [Console]::Out.Flush()',
    '  exit 1',
    '} finally {',
    '  if ($null -ne $recognizer) {',
    '    try { $recognizer.RecognizeAsyncCancel() } catch {}',
    '    try { $recognizer.Dispose() } catch {}',
    '  }',
    '  if ($null -ne $subscription) { Unregister-Event -SubscriptionId $subscription.Id -ErrorAction SilentlyContinue }',
    '}',
  ].join('\r\n')
}

function defaultPowerShellPath() {
  const windowsRoot = process.env.SystemRoot || 'C:\\Windows'
  return `${windowsRoot}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`
}

export class WindowsSpeechRecognizer {
  constructor(options = {}) {
    this.language = speechCulture(options.language)
    this.spawn = options.spawn || spawnProcess
    this.onResult = options.onResult || (() => {})
    this.onState = options.onState || (() => {})
    this.startupTimeoutMs = options.startupTimeoutMs ?? 12_000
    this.child = null
    this.buffer = ''
    this.stderr = ''
    this.startupTimer = null
    this.intentionalStop = false
    this.ready = false
  }

  emit(state) {
    this.onState({ culture: this.language, ...state })
  }

  start() {
    if (this.child) return
    if (process.platform !== 'win32') {
      this.emit({ status: 'error', error: 'Windows 本地语音识别仅可在 Windows 上使用。' })
      return
    }
    this.intentionalStop = false
    this.emit({ status: 'starting', error: '' })
    const encoded = Buffer.from(windowsSpeechScript(this.language), 'utf16le').toString('base64')
    const child = this.spawn(defaultPowerShellPath(), [
      '-NoLogo',
      '-NoProfile',
      '-NonInteractive',
      '-ExecutionPolicy', 'Bypass',
      '-EncodedCommand', encoded,
    ], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    this.child = child
    this.startupTimer = setTimeout(() => {
      if (this.ready || this.child !== child) return
      this.emit({ status: 'error', error: 'Windows 语音识别启动超时。' })
      child.kill()
    }, this.startupTimeoutMs)
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', chunk => this.consume(chunk))
    child.stderr.on('data', chunk => { this.stderr = (this.stderr + chunk).slice(-2000) })
    child.on('error', error => {
      if (this.child !== child) return
      this.clearStartupTimer()
      this.emit({ status: 'error', error: error.message || String(error) })
    })
    child.on('exit', code => {
      if (this.child !== child) return
      this.clearStartupTimer()
      this.child = null
      this.ready = false
      if (this.intentionalStop) this.emit({ status: 'stopped', error: '' })
      else this.emit({ status: 'error', error: this.stderr.trim() || `Windows 语音识别进程已退出（${code ?? 'unknown'}）。` })
    })
  }

  consume(chunk) {
    this.buffer += chunk
    const lines = this.buffer.split(/\r?\n/)
    this.buffer = lines.pop() || ''
    for (const line of lines) {
      if (!line.trim()) continue
      let event
      try { event = JSON.parse(line) } catch { continue }
      if (event.type === 'ready') {
        this.ready = true
        this.clearStartupTimer()
        this.emit({ status: 'ready', error: '' })
      } else if (event.type === 'result' && typeof event.text === 'string' && event.text.trim()) {
        this.onResult({ text: event.text.trim(), confidence: Number(event.confidence) || 0, culture: this.language })
      } else if (event.type === 'error') {
        this.emit({ status: 'error', error: String(event.message || 'Windows 语音识别失败。') })
      }
    }
  }

  clearStartupTimer() {
    if (this.startupTimer) clearTimeout(this.startupTimer)
    this.startupTimer = null
  }

  stop() {
    this.intentionalStop = true
    this.clearStartupTimer()
    const child = this.child
    this.child = null
    this.ready = false
    if (child) child.kill()
    this.emit({ status: 'stopped', error: '' })
  }
}
