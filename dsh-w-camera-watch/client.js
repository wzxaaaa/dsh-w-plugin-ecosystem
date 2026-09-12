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
      ".dcw-test{margin-top:14px;padding-top:14px;border-top:1px solid var(--dsw-alias-border-l2)}",
      ".dcw-test-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:9px}",
      ".dcw-test-head span{color:var(--dsw-alias-label-secondary);font-size:12px}",
      ".dcw-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:13px}",
      ".dcw-stat{padding:9px;border-radius:10px;background:var(--dsw-alias-bg-layer-2);text-align:center}",
      ".dcw-stat b{display:block;color:var(--dsw-alias-label-primary);font-size:15px}",
      ".dcw-stat span{display:block;margin-top:2px;color:var(--dsw-alias-label-tertiary);font-size:10px}",
      "@media(max-width:760px){.dcw-grid{grid-template-columns:1fr}.dcw-title-row{flex-direction:column}.dcw-badge{align-self:flex-start}}",
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
    function parameter(name) {
      return { name: name, wire: name, source: "json", codec: { mode: "strict", typeSymbol: "json", schema: passthrough } };
    }
    function descriptor(method, parameters) {
      return {
        id: "dsh-w-camera-watch#cameraWatch/" + method,
        service: "cameraWatch",
        namespace: "cameraWatch",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: { mode: "strict", typeSymbol: "json", schema: passthrough },
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

    function createCameraRuntime(api) {
      var AUTO_KEY = "dsh-w-camera-watch/auto-start";
      var DEVICE_KEY = "dsh-w-camera-watch/device-id";
      var listeners = new Set();
      var clientId = window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : "camera-" + Date.now() + "-" + Math.random().toString(36).slice(2);
      var stream = null;
      var timer = null;
      var disposed = false;
      var generation = 0;
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
        var delay = 650;
        try {
          var value = await api.poll({
            clientId: clientId,
            ready: state.status === "ready" && Boolean(stream),
            deviceLabel: state.deviceLabel,
            error: state.error,
          });
          patch({ bridgeError: "" });
          setBridge(value && value.state);
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
              React.createElement("p", { className: "dcw-kicker" }, "CAMERA TOOL"),
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
      );
    }

    var NS = "dshWCameraWatch";
    var inject = ["slots", "locale", "remote"];
    var dicts = {
      zh: {
        nav: "摄像头监督",
        title: "摄像头监督",
        subtitle: "连接后，模型可在普通对话和 Goal 中随时调用 camera_capture，获得此刻的真实画面并直接进行视觉判断。",
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
      },
      en: {
        nav: "Camera Watch",
        title: "Camera Watch",
        subtitle: "Once connected, the model can call camera_capture from chats or Goals and inspect the live frame as native image context.",
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
      });
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
