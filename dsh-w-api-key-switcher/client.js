window.__ModuleLoader__.load({
  id: "dsh-w-api-key-switcher",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    // Design notes: the card lives inside a model-provider card, so it reads as
    // one quiet inset section. Width-dependent layout uses a container query on
    // the section itself (a viewport media query stacked everything whenever the
    // settings window was narrow, even though the card had room).
    var CSS = [
      ".waks{--waks-accent:var(--dsw-alias-state-business-primary,#3964fe);--waks-danger:var(--dsw-alias-state-error-primary,#e5484d);--waks-ok:var(--dsw-alias-state-success-primary,#2f8f5b);--waks-warn:var(--dsw-alias-state-warning-primary,#c27c0e);--waks-line:var(--dsw-alias-border-l1,#e7e9ee);--waks-line-strong:var(--dsw-alias-border-l2,#dcdfe5);--waks-fg:var(--dsw-alias-label-primary,#1f2329);--waks-fg2:var(--dsw-alias-label-secondary,#5c6470);--waks-fg3:var(--dsw-alias-label-tertiary,#8a919c);--waks-surface:var(--dsw-alias-bg-layer-1,#fff);--waks-sunken:var(--dsw-alias-bg-layer-2,#f6f7f9);--waks-hover:var(--dsw-alias-interactive-bg-hover,color-mix(in srgb,var(--waks-fg) 5%,transparent));container-type:inline-size;container-name:waks;margin-top:14px;border:1px solid var(--waks-line);border-radius:12px;background:var(--waks-surface);color:var(--waks-fg);font-size:13px;line-height:20px;overflow:hidden}",
      ".waks *{box-sizing:border-box}",
      ".waks svg{display:block;flex:none}",
      // summary row
      ".waks-summary{display:flex;width:100%;align-items:center;gap:12px;margin:0;padding:12px 14px;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background .15s ease}",
      ".waks-summary:hover{background:var(--waks-hover)}",
      ".waks-summary:focus-visible{outline:2px solid var(--waks-accent);outline-offset:-2px}",
      ".waks-glyph{display:inline-flex;width:32px;height:32px;flex:none;align-items:center;justify-content:center;border-radius:9px;background:color-mix(in srgb,var(--waks-accent) 10%,transparent);color:var(--waks-accent)}",
      ".waks-summary-text{display:flex;min-width:0;flex:1;flex-direction:column;gap:1px}",
      ".waks-title{font-size:13px;line-height:20px;font-weight:600}",
      ".waks-sub{display:flex;min-width:0;align-items:center;gap:6px;color:var(--waks-fg3);font-size:12px;line-height:18px}",
      ".waks-sub-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".waks-sub-text b{color:var(--waks-fg2);font-weight:600}",
      ".waks-dot{width:7px;height:7px;flex:none;border-radius:50%;background:var(--waks-fg3)}",
      ".waks-dot[data-tone=ok]{background:var(--waks-ok);box-shadow:0 0 0 3px color-mix(in srgb,var(--waks-ok) 16%,transparent)}",
      ".waks-dot[data-tone=warn]{background:var(--waks-warn)}",
      ".waks-dot[data-tone=error]{background:var(--waks-danger)}",
      ".waks-chevron{color:var(--waks-fg3);transition:transform .2s ease}",
      ".waks[data-open=true] .waks-chevron{transform:rotate(180deg)}",
      // body
      ".waks-body{display:flex;flex-direction:column;gap:12px;padding:4px 14px 14px;animation:waks-in .18s ease}",
      "@keyframes waks-in{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none}}",
      ".waks-callout{display:flex;align-items:flex-start;gap:8px;margin:0;padding:9px 11px;border-radius:9px;font-size:12px;line-height:18px}",
      ".waks-callout svg{margin-top:1px}",
      ".waks-callout[data-tone=warn]{background:color-mix(in srgb,var(--waks-warn) 11%,transparent);color:color-mix(in srgb,var(--waks-warn) 80%,var(--waks-fg))}",
      ".waks-callout[data-tone=error]{background:color-mix(in srgb,var(--waks-danger) 10%,transparent);color:var(--waks-danger)}",
      ".waks-callout[data-tone=ok]{background:color-mix(in srgb,var(--waks-ok) 10%,transparent);color:var(--waks-ok)}",
      ".waks-callout-text{flex:1;min-width:0}",
      // list
      ".waks-list{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}",
      ".waks-row{position:relative;display:flex;align-items:center;gap:4px;border-radius:10px;transition:background .15s ease}",
      ".waks-row:hover{background:var(--waks-hover)}",
      ".waks-row[data-active=true]{background:color-mix(in srgb,var(--waks-accent) 7%,transparent)}",
      ".waks-pick{display:flex;min-width:0;flex:1;align-items:flex-start;gap:11px;margin:0;padding:10px 4px 10px 10px;border:0;border-radius:10px;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}",
      ".waks-pick:disabled{cursor:default}",
      ".waks-pick:focus-visible{outline:2px solid var(--waks-accent);outline-offset:-2px}",
      ".waks-radio{position:relative;display:inline-flex;width:16px;height:16px;flex:none;margin-top:2px;align-items:center;justify-content:center;border:1.5px solid var(--waks-line-strong);border-radius:50%;background:var(--waks-surface);transition:border-color .15s ease}",
      ".waks-pick:hover .waks-radio{border-color:var(--waks-accent)}",
      ".waks-row[data-active=true] .waks-radio{border-color:var(--waks-accent);background:var(--waks-accent)}",
      ".waks-row[data-active=true] .waks-radio::after{content:'';width:6px;height:6px;border-radius:50%;background:#fff}",
      ".waks-radio[data-busy=true]{border-color:color-mix(in srgb,var(--waks-accent) 25%,transparent);border-top-color:var(--waks-accent);animation:waks-spin .7s linear infinite}",
      "@keyframes waks-spin{to{transform:rotate(360deg)}}",
      ".waks-pick-text{display:flex;min-width:0;flex:1;flex-direction:column;gap:1px}",
      ".waks-name{display:flex;min-width:0;align-items:center;gap:8px;font-weight:600}",
      ".waks-name>span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".waks-tag{flex:none;padding:0 7px;border-radius:999px;background:color-mix(in srgb,var(--waks-accent) 13%,transparent);color:var(--waks-accent);font-size:11px;line-height:18px;font-weight:500}",
      ".waks-tools{display:flex;flex:none;align-items:center;gap:2px;padding-right:6px;transition:opacity .15s ease}",
      "@media (hover:hover){.waks-row .waks-tools{opacity:0}.waks-row:hover .waks-tools,.waks-row:focus-within .waks-tools{opacity:1}}",
      ".waks-icon-btn{display:inline-flex;width:28px;height:28px;align-items:center;justify-content:center;padding:0;border:0;border-radius:7px;background:transparent;color:var(--waks-fg3);cursor:pointer;transition:background .15s ease,color .15s ease}",
      ".waks-icon-btn:hover{background:color-mix(in srgb,var(--waks-fg) 8%,transparent);color:var(--waks-fg)}",
      ".waks-icon-btn[data-danger=true]:hover{background:color-mix(in srgb,var(--waks-danger) 12%,transparent);color:var(--waks-danger)}",
      ".waks-icon-btn:disabled{opacity:.35;cursor:not-allowed;background:transparent;color:var(--waks-fg3)}",
      ".waks-icon-btn:focus-visible{outline:2px solid var(--waks-accent);outline-offset:1px}",
      // inline confirm / edit
      ".waks-confirm{display:flex;width:100%;align-items:center;gap:8px;padding:8px 8px 8px 12px;border-radius:10px;background:color-mix(in srgb,var(--waks-danger) 8%,transparent)}",
      ".waks-confirm-text{flex:1;min-width:0;color:var(--waks-fg2);font-size:12px;line-height:18px}",
      ".waks-confirm-text b{color:var(--waks-fg)}",
      ".waks-edit{display:flex;width:100%;flex-direction:column;gap:8px;padding:10px;border:1px solid var(--waks-line);border-radius:10px;background:var(--waks-sunken)}",
      // buttons
      ".waks-btn{display:inline-flex;height:30px;flex:none;align-items:center;justify-content:center;gap:6px;padding:0 12px;border:1px solid var(--waks-line-strong);border-radius:8px;background:var(--waks-surface);color:var(--waks-fg);font:inherit;font-size:12px;font-weight:500;white-space:nowrap;cursor:pointer;transition:background .15s ease,border-color .15s ease,filter .15s ease}",
      ".waks-btn:hover{background:var(--waks-hover)}",
      ".waks-btn[data-variant=primary]{border-color:transparent;background:var(--waks-accent);color:#fff}",
      ".waks-btn[data-variant=primary]:hover{filter:brightness(1.07)}",
      ".waks-btn[data-variant=danger]{border-color:transparent;background:var(--waks-danger);color:#fff}",
      ".waks-btn[data-variant=ghost]{border-color:transparent;background:transparent;color:var(--waks-fg2)}",
      ".waks-btn[data-variant=ghost]:hover{background:var(--waks-hover);color:var(--waks-fg)}",
      ".waks-btn:disabled{opacity:.45;cursor:not-allowed;filter:none}",
      ".waks-btn:focus-visible{outline:2px solid var(--waks-accent);outline-offset:1px}",
      ".waks-add{display:flex;width:100%;height:38px;align-items:center;justify-content:center;gap:6px;padding:0;border:1px dashed var(--waks-line-strong);border-radius:10px;background:transparent;color:var(--waks-fg2);font:inherit;font-size:12px;font-weight:500;cursor:pointer;transition:border-color .15s ease,color .15s ease,background .15s ease}",
      ".waks-add:hover{border-color:var(--waks-accent);background:color-mix(in srgb,var(--waks-accent) 5%,transparent);color:var(--waks-accent)}",
      ".waks-add:disabled{opacity:.45;cursor:not-allowed}",
      // form
      ".waks-form{display:flex;flex-direction:column;gap:12px;padding:14px;border:1px solid var(--waks-line);border-radius:11px;background:var(--waks-sunken)}",
      ".waks-form-title{margin:0;font-size:12px;line-height:18px;font-weight:600;color:var(--waks-fg2)}",
      ".waks-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px 12px}",
      ".waks-field{display:flex;min-width:0;flex-direction:column;gap:5px}",
      ".waks-field[data-wide=true]{grid-column:1/-1}",
      ".waks-label{color:var(--waks-fg2);font-size:12px;line-height:16px;font-weight:500}",
      ".waks-control{position:relative;display:flex}",
      ".waks-input{width:100%;height:34px;padding:0 10px;border:1px solid var(--waks-line-strong);border-radius:8px;outline:none;background:var(--waks-surface);color:var(--waks-fg);font:inherit;font-size:13px;transition:border-color .15s ease,box-shadow .15s ease}",
      ".waks-input[data-secret=true]{padding-right:36px;font-family:var(--ds-font-family-code,ui-monospace,monospace);font-size:12px;letter-spacing:.02em}",
      ".waks-input::placeholder{color:var(--waks-fg3)}",
      ".waks-input:focus{border-color:var(--waks-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--waks-accent) 16%,transparent)}",
      ".waks-input:disabled{opacity:.55}",
      ".waks-reveal{position:absolute;top:3px;right:3px}",
      ".waks-form-foot{display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
      ".waks-secure{display:flex;min-width:0;flex:1;align-items:center;gap:6px;color:var(--waks-fg3);font-size:11px;line-height:16px}",
      ".waks-form-actions{display:flex;flex:none;gap:8px;margin-left:auto}",
      // empty / loading / footer
      ".waks-empty{display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 8px 4px;color:var(--waks-fg3);font-size:12px;text-align:center}",
      ".waks-empty strong{color:var(--waks-fg2);font-size:13px;font-weight:600}",
      ".waks-skeleton{height:44px;border-radius:10px;background:linear-gradient(90deg,var(--waks-sunken),color-mix(in srgb,var(--waks-fg) 6%,var(--waks-sunken)),var(--waks-sunken));background-size:200% 100%;animation:waks-shimmer 1.2s ease infinite}",
      "@keyframes waks-shimmer{from{background-position:100% 0}to{background-position:-100% 0}}",
      ".waks-foot{display:flex;align-items:center;gap:6px;padding-top:10px;border-top:1px solid var(--waks-line);color:var(--waks-fg3);font-size:11px;line-height:16px}",
      ".waks-code{overflow:hidden;padding:1px 6px;border-radius:5px;background:var(--waks-sunken);color:var(--waks-fg2);font-family:var(--ds-font-family-code,ui-monospace,monospace);text-overflow:ellipsis;white-space:nowrap}",
      ".waks-count{margin-left:auto;flex:none}",
      "@container waks (max-width:460px){.waks-grid{grid-template-columns:1fr}.waks-field[data-wide=true]{grid-column:auto}.waks-form-actions{width:100%}.waks-form-actions .waks-btn{flex:1}}",
      "@media (prefers-reduced-motion:reduce){.waks *,.waks-body{animation:none!important;transition:none!important}}",
    ].join("\n");

    function installStyle() {
      if (typeof document === "undefined") return null;
      var selector = 'style[data-plugin-css="dsh-w-api-key-switcher/styles"]';
      var node = document.querySelector(selector);
      if (node) return { node: node, owned: false };
      node = document.createElement("style");
      node.dataset.plugin = "dsh-w-api-key-switcher";
      node.dataset.pluginCss = "dsh-w-api-key-switcher/styles";
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
        id: "dsh-w-api-key-switcher#apiKeySwitcher/" + method,
        service: "apiKeySwitcher",
        namespace: "apiKeySwitcher",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: { mode: "strict", typeSymbol: "json", schema: passthrough },
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-api-key-switcher",
      descriptors: [
        descriptor("getState", [parameter("provider")]),
        descriptor("saveKey", [parameter("input")]),
        descriptor("switchKey", [parameter("provider"), parameter("id")]),
        descriptor("updateKey", [parameter("input")]),
        descriptor("deleteKey", [parameter("provider"), parameter("id")]),
      ],
    };

    function messageOf(error, fallback) {
      return error && typeof error.message === "string" ? error.message : fallback;
    }

    // Small stroke icons (Lucide geometry), drawn inline so the bundle stays
    // dependency-free. Each entry is a list of <path d> strings or shape tuples.
    var ICONS = {
      key: [["circle", 7.5, 15.5, 5.5], "m21 2-9.6 9.6", "m15.5 7.5 3 3L22 7l-3-3"],
      chevron: ["m6 9 6 6 6-6"],
      pencil: ["M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z", "m15 5 4 4"],
      trash: ["M3 6h18", "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"],
      plus: ["M5 12h14", "M12 5v14"],
      eye: ["M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0", ["circle", 12, 12, 3]],
      eyeOff: ["M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49", "M14.084 14.158a3 3 0 0 1-4.242-4.242", "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143", "m2 2 20 20"],
      lock: [["rect", 3, 11, 18, 11, 2], "M7 11V7a5 5 0 0 1 10 0v4"],
      warn: ["m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3", "M12 9v4", "M12 17h.01"],
      ok: [["circle", 12, 12, 10], "m9 12 2 2 4-4"],
      error: [["circle", 12, 12, 10], "M12 8v4", "M12 16h.01"],
    };

    function Icon(props) {
      var size = props.size || 16;
      var children = (ICONS[props.name] || []).map(function (part, index) {
        if (typeof part === "string") return React.createElement("path", { key: index, d: part });
        if (part[0] === "circle") return React.createElement("circle", { key: index, cx: part[1], cy: part[2], r: part[3] });
        return React.createElement("rect", { key: index, x: part[1], y: part[2], width: part[3], height: part[4], rx: part[5] });
      });
      return React.createElement("svg", {
        width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
        strokeWidth: props.stroke || 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: "false",
      }, children);
    }

    function Callout(props) {
      var icon = props.tone === "ok" ? "ok" : props.tone === "error" ? "error" : "warn";
      return React.createElement(
        "div",
        { className: "waks-callout", "data-tone": props.tone, role: props.tone === "warn" ? undefined : "status" },
        React.createElement(Icon, { name: icon, size: 15 }),
        React.createElement("span", { className: "waks-callout-text" }, props.children),
        props.action || null,
      );
    }

    function ApiKeySwitcherCard(props) {
      var t = props.t;
      var providerId = props.provider.provider;
      var supported = props.provider.settingsNs === "llm-pi-ai" || props.provider.settingsNs === "llm-deepseek";
      var configured = supported && props.configured;
      var expandedSlot = React.useState(false);
      var expanded = expandedSlot[0];
      var setExpanded = expandedSlot[1];
      var stateSlot = React.useState({ status: "loading", value: null, error: null });
      var state = stateSlot[0];
      var setState = stateSlot[1];
      var busySlot = React.useState(null);
      var busy = busySlot[0];
      var setBusy = busySlot[1];
      var feedbackSlot = React.useState(null);
      var feedback = feedbackSlot[0];
      var setFeedback = feedbackSlot[1];
      var formSlot = React.useState({ label: "", apiKey: "" });
      var form = formSlot[0];
      var setForm = formSlot[1];
      var addingSlot = React.useState(false);
      var adding = addingSlot[0];
      var setAdding = addingSlot[1];
      var revealSlot = React.useState(false);
      var reveal = revealSlot[0];
      var setReveal = revealSlot[1];
      var editSlot = React.useState(null);
      var edit = editSlot[0];
      var setEdit = editSlot[1];
      var editRevealSlot = React.useState(false);
      var editReveal = editRevealSlot[0];
      var setEditReveal = editRevealSlot[1];
      var confirmSlot = React.useState(null);
      var confirmId = confirmSlot[0];
      var setConfirmId = confirmSlot[1];
      var mountedRef = React.useRef(false);
      var labelRef = React.useRef(null);

      var load = React.useCallback(function () {
        if (!configured) return Promise.resolve();
        return props.getState(providerId).then(function (value) {
          if (!mountedRef.current) return;
          setState({ status: "ready", value: value, error: null });
        }, function (error) {
          if (!mountedRef.current) return;
          setState({ status: "error", value: null, error: messageOf(error, t("loadFailed")) });
        });
      }, [configured, props.getState, providerId, t]);

      React.useEffect(function () {
        mountedRef.current = true;
        void load();
        return function () { mountedRef.current = false; };
      }, [load]);

      React.useEffect(function () {
        return props.subscribe(function () { void load(); });
      }, [props.subscribe, load]);

      // Success messages fade out on their own; errors stay until the next action.
      React.useEffect(function () {
        if (!feedback || feedback.error) return undefined;
        var timer = setTimeout(function () { if (mountedRef.current) setFeedback(null); }, 3800);
        return function () { clearTimeout(timer); };
      }, [feedback]);

      // An armed delete disarms itself if the user walks away.
      React.useEffect(function () {
        if (confirmId === null) return undefined;
        var timer = setTimeout(function () { if (mountedRef.current) setConfirmId(null); }, 6000);
        return function () { clearTimeout(timer); };
      }, [confirmId]);

      React.useEffect(function () {
        if (adding && labelRef.current) labelRef.current.focus();
      }, [adding]);

      if (!configured) return null;
      var value = state.value;
      var entries = value && Array.isArray(value.entries) ? value.entries : [];
      var active = entries.find(function (entry) { return entry.active; });
      var credential = value ? value.credential : null;
      var writable = !credential || credential.writable !== false;
      var isBusy = busy !== null;
      var showForm = writable && (adding || (state.status === "ready" && entries.length === 0));

      function perform(kind, operation, successText, onSuccess) {
        if (isBusy) return;
        setBusy(kind);
        setFeedback(null);
        Promise.resolve().then(operation).then(function (next) {
          if (!mountedRef.current) return;
          setState({ status: "ready", value: next, error: null });
          setFeedback({ error: false, text: successText });
          if (onSuccess) onSuccess();
        }, function (error) {
          if (!mountedRef.current) return;
          setFeedback({ error: true, text: messageOf(error, t("operationFailed")) });
        }).finally(function () {
          if (mountedRef.current) setBusy(null);
        });
      }

      function onAdd(event) {
        if (event) event.preventDefault();
        if (!form.label.trim() || !form.apiKey.trim()) {
          setFeedback({ error: true, text: t("required") });
          return;
        }
        var payload = { provider: providerId, label: form.label, apiKey: form.apiKey };
        perform("add", function () { return props.saveKey(payload); }, t("savedAndSwitched"), function () {
          setForm({ label: "", apiKey: "" });
          setReveal(false);
          setAdding(false);
        });
      }

      function onCancelAdd() {
        setForm({ label: "", apiKey: "" });
        setReveal(false);
        setAdding(false);
        setFeedback(null);
      }

      function onSwitch(id) {
        setConfirmId(null);
        perform("switch:" + id, function () { return props.switchKey(providerId, id); }, t("switched"));
      }

      function onSaveEdit(event) {
        if (event) event.preventDefault();
        if (!edit || !edit.label.trim()) {
          setFeedback({ error: true, text: t("labelRequired") });
          return;
        }
        var payload = { provider: providerId, id: edit.id, label: edit.label };
        if (edit.apiKey.trim()) payload.apiKey = edit.apiKey;
        perform("edit", function () { return props.updateKey(payload); }, t("updated"), function () {
          setEdit(null);
          setEditReveal(false);
        });
      }

      function onDelete(id) {
        perform("delete:" + id, function () { return props.deleteKey(providerId, id); }, t("deleted"), function () { setConfirmId(null); });
      }

      // ── summary line ────────────────────────────────────────────────────
      var tone = "idle";
      var subText;
      if (state.status === "loading") {
        subText = t("loading");
      } else if (state.status === "error") {
        tone = "error";
        subText = t("loadFailed");
      } else if (active) {
        tone = "ok";
        subText = React.createElement(React.Fragment, null, t("currentPrefix"), React.createElement("b", null, active.label));
      } else if (credential && credential.configured) {
        tone = "warn";
        subText = t("externalActive");
      } else {
        subText = t("notConfigured");
      }
      var countText = state.status === "ready" && entries.length > 0 ? t("savedCount", { count: entries.length }) : "";

      var summary = React.createElement(
        "button",
        {
          type: "button",
          className: "waks-summary",
          "aria-expanded": expanded,
          onClick: function () { setExpanded(!expanded); setConfirmId(null); },
        },
        React.createElement("span", { className: "waks-glyph" }, React.createElement(Icon, { name: "key", size: 16 })),
        React.createElement(
          "span",
          { className: "waks-summary-text" },
          React.createElement("span", { className: "waks-title" }, t("title")),
          React.createElement(
            "span",
            { className: "waks-sub" },
            React.createElement("span", { className: "waks-dot", "data-tone": tone }),
            React.createElement("span", { className: "waks-sub-text" }, subText, countText ? " · " + countText : ""),
          ),
        ),
        React.createElement("span", { className: "waks-chevron" }, React.createElement(Icon, { name: "chevron", size: 18 })),
      );

      // ── rows ────────────────────────────────────────────────────────────
      function renderRow(entry) {
        var switching = busy === "switch:" + entry.id;
        var deleting = busy === "delete:" + entry.id;
        if (edit && edit.id === entry.id) {
          return React.createElement(
            "li",
            { key: entry.id },
            React.createElement(
              "form",
              { className: "waks-edit", onSubmit: onSaveEdit },
              React.createElement(
                "label", { className: "waks-field" },
                React.createElement("span", { className: "waks-label" }, t("label")),
                React.createElement("input", { className: "waks-input", value: edit.label, disabled: isBusy, maxLength: 80, autoFocus: true, onChange: function (event) { setEdit(Object.assign({}, edit, { label: event.currentTarget.value })); } }),
              ),
              React.createElement(
                "label", { className: "waks-field" },
                React.createElement("span", { className: "waks-label" }, t("replacementKey")),
                React.createElement(
                  "span", { className: "waks-control" },
                  React.createElement("input", { className: "waks-input", "data-secret": true, type: editReveal ? "text" : "password", autoComplete: "new-password", value: edit.apiKey, disabled: isBusy, spellCheck: false, placeholder: t("replacementHint"), onChange: function (event) { setEdit(Object.assign({}, edit, { apiKey: event.currentTarget.value })); } }),
                  React.createElement("button", { type: "button", className: "waks-icon-btn waks-reveal", "aria-label": editReveal ? t("hideKey") : t("showKey"), title: editReveal ? t("hideKey") : t("showKey"), onClick: function () { setEditReveal(!editReveal); } }, React.createElement(Icon, { name: editReveal ? "eyeOff" : "eye", size: 15 })),
                ),
              ),
              React.createElement("span", { className: "waks-secure" }, t("replacementHint")),
              React.createElement(
                "div",
                { className: "waks-form-actions" },
                React.createElement("button", { type: "button", className: "waks-btn", "data-variant": "ghost", disabled: isBusy, onClick: function () { setEdit(null); setEditReveal(false); } }, t("cancel")),
                React.createElement("button", { type: "submit", className: "waks-btn", "data-variant": "primary", disabled: isBusy || !edit.label.trim() }, busy === "edit" ? t("saving") : t("saveEdit")),
              ),
            ),
          );
        }
        if (confirmId === entry.id) {
          return React.createElement(
            "li",
            { key: entry.id },
            React.createElement(
              "div",
              { className: "waks-confirm", role: "alertdialog", "aria-label": t("delete") },
              React.createElement("span", { className: "waks-confirm-text" }, t("deleteAskPrefix"), React.createElement("b", null, entry.label), t("deleteAskSuffix")),
              React.createElement("button", { type: "button", className: "waks-btn", "data-variant": "ghost", disabled: isBusy, onClick: function () { setConfirmId(null); } }, t("cancel")),
              React.createElement("button", { type: "button", className: "waks-btn", "data-variant": "danger", disabled: isBusy, autoFocus: true, onClick: function () { onDelete(entry.id); } }, deleting ? t("deleting") : t("confirmDelete")),
            ),
          );
        }
        return React.createElement(
          "li",
          { key: entry.id, className: "waks-row", "data-active": entry.active || undefined },
          React.createElement(
            "button",
            {
              type: "button",
              className: "waks-pick",
              role: "radio",
              "aria-checked": !!entry.active,
              disabled: entry.active || isBusy || !writable,
              title: entry.active ? t("inUse") : writable ? t("switchHint") : "",
              onClick: function () { onSwitch(entry.id); },
            },
            React.createElement("span", { className: "waks-radio", "data-busy": switching || undefined }),
            React.createElement(
              "span",
              { className: "waks-pick-text" },
              React.createElement(
                "span",
                { className: "waks-name" },
                React.createElement("span", { title: entry.label }, entry.label),
                entry.active ? React.createElement("span", { className: "waks-tag" }, t("inUse")) : null,
                switching ? React.createElement("span", { className: "waks-tag" }, t("switching")) : null,
              ),
            ),
          ),
          React.createElement(
            "span",
            { className: "waks-tools" },
            React.createElement(
              "button",
              { type: "button", className: "waks-icon-btn", disabled: isBusy, "aria-label": t("editAria", { name: entry.label }), title: t("edit"), onClick: function () { setConfirmId(null); setEditReveal(false); setEdit({ id: entry.id, label: entry.label, apiKey: "" }); } },
              React.createElement(Icon, { name: "pencil", size: 15 }),
            ),
            React.createElement(
              "button",
              { type: "button", className: "waks-icon-btn", "data-danger": true, disabled: isBusy || entry.active, "aria-label": t("deleteAria", { name: entry.label }), title: entry.active ? t("deleteActiveHint") : t("delete"), onClick: function () { setEdit(null); setConfirmId(entry.id); } },
              React.createElement(Icon, { name: "trash", size: 15 }),
            ),
          ),
        );
      }

      // ── add form ────────────────────────────────────────────────────────
      var addForm = React.createElement(
        "form",
        { className: "waks-form", onSubmit: onAdd },
        React.createElement("p", { className: "waks-form-title" }, entries.length === 0 ? t("addFirst") : t("addKey")),
        React.createElement(
          "div",
          { className: "waks-grid" },
          React.createElement(
            "label", { className: "waks-field" },
            React.createElement("span", { className: "waks-label" }, t("label")),
            React.createElement("input", { ref: labelRef, className: "waks-input", value: form.label, disabled: isBusy, maxLength: 80, placeholder: t("labelPlaceholder"), onChange: function (event) { setForm(Object.assign({}, form, { label: event.currentTarget.value })); } }),
          ),
          React.createElement(
            "label", { className: "waks-field" },
            React.createElement("span", { className: "waks-label" }, t("apiKey")),
            React.createElement(
              "span",
              { className: "waks-control" },
              React.createElement("input", { className: "waks-input", "data-secret": true, type: reveal ? "text" : "password", autoComplete: "new-password", value: form.apiKey, disabled: isBusy, spellCheck: false, placeholder: "sk-…", onChange: function (event) { setForm(Object.assign({}, form, { apiKey: event.currentTarget.value })); } }),
              React.createElement(
                "button",
                { type: "button", className: "waks-icon-btn waks-reveal", "aria-label": reveal ? t("hideKey") : t("showKey"), title: reveal ? t("hideKey") : t("showKey"), onClick: function () { setReveal(!reveal); } },
                React.createElement(Icon, { name: reveal ? "eyeOff" : "eye", size: 15 }),
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          { className: "waks-form-foot" },
          React.createElement("span", { className: "waks-secure" }, React.createElement(Icon, { name: "lock", size: 13 }), t("secretHint")),
          React.createElement(
            "span",
            { className: "waks-form-actions" },
            entries.length > 0 ? React.createElement("button", { type: "button", className: "waks-btn", "data-variant": "ghost", disabled: isBusy, onClick: onCancelAdd }, t("cancel")) : null,
            React.createElement("button", { type: "submit", className: "waks-btn", "data-variant": "primary", disabled: isBusy || !form.label.trim() || !form.apiKey.trim() }, busy === "add" ? t("saving") : t("saveAndSwitch")),
          ),
        ),
      );

      // ── body ────────────────────────────────────────────────────────────
      var body = null;
      if (expanded) {
        var content;
        if (state.status === "loading") {
          content = React.createElement("div", { className: "waks-list", "aria-busy": true },
            React.createElement("div", { className: "waks-skeleton" }),
            React.createElement("div", { className: "waks-skeleton" }));
        } else if (state.status === "error") {
          content = React.createElement(Callout, {
            tone: "error",
            action: React.createElement("button", { type: "button", className: "waks-btn", onClick: function () { setState({ status: "loading", value: null, error: null }); void load(); } }, t("retry")),
          }, state.error);
        } else {
          content = React.createElement(
            React.Fragment,
            null,
            !writable
              ? React.createElement(Callout, { tone: "warn" }, t("readOnly", { source: credential && credential.source ? credential.source : t("unknownSource") }))
              : null,
            entries.length > 0
              ? React.createElement("ul", { className: "waks-list", role: "radiogroup", "aria-label": t("title") }, entries.map(renderRow))
              : !writable
                ? React.createElement("div", { className: "waks-empty" }, React.createElement("strong", null, t("empty")))
                : null,
            showForm
              ? addForm
              : writable
                ? React.createElement(
                    "button",
                    { type: "button", className: "waks-add", disabled: isBusy, onClick: function () { setEdit(null); setConfirmId(null); setAdding(true); } },
                    React.createElement(Icon, { name: "plus", size: 15 }),
                    t("addKey"),
                  )
                : null,
            feedback ? React.createElement(Callout, { tone: feedback.error ? "error" : "ok" }, feedback.text) : null,
            credential
              ? React.createElement(
                  "div",
                  { className: "waks-foot" },
                  React.createElement("span", null, t("credentialRef")),
                  React.createElement("span", { className: "waks-code", title: credential.ref }, credential.ref),
                  React.createElement("span", { className: "waks-count" }, t("limitHint", { count: entries.length })),
                )
              : null,
          );
        }
        body = React.createElement("div", { className: "waks-body" }, content);
      }

      return React.createElement(
        "section",
        { className: "waks", "data-open": expanded || undefined },
        summary,
        body,
      );
    }

    var NS = "dshWApiKeySwitcher";
    var inject = ["slots", "locale", "remote"];
    var dicts = {
      zh: {
        title: "API 密钥",
        loading: "读取中…",
        loadFailed: "读取失败",
        currentPrefix: "当前：",
        savedCount: "已保存 {count} 组",
        externalActive: "当前密钥不在已保存列表中",
        notConfigured: "尚未配置",
        retry: "重试",
        credentialRef: "凭据引用",
        limitHint: "{count} / 50",
        readOnly: "当前凭据由 {source} 提供且不可写，请先移除启动环境中的同名变量。",
        unknownSource: "只读来源",
        empty: "还没有保存密钥配置",
        inUse: "使用中",
        switching: "切换中…",
        switchHint: "点击切换到这组密钥",
        edit: "编辑名称和密钥",
        editAria: "编辑「{name}」",
        delete: "删除",
        deleteAria: "删除「{name}」",
        deleteActiveHint: "正在使用的密钥不能删除，请先切换到另一组",
        deleteAskPrefix: "删除「",
        deleteAskSuffix: "」？保存的密钥无法恢复。",
        confirmDelete: "删除",
        deleting: "删除中…",
        addKey: "添加密钥",
        addFirst: "添加第一组密钥",
        label: "名称",
        labelPlaceholder: "如：主账号、备用额度",
        apiKey: "API Key",
        replacementKey: "替换 API Key（可选）",
        replacementHint: "留空则保持原密钥；已保存的密钥不会回显",
        showKey: "显示密钥",
        hideKey: "隐藏密钥",
        saveAndSwitch: "保存并切换",
        saving: "保存中…",
        secretHint: "只写入 Harness 私密凭据存储，页面不会回显明文",
        saveEdit: "保存",
        cancel: "取消",
        required: "请填写名称和 API Key。",
        labelRequired: "名称不能为空。",
        savedAndSwitched: "已保存，下一次模型请求就会使用这组密钥。",
        switched: "已切换，下一次模型请求生效。",
        updated: "已保存修改；若替换了当前密钥，下一次模型请求即生效。",
        deleted: "已删除。",
        operationFailed: "操作失败。",
      },
      en: {
        title: "API keys",
        loading: "Loading…",
        loadFailed: "Load failed",
        currentPrefix: "Using ",
        savedCount: "{count} saved",
        externalActive: "Current key isn't in the saved list",
        notConfigured: "Not configured",
        retry: "Retry",
        credentialRef: "Credential ref",
        limitHint: "{count} / 50",
        readOnly: "This credential is supplied by {source} and is read-only. Remove the same variable from the launch environment first.",
        unknownSource: "a read-only source",
        empty: "No saved keys yet",
        inUse: "In use",
        switching: "Switching…",
        switchHint: "Click to switch to this key",
        edit: "Edit name and key",
        editAria: "Edit “{name}”",
        delete: "Delete",
        deleteAria: "Delete “{name}”",
        deleteActiveHint: "Switch to another key before deleting the active one",
        deleteAskPrefix: "Delete “",
        deleteAskSuffix: "”? The saved secret can't be recovered.",
        confirmDelete: "Delete",
        deleting: "Deleting…",
        addKey: "Add key",
        addFirst: "Add your first key",
        label: "Name",
        labelPlaceholder: "e.g. Primary, Backup quota",
        apiKey: "API key",
        replacementKey: "Replacement API key (optional)",
        replacementHint: "Leave blank to keep the saved key; existing keys are never shown",
        showKey: "Show key",
        hideKey: "Hide key",
        saveAndSwitch: "Save and switch",
        saving: "Saving…",
        secretHint: "Stored only in Harness's private credential store; never shown again",
        saveEdit: "Save",
        cancel: "Cancel",
        required: "Enter a name and an API key.",
        labelRequired: "Name is required.",
        savedAndSwitched: "Saved. The next model request will use this key.",
        switched: "Switched. Takes effect on the next model request.",
        updated: "Changes saved. An active key replacement takes effect on the next model request.",
        deleted: "Deleted.",
        operationFailed: "Operation failed.",
      },
    };

    async function apply(ctx) {
      var style = installStyle();
      ctx.effect(function () { return function () { if (style && style.owned) style.node.remove(); }; }, "dsh-w-api-key-switcher: styles");
      ctx.effect(function () { return ctx.locale.register(NS, dicts); });
      var unmount = await ctx.remote.$mount(TYPERT_REMOTE);
      ctx.effect(function () { return unmount; }, "dsh-w-api-key-switcher: remote");
      var service = ctx.get("remote.apiKeySwitcher");
      if (!service) throw new Error("dsh-w-api-key-switcher: remote.apiKeySwitcher did not mount");
      var listeners = new Set();
      ctx.effect(function () {
        return ctx.remote.$on("credentials/reference-updated", function () {
          listeners.forEach(function (listener) { listener(); });
        });
      }, "dsh-w-api-key-switcher: credential refresh");

      async function unwrap(method, args) {
        var answer = await service[method].apply(service, args);
        if (!answer.ok) throw new Error(answer.error && answer.error.message ? answer.error.message : JSON.stringify(answer.error));
        return answer.value;
      }
      function subscribe(listener) {
        listeners.add(listener);
        return function () { listeners.delete(listener); };
      }
      var t = ctx.locale.bind(NS);
      function injected() {
        return {
          t: t,
          subscribe: subscribe,
          getState: function (provider) { return unwrap("getState", [provider]); },
          saveKey: function (input) { return unwrap("saveKey", [input]); },
          switchKey: function (provider, id) { return unwrap("switchKey", [provider, id]); },
          updateKey: function (input) { return unwrap("updateKey", [input]); },
          deleteKey: function (provider, id) { return unwrap("deleteKey", [provider, id]); },
        };
      }
      ["llm-pi-ai", "llm-deepseek"].forEach(function (settingsNs) {
        ctx.slots.inject("settings.models.provider-card", function () {
          return ctx.slots.register({
            name: "settings.models.provider-card",
            key: settingsNs,
            inject: injected,
          }, ApiKeySwitcherCard);
        });
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-api-key-switcher";
    return module.exports;
  },
});
