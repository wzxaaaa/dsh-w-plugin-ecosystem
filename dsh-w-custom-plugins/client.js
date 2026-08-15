window.__ModuleLoader__.load({
  id: "dsh-w-custom-plugins",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    // ---- stylesheet (package-scoped, cleaned up with the run) ----
    var CSS = [
      ".dshwcp-root{width:100%;max-width:760px;display:flex;flex-direction:column;gap:14px;color:var(--dsw-alias-label-primary)}",
      ".dshwcp-drop{position:relative;border:1px dashed var(--dsw-alias-border-l2);background:color-mix(in srgb,var(--dsw-alias-bg-layer-3) 88%,transparent);border-radius:12px;padding:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;text-align:center;transition:border-color .15s ease,background .15s ease,transform .15s ease;cursor:pointer}",
      ".dshwcp-drop[data-drag=true]{border-color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 9%,var(--dsw-alias-bg-layer-3));transform:translateY(-1px)}",
      ".dshwcp-drop[data-busy=true]{cursor:default;opacity:.78}",
      ".dshwcp-drop-title{font-size:14px;font-weight:600;line-height:20px}",
      ".dshwcp-drop-note{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}",
      ".dshwcp-file-input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}",
      ".dshwcp-progress{width:100%;display:flex;flex-direction:column;gap:7px;padding:2px 0}",
      ".dshwcp-progress-row{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:12px;color:var(--dsw-alias-label-secondary)}",
      ".dshwcp-progress-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}",
      ".dshwcp-progress-track{height:7px;border-radius:999px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}",
      ".dshwcp-progress-bar{height:100%;min-width:2px;border-radius:inherit;background:var(--dsw-alias-state-business-primary);transition:width .18s ease}",
      ".dshwcp-progress[data-stage=installing] .dshwcp-progress-bar{background:linear-gradient(90deg,var(--dsw-alias-state-business-primary),color-mix(in srgb,var(--dsw-alias-state-business-primary) 45%,#fff),var(--dsw-alias-state-business-primary));background-size:200% 100%;animation:dshwcp-progress 1.1s linear infinite}",
      ".dshwcp-install-result{font-size:12px;line-height:18px;margin:0;border-radius:8px;padding:9px 11px}",
      ".dshwcp-install-result[data-kind=success]{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 12%,transparent);border:1px solid color-mix(in srgb,var(--dsw-alias-state-success-primary) 25%,transparent)}",
      ".dshwcp-install-result[data-kind=error]{color:var(--dsw-alias-state-danger-primary,#c33);background:color-mix(in srgb,var(--dsw-alias-state-danger-primary,#c33) 10%,transparent);border:1px solid color-mix(in srgb,var(--dsw-alias-state-danger-primary,#c33) 24%,transparent)}",
      ".dshwcp-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}",
      ".dshwcp-card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:10px;min-width:0}",
      ".dshwcp-name{font-size:14px;font-weight:600;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}",
      ".dshwcp-id{font-size:11px;color:var(--dsw-alias-label-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwcp-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;min-width:0}",
      ".dshwcp-gear{width:26px;height:26px;flex:none;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);border-radius:7px;cursor:pointer;padding:0}",
      ".dshwcp-gear:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
      ".dshwcp-settings-panel{border-top:1px solid var(--dsw-alias-border-l2);padding-top:10px;margin-top:2px}",
      ".dshwcp-row{display:flex;align-items:center;justify-content:space-between;gap:10px}",
      ".dshwcp-status{font-size:12px;color:var(--dsw-alias-label-secondary)}",
      ".dshwcp-hint{font-size:12px;color:var(--dsw-alias-label-tertiary);line-height:18px;margin:0}",
      ".dshwcp-hint-applied{background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 12%,transparent);border:1px solid color-mix(in srgb,var(--dsw-alias-state-success-primary) 25%,transparent);border-radius:8px;padding:8px 12px;color:var(--dsw-alias-state-success-primary);animation:dshwcp-fadeout 2s ease forwards}",
      ".dshwcp-empty{font-size:13px;color:var(--dsw-alias-label-tertiary);margin:0}",
      ".dshwcp-toggle{position:relative;width:40px;height:22px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);cursor:pointer;padding:0;flex:none}",
      ".dshwcp-toggle:disabled{cursor:default;opacity:.55}",
      ".dshwcp-toggle[data-on=true]{background:var(--dsw-alias-state-business-primary);border-color:transparent}",
      ".dshwcp-knob{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:999px;background:#fff;transition:transform .14s var(--ds-ease-in-out)}",
      ".dshwcp-toggle[data-on=true] .dshwcp-knob{transform:translateX(18px)}",
      "@keyframes dshwcp-fadeout{0%{opacity:1}100%{opacity:0}}",
      "@keyframes dshwcp-progress{0%{background-position:100% 0}100%{background-position:-100% 0}}",
      "@media (max-width:680px){.dshwcp-list{grid-template-columns:minmax(0,1fr)}}",
    ].join("\n");
    var tagId = "dsh-w-custom-plugins/styles";
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
      var styleTag = document.createElement("style");
      styleTag.dataset.plugin = "dsh-w-custom-plugins";
      styleTag.dataset.pluginCss = tagId;
      styleTag.textContent = CSS;
      document.head.appendChild(styleTag);
    }

    // ---- Remote contribution (client face of the Host `customPlugins` service) ----
    var passthrough = { parse: function (v) { return v; } };
    function parameter(name) {
      return { name: name, wire: name, source: "json", codec: { mode: "strict", typeSymbol: "json", schema: passthrough } };
    }
    function descriptor(method, parameters) {
      return {
        id: "dsh-w-custom-plugins#customPlugins/" + method,
        service: "customPlugins",
        namespace: "customPlugins",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: { mode: "strict", typeSymbol: "json", schema: passthrough },
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-custom-plugins",
      descriptors: [
        descriptor("listCustom"),
        descriptor("setEnabled", [parameter("entryId"), parameter("enabled")]),
        descriptor("beginInstall", [parameter("fileName"), parameter("size")]),
        descriptor("appendInstallChunk", [parameter("uploadId"), parameter("index"), parameter("base64")]),
        descriptor("cancelInstall", [parameter("uploadId")]),
        descriptor("finishInstall", [parameter("uploadId")]),
      ],
    };

    function bufferToBase64(buffer) {
      var bytes = new Uint8Array(buffer);
      var binary = "";
      for (var offset = 0; offset < bytes.length; offset += 32768) {
        binary += String.fromCharCode.apply(null, bytes.subarray(offset, Math.min(offset + 32768, bytes.length)));
      }
      return btoa(binary);
    }

    // ---- gear (settings) icon, rendered in the card's reserved right column ----
    function GearIcon() {
      return React.createElement(
        "svg",
        {
          viewBox: "0 0 24 24",
          width: 15,
          height: 15,
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": true,
        },
        React.createElement("circle", { cx: 12, cy: 12, r: 3 }),
        React.createElement("path", {
          d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z",
        }),
      );
    }

    // ---- tab component ----
    function CustomPluginsTab(props) {
      var list = props.list;
      var toggle = props.toggle;
      var beginInstall = props.beginInstall;
      var appendInstallChunk = props.appendInstallChunk;
      var cancelInstall = props.cancelInstall;
      var finishInstall = props.finishInstall;
      var settingsEntries = props.settingsEntries;
      var subscribeSettings = props.subscribeSettings;
      var renderSlot = props.renderSlot;
      var t = props.t;

      var stateSlot = React.useState({ status: "loading", entries: [] });
      var state = stateSlot[0];
      var setState = stateSlot[1];
      var busySlot = React.useState({});
      var busy = busySlot[0];
      var setBusy = busySlot[1];
      var hintSlot = React.useState(null);
      var hint = hintSlot[0];
      var setHint = hintSlot[1];
      var installSlot = React.useState({ stage: "idle", percent: 0, fileName: "", message: "", kind: "" });
      var install = installSlot[0];
      var setInstall = installSlot[1];
      var dragSlot = React.useState(false);
      var dragActive = dragSlot[0];
      var setDragActive = dragSlot[1];
      var fileInput = React.useRef(null);
      var appliedSeq = React.useRef(0);
      var mountedRef = React.useRef(true);
      var loadSeq = React.useRef(0);
      var busyEntries = React.useRef({});
      var installBusyRef = React.useRef(false);
      var uploadIdRef = React.useRef(null);
      var tickerRef = React.useRef(undefined);
      var reloadTimerRef = React.useRef(undefined);

      // Settings-protocol ledger: which plugin ids have registered a settings
      // form via the `custom-plugin.settings` keyed slot.
      var settings = React.useSyncExternalStore(subscribeSettings, settingsEntries);
      var openKeySlot = React.useState(null);
      var openKey = openKeySlot[0];
      var setOpenKey = openKeySlot[1];
      var settingsByKey = {};
      if (Array.isArray(settings)) {
        for (var si = 0; si < settings.length; si++) {
          var sEntry = settings[si];
          if (sEntry && sEntry.options && typeof sEntry.options.key === "string") {
            settingsByKey[sEntry.options.key] = sEntry;
          }
        }
      }

      var load = React.useCallback(function (silent) {
        var requestId = loadSeq.current + 1;
        loadSeq.current = requestId;
        if (!silent) setState({ status: "loading", entries: [] });
        list().then(
          function (snapshot) {
            if (!mountedRef.current || requestId !== loadSeq.current) return;
            setState({ status: "ready", entries: snapshot.entries });
          },
          function (err) {
            if (!mountedRef.current || requestId !== loadSeq.current) return;
            setState({ status: "error", entries: [] });
            var msg = (err && err.message) ? err.message : String(err);
            console.error("dsh-w-custom-plugins: list failed:", err);
            setHint({ text: msg, kind: "error" });
          },
        );
      }, [list]);

      React.useEffect(function () {
        mountedRef.current = true;
        return function () {
          mountedRef.current = false;
          loadSeq.current += 1;
          installBusyRef.current = false;
          if (tickerRef.current !== undefined) window.clearInterval(tickerRef.current);
          if (reloadTimerRef.current !== undefined) window.clearTimeout(reloadTimerRef.current);
          tickerRef.current = undefined;
          reloadTimerRef.current = undefined;
          var uploadId = uploadIdRef.current;
          uploadIdRef.current = null;
          if (uploadId !== null) void cancelInstall(uploadId).catch(function () {});
        };
      }, [cancelInstall]);

      React.useEffect(function () { load(false); }, [load]);

      function setBusyEntry(entryId, value) {
        busyEntries.current[entryId] = value;
        if (!mountedRef.current) return;
        setBusy(function (prev) {
          var next = {};
          for (var k in prev) next[k] = prev[k];
          next[entryId] = value;
          return next;
        });
      }

      function showApplied() {
        if (!mountedRef.current) return;
        appliedSeq.current += 1;
        setHint({ id: appliedSeq.current, text: t("applied"), kind: "applied" });
      }

      function onToggle(entry) {
        if (busyEntries.current[entry.entryId] === true) return;
        var next = !entry.enabled;
        setBusyEntry(entry.entryId, true);
        toggle(entry.entryId, next).then(
          function () {
            if (!mountedRef.current) return;
            setBusyEntry(entry.entryId, false);
            setState(function (prev) {
              var entries = prev.entries.map(function (e) {
                return e.entryId === entry.entryId
                  ? { entryId: e.entryId, moduleName: e.moduleName, enabled: next }
                  : e;
              });
              return { status: prev.status, entries: entries };
            });
            showApplied();
            reloadTimerRef.current = window.setTimeout(function () { window.location.reload(); }, 300);
          },
          function (error) {
            busyEntries.current[entry.entryId] = false;
            if (!mountedRef.current) return;
            setBusyEntry(entry.entryId, false);
            console.error("dsh-w-custom-plugins: toggle failed:", error);
            setHint({ text: t("error"), kind: "error" });
          },
        );
      }

      async function installFile(file) {
        if (!file || installBusyRef.current) return;
        var lower = String(file.name || "").toLowerCase();
        if (!(lower.endsWith(".tgz") || lower.endsWith(".tar.gz") || lower.endsWith(".zip"))) {
          setInstall({ stage: "error", percent: 0, fileName: file.name || "", message: t("archiveTypeError"), kind: "error" });
          return;
        }
        installBusyRef.current = true;
        var uploadId = null;
        try {
          setInstall({ stage: "uploading", percent: 0, fileName: file.name, message: t("uploading"), kind: "" });
          var started = await beginInstall(file.name, file.size);
          uploadId = started.uploadId;
          uploadIdRef.current = uploadId;
          if (!mountedRef.current) {
            await cancelInstall(uploadId).catch(function () {});
            uploadIdRef.current = null;
            return;
          }
          var chunkSize = started.maxChunkBytes || 524288;
          var index = 0;
          for (var offset = 0; offset < file.size; offset += chunkSize) {
            var end = Math.min(offset + chunkSize, file.size);
            var base64 = bufferToBase64(await file.slice(offset, end).arrayBuffer());
            if (!mountedRef.current) throw new Error("Plugin upload was cancelled because the page closed");
            var progress = await appendInstallChunk(uploadId, index, base64);
            var percent = Math.max(1, Math.min(70, Math.round(progress.received / progress.size * 70)));
            if (mountedRef.current) setInstall({ stage: "uploading", percent: percent, fileName: file.name, message: t("uploading"), kind: "" });
            index += 1;
          }
          var shown = 72;
          setInstall({ stage: "installing", percent: shown, fileName: file.name, message: t("installing"), kind: "" });
          tickerRef.current = window.setInterval(function () {
            if (!mountedRef.current) return;
            shown = Math.min(93, shown + 1);
            setInstall(function (current) {
              return current.stage === "installing"
                ? { stage: "installing", percent: shown, fileName: current.fileName, message: current.message, kind: "" }
                : current;
            });
          }, 450);
          var result = await finishInstall(uploadId);
          uploadIdRef.current = null;
          window.clearInterval(tickerRef.current);
          tickerRef.current = undefined;
          if (!mountedRef.current) return;
          var label = result.version ? result.packageName + "@" + result.version : result.packageName;
          setInstall({ stage: "success", percent: 100, fileName: file.name, message: t("installed") + " " + label + "\u3002" + t("restartRequired"), kind: "success" });
        } catch (error) {
          if (tickerRef.current !== undefined) window.clearInterval(tickerRef.current);
          tickerRef.current = undefined;
          if (uploadId !== null) await cancelInstall(uploadId).catch(function () {});
          uploadIdRef.current = null;
          if (!mountedRef.current) return;
          var message = error && error.message ? error.message : String(error);
          console.error("dsh-w-custom-plugins: archive install failed:", error);
          setInstall({ stage: "error", percent: 0, fileName: file.name, message: message, kind: "error" });
        } finally {
          installBusyRef.current = false;
          if (mountedRef.current && fileInput.current) fileInput.current.value = "";
        }
      }

      function onDrop(event) {
        event.preventDefault();
        setDragActive(false);
        if (installBusyRef.current) return;
        var file = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files[0] : undefined;
        if (file) void installFile(file);
      }

      var installBusy = install.stage === "uploading" || install.stage === "installing";
      var progressVisible = install.stage !== "idle";

      return React.createElement(
        "div",
        { className: "dshwcp-root", "aria-busy": state.status === "loading" || installBusy },
        React.createElement(
          "div",
          {
            className: "dshwcp-drop",
            "data-drag": dragActive ? "true" : "false",
            "data-busy": installBusy ? "true" : "false",
            role: "button",
            tabIndex: 0,
            onClick: function () { if (!installBusy && fileInput.current) fileInput.current.click(); },
            onKeyDown: function (event) {
              if (!installBusy && (event.key === "Enter" || event.key === " ") && fileInput.current) fileInput.current.click();
            },
            onDragEnter: function (event) { event.preventDefault(); if (!installBusy) setDragActive(true); },
            onDragOver: function (event) { event.preventDefault(); },
            onDragLeave: function (event) {
              if (event.currentTarget === event.target) setDragActive(false);
            },
            onDrop: onDrop,
          },
          React.createElement("input", {
            ref: fileInput,
            className: "dshwcp-file-input",
            type: "file",
            accept: ".tgz,.tar.gz,.zip,application/gzip,application/zip",
            disabled: installBusy,
            onChange: function (event) {
              var file = event.target.files && event.target.files[0];
              if (file) void installFile(file);
            },
          }),
          React.createElement("div", { className: "dshwcp-drop-title" }, installBusy ? t("installWorking") : t("dropTitle")),
          React.createElement("div", { className: "dshwcp-drop-note" }, t("dropNote")),
        ),
        progressVisible
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "div",
                { className: "dshwcp-progress", "data-stage": install.stage },
                React.createElement(
                  "div",
                  { className: "dshwcp-progress-row" },
                  React.createElement("span", { className: "dshwcp-progress-name", title: install.fileName }, install.fileName),
                  React.createElement("span", null, String(install.percent) + "%"),
                ),
                React.createElement(
                  "div",
                  { className: "dshwcp-progress-track" },
                  React.createElement("div", { className: "dshwcp-progress-bar", style: { width: String(install.percent) + "%" } }),
                ),
                React.createElement("div", { className: "dshwcp-drop-note" }, install.message),
              ),
              install.kind
                ? React.createElement("p", { className: "dshwcp-install-result", "data-kind": install.kind }, install.message)
                : null,
            )
          : null,
        state.status === "loading" ? React.createElement("p", { className: "dshwcp-empty" }, t("loading")) : null,
        state.status === "error"
          ? React.createElement(
              "div",
              null,
              React.createElement("p", { className: "dshwcp-empty", role: "alert" }, t("error")),
              React.createElement("button", { type: "button", onClick: function () { load(false); } }, t("retry")),
            )
          : null,
        hint !== null
          ? React.createElement(
              "p",
              {
                key: hint.id !== undefined ? String(hint.id) : undefined,
                className: hint.kind === "applied" ? "dshwcp-hint dshwcp-hint-applied" : "dshwcp-hint",
                onAnimationEnd: hint.kind === "applied" ? function () { setHint(null); } : undefined,
              },
              hint.text,
            )
          : null,
        state.status === "ready" && state.entries.length === 0
          ? React.createElement("p", { className: "dshwcp-empty" }, t("empty"))
          : null,
        state.status === "ready" && state.entries.length > 0
          ? React.createElement(
              "ul",
              { className: "dshwcp-list" },
              state.entries.map(function (entry) {
                var on = entry.enabled;
                var hasSettings = settingsByKey[entry.moduleName] !== undefined;
                var isOpen = openKey === entry.moduleName;
                return React.createElement(
                  "li",
                  { className: "dshwcp-card", key: entry.entryId },
                  React.createElement(
                    "div",
                    { className: "dshwcp-head" },
                    React.createElement("div", { className: "dshwcp-name", title: entry.moduleName }, entry.moduleName),
                    hasSettings
                      ? React.createElement(
                          "button",
                          {
                            type: "button",
                            className: "dshwcp-gear",
                            "aria-label": t("settingsAria"),
                            "aria-expanded": isOpen,
                            title: t("settingsAria"),
                            onClick: function () { setOpenKey(isOpen ? null : entry.moduleName); },
                          },
                          React.createElement(GearIcon, null),
                        )
                      : null,
                  ),
                  React.createElement("div", { className: "dshwcp-id" }, entry.entryId),
                  React.createElement(
                    "div",
                    { className: "dshwcp-row" },
                    React.createElement("span", { className: "dshwcp-status" }, on ? t("enabled") : t("disabled")),
                    React.createElement(
                      "button",
                      {
                        type: "button",
                        className: "dshwcp-toggle",
                        "data-on": on ? "true" : "false",
                        "aria-pressed": on,
                        disabled: busy[entry.entryId] === true,
                        "aria-label": on ? t("disableAria") : t("enableAria"),
                        onClick: function () { onToggle(entry); },
                      },
                      React.createElement("span", { className: "dshwcp-knob" }),
                    ),
                  ),
                  isOpen && hasSettings && typeof renderSlot === "function"
                    ? React.createElement(
                        "div",
                        { className: "dshwcp-settings-panel" },
                        renderSlot("custom-plugin.settings", {}, { entryKey: entry.moduleName }),
                      )
                    : null,
                );
              }),
            )
          : null,
      );
    }

    // ---- plugin ----
    var NS = "dshWCustomPlugins";
    var inject = ["slots", "locale", "remote"];

    var dicts = {
      zh: {
        tab: "\u81ea\u5b9a\u4e49\u63d2\u4ef6",
        loading: "\u6b63\u5728\u8bfb\u53d6\u81ea\u5b9a\u4e49\u63d2\u4ef6...",
        error: "\u64cd\u4f5c\u5931\u8d25\u3002",
        retry: "\u91cd\u8bd5",
        empty: "\u6682\u672a\u6302\u8f7d\u81ea\u5b9a\u4e49\u63d2\u4ef6\u3002",
        enabled: "\u5df2\u542f\u7528",
        disabled: "\u5df2\u505c\u7528",
        disableAria: "\u505c\u7528\u6b64\u63d2\u4ef6",
        enableAria: "\u542f\u7528\u6b64\u63d2\u4ef6",
        settingsAria: "\u8bbe\u7f6e\u6b64\u63d2\u4ef6",
        applied: "\u5df2\u751f\u6548",
        dropTitle: "\u628a\u63d2\u4ef6\u538b\u7f29\u5305\u62d6\u5230\u8fd9\u91cc\uff0c\u6216\u70b9\u51fb\u9009\u62e9",
        dropNote: "\u652f\u6301 .tgz\u3001.tar.gz \u548c .zip\uff1b\u63d2\u4ef6\u5177\u6709\u672c\u673a\u4ee3\u7801\u6267\u884c\u6743\u9650\uff0c\u8bf7\u53ea\u5b89\u88c5\u53ef\u4fe1\u6765\u6e90\u3002",
        installWorking: "\u6b63\u5728\u81ea\u52a8\u5b89\u88c5\u63d2\u4ef6...",
        uploading: "\u6b63\u5728\u4e0a\u4f20\u538b\u7f29\u5305",
        installing: "\u6b63\u5728\u6821\u9a8c\u5e76\u8c03\u7528\u5b98\u65b9\u63d2\u4ef6\u5b89\u88c5\u6d41\u7a0b",
        installed: "\u5b89\u88c5\u5b8c\u6210\uff1a",
        restartRequired: "\u8bf7\u5173\u95ed\u5e76\u91cd\u65b0\u6253\u5f00\u684c\u9762\u7248\u540e\u4f7f\u7528",
        archiveTypeError: "\u53ea\u652f\u6301 .tgz\u3001.tar.gz \u548c .zip \u63d2\u4ef6\u538b\u7f29\u5305\u3002",
      },
      en: {
        tab: "Custom plugins",
        loading: "Reading custom plugins...",
        error: "Operation failed.",
        retry: "Retry",
        empty: "No custom plugins mounted.",
        enabled: "Enabled",
        disabled: "Disabled",
        disableAria: "Disable this plugin",
        enableAria: "Enable this plugin",
        settingsAria: "Configure this plugin",
        applied: "Applied",
        dropTitle: "Drop a plugin archive here, or click to choose",
        dropNote: "Supports .tgz, .tar.gz, and .zip. Plugins can execute local code; install trusted sources only.",
        installWorking: "Installing plugin automatically...",
        uploading: "Uploading archive",
        installing: "Validating and running the official plugin installer",
        installed: "Installed:",
        restartRequired: "Close and reopen the desktop app to activate it",
        archiveTypeError: "Only .tgz, .tar.gz, and .zip plugin archives are supported.",
      },
    };

    async function apply(ctx) {
      ctx.effect(function () { return ctx.locale.register(NS, dicts); });
      var t = ctx.locale.bind(NS);

      var unmount = await ctx.remote.$mount(TYPERT_REMOTE);
      ctx.effect(function () { return unmount; }, "dsh-w-custom-plugins: remote");

      var customPlugins = ctx.get("remote.customPlugins");
      if (!customPlugins) throw new Error("dsh-w-custom-plugins: remote.customPlugins did not mount");

      async function unwrap(method, args) {
        var result = await customPlugins[method].apply(customPlugins, args);
        if (!result.ok) throw new Error("customPlugins." + method + " failed: " + JSON.stringify(result.error));
        return result.value;
      }

      function injected() {
        return {
          list: function () { return unwrap("listCustom", []); },
          toggle: function (entryId, enabled) { return unwrap("setEnabled", [entryId, enabled]); },
          beginInstall: function (fileName, size) { return unwrap("beginInstall", [fileName, size]); },
          appendInstallChunk: function (uploadId, index, base64) { return unwrap("appendInstallChunk", [uploadId, index, base64]); },
          cancelInstall: function (uploadId) { return unwrap("cancelInstall", [uploadId]); },
          finishInstall: function (uploadId) { return unwrap("finishInstall", [uploadId]); },
          // Settings-protocol read face (the `custom-plugin.settings` child slot).
          settingsEntries: function () { return ctx.slots.entries("custom-plugin.settings"); },
          subscribeSettings: function (fn) { return ctx.slots.subscribe("custom-plugin.settings", fn); },
        };
      }

      // ── 设置图标协议（custom-plugin.settings）───────────────────────────────
      // 本组件通过下面这个 children 声明，拥有一个 keyed 子槽
      // `custom-plugin.settings`（scope: root）。想要「插件配置能力」的插件，
      // 在其 client 半部用：
      //
      //   ctx.slots.inject("custom-plugin.settings", () => ctx.slots.register({
      //     name: "custom-plugin.settings",
      //     key: "<该插件的包名>",          // 必须等于列表里的 moduleName
      //     locale: "<字典命名空间>",        // 可选，提供 t()
      //     inject: { getConfig, saveConfig }, // 业务面：注入给设置表单
      //   }, SettingsFormComponent));
      //
      // 组件 props 会合成为：t（若声明 locale）+ inject 注入的业务面 + 全局标准
      // 组件。卡片右侧会为存在匹配 key 的插件显示齿轮图标；点击后在卡片内展开，
      // 通过 renderSlot("custom-plugin.settings", {}, { entryKey: key }) 渲染该
      // 表单。用 inject（而非直接 register）是为了等待本组件先声明子槽，从而不受
      // 插件加载顺序影响。
      ctx.slots.inject("settings.plugins.tab", function () {
        return ctx.slots.register({
          name: "settings.plugins.tab",
          id: "custom",
          order: 20,
          label: function () { return t("tab"); },
          locale: NS,
          children: {
            "custom-plugin.settings": { kind: "keyed", scope: "root" },
          },
          inject: injected,
        }, CustomPluginsTab);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-custom-plugins";
    return module.exports;
  },
});
