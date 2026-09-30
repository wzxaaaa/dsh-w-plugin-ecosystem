'use strict';
(function () {
  const token = location.hash.slice(1);
  history.replaceState(null, '', location.pathname);
  const startButton = document.getElementById('start'), stopButton = document.getElementById('stop');
  const device = document.getElementById('device'), video = document.getElementById('preview'), status = document.getElementById('status');
  let stream = null, label = '', error = '', closed = false, generation = 0;
  async function api(method, value) {
    const response = await fetch('/api/' + method, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(value), signal: AbortSignal.timeout(6000) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '本机连接失败');
    return result;
  }
  function stop() {
    generation += 1;
    if (stream) stream.getTracks().forEach(track => track.stop());
    stream = null; video.srcObject = null; stopButton.disabled = true;
  }
  async function start() {
    stop();
    const current = generation;
    startButton.disabled = true; status.textContent = '正在请求摄像头权限…'; error = '';
    try {
      const next = await navigator.mediaDevices.getUserMedia({ audio: false, video: device.value ? { deviceId: { exact: device.value }, width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 1280 }, height: { ideal: 720 } } });
      if (closed || current !== generation) { next.getTracks().forEach(track => track.stop()); return; }
      stream = next; video.srcObject = next; await video.play();
      const track = next.getVideoTracks()[0]; label = track.label || '系统默认摄像头';
      track.addEventListener('ended', () => { if (stream === next) { stop(); error = '摄像头已断开，请重新启动。'; status.textContent = error; } }, { once: true });
      const devices = (await navigator.mediaDevices.enumerateDevices()).filter(item => item.kind === 'videoinput');
      device.replaceChildren(new Option('系统默认摄像头', ''), ...devices.map((item, i) => new Option(item.label || '摄像头 ' + (i + 1), item.deviceId)));
      device.value = track.getSettings().deviceId || '';
      stopButton.disabled = false; status.textContent = '已连接：' + label + '。可返回 Harness 请求截图。';
    } catch (failure) {
      stop(); error = failure.name === 'NotAllowedError' ? '摄像头授权被拒绝。请在地址栏的网站权限中允许摄像头；也请检查 Windows 摄像头隐私设置。' : failure.message;
      status.textContent = error;
    } finally { startButton.disabled = closed; }
  }
  startButton.addEventListener('click', start);
  device.addEventListener('change', () => { if (stream) start(); });
  stopButton.addEventListener('click', () => { stop(); error = ''; status.textContent = '已停止。'; api('disconnect', {}).catch(() => {}); });
  async function poll() {
    if (closed) return;
    try {
      const result = await api('poll', { ready: Boolean(stream), deviceLabel: label, error });
      if (result.request && stream) {
        try {
          if (!video.videoWidth || !video.videoHeight) throw new Error('摄像头画面尚未就绪，请稍后重试。');
          const canvas = document.createElement('canvas');
          const ratio = Math.min(1, 1280 / video.videoWidth);
          canvas.width = Math.round(video.videoWidth * ratio); canvas.height = Math.round(video.videoHeight * ratio);
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
          await api('submit', { requestId: result.request.id, payload: { mediaType: 'image/jpeg', data: canvas.toDataURL('image/jpeg', .85).split(',')[1], width: canvas.width, height: canvas.height, deviceLabel: label, capturedAt: new Date().toISOString() } });
        } catch (failure) { await api('fail', { requestId: result.request.id, message: failure.message }); }
      }
    } catch (_failure) {
      closed = true; stop(); startButton.disabled = true;
      status.textContent = '与 Harness 的本机连接已关闭。请返回 Harness，重新打开摄像头授权页。';
    }
    if (!closed) poll();
  }
  window.addEventListener('pagehide', () => {
    closed = true; stop();
    fetch('/api/disconnect', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: '{}', keepalive: true }).catch(() => {});
  });
  if (!/^[a-f0-9]{64}$/.test(token)) { closed = true; startButton.disabled = true; status.textContent = '连接链接无效或已过期。请从 Harness 的摄像头设置重新打开。'; }
  else poll();
})();
