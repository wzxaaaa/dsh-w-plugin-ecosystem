window.__ModuleLoader__.load({
  id: "dsh-w-camera-watch",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    var CSS = [
      ".dcw-page{display:flex;flex-direction:column;gap:18px;max-width:920px;padding:4px 0 28px}",
      ".dcw-hero{position:relative;overflow:hidden;padding:22px;border:1px solid var(--dsw-alias-border-l2);border-radius:18px;background:linear-gradient(135deg,color-mix(in srgb,var(--dsw-alias-state-business-primary) 13%,var(--dsw-alias-bg-layer-1)),var(--dsw-alias-bg-layer-1) 58%)}",
      ".dcw-hero:after{content:'';position:absolute;right:-52px;top:-70px;width:190px;height:190px;border-radius:50%;background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 13%,transparent);pointer-events:none}",
      ".dcw-title-row{position:relative;z-index:1;display:flex;align-items:flex-start;justify-content:space-between;gap:18px}",
      ".dcw-kicker{margin:0 0 6px;color:var(--dsw-alias-state-business-primary);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}",
      ".dcw-title{margin:0;color:var(--dsw-alias-label-primary);font-size:24px;line-height:1.3}",
      ".dcw-subtitle{max-width:630px;margin:8px 0 0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1.65}",
      ".dcw-badge{display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;padding:7px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:650;white-space:nowrap}",
      ".dcw-dot{width:8px;height:8px;border-radius:50%;background:var(--dsw-alias-label-quaternary,#aaa);box-shadow:0 0 0 4px color-mix(in srgb,var(--dsw-alias-label-quaternary,#aaa) 13%,transparent)}",
      ".dcw-badge[data-state=ready] .dcw-dot{background:#22a06b;box-shadow:0 0 0 4px rgba(34,160,107,.14)}",
      ".dcw-badge[data-state=starting] .dcw-dot{background:#d89b18;box-shadow:0 0 0 4px rgba(216,155,24,.14)}",
      ".dcw-badge[data-state=error] .dcw-dot{background:#d64545;box-shadow:0 0 0 4px rgba(214,69,69,.14)}",
      ".dcw-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(270px,.65fr);gap:16px}",
      ".dcw-card{padding:16px;border:1px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-layer-1)}",
      ".dcw-card-title{margin:0 0 12px;color:var(--dsw-alias-label-primary);font-size:14px;font-weight:700}",
      ".dcw-preview{position:relative;overflow:hidden;aspect-ratio:16/9;border-radius:12px;background:#101217;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}",
      ".dcw-preview video,.dcw-preview img{display:block;width:100%;height:100%;object-fit:cover}",
      ".dcw-preview-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;color:#a7acb7;font-size:13px;text-align:center}",
      ".dcw-live{position:absolute;left:10px;top:10px;display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:999px;background:rgba(12,14,19,.72);color:#fff;font-size:11px;font-weight:700;backdrop-filter:blur(8px)}",
      ".dcw-live i{display:block;width:7px;height:7px;border-radius:50%;background:#ff4d4f}",
      ".dcw-stack{display:flex;flex-direction:column;gap:12px}",
      ".dcw-field{display:flex;flex-direction:column;gap:6px}",
      ".dcw-label{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:650}",
      ".dcw-select{box-sizing:border-box;width:100%;height:38px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;outline:none}",
      ".dcw-select:focus-visible{border-color:var(--dsw-alias-state-business-primary)}",
      ".dcw-actions{display:flex;flex-wrap:wrap;gap:8px}",
      ".dcw-button{min-height:36px;padding:0 13px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;font-weight:650;cursor:pointer}",
      ".dcw-button:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}",
      ".dcw-button[data-primary=true]{border-color:transparent;background:var(--dsw-alias-state-business-primary);color:#fff}",
      ".dcw-button[data-danger=true]{color:var(--dsw-alias-state-danger-primary,#d64545)}",
      ".dcw-button:disabled{cursor:default;opacity:.5}",
      ".dcw-toggle{display:flex;align-items:flex-start;gap:9px;padding:11px;border-radius:10px;background:var(--dsw-alias-bg-layer-2)}",
      ".dcw-toggle input{margin-top:2px;accent-color:var(--dsw-alias-state-business-primary)}",
      ".dcw-toggle strong{display:block;color:var(--dsw-alias-label-primary);font-size:12px;line-height:18px}",
      ".dcw-toggle span{display:block;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:17px}",
      ".dcw-hint{margin:0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:1.6}",
      ".dcw-error{margin:0;padding:9px 10px;border-radius:9px;background:color-mix(in srgb,var(--dsw-alias-state-danger-primary,#d64545) 10%,transparent);color:var(--dsw-alias-state-danger-primary,#d64545);font-size:12px;line-height:1.5;word-break:break-word}",
      ".dcw-voice{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.55fr);gap:16px;align-items:start}",
      ".dcw-voice-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}",
      ".dcw-voice-copy{margin:4px 0 0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:1.6}",
      ".dcw-voice-status{display:inline-flex;align-items:center;gap:7px;padding:6px 9px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:700;white-space:nowrap}",
      ".dcw-voice-status i{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-label-quaternary,#aaa)}",
      ".dcw-voice-status[data-live=true] i{background:#ff4d4f;box-shadow:0 0 0 4px rgba(255,77,79,.13)}",
      ".dcw-transcript{min-height:52px;margin:12px 0 0;padding:11px 12px;border-radius:10px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.65}",
      ".dcw-transcript b{display:block;margin-bottom:3px;color:var(--dsw-alias-label-primary);font-size:11px}",
      ".dcw-test{margin-top:14px;padding-top:14px;border-top:1px solid var(--dsw-alias-border-l2)}",
      ".dcw-test-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:9px}",
      ".dcw-test-head span{color:var(--dsw-alias-label-secondary);font-size:12px}",
      ".dcw-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:13px}",
      ".dcw-stat{padding:9px;border-radius:10px;background:var(--dsw-alias-bg-layer-2);text-align:center}",
      ".dcw-stat b{display:block;color:var(--dsw-alias-label-primary);font-size:15px}",
      ".dcw-stat span{display:block;margin-top:2px;color:var(--dsw-alias-label-tertiary);font-size:10px}",
      "@media(max-width:760px){.dcw-grid,.dcw-voice{grid-template-columns:1fr}.dcw-title-row{flex-direction:column}.dcw-badge{align-self:flex-start}}",
    ].join("\n");

    var styleId = "dsh-w-camera-watch/styles";
    function installStyle() {
      var existing = document.querySelector("style[data-plugin-css=" + JSON.stringify(styleId) + "]");
      if (existing) return { node: existing, owned: false };
      var node = document.createElement("style");
      node.dataset.plugin = "dsh-w-camera-watch";
      node.dataset.pluginCss = styleId;
      node.textContent = CSS;
      document.head.appendChild(node);
      return { node: node, owned: true };
    }

    var passthrough = { parse: function (value) { return value; } };
    // Lazy schema factory for official Harness; schema keeps older source builds compatible.
    function jsonCodec() {
      return { mode: "strict", typeSymbol: "json", schema: passthrough, create: function () { return passthrough; } };
    }
    function parameter(name) {
      return { name: name, wire: name, source: "json", codec: jsonCodec() };
    }
    function descriptor(method, parameters) {
      return {
        id: "dsh-w-camera-watch#cameraWatch/" + method,
        service: "cameraWatch",
        namespace: "cameraWatch",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: jsonCodec(),
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-camera-watch",
      descriptors: [
        descriptor("poll", [parameter("input")]),
        descriptor("submit", [parameter("input")]),
        descriptor("fail", [parameter("input")]),
        descriptor("getState"),
        descriptor("requestTestCapture", [parameter("input")]),
        descriptor("submitSpeech", [parameter("input")]),
      ],
    };

    function safeStorageGet(key, fallback) {
      try {
        var value = window.localStorage.getItem(key);
        return value === null ? fallback : value;
      } catch (_error) {
        return fallback;
      }
    }

    function safeStorageSet(key, value) {
      try { window.localStorage.setItem(key, value); } catch (_error) {}
    }

    function messageOf(error) {
      if (error && typeof error.message === "string") return error.message;
      return String(error || "Unknown camera error");
    }

    function createCameraRuntime(api, sessions) {
      var AUTO_KEY = "dsh-w-camera-watch/auto-start";
      var DEVICE_KEY = "dsh-w-camera-watch/device-id";
      var VOICE_KEY = "dsh-w-camera-watch/goal-voice";
      var VOICE_LANG_KEY = "dsh-w-camera-watch/voice-language";
      var VOICE_ENGINE_KEY = "dsh-w-camera-watch/voice-engine";
      var listeners = new Set();
      var clientId = window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : "camera-" + Date.now() + "-" + Math.random().toString(36).slice(2);
      var stream = null;
      var timer = null;
      var voiceRestartTimer = null;
      var voiceFlushTimer = null;
      var voiceGeneration = 0;
      var disposed = false;
      var generation = 0;
      var speechRecognition = null;
      var speechStarting = false;
      var voiceBlocked = false;
      var localVoiceReadyLanguage = "";
      var nativeRestartToken = 0;
      var microphonePermissionGranted = false;
      var pendingSpeech = [];
      var pendingSpeechTarget = null;
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      var hiddenVideo = document.createElement("video");
      hiddenVideo.autoplay = true;
      hiddenVideo.muted = true;
      hiddenVideo.playsInline = true;
      var state = {
        status: "stopped",
        error: "",
        bridgeError: "",
        deviceLabel: "",
        devices: [],
        selectedDeviceId: safeStorageGet(DEVICE_KEY, ""),
        autoStart: safeStorageGet(AUTO_KEY, "true") !== "false",
        voiceSupported: true,
        browserVoiceSupported: typeof SpeechRecognition === "function",
        voiceEnabled: safeStorageGet(VOICE_KEY, "true") !== "false",
        voiceLanguage: safeStorageGet(VOICE_LANG_KEY, navigator.language || "zh-CN"),
        voiceEngine: ["windows", "local", "cloud"].indexOf(safeStorageGet(VOICE_ENGINE_KEY, "windows")) >= 0 ? safeStorageGet(VOICE_ENGINE_KEY, "windows") : "windows",
        voiceEngineStatus: "idle",
        voiceListening: false,
        goalActive: false,
        goalObjective: "",
        voiceError: "",
        interimTranscript: "",
        lastTranscript: "",
        sentTranscripts: 0,
        streamRevision: 0,
        bridge: { connectedClients: 0, readyClients: 0, pendingCaptures: 0, cameraReady: false },
      };

      function snapshot() {
        return Object.assign({}, state, {
          devices: state.devices.slice(),
          bridge: Object.assign({}, state.bridge),
        });
      }

      function emit() {
        var value = snapshot();
        listeners.forEach(function (listener) { listener(value); });
      }

      function patch(next) {
        var changed = false;
        Object.keys(next).forEach(function (key) {
          if (state[key] !== next[key]) {
            state[key] = next[key];
            changed = true;
          }
        });
        if (changed) emit();
      }

      function setBridge(next) {
        if (!next) return;
        var previous = JSON.stringify(state.bridge);
        var value = Object.assign({}, state.bridge, next);
        if (JSON.stringify(value) !== previous) patch({ bridge: value });
      }

      function closeStream() {
        generation += 1;
        if (stream) stream.getTracks().forEach(function (track) { track.stop(); });
        stream = null;
        hiddenVideo.srcObject = null;
      }

      async function refreshDevices() {
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.enumerateDevices !== "function") return;
        var all = await navigator.mediaDevices.enumerateDevices();
        var cameras = all.filter(function (device) { return device.kind === "videoinput"; }).map(function (device, index) {
          return { deviceId: device.deviceId, label: device.label || "摄像头 " + (index + 1) };
        });
        if (JSON.stringify(cameras) !== JSON.stringify(state.devices)) patch({ devices: cameras });
      }

      async function start(deviceId) {
        var current = ++generation;
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
          patch({ status: "error", error: "当前页面无法使用 navigator.mediaDevices.getUserMedia；请通过 localhost/桌面版打开 DSH。" });
          throw new Error(state.error);
        }
        if (stream) stream.getTracks().forEach(function (track) { track.stop(); });
        stream = null;
        hiddenVideo.srcObject = null;
        var selected = typeof deviceId === "string" ? deviceId : state.selectedDeviceId;
        patch({ status: "starting", error: "" });
        try {
          var constraints = {
            audio: false,
            video: selected
              ? { deviceId: { exact: selected }, width: { ideal: 1280 }, height: { ideal: 720 } }
              : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: { ideal: "user" } },
          };
          var nextStream = await navigator.mediaDevices.getUserMedia(constraints);
          if (disposed || current !== generation) {
            nextStream.getTracks().forEach(function (track) { track.stop(); });
            return;
          }
          stream = nextStream;
          hiddenVideo.srcObject = stream;
          await hiddenVideo.play().catch(function () {});
          var track = stream.getVideoTracks()[0];
          var settings = track && typeof track.getSettings === "function" ? track.getSettings() : {};
          var actualId = settings.deviceId || selected || "";
          if (actualId) safeStorageSet(DEVICE_KEY, actualId);
          if (track) {
            track.addEventListener("ended", function () {
              if (disposed || current !== generation) return;
              stream = null;
              hiddenVideo.srcObject = null;
              patch({ status: "error", error: "摄像头视频流已经结束。", streamRevision: state.streamRevision + 1 });
            }, { once: true });
          }
          patch({
            status: "ready",
            error: "",
            deviceLabel: track ? track.label || "默认摄像头" : "默认摄像头",
            selectedDeviceId: actualId,
            streamRevision: state.streamRevision + 1,
          });
          await refreshDevices().catch(function () {});
        } catch (error) {
          if (current !== generation) return;
          patch({ status: "error", error: messageOf(error), streamRevision: state.streamRevision + 1 });
          throw error;
        }
      }

      function stop() {
        closeStream();
        patch({ status: "stopped", error: "", deviceLabel: "", streamRevision: state.streamRevision + 1 });
      }

      function setAutoStart(value) {
        var enabled = value === true;
        safeStorageSet(AUTO_KEY, enabled ? "true" : "false");
        patch({ autoStart: enabled });
      }

      function currentGoalTarget() {
        try {
          var list = sessions.list.getSnapshot();
          var selected = Object.values(list.byId || {}).find(function (row) {
            return row.retainedBy && row.retainedBy.mainView > 0;
          });
          var current = list.current != null ? list.current : selected && selected.id;
          if (!current) return null;
          var binding = sessions.binding(current);
          var face = binding && binding.session && binding.session.projections.faceOf("goal");
          var projection = face && face.getSnapshot();
          if (!projection || !projection.goal || projection.goal.phase !== "active") return null;
          return { sessionId: current, goalId: projection.goal.id, objective: projection.goal.objective || "" };
        } catch (_error) {
          return null;
        }
      }

      function newSpeechId() {
        return window.crypto && typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : "speech-" + Date.now() + "-" + Math.random().toString(36).slice(2);
      }

      function clearVoiceRestart() {
        if (voiceRestartTimer !== null) window.clearTimeout(voiceRestartTimer);
        voiceRestartTimer = null;
      }

      function stopVoiceRecognition(clearPending) {
        voiceGeneration += 1;
        clearVoiceRestart();
        speechStarting = false;
        var current = speechRecognition;
        speechRecognition = null;
        if (current) {
          current.onend = null;
          current.onerror = null;
          current.onresult = null;
          try { current.abort(); } catch (_error) {}
        }
        if (clearPending) {
          if (voiceFlushTimer !== null) window.clearTimeout(voiceFlushTimer);
          voiceFlushTimer = null;
          pendingSpeech = [];
          pendingSpeechTarget = null;
          patch({ interimTranscript: "" });
        }
        patch({ voiceListening: false });
      }

      async function ensureMicrophonePermission() {
        if (microphonePermissionGranted) return;
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") return;
        var permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        permissionStream.getTracks().forEach(function (track) { track.stop(); });
        microphonePermissionGranted = true;
      }

      async function flushSpeech() {
        if (voiceFlushTimer !== null) window.clearTimeout(voiceFlushTimer);
        voiceFlushTimer = null;
        var target = pendingSpeechTarget;
        var text = pendingSpeech.join(" ").replace(/\s+/g, " ").trim().slice(0, 5000);
        pendingSpeech = [];
        pendingSpeechTarget = null;
        patch({ interimTranscript: "" });
        if (!target || !text) return;
        try {
          var result = await api.submitSpeech({
            sessionId: target.sessionId,
            speechId: newSpeechId(),
            text: text,
            language: state.voiceLanguage,
            recognizedAt: new Date().toISOString(),
          });
          if (result && result.accepted) {
            patch({ lastTranscript: text, sentTranscripts: state.sentTranscripts + 1, voiceError: "" });
          } else if (result && result.reason !== "no-active-goal") {
            patch({ voiceError: "语音消息未被接收：" + String(result && result.reason || "unknown") });
          }
        } catch (error) {
          patch({ voiceError: messageOf(error) });
        }
      }

      function queueFinalSpeech(text, target) {
        var clean = String(text || "").replace(/\s+/g, " ").trim();
        if (!clean || !target) return;
        if (pendingSpeechTarget && pendingSpeechTarget.sessionId !== target.sessionId) void flushSpeech();
        pendingSpeechTarget = target;
        pendingSpeech.push(clean);
        if (voiceFlushTimer !== null) window.clearTimeout(voiceFlushTimer);
        voiceFlushTimer = window.setTimeout(function () { void flushSpeech(); }, 850);
      }

      function scheduleVoiceRestart() {
        clearVoiceRestart();
        if (disposed || voiceBlocked || !state.voiceEnabled || !currentGoalTarget()) return;
        voiceRestartTimer = window.setTimeout(function () {
          voiceRestartTimer = null;
          reconcileVoice();
        }, 350);
      }

      function localSpeechOptions() {
        return { langs: [state.voiceLanguage], processLocally: true };
      }

      async function prepareLocalSpeech() {
        if (localVoiceReadyLanguage === state.voiceLanguage) return true;
        if (!SpeechRecognition || typeof SpeechRecognition.available !== "function") {
          throw new Error("当前浏览器没有设备端语音识别接口；请更新 DSH，或临时切换到在线识别。");
        }
        patch({ voiceEngineStatus: "checking", voiceError: "" });
        var availability = await SpeechRecognition.available(localSpeechOptions());
        if (availability === "available") {
          localVoiceReadyLanguage = state.voiceLanguage;
          patch({ voiceEngineStatus: "ready", voiceError: "" });
          return true;
        }
        if (availability === "downloadable" || availability === "downloading") {
          if (typeof SpeechRecognition.install !== "function") {
            throw new Error("浏览器缺少本地语音包安装接口，请更新 DSH。");
          }
          patch({ voiceEngineStatus: "installing", voiceError: "" });
          var installed = await SpeechRecognition.install(localSpeechOptions());
          if (!installed) throw new Error("本地语音包安装失败；请点击“安装/检查本地语音包”后重试。");
          localVoiceReadyLanguage = state.voiceLanguage;
          patch({ voiceEngineStatus: "ready", voiceError: "" });
          return true;
        }
        throw new Error("当前识别语言没有可用的本地语音包；可更换语言或临时切换到在线识别。");
      }

      function friendlyVoiceError(code, usingLocal) {
        if (code === "network") {
          return usingLocal
            ? "设备端语音组件启动失败；请点击“安装/检查本地语音包”后重试。"
            : "浏览器在线语音服务连接失败；请切换到“设备端识别”并安装本地语音包。";
        }
        if (code === "language-not-supported" || code === "language-unavailable") {
          return "当前识别语言不可用；请安装对应的本地语音包或更换语言。";
        }
        if (code === "not-allowed" || code === "service-not-allowed") return "麦克风权限被拒绝，请在 DSH 的站点权限中允许麦克风。";
        if (code === "audio-capture") return "没有找到可用麦克风，或麦克风正被其他程序独占。";
        return code;
      }

      async function startVoiceRecognition() {
        if (state.voiceEngine === "windows") return;
        if (disposed || voiceBlocked || speechRecognition || speechStarting || !state.voiceEnabled || typeof SpeechRecognition !== "function") return;
        if (!currentGoalTarget()) return;
        var currentVoiceGeneration = voiceGeneration;
        speechStarting = true;
        patch({ voiceError: "" });
        try {
          await ensureMicrophonePermission();
          if (currentVoiceGeneration !== voiceGeneration) return;
          if (disposed || !state.voiceEnabled || !currentGoalTarget()) {
            speechStarting = false;
            return;
          }
          var usingLocal = state.voiceEngine === "local";
          if (usingLocal) await prepareLocalSpeech();
          else patch({ voiceEngineStatus: "cloud" });
          if (currentVoiceGeneration !== voiceGeneration) return;
          if (disposed || !state.voiceEnabled || !currentGoalTarget()) {
            speechStarting = false;
            return;
          }
          var recognition = new SpeechRecognition();
          speechRecognition = recognition;
          recognition.lang = state.voiceLanguage;
          if (usingLocal && "processLocally" in recognition) recognition.processLocally = true;
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.maxAlternatives = 1;
          recognition.onstart = function () {
            speechStarting = false;
            patch({ voiceListening: true, voiceError: "" });
          };
          recognition.onresult = function (event) {
            var activeTarget = currentGoalTarget();
            if (!activeTarget) return;
            var interim = "";
            for (var i = event.resultIndex || 0; i < event.results.length; i += 1) {
              var result = event.results[i];
              var transcript = result && result[0] ? result[0].transcript : "";
              if (result && result.isFinal) queueFinalSpeech(transcript, activeTarget);
              else interim += transcript;
            }
            patch({ interimTranscript: interim.trim() });
          };
          recognition.onerror = function (event) {
            var code = event && event.error ? String(event.error) : "speech-recognition-error";
            if (code === "not-allowed" || code === "service-not-allowed" || code === "audio-capture" || code === "network" || code === "language-not-supported" || code === "language-unavailable") {
              voiceBlocked = true;
              if (code === "not-allowed" || code === "service-not-allowed" || code === "audio-capture") microphonePermissionGranted = false;
            }
            if (code !== "no-speech" && code !== "aborted") patch({ voiceError: friendlyVoiceError(code, usingLocal), voiceEngineStatus: "error" });
          };
          recognition.onend = function () {
            if (speechRecognition === recognition) speechRecognition = null;
            speechStarting = false;
            patch({ voiceListening: false, interimTranscript: "" });
            scheduleVoiceRestart();
          };
          recognition.start();
        } catch (error) {
          if (currentVoiceGeneration !== voiceGeneration) return;
          speechStarting = false;
          speechRecognition = null;
          if (error && (error.name === "NotAllowedError" || error.name === "NotFoundError")) voiceBlocked = true;
          voiceBlocked = true;
          patch({ voiceListening: false, voiceError: messageOf(error), voiceEngineStatus: "error" });
          scheduleVoiceRestart();
        }
      }

      function reconcileVoice() {
        var target = currentGoalTarget();
        patch({ goalActive: Boolean(target), goalObjective: target ? target.objective : "" });
        if (state.voiceEngine === "windows") {
          if (speechRecognition || speechStarting) stopVoiceRecognition(false);
          return;
        }
        if (!state.voiceSupported || !state.voiceEnabled || !target) {
          if (speechRecognition || speechStarting) stopVoiceRecognition(!target || !state.voiceEnabled);
          return;
        }
        if (!voiceBlocked && !speechRecognition && !speechStarting) void startVoiceRecognition();
      }

      function setVoiceEnabled(value) {
        var enabled = value === true;
        if (enabled) voiceBlocked = false;
        safeStorageSet(VOICE_KEY, enabled ? "true" : "false");
        patch({ voiceEnabled: enabled, voiceError: "" });
        if (!enabled) stopVoiceRecognition(true);
        else reconcileVoice();
      }

      function setVoiceLanguage(language) {
        var value = String(language || "").trim() || "zh-CN";
        safeStorageSet(VOICE_LANG_KEY, value);
        localVoiceReadyLanguage = "";
        patch({ voiceLanguage: value, voiceError: "", voiceEngineStatus: "idle" });
        voiceBlocked = false;
        stopVoiceRecognition(false);
        reconcileVoice();
      }

      function setVoiceEngine(engine) {
        var value = ["windows", "local", "cloud"].indexOf(engine) >= 0 ? engine : "windows";
        safeStorageSet(VOICE_ENGINE_KEY, value);
        patch({ voiceEngine: value, voiceError: "", voiceEngineStatus: "idle" });
        voiceBlocked = false;
        stopVoiceRecognition(false);
        reconcileVoice();
      }

      async function installLocalVoice() {
        voiceBlocked = false;
        localVoiceReadyLanguage = "";
        stopVoiceRecognition(false);
        try {
          await prepareLocalSpeech();
          reconcileVoice();
        } catch (error) {
          voiceBlocked = true;
          patch({ voiceListening: false, voiceError: messageOf(error), voiceEngineStatus: "error" });
        }
      }

      function restartVoice() {
        voiceBlocked = false;
        microphonePermissionGranted = false;
        if (state.voiceEngine === "windows") {
          nativeRestartToken += 1;
          patch({ voiceListening: false, voiceError: "", voiceEngineStatus: "starting" });
        }
        stopVoiceRecognition(false);
        reconcileVoice();
      }

      function attachPreview(node) {
        if (!node) return function () {};
        node.srcObject = stream;
        node.muted = true;
        node.playsInline = true;
        if (stream) node.play().catch(function () {});
        return function () { if (node.srcObject === stream) node.srcObject = null; };
      }

      async function waitForFrame() {
        if (!stream || stream.getVideoTracks().every(function (track) { return track.readyState !== "live"; })) {
          throw new Error("摄像头尚未启动。请在设置页启动摄像头。 ");
        }
        if (hiddenVideo.readyState >= 2 && hiddenVideo.videoWidth > 0) return;
        await new Promise(function (resolve, reject) {
          var done = false;
          var timeout = window.setTimeout(function () {
            if (done) return;
            done = true;
            reject(new Error("摄像头画面尚未准备好。"));
          }, 5000);
          hiddenVideo.addEventListener("loadeddata", function onLoaded() {
            if (done) return;
            done = true;
            window.clearTimeout(timeout);
            resolve();
          }, { once: true });
        });
      }

      async function captureFrame() {
        await waitForFrame();
        var sourceWidth = hiddenVideo.videoWidth;
        var sourceHeight = hiddenVideo.videoHeight;
        var maxSide = 1280;
        var scale = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight));
        var width = Math.max(1, Math.round(sourceWidth * scale));
        var height = Math.max(1, Math.round(sourceHeight * scale));
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext("2d", { alpha: false });
        if (!context) throw new Error("浏览器无法创建摄像头截图画布。 ");
        context.drawImage(hiddenVideo, 0, 0, width, height);
        var dataUrl = canvas.toDataURL("image/jpeg", 0.86);
        return {
          data: dataUrl.slice(dataUrl.indexOf(",") + 1),
          mediaType: "image/jpeg",
          width: width,
          height: height,
          capturedAt: new Date().toISOString(),
          deviceLabel: state.deviceLabel || "默认摄像头",
        };
      }

      async function pollOnce() {
        if (disposed) return;
        reconcileVoice();
        var voiceTarget = currentGoalTarget();
        var delay = 650;
        try {
          var value = await api.poll({
            clientId: clientId,
            ready: state.status === "ready" && Boolean(stream),
            deviceLabel: state.deviceLabel,
            error: state.error,
            nativeVoice: state.voiceEnabled && state.voiceEngine === "windows" && voiceTarget ? {
              enabled: true,
              sessionId: voiceTarget.sessionId,
              goalId: voiceTarget.goalId,
              language: state.voiceLanguage,
              restartToken: nativeRestartToken,
            } : { enabled: false },
          });
          patch({ bridgeError: "" });
          setBridge(value && value.state);
          if (state.voiceEngine === "windows" && value && value.nativeSpeech) {
            patch({
              voiceListening: value.nativeSpeech.status === "ready",
              voiceEngineStatus: value.nativeSpeech.status || "idle",
              voiceError: value.nativeSpeech.error || "",
            });
          }
          if (value && value.request) {
            delay = 40;
            try {
              var payload = await captureFrame();
              await api.submit({ clientId: clientId, requestId: value.request.id, payload: payload });
            } catch (error) {
              await api.fail({ clientId: clientId, requestId: value.request.id, message: messageOf(error) }).catch(function () {});
            }
          }
        } catch (error) {
          patch({ bridgeError: messageOf(error) });
          delay = 1200;
        }
        if (!disposed) timer = window.setTimeout(pollOnce, delay);
      }

      function subscribe(listener) {
        listeners.add(listener);
        listener(snapshot());
        return function () { listeners.delete(listener); };
      }

      function dispose() {
        disposed = true;
        if (timer !== null) window.clearTimeout(timer);
        if (voiceFlushTimer !== null) window.clearTimeout(voiceFlushTimer);
        stopVoiceRecognition(true);
        closeStream();
        listeners.clear();
      }

      pollOnce();
      if (state.autoStart) Promise.resolve().then(function () { return start(); }).catch(function () {});
      return {
        snapshot: snapshot,
        subscribe: subscribe,
        start: start,
        stop: stop,
        setAutoStart: setAutoStart,
        setVoiceEnabled: setVoiceEnabled,
        setVoiceLanguage: setVoiceLanguage,
        setVoiceEngine: setVoiceEngine,
        installLocalVoice: installLocalVoice,
        restartVoice: restartVoice,
        attachPreview: attachPreview,
        captureFrame: captureFrame,
        dispose: dispose,
      };
    }

    function CameraSettings(props) {
      var runtime = props.runtime;
      var t = props.t;
      var stateSlot = React.useState(function () { return runtime.snapshot(); });
      var state = stateSlot[0];
      var setState = stateSlot[1];
      var busySlot = React.useState(false);
      var busy = busySlot[0];
      var setBusy = busySlot[1];
      var testSlot = React.useState(null);
      var testImage = testSlot[0];
      var setTestImage = testSlot[1];
      var testErrorSlot = React.useState("");
      var testError = testErrorSlot[0];
      var setTestError = testErrorSlot[1];
      var videoRef = React.useRef(null);

      React.useEffect(function () { return runtime.subscribe(setState); }, [runtime]);
      React.useEffect(function () { return runtime.attachPreview(videoRef.current); }, [runtime, state.streamRevision]);

      function onStart() {
        setBusy(true);
        runtime.start(state.selectedDeviceId).catch(function () {}).finally(function () { setBusy(false); });
      }

      function onDevice(event) {
        var value = event.currentTarget.value;
        setBusy(true);
        runtime.start(value).catch(function () {}).finally(function () { setBusy(false); });
      }

      function onTest() {
        setBusy(true);
        setTestError("");
        props.requestTestCapture({ question: "设置页测试截图" }).then(function (capture) {
          setTestImage("data:" + capture.mediaType + ";base64," + capture.data);
        }, function (error) {
          setTestError(messageOf(error));
        }).finally(function () { setBusy(false); });
      }

      var statusText = state.status === "ready" ? t("ready")
        : state.status === "starting" ? t("starting")
          : state.status === "error" ? t("errorStatus") : t("stopped");
      var voiceStatusText = !state.voiceSupported ? t("voiceUnsupported")
        : !state.voiceEnabled ? t("voiceDisabled")
          : state.voiceListening ? t("voiceListening")
            : state.voiceEngineStatus === "checking" ? t("voiceChecking")
              : state.voiceEngineStatus === "installing" ? t("voiceInstalling")
            : state.goalActive ? t("voiceStarting") : t("voiceWaitingGoal");

      return React.createElement(
        "section",
        { className: "dcw-page" },
        React.createElement(
          "div",
          { className: "dcw-hero" },
          React.createElement(
            "div",
            { className: "dcw-title-row" },
            React.createElement(
              "div",
              null,
              React.createElement("p", { className: "dcw-kicker" }, "CAMERA + GOAL VOICE"),
              React.createElement("h2", { className: "dcw-title" }, t("title")),
              React.createElement("p", { className: "dcw-subtitle" }, t("subtitle")),
            ),
            React.createElement(
              "span",
              { className: "dcw-badge", "data-state": state.status },
              React.createElement("i", { className: "dcw-dot" }),
              statusText,
            ),
          ),
        ),
        React.createElement(
          "div",
          { className: "dcw-grid" },
          React.createElement(
            "div",
            { className: "dcw-card" },
            React.createElement("h3", { className: "dcw-card-title" }, t("livePreview")),
            React.createElement(
              "div",
              { className: "dcw-preview" },
              React.createElement("video", { ref: videoRef, autoPlay: true, muted: true, playsInline: true }),
              state.status !== "ready" ? React.createElement("div", { className: "dcw-preview-empty" }, t("previewEmpty")) : null,
              state.status === "ready" ? React.createElement("span", { className: "dcw-live" }, React.createElement("i"), "LIVE") : null,
            ),
            React.createElement(
              "div",
              { className: "dcw-stats" },
              React.createElement("div", { className: "dcw-stat" }, React.createElement("b", null, state.bridge.readyClients || 0), React.createElement("span", null, t("readyPages"))),
              React.createElement("div", { className: "dcw-stat" }, React.createElement("b", null, state.bridge.pendingCaptures || 0), React.createElement("span", null, t("pending"))),
              React.createElement("div", { className: "dcw-stat" }, React.createElement("b", null, "JPEG"), React.createElement("span", null, t("format"))),
            ),
            React.createElement(
              "div",
              { className: "dcw-test" },
              React.createElement(
                "div",
                { className: "dcw-test-head" },
                React.createElement("span", null, t("testHint")),
                React.createElement("button", { type: "button", className: "dcw-button", disabled: busy || state.status !== "ready", onClick: onTest }, busy ? t("working") : t("test")),
              ),
              testImage ? React.createElement("div", { className: "dcw-preview" }, React.createElement("img", { src: testImage, alt: t("testResult") })) : null,
              testError ? React.createElement("p", { className: "dcw-error" }, testError) : null,
            ),
          ),
          React.createElement(
            "div",
            { className: "dcw-card dcw-stack" },
            React.createElement("h3", { className: "dcw-card-title" }, t("control")),
            React.createElement(
              "label",
              { className: "dcw-field" },
              React.createElement("span", { className: "dcw-label" }, t("device")),
              React.createElement(
                "select",
                { className: "dcw-select", value: state.selectedDeviceId || "", disabled: busy, onChange: onDevice },
                React.createElement("option", { value: "" }, t("defaultDevice")),
                state.devices.map(function (device) { return React.createElement("option", { key: device.deviceId, value: device.deviceId }, device.label); }),
              ),
            ),
            React.createElement(
              "div",
              { className: "dcw-actions" },
              React.createElement("button", { type: "button", className: "dcw-button", "data-primary": "true", disabled: busy || state.status === "starting", onClick: onStart }, state.status === "ready" ? t("restart") : t("start")),
              React.createElement("button", { type: "button", className: "dcw-button", "data-danger": "true", disabled: state.status === "stopped", onClick: runtime.stop }, t("stop")),
            ),
            React.createElement(
              "label",
              { className: "dcw-toggle" },
              React.createElement("input", { type: "checkbox", checked: state.autoStart, onChange: function (event) { runtime.setAutoStart(event.currentTarget.checked); } }),
              React.createElement("span", null, React.createElement("strong", null, t("autoStart")), React.createElement("span", null, t("autoStartHint"))),
            ),
            React.createElement("p", { className: "dcw-hint" }, state.deviceLabel ? t("using") + state.deviceLabel : t("modelHint")),
            state.error ? React.createElement("p", { className: "dcw-error" }, state.error) : null,
            state.bridgeError ? React.createElement("p", { className: "dcw-error" }, t("bridgeError") + state.bridgeError) : null,
          ),
        ),
        React.createElement(
          "div",
          { className: "dcw-card dcw-voice" },
          React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              { className: "dcw-voice-head" },
              React.createElement(
                "div",
                null,
                React.createElement("h3", { className: "dcw-card-title" }, t("voiceTitle")),
                React.createElement("p", { className: "dcw-voice-copy" }, t("voiceCopy")),
              ),
              React.createElement(
                "span",
                { className: "dcw-voice-status", "data-live": state.voiceListening ? "true" : "false" },
                React.createElement("i"),
                voiceStatusText,
              ),
            ),
            React.createElement(
              "div",
              { className: "dcw-transcript" },
              React.createElement("b", null, state.interimTranscript ? t("recognizing") : t("lastSpeech")),
              state.interimTranscript || state.lastTranscript || t("noSpeech"),
            ),
          ),
          React.createElement(
            "div",
            { className: "dcw-stack" },
            React.createElement(
              "label",
              { className: "dcw-toggle" },
              React.createElement("input", {
                type: "checkbox",
                checked: state.voiceEnabled,
                disabled: !state.voiceSupported,
                onChange: function (event) { runtime.setVoiceEnabled(event.currentTarget.checked); },
              }),
              React.createElement("span", null, React.createElement("strong", null, t("voiceAuto")), React.createElement("span", null, t("voiceAutoHint"))),
            ),
            React.createElement(
              "label",
              { className: "dcw-field" },
              React.createElement("span", { className: "dcw-label" }, t("voiceEngine")),
              React.createElement(
                "select",
                { className: "dcw-select", value: state.voiceEngine, disabled: !state.voiceSupported, onChange: function (event) { runtime.setVoiceEngine(event.currentTarget.value); } },
                React.createElement("option", { value: "windows" }, t("voiceEngineWindows")),
                React.createElement("option", { value: "local", disabled: !state.browserVoiceSupported }, t("voiceEngineLocal")),
                React.createElement("option", { value: "cloud", disabled: !state.browserVoiceSupported }, t("voiceEngineCloud")),
              ),
            ),
            React.createElement(
              "label",
              { className: "dcw-field" },
              React.createElement("span", { className: "dcw-label" }, t("voiceLanguage")),
              React.createElement(
                "select",
                { className: "dcw-select", value: state.voiceLanguage, disabled: !state.voiceSupported, onChange: function (event) { runtime.setVoiceLanguage(event.currentTarget.value); } },
                React.createElement("option", { value: "zh-CN" }, "中文（普通话）"),
                React.createElement("option", { value: "zh-TW" }, "中文（繁體）"),
                React.createElement("option", { value: "en-US" }, "English (US)"),
                React.createElement("option", { value: "ja-JP" }, "日本語"),
                React.createElement("option", { value: "ko-KR" }, "한국어"),
              ),
            ),
            React.createElement(
              "div",
              { className: "dcw-actions" },
              state.voiceEngine === "local" ? React.createElement("button", {
                type: "button",
                className: "dcw-button",
                disabled: !state.browserVoiceSupported || state.voiceEngineStatus === "checking" || state.voiceEngineStatus === "installing",
                onClick: runtime.installLocalVoice,
              }, state.voiceEngineStatus === "installing" ? t("voiceInstalling") : t("installLocalVoice")) : null,
              React.createElement("button", {
                type: "button",
                className: "dcw-button",
                disabled: !state.voiceSupported || !state.voiceEnabled || !state.goalActive,
                onClick: runtime.restartVoice,
              }, t("restartVoice")),
            ),
            React.createElement("p", { className: "dcw-hint" }, state.voiceEngine === "windows" ? t("windowsVoiceHint") : state.voiceEngine === "local" ? t("localVoiceHint") : t("cloudVoiceHint")),
            React.createElement("p", { className: "dcw-hint" }, state.goalActive ? t("activeGoal") + state.goalObjective : t("waitingGoalHint")),
            React.createElement("p", { className: "dcw-hint" }, t("sentSpeech") + String(state.sentTranscripts)),
            state.voiceError ? React.createElement("p", { className: "dcw-error" }, t("voiceError") + state.voiceError) : null,
          ),
        ),
      );
    }

    var NS = "dshWCameraWatch";
    var inject = ["slots", "locale", "remote", "sessions"];
    var dicts = {
      zh: {
        nav: "摄像头监督",
        title: "摄像头监督",
        subtitle: "连接后，模型可随时调用 camera_capture 查看真实画面；活动 Goal 中还会持续识别你的讲话并自动发送。",
        ready: "摄像头已连接",
        starting: "正在连接",
        stopped: "摄像头已停止",
        errorStatus: "连接失败",
        livePreview: "实时画面",
        previewEmpty: "启动摄像头后，这里会显示实时预览。",
        readyPages: "可用页面",
        pending: "等待截图",
        format: "工具图片",
        testHint: "通过与模型工具相同的 Host 桥接链路拍一张测试图。",
        test: "测试截图",
        working: "处理中...",
        testResult: "摄像头测试截图",
        control: "摄像头控制",
        device: "视频来源",
        defaultDevice: "系统默认摄像头",
        start: "启动并授权",
        restart: "重新连接",
        stop: "停止",
        autoStart: "启动 DSH 时自动连接",
        autoStartHint: "浏览器记住许可后，插件会在页面加载时直接恢复摄像头。",
        using: "当前设备：",
        modelHint: "摄像头连接后，无需打开此设置页；模型仍可随时截图。",
        bridgeError: "Host 桥接异常：",
        voiceTitle: "Goal 自动收音",
        voiceCopy: "活动 Goal 打开时持续监听。识别到一句完整讲话后，短暂停顿会触发发送，并作为真正的用户消息进入当前会话队列。",
        voiceUnsupported: "浏览器不支持",
        voiceDisabled: "已关闭",
        voiceListening: "正在收音",
        voiceStarting: "正在启动",
        voiceChecking: "检查本地语音包",
        voiceInstalling: "安装本地语音包中",
        voiceWaitingGoal: "等待 Goal",
        recognizing: "正在识别",
        lastSpeech: "最近发送",
        noSpeech: "还没有识别到讲话。",
        voiceAuto: "Goal 期间自动收音并发送",
        voiceAutoHint: "只要当前会话存在活动 Goal，就会启动浏览器连续语音识别。",
        voiceEngine: "识别引擎",
        voiceEngineWindows: "Windows 本地识别（推荐）",
        voiceEngineLocal: "浏览器设备端识别",
        voiceEngineCloud: "浏览器在线识别",
        voiceLanguage: "识别语言",
        installLocalVoice: "安装/检查本地语音包",
        windowsVoiceHint: "直接使用 Windows 已安装的语音识别器和系统默认麦克风，不经过浏览器在线服务。",
        localVoiceHint: "由浏览器在当前设备识别；首次使用需下载语言包，并非所有语言都有可用包。",
        cloudVoiceHint: "在线识别依赖浏览器厂商服务，网络受限时可能出现 network 错误。",
        restartVoice: "重新启动收音",
        activeGoal: "当前 Goal：",
        waitingGoalHint: "建立并启动 Goal 后，麦克风会自动开始工作。",
        sentSpeech: "本页已发送语音：",
        voiceError: "语音识别异常：",
      },
      en: {
        nav: "Camera Watch",
        title: "Camera Watch",
        subtitle: "The model can inspect live frames with camera_capture, while active Goals continuously transcribe and send your speech.",
        ready: "Camera connected",
        starting: "Connecting",
        stopped: "Camera stopped",
        errorStatus: "Connection failed",
        livePreview: "Live preview",
        previewEmpty: "Start the camera to see the live preview.",
        readyPages: "Ready pages",
        pending: "Pending",
        format: "Tool image",
        testHint: "Capture through the same Host bridge used by the model tool.",
        test: "Test capture",
        working: "Working...",
        testResult: "Camera test capture",
        control: "Camera controls",
        device: "Video source",
        defaultDevice: "System default camera",
        start: "Start and authorize",
        restart: "Reconnect",
        stop: "Stop",
        autoStart: "Connect when DSH starts",
        autoStartHint: "After the browser remembers permission, the plugin reconnects when the page loads.",
        using: "Current device: ",
        modelHint: "The settings page may be closed after connection; model captures remain available.",
        bridgeError: "Host bridge error: ",
        voiceTitle: "Goal voice relay",
        voiceCopy: "While a Goal is active, final speech segments are merged after a short pause and sent as real user messages to the current session queue.",
        voiceUnsupported: "Unsupported browser",
        voiceDisabled: "Disabled",
        voiceListening: "Listening",
        voiceStarting: "Starting",
        voiceChecking: "Checking local pack",
        voiceInstalling: "Installing local pack",
        voiceWaitingGoal: "Waiting for Goal",
        recognizing: "Recognizing",
        lastSpeech: "Last sent",
        noSpeech: "No speech has been recognized yet.",
        voiceAuto: "Listen and send during Goals",
        voiceAutoHint: "Continuous browser speech recognition starts whenever the current session has an active Goal.",
        voiceEngine: "Recognition engine",
        voiceEngineWindows: "Windows local (recommended)",
        voiceEngineLocal: "Browser on-device",
        voiceEngineCloud: "Browser cloud service",
        voiceLanguage: "Recognition language",
        installLocalVoice: "Install/check local language pack",
        windowsVoiceHint: "Uses the Windows speech recognizer and default system microphone without the browser cloud service.",
        localVoiceHint: "Speech is recognized by the browser on this device. A language pack is required and may not exist for every language.",
        cloudVoiceHint: "Cloud recognition depends on the browser vendor service and may fail with a network error on restricted networks.",
        restartVoice: "Restart listening",
        activeGoal: "Active Goal: ",
        waitingGoalHint: "Create and start a Goal to activate the microphone automatically.",
        sentSpeech: "Voice messages sent by this page: ",
        voiceError: "Speech recognition error: ",
      },
    };

    async function apply(ctx) {
      var style = installStyle();
      ctx.effect(function () { return function () { if (style.owned) style.node.remove(); }; }, "dsh-w-camera-watch: styles");
      ctx.effect(function () { return ctx.locale.register(NS, dicts); });
      var unmount = await ctx.remote.$mount(TYPERT_REMOTE);
      ctx.effect(function () { return unmount; }, "dsh-w-camera-watch: remote");
      var cameraWatch = ctx.get("remote.cameraWatch");
      if (!cameraWatch) throw new Error("dsh-w-camera-watch: remote.cameraWatch did not mount");

      async function unwrap(method, args) {
        var result = await cameraWatch[method].apply(cameraWatch, args);
        if (!result.ok) throw new Error("cameraWatch." + method + " failed: " + JSON.stringify(result.error));
        return result.value;
      }

      var runtime = createCameraRuntime({
        poll: function (input) { return unwrap("poll", [input]); },
        submit: function (input) { return unwrap("submit", [input]); },
        fail: function (input) { return unwrap("fail", [input]); },
        submitSpeech: function (input) { return unwrap("submitSpeech", [input]); },
      }, ctx.sessions);
      ctx.effect(function () { return runtime.dispose; }, "dsh-w-camera-watch: camera runtime");
      var t = ctx.locale.bind(NS);
      ctx.slots.inject("settings.section", function () {
        return ctx.slots.register({
          name: "settings.section",
          id: "camera-watch",
          order: 24,
          label: function () { return t("nav"); },
          locale: NS,
          inject: function () {
            return {
              runtime: runtime,
              requestTestCapture: function (input) { return unwrap("requestTestCapture", [input]); },
            };
          },
        }, CameraSettings);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-camera-watch";
    return module.exports;
  },
});
