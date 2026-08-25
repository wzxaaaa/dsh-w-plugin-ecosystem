window.__ModuleLoader__.load({
  id: "dsh-w-noval-write",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    var CSS = [
      ".dshwnw-root{--dshwnw-accent:var(--dsw-alias-state-business-primary,#3978e8);container:novel-panel / inline-size;height:100%;min-height:0;display:flex;flex-direction:column;color:var(--dsw-alias-label-primary,#1f2329);font-family:var(--dsw-font-ui,ui-sans-serif,system-ui,sans-serif);background:var(--dsw-specific-sidebar-fill,#f8fafc)}",
      ".dshwnw-toolbar{flex:none;padding:12px 13px 10px;border-bottom:1px solid var(--dsw-alias-border-l1,#e6e9ee);display:flex;flex-direction:column;gap:9px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 3px 12px rgba(31,35,41,.035);z-index:1}",
      ".dshwnw-workspace{position:relative;padding-left:13px;font-size:12px;line-height:17px;color:var(--dsw-alias-label-secondary,#68717e);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-workspace:before{content:'';position:absolute;left:1px;top:5px;width:6px;height:6px;border-radius:50%;background:#35a36f;box-shadow:0 0 0 3px rgba(53,163,111,.1)}",
      ".dshwnw-tabs{display:flex;gap:3px;overflow:auto;padding:3px;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:11px;background:rgba(31,35,41,.035);scrollbar-width:none}",
      ".dshwnw-tabs::-webkit-scrollbar{display:none}",
      ".dshwnw-tab{height:31px;flex:none;padding:0 10px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary,#68717e);font-size:12px;font-weight:500;white-space:nowrap;cursor:pointer}",
      ".dshwnw-tab[data-active=true]{background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dshwnw-accent);font-weight:650;box-shadow:0 1px 4px rgba(31,35,41,.12)}",
      ".dshwnw-body{flex:1;min-height:0;overflow:auto;padding:14px 13px 16px;display:flex;flex-direction:column;gap:13px;scrollbar-gutter:stable}",
      ".dshwnw-section{display:flex;flex-direction:column;gap:12px}",
      ".dshwnw-section-title{font-size:16px;font-weight:700;line-height:23px;letter-spacing:-.01em}",
      ".dshwnw-section-hint{margin-top:-7px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary,#68717e)}",
      ".dshwnw-subsection{display:flex;flex-direction:column;gap:11px;padding:12px;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:12px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 2px 8px rgba(31,35,41,.035)}",
      ".dshwnw-subsection:first-of-type{padding:12px;border:1px solid var(--dsw-alias-border-l1,#e6e9ee)}",
      ".dshwnw-subtitle{font-size:12px;line-height:17px;font-weight:700;color:var(--dsw-alias-label-secondary,#68717e)}",
      ".dshwnw-field{display:flex;flex-direction:column;gap:6px}",
      ".dshwnw-label{font-size:12px;font-weight:550;line-height:17px;color:var(--dsw-alias-label-secondary,#68717e)}",
      ".dshwnw-input,.dshwnw-select,.dshwnw-textarea{width:100%;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1,#e1e5eb);border-radius:9px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;font:inherit;font-size:13px;transition:border-color .15s,box-shadow .15s,background .15s}",
      ".dshwnw-input,.dshwnw-select{height:36px;padding:0 10px}",
      ".dshwnw-textarea{min-height:96px;padding:9px 10px;line-height:20px;resize:vertical}",
      ".dshwnw-input:focus,.dshwnw-select:focus,.dshwnw-textarea:focus{outline:none;border-color:var(--dsw-alias-state-business-primary,#3978e8);box-shadow:0 0 0 2px rgba(57,120,232,.1)}",
      ".dshwnw-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}",
      ".dshwnw-card{border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:13px;background:var(--dsw-alias-bg-layer-1,#fff);padding:12px;display:flex;flex-direction:column;gap:11px;box-shadow:0 2px 8px rgba(31,35,41,.04)}",
      ".dshwnw-card-head{display:flex;align-items:center;gap:7px}",
      ".dshwnw-card-title{flex:1;min-width:0;font-size:14px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-card-subtitle{font-size:11px;color:var(--dsw-alias-label-tertiary,#87909d)}",
      ".dshwnw-warning{padding:8px 9px;border-radius:8px;background:rgba(214,69,69,.08);color:#b93636;font-size:11px;line-height:16px}",
      ".dshwnw-list{display:flex;flex-direction:column;gap:7px}",
      ".dshwnw-list-row{display:flex;align-items:center;gap:9px;width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:10px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;text-align:left;cursor:pointer;transition:border-color .15s,background .15s,box-shadow .15s}",
      ".dshwnw-list-row[data-active=true]{border-color:var(--dsw-alias-state-business-primary,#3978e8);background:var(--dsw-alias-interactive-bg-hover,#f5f8ff)}",
      ".dshwnw-avatar{width:32px;height:32px;flex:none;border-radius:10px;background:linear-gradient(145deg,#487fe7,#7f6fe3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;box-shadow:0 3px 8px rgba(79,104,219,.2)}",
      ".dshwnw-list-copy{min-width:0;display:flex;flex-direction:column}",
      ".dshwnw-list-name{font-size:13px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-list-meta{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#87909d);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-actions{display:flex;gap:7px;flex-wrap:wrap}",
      ".dshwnw-primary,.dshwnw-button,.dshwnw-danger{height:34px;padding:0 12px;border-radius:9px;font-size:12px;font-weight:550;cursor:pointer;transition:transform .15s,box-shadow .15s,border-color .15s}",
      ".dshwnw-primary{border:0;background:var(--dsw-alias-state-business-primary,#3978e8);color:#fff;font-weight:600}",
      ".dshwnw-button,.dshwnw-danger{border:1px solid var(--dsw-alias-border-l1,#e1e5eb);background:var(--dsw-alias-bg-layer-1,#fff);color:inherit}",
      ".dshwnw-danger{color:#d64545}",
      ".dshwnw-primary:disabled,.dshwnw-button:disabled,.dshwnw-danger:disabled{opacity:.55;cursor:default}",
      ".dshwnw-empty{padding:18px 8px;text-align:center;color:var(--dsw-alias-label-tertiary,#87909d);font-size:12px;line-height:18px;border:1px dashed var(--dsw-alias-border-l1,#d7dbe2);border-radius:10px}",
      ".dshwnw-progress{display:flex;flex-direction:column;gap:7px}",
      ".dshwnw-progress-item{padding:9px;border-left:3px solid var(--dsw-alias-state-business-primary,#3978e8);border-radius:7px;background:var(--dsw-specific-sidebar-fill,#fafbfc);display:flex;flex-direction:column;gap:4px}",
      ".dshwnw-progress-head{display:flex;gap:8px;align-items:center;font-size:11px;color:var(--dsw-alias-label-tertiary,#87909d)}",
      ".dshwnw-progress-chapter{font-weight:650;color:var(--dsw-alias-label-secondary,#68717e)}",
      ".dshwnw-progress-copy{font-size:12px;line-height:18px;white-space:pre-wrap;overflow-wrap:anywhere}",
      ".dshwnw-footer{flex:none;padding:10px 13px;border-top:1px solid var(--dsw-alias-border-l1,#e6e9ee);display:flex;align-items:center;gap:8px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 -4px 14px rgba(31,35,41,.035);z-index:1}",
      ".dshwnw-notice{flex:1;min-width:0;font-size:12px;line-height:17px;color:var(--dsw-alias-label-secondary,#68717e);overflow-wrap:anywhere}",
      ".dshwnw-notice[data-kind=error]{color:#d64545}",
      ".dshwnw-rail{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:10px;background:transparent;color:var(--dsw-alias-label-secondary,#68717e);cursor:pointer}",
      ".dshwnw-rail:hover{background:var(--dsw-alias-interactive-bg-hover,#e9edf3);color:var(--dsw-alias-label-primary,#1f2329)}",
      ".dshwnw-rail[data-active=true]{background:var(--dsw-alias-interactive-bg-selected,#dce8ff);color:var(--dsw-alias-state-business-primary,#3978e8)}",
      ".dshwnw-dock{box-sizing:border-box;width:calc(100% - 4 * var(--dsh-composer-dock-inset,8px) - 2 * var(--dsh-composer-side-clearance,0px));margin:0 auto}",
      ".dshwnw-writebar{box-sizing:border-box;width:100%;max-width:calc(var(--dsh-composer-card-max-width,760px) - 4 * var(--dsh-composer-dock-inset,8px));min-height:36px;margin:0 auto;padding:4px 6px 4px 12px;border:1px solid var(--dsw-alias-border-l1,#e1e5eb);border-radius:12px;background:var(--dsw-specific-tip,#f7f9fc);display:flex;align-items:center;gap:9px}",
      ".dshwnw-writebar-icon{display:inline-flex;flex:none;color:var(--dsw-alias-state-business-primary,#3978e8)}",
      ".dshwnw-writebar-label{flex:none;font-size:13px;font-weight:600}",
      ".dshwnw-writebar-objective{flex:1;min-width:0;font-size:13px;color:var(--dsw-alias-label-primary-dimmed,#68717e);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-writebar-input{flex:1;min-width:0;height:26px;box-sizing:border-box;padding:0 8px;border:1px solid var(--dsw-alias-border-l2,#d7dbe2);border-radius:6px;background:var(--dsw-alias-bg-base,#fff);color:inherit;font-size:13px;outline:none}",
      ".dshwnw-writebar-actions{display:flex;align-items:center;gap:4px;flex:none}",
      ".dshwnw-writebar-action{height:27px;padding:0 8px;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary,#68717e);font-size:11px;cursor:pointer}",
      ".dshwnw-writebar-action:hover{background:var(--dsw-alias-interactive-bg-hover,#e9edf3)}",
      ".dshwnw-writebar-action:disabled{opacity:.45;cursor:default}",
      ".dshwnw-writebar-error{flex:1;min-width:0;color:var(--dsw-alias-state-error-primary,#d64545);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-command-row{display:flex;flex-direction:column;align-items:flex-end;gap:6px}",
      ".dshwnw-command-bubble{max-width:min(525px,82%);box-sizing:border-box;padding:10px 16px;border-radius:22px;background:var(--dsw-specific-bubble,#edf3ff);color:var(--dsw-alias-label-primary,#1f2329);font:var(--dsw-font-markdown-code,13px ui-monospace,monospace);white-space:pre-wrap;overflow-wrap:anywhere}",
      ".dshwnw-settings{display:flex;flex-direction:column;gap:10px}",
      ".dshwnw-setting-card{display:grid;grid-template-columns:38px minmax(0,1fr);gap:11px;padding:13px;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:13px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 2px 8px rgba(31,35,41,.04)}",
      ".dshwnw-setting-card[data-danger=true]{border-color:rgba(214,69,69,.28);background:rgba(214,69,69,.035)}",
      ".dshwnw-setting-icon{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:var(--dsw-alias-interactive-bg-selected,#dce8ff);color:var(--dshwnw-accent)}",
      ".dshwnw-setting-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}",
      ".dshwnw-setting-card[data-danger=true] .dshwnw-setting-icon{background:rgba(214,69,69,.1);color:#d64545}",
      ".dshwnw-setting-main{min-width:0;display:flex;flex-direction:column;gap:5px}",
      ".dshwnw-setting-title{font-size:14px;font-weight:700;line-height:20px}",
      ".dshwnw-setting-copy{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary,#68717e)}",
      ".dshwnw-setting-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:4px}",
      ".dshwnw-confirm{display:flex;flex-direction:column;gap:7px;margin-top:5px;padding:9px;border-radius:9px;background:rgba(214,69,69,.08);color:#a93232;font-size:11px;line-height:17px}",
      ".dshwnw-file-input{display:none}",
      ".dshwnw-custom-list{display:flex;flex-direction:column;gap:7px}",
      ".dshwnw-custom-row{display:grid;grid-template-columns:minmax(90px,.7fr) minmax(120px,1.3fr) 34px;gap:7px;align-items:start}",
      ".dshwnw-outline-card{content-visibility:auto;contain-intrinsic-size:0 360px}",
      ".dshwnw-chapter-meta{display:grid;grid-template-columns:80px 1fr 110px;gap:8px}",
      "@container novel-panel (max-width:430px){.dshwnw-grid,.dshwnw-chapter-meta{grid-template-columns:minmax(0,1fr)}.dshwnw-custom-row{grid-template-columns:minmax(80px,.7fr) minmax(100px,1.3fr) 34px}.dshwnw-toolbar{padding-inline:12px}.dshwnw-body{padding-inline:12px}.dshwnw-tab{padding-inline:9px}.dshwnw-card{padding:11px}.dshwnw-setting-card{grid-template-columns:36px minmax(0,1fr);padding:12px}.dshwnw-setting-icon{width:36px;height:36px}}",
      "@container novel-panel (max-width:330px){.dshwnw-setting-card{grid-template-columns:1fr}.dshwnw-setting-icon{width:34px;height:34px}.dshwnw-footer{flex-wrap:wrap}.dshwnw-notice{flex-basis:100%}}",
    ].join("\n");
    var tagId = "dsh-w-noval-write/styles";

    function installStyle() {
      if (typeof document === "undefined") return { owned: false, node: null };
      var existing = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]");
      if (existing) return { owned: false, node: existing };
      var node = document.createElement("style");
      node.dataset.plugin = "dsh-w-noval-write";
      node.dataset.pluginCss = tagId;
      node.textContent = CSS;
      document.head.appendChild(node);
      return { owned: true, node: node };
    }

    var passthrough = { parse: function (value) { return value; } };
    function parameter(name) {
      return { name: name, wire: name, source: "json", codec: { mode: "strict", typeSymbol: "json", schema: passthrough } };
    }
    function descriptor(method, parameters) {
      return {
        id: "dsh-w-noval-write#novalWriter/" + method,
        service: "novalWriter",
        namespace: "novalWriter",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: { mode: "strict", typeSymbol: "json", schema: passthrough },
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-noval-write",
      descriptors: [
        descriptor("getState", [parameter("workspaceId")]),
        descriptor("saveProject", [parameter("workspaceId"), parameter("input"), parameter("expectedRevision")]),
        descriptor("exportProject", [parameter("workspaceId")]),
        descriptor("importProject", [parameter("workspaceId"), parameter("input"), parameter("expectedRevision")]),
        descriptor("resetProject", [parameter("workspaceId"), parameter("expectedRevision")]),
        descriptor("getLink", [parameter("sessionId")]),
        descriptor("editLink", [parameter("sessionId"), parameter("objective"), parameter("expectedRevision")]),
        descriptor("clearLink", [parameter("sessionId"), parameter("expectedRevision")]),
      ],
    };

    function failureText(error) {
      if (!error) return "unknown error";
      if (error.message) return String(error.message);
      try { return JSON.stringify(error); } catch (_) { return String(error); }
    }

    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }

    function makeId(prefix) {
      return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    }

    function IconQuill() {
      return React.createElement("svg", { viewBox: "0 0 20 20", width: 18, height: 18, "aria-hidden": true },
        React.createElement("path", { d: "M15.8 3.2c-3.9.5-7.4 2.7-9.4 6.1-.9 1.5-1.4 3.1-1.6 4.6 1.5-.2 3.1-.7 4.6-1.6 3.4-2 5.6-5.5 6.4-9.1Z", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinejoin: "round" }),
        React.createElement("path", { d: "M4 16c2.4-3.5 5.4-6.5 9-9", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" })
      );
    }

    function WriteDock(props) {
      var linkSlot = React.useState(null);
      var link = linkSlot[0];
      var setLink = linkSlot[1];
      var editingSlot = React.useState(false);
      var editing = editingSlot[0];
      var setEditing = editingSlot[1];
      var draftSlot = React.useState("");
      var draft = draftSlot[0];
      var setDraft = draftSlot[1];
      var pendingSlot = React.useState(false);
      var pending = pendingSlot[0];
      var setPending = pendingSlot[1];
      var errorSlot = React.useState("");
      var actionError = errorSlot[0];
      var setActionError = errorSlot[1];
      var pendingRef = React.useRef(false);
      var mountedRef = React.useRef(true);
      var revision = link ? link.revision : 0;

      React.useEffect(function () {
        mountedRef.current = true;
        var stopped = false;
        function refresh() {
          props.loadLink().then(function (value) {
            if (!stopped && mountedRef.current && !pendingRef.current) setLink(value || null);
          }).catch(function () {});
        }
        refresh();
        var timer = setInterval(refresh, 3000);
        return function () { stopped = true; mountedRef.current = false; clearInterval(timer); };
      }, [props.loadLink]);

      React.useEffect(function () {
        setEditing(false);
        setActionError("");
      }, [revision]);

      function run(action, onSuccess) {
        if (pendingRef.current) return;
        pendingRef.current = true;
        setPending(true);
        setActionError("");
        action().then(function (value) {
          if (mountedRef.current && typeof onSuccess === "function") onSuccess(value);
        }).catch(function (error) {
          if (mountedRef.current) setActionError(failureText(error));
        }).finally(function () {
          pendingRef.current = false;
          if (mountedRef.current) setPending(false);
        });
      }

      if (!link) return null;
      if (editing) {
        return React.createElement("div", { className: "dshwnw-dock", "data-noval-write-bar": "true" },
          React.createElement("div", { className: "dshwnw-writebar" },
            React.createElement("span", { className: "dshwnw-writebar-icon" }, React.createElement(IconQuill, null)),
            React.createElement("input", {
              className: "dshwnw-writebar-input", type: "text", value: draft, autoFocus: true,
              "aria-label": props.t("writeObjectiveAria"),
              onChange: function (event) { setDraft(event.target.value); },
              onKeyDown: function (event) {
                if (event.key === "Enter" && draft.trim()) run(function () { return props.onEdit(draft.trim(), link.revision); }, function (value) { setLink(value); setEditing(false); });
                if (event.key === "Escape") setEditing(false);
              },
            }),
            actionError ? React.createElement("span", { className: "dshwnw-writebar-error", role: "alert" }, actionError) : null,
            React.createElement("div", { className: "dshwnw-writebar-actions" },
              React.createElement("button", { type: "button", className: "dshwnw-writebar-action", disabled: pending || !draft.trim(), onClick: function () { run(function () { return props.onEdit(draft.trim(), link.revision); }, function (value) { setLink(value); setEditing(false); }); } }, props.t("writeSave")),
              React.createElement("button", { type: "button", className: "dshwnw-writebar-action", disabled: pending, onClick: function () { setEditing(false); } }, props.t("writeCancel"))
            )
          )
        );
      }
      return React.createElement("div", { className: "dshwnw-dock", "data-noval-write-bar": "true" },
        React.createElement("div", { className: "dshwnw-writebar", title: link.workspaceTitle || link.workspaceId },
          React.createElement("span", { className: "dshwnw-writebar-icon" }, React.createElement(IconQuill, null)),
          React.createElement("span", { className: "dshwnw-writebar-label" }, props.t("writeActive")),
          actionError
            ? React.createElement("span", { className: "dshwnw-writebar-error", role: "alert" }, actionError)
            : React.createElement("span", { className: "dshwnw-writebar-objective" }, link.objective),
          React.createElement("div", { className: "dshwnw-writebar-actions" },
            React.createElement("button", { type: "button", className: "dshwnw-writebar-action", disabled: pending, onClick: function () { setDraft(link.objective); setEditing(true); } }, props.t("writeEdit")),
            React.createElement("button", { type: "button", className: "dshwnw-writebar-action", disabled: pending, onClick: function () { run(function () { return props.onClear(link.revision); }, function () { setLink(null); }); } }, props.t("writeClear"))
          )
        )
      );
    }

    var writeCommandInputDefinition = {
      kind: "noval-write-command-input",
      target: "chat",
      match: function (event) {
        return event.type === "command/run" && event.data && event.data.name === "write"
          ? { id: String(event.data.commandId), role: "start" }
          : null;
      },
      start: function (_context, match) {
        var event = match.event;
        return {
          commandId: event.data.commandId,
          seq: event.seq,
          time: event.time,
          text: "/" + event.data.name + String(event.data.args || "").trimEnd(),
        };
      },
      update: function (context) { return context.state; },
      buildViewNode: function (context) {
        if (!context.state) return null;
        return {
          key: context.key,
          kind: "noval-write-command-input",
          id: context.id,
          target: "chat",
          anchorSeq: context.state.seq - 0.1,
          location: context.start && context.start.location ? context.start.location : { kind: "unresolved" },
          visibility: "visible",
          data: context.state,
        };
      },
    };

    function WriteCommandInputView(props) {
      return React.createElement("div", { className: "dshwnw-command-row", role: "group", "aria-label": props.t("writeCommandInput") },
        React.createElement("div", { className: "dshwnw-command-bubble" }, props.node.data.text)
      );
    }

    function InputField(props) {
      return React.createElement("label", { className: "dshwnw-field" },
        React.createElement("span", { className: "dshwnw-label" }, props.label),
        React.createElement("input", {
          className: "dshwnw-input",
          value: props.value || "",
          placeholder: props.placeholder || "",
          onChange: function (event) { props.onChange(event.target.value); },
        })
      );
    }

    function TextField(props) {
      return React.createElement("label", { className: "dshwnw-field" },
        React.createElement("span", { className: "dshwnw-label" }, props.label),
        React.createElement("textarea", {
          className: "dshwnw-textarea",
          value: props.value || "",
          placeholder: props.placeholder || "",
          rows: props.rows || 4,
          onChange: function (event) { props.onChange(event.target.value); },
        })
      );
    }

    function SelectField(props) {
      return React.createElement("label", { className: "dshwnw-field" },
        React.createElement("span", { className: "dshwnw-label" }, props.label),
        React.createElement("select", {
          className: "dshwnw-select",
          value: props.value || "",
          onChange: function (event) { props.onChange(event.target.value); },
        }, React.createElement("option", { value: "" }, props.empty || "—"), props.options.map(function (option) {
          return React.createElement("option", { key: option.value, value: option.value }, option.label);
        }))
      );
    }

    function FieldGroup(props) {
      return React.createElement("div", { className: "dshwnw-subsection" },
        props.title ? React.createElement("div", { className: "dshwnw-subtitle" }, props.title) : null,
        props.children
      );
    }

    function CustomFieldsEditor(props) {
      var fields = props.value && typeof props.value === "object" ? props.value : {};
      var entries = Object.entries(fields);
      function replaceKey(oldKey, nextKey) {
        var clean = nextKey.trim();
        var next = {};
        entries.forEach(function (entry) {
          if (entry[0] === oldKey) {
            if (clean) next[clean] = entry[1];
          } else next[entry[0]] = entry[1];
        });
        props.onChange(next);
      }
      function setValue(key, value) {
        props.onChange(Object.assign({}, fields, { [key]: value }));
      }
      function remove(key) {
        var next = Object.assign({}, fields);
        delete next[key];
        props.onChange(next);
      }
      function addField() {
        var index = entries.length + 1;
        var key = props.t("customFieldDefault") + index;
        while (Object.hasOwn(fields, key)) { index += 1; key = props.t("customFieldDefault") + index; }
        props.onChange(Object.assign({}, fields, { [key]: "" }));
      }
      return React.createElement(FieldGroup, { title: props.title || props.t("customFields") },
        React.createElement("div", { className: "dshwnw-section-hint" }, props.t("customFieldsHint")),
        entries.length === 0 ? React.createElement("div", { className: "dshwnw-empty" }, props.t("customFieldsEmpty")) : null,
        React.createElement("div", { className: "dshwnw-custom-list" }, entries.map(function (entry, entryIndex) {
          return React.createElement("div", { className: "dshwnw-custom-row", key: entryIndex },
            React.createElement("input", { className: "dshwnw-input", value: entry[0], "aria-label": props.t("customFieldName"), onChange: function (event) { replaceKey(entry[0], event.target.value); } }),
            React.createElement("textarea", { className: "dshwnw-textarea", rows: 2, value: entry[1], "aria-label": props.t("customFieldValue"), onChange: function (event) { setValue(entry[0], event.target.value); } }),
            React.createElement("button", { type: "button", className: "dshwnw-danger", "aria-label": props.t("delete"), onClick: function () { remove(entry[0]); } }, "×")
          );
        })),
        React.createElement("button", { type: "button", className: "dshwnw-button", onClick: addField }, "+ " + props.t("addCustomField"))
      );
    }

    function ProjectTab(props) {
      var p = props.project;
      var set = props.set;
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-section-title" }, props.t("projectTitle")),
        React.createElement("div", { className: "dshwnw-section-hint" }, props.t("projectHint")),
        React.createElement(FieldGroup, { title: props.t("groupBasics") },
          React.createElement("div", { className: "dshwnw-grid" },
            React.createElement(InputField, { label: props.t("bookTitle"), value: p.title, onChange: function (v) { set("title", v); } }),
            React.createElement(InputField, { label: props.t("genre"), value: p.genre, onChange: function (v) { set("genre", v); } }),
            React.createElement(InputField, { label: props.t("tone"), value: p.tone, onChange: function (v) { set("tone", v); } }),
            React.createElement(InputField, { label: props.t("pov"), value: p.pov, onChange: function (v) { set("pov", v); } }),
            React.createElement(InputField, { label: props.t("targetWords"), value: p.targetWords, onChange: function (v) { set("targetWords", v); } }),
            React.createElement(InputField, { label: props.t("audience"), value: p.audience, onChange: function (v) { set("audience", v); } }),
            React.createElement(InputField, { label: props.t("contentRating"), value: p.contentRating, onChange: function (v) { set("contentRating", v); } })
          ),
          React.createElement(TextField, { label: props.t("premise"), value: p.premise, onChange: function (v) { set("premise", v); } })
        ),
        React.createElement(FieldGroup, { title: props.t("groupWritingContract") },
          React.createElement(TextField, { label: props.t("styleGuide"), value: p.styleGuide, rows: 6, onChange: function (v) { set("styleGuide", v); } }),
          React.createElement(TextField, { label: props.t("constraints"), value: p.constraints, rows: 5, onChange: function (v) { set("constraints", v); } }),
          React.createElement(TextField, { label: props.t("notes"), value: p.notes, onChange: function (v) { set("notes", v); } })
        ),
        React.createElement(FieldGroup, { title: props.t("genreProfileTitle") },
          React.createElement(InputField, { label: props.t("genreProfileType"), value: p.genreProfile.type, placeholder: props.t("genreProfilePlaceholder"), onChange: function (v) { props.setGenre("type", v); } })
        ),
        React.createElement(CustomFieldsEditor, { t: props.t, value: p.genreProfile.customFields, onChange: props.setGenreFields })
      );
    }

    function CharacterTab(props) {
      var characters = props.project.characters;
      var selected = characters.find(function (item) { return item.id === props.selectedId; }) || characters[0] || null;
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-card-head" },
          React.createElement("div", { className: "dshwnw-section-title" }, props.t("charactersTitle")),
          React.createElement("button", { type: "button", className: "dshwnw-button", onClick: props.onAdd }, "+ " + props.t("add"))
        ),
        characters.length === 0
          ? React.createElement("div", { className: "dshwnw-empty" }, props.t("charactersEmpty"))
          : React.createElement(React.Fragment, null,
            React.createElement("div", { className: "dshwnw-list" }, characters.map(function (character) {
              return React.createElement("button", {
                key: character.id, type: "button", className: "dshwnw-list-row",
                "data-active": selected && selected.id === character.id ? "true" : undefined,
                onClick: function () { props.onSelect(character.id); },
              },
                React.createElement("span", { className: "dshwnw-avatar" }, (character.name || "?").slice(0, 1)),
                React.createElement("span", { className: "dshwnw-list-copy" },
                  React.createElement("span", { className: "dshwnw-list-name" }, character.name || props.t("unnamedCharacter")),
                  React.createElement("span", { className: "dshwnw-list-meta" }, character.role || props.t("rolePlaceholder"))
                )
              );
            })),
            selected ? React.createElement("div", { className: "dshwnw-card" },
              React.createElement("div", { className: "dshwnw-card-head" },
                React.createElement("div", { className: "dshwnw-card-title" }, selected.name || props.t("unnamedCharacter")),
                React.createElement("button", { type: "button", className: "dshwnw-danger", onClick: function () { props.onDelete(selected.id); } }, props.t("delete"))
              ),
              React.createElement(FieldGroup, { title: props.t("groupIdentity") },
                React.createElement("div", { className: "dshwnw-grid" },
                  React.createElement(InputField, { label: props.t("name"), value: selected.name, onChange: function (v) { props.onPatch(selected.id, "name", v); } }),
                  React.createElement(InputField, { label: props.t("aliases"), value: selected.aliases, onChange: function (v) { props.onPatch(selected.id, "aliases", v); } }),
                  React.createElement(InputField, { label: props.t("age"), value: selected.age, onChange: function (v) { props.onPatch(selected.id, "age", v); } }),
                  React.createElement(InputField, { label: props.t("identity"), value: selected.identity, onChange: function (v) { props.onPatch(selected.id, "identity", v); } }),
                  React.createElement(InputField, { label: props.t("role"), value: selected.role, onChange: function (v) { props.onPatch(selected.id, "role", v); } }),
                  React.createElement(InputField, { label: props.t("characterStatus"), value: selected.status, onChange: function (v) { props.onPatch(selected.id, "status", v); } })
                )
              ),
              React.createElement(FieldGroup, { title: props.t("groupPortrait") },
                React.createElement(TextField, { label: props.t("appearance"), value: selected.appearance, onChange: function (v) { props.onPatch(selected.id, "appearance", v); } }),
                React.createElement(TextField, { label: props.t("traits"), value: selected.traits, onChange: function (v) { props.onPatch(selected.id, "traits", v); } }),
                React.createElement(TextField, { label: props.t("background"), value: selected.background, onChange: function (v) { props.onPatch(selected.id, "background", v); } })
              ),
              React.createElement(FieldGroup, { title: props.t("groupDrive") },
                React.createElement(TextField, { label: props.t("goal"), value: selected.goal, onChange: function (v) { props.onPatch(selected.id, "goal", v); } }),
                React.createElement(TextField, { label: props.t("motivation"), value: selected.motivation, onChange: function (v) { props.onPatch(selected.id, "motivation", v); } }),
                React.createElement(TextField, { label: props.t("stakes"), value: selected.stakes, onChange: function (v) { props.onPatch(selected.id, "stakes", v); } }),
                React.createElement(TextField, { label: props.t("conflict"), value: selected.conflict, onChange: function (v) { props.onPatch(selected.id, "conflict", v); } })
              ),
              React.createElement(FieldGroup, { title: props.t("groupResources") },
                React.createElement(TextField, { label: props.t("abilities"), value: selected.abilities, onChange: function (v) { props.onPatch(selected.id, "abilities", v); } }),
                React.createElement(TextField, { label: props.t("weaknesses"), value: selected.weaknesses, onChange: function (v) { props.onPatch(selected.id, "weaknesses", v); } }),
                React.createElement(TextField, { label: props.t("knowledge"), value: selected.knowledge, onChange: function (v) { props.onPatch(selected.id, "knowledge", v); } }),
                React.createElement(TextField, { label: props.t("possessions"), value: selected.possessions, onChange: function (v) { props.onPatch(selected.id, "possessions", v); } })
              ),
              React.createElement(FieldGroup, { title: props.t("groupPerformance") },
                React.createElement(TextField, { label: props.t("secret"), value: selected.secret, onChange: function (v) { props.onPatch(selected.id, "secret", v); } }),
                React.createElement(TextField, { label: props.t("voice"), value: selected.voice, onChange: function (v) { props.onPatch(selected.id, "voice", v); } }),
                React.createElement(TextField, { label: props.t("habits"), value: selected.habits, onChange: function (v) { props.onPatch(selected.id, "habits", v); } }),
                React.createElement(TextField, { label: props.t("arc"), value: selected.arc, onChange: function (v) { props.onPatch(selected.id, "arc", v); } })
              ),
              React.createElement(CustomFieldsEditor, { t: props.t, value: selected.customFields, onChange: function (value) { props.onPatch(selected.id, "customFields", value); } })
            ) : null
          )
      );
    }

    function RelationshipsTab(props) {
      var characters = props.project.characters;
      var options = characters.map(function (item) { return { value: item.id, label: item.name || props.t("unnamedCharacter") }; });
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-card-head" },
          React.createElement("div", { className: "dshwnw-section-title" }, props.t("relationshipsTitle")),
          React.createElement("button", { type: "button", className: "dshwnw-button", disabled: characters.length < 2, onClick: props.onAdd }, "+ " + props.t("add"))
        ),
        characters.length < 2
          ? React.createElement("div", { className: "dshwnw-empty" }, props.t("relationshipsNeedCharacters"))
          : props.project.relationships.length === 0
            ? React.createElement("div", { className: "dshwnw-empty" }, props.t("relationshipsEmpty"))
            : props.project.relationships.map(function (relation) {
              var fromCharacter = characters.find(function (item) { return item.id === relation.fromId; });
              var toCharacter = characters.find(function (item) { return item.id === relation.toId; });
              var relationTitle = fromCharacter && toCharacter
                ? (fromCharacter.name || props.t("unnamedCharacter")) + " → " + (toCharacter.name || props.t("unnamedCharacter"))
                : props.t("relationship");
              var fromOptions = options.filter(function (option) { return option.value !== relation.toId; });
              var toOptions = options.filter(function (option) { return option.value !== relation.fromId; });
              return React.createElement("div", { className: "dshwnw-card", key: relation.id },
                React.createElement("div", { className: "dshwnw-card-head" },
                  React.createElement("div", { className: "dshwnw-card-title" }, relationTitle),
                  React.createElement("button", { type: "button", className: "dshwnw-danger", onClick: function () { props.onDelete(relation.id); } }, props.t("delete"))
                ),
                !fromCharacter || !toCharacter || relation.fromId === relation.toId
                  ? React.createElement("div", { className: "dshwnw-warning" }, props.t("relationshipInvalid"))
                  : null,
                React.createElement(FieldGroup, { title: props.t("groupRelationIdentity") },
                  React.createElement("div", { className: "dshwnw-grid" },
                    React.createElement(SelectField, { label: props.t("from"), empty: props.t("chooseCharacter"), value: relation.fromId, options: fromOptions, onChange: function (v) { props.onPatch(relation.id, "fromId", v); } }),
                    React.createElement(SelectField, { label: props.t("to"), empty: props.t("chooseCharacter"), value: relation.toId, options: toOptions, onChange: function (v) { props.onPatch(relation.id, "toId", v); } }),
                    React.createElement(InputField, { label: props.t("relationLabel"), value: relation.label, onChange: function (v) { props.onPatch(relation.id, "label", v); } }),
                    React.createElement(InputField, { label: props.t("relationStatus"), value: relation.status, onChange: function (v) { props.onPatch(relation.id, "status", v); } })
                  )
                ),
                React.createElement(FieldGroup, { title: props.t("groupRelationHistory") },
                  React.createElement(TextField, { label: props.t("relationHistory"), value: relation.history, onChange: function (v) { props.onPatch(relation.id, "history", v); } }),
                  React.createElement(TextField, { label: props.t("dynamic"), value: relation.dynamic, onChange: function (v) { props.onPatch(relation.id, "dynamic", v); } }),
                  React.createElement(TextField, { label: props.t("powerBalance"), value: relation.powerBalance, onChange: function (v) { props.onPatch(relation.id, "powerBalance", v); } })
                ),
                React.createElement(FieldGroup, { title: props.t("groupRelationLayers") },
                  React.createElement(TextField, { label: props.t("publicFace"), value: relation.publicFace, onChange: function (v) { props.onPatch(relation.id, "publicFace", v); } }),
                  React.createElement(TextField, { label: props.t("privateTruth"), value: relation.privateTruth, onChange: function (v) { props.onPatch(relation.id, "privateTruth", v); } }),
                  React.createElement(TextField, { label: props.t("sharedSecret"), value: relation.sharedSecret, onChange: function (v) { props.onPatch(relation.id, "sharedSecret", v); } })
                ),
                React.createElement(FieldGroup, { title: props.t("groupRelationArc") },
                  React.createElement(TextField, { label: props.t("tension"), value: relation.tension, onChange: function (v) { props.onPatch(relation.id, "tension", v); } }),
                  React.createElement(TextField, { label: props.t("turningPoints"), value: relation.turningPoints, onChange: function (v) { props.onPatch(relation.id, "turningPoints", v); } }),
                  React.createElement(TextField, { label: props.t("futureDirection"), value: relation.futureDirection, onChange: function (v) { props.onPatch(relation.id, "futureDirection", v); } })
                ),
                React.createElement(CustomFieldsEditor, { t: props.t, value: relation.customFields, onChange: function (value) { props.onPatch(relation.id, "customFields", value); } })
              );
            })
      );
    }

    function SectionFields(props) {
      var groups = props.groups || [{ title: "", fields: props.fields || [] }];
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-section-title" }, props.title),
        props.hint ? React.createElement("div", { className: "dshwnw-section-hint" }, props.hint) : null,
        groups.map(function (group, groupIndex) {
          return React.createElement(FieldGroup, { key: group.title || groupIndex, title: group.title }, group.fields.map(function (field) {
            return React.createElement(TextField, {
              key: field.key,
              label: field.label,
              value: props.value[field.key],
              rows: field.rows || 4,
              onChange: function (v) { props.onPatch(field.key, v); },
            });
          }));
        })
      );
    }

    function SceneTab(props) {
      var scene = props.project.scene;
      var options = props.project.characters.map(function (item) { return { value: item.id, label: item.name || props.t("unnamedCharacter") }; });
      var progress = (props.project.progress || []).slice(-20).reverse();
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-section-title" }, props.t("sceneTitle")),
        React.createElement("div", { className: "dshwnw-section-hint" }, props.t("sceneHint")),
        React.createElement(FieldGroup, { title: props.t("groupSceneFrame") },
          React.createElement("div", { className: "dshwnw-grid" },
            React.createElement(InputField, { label: props.t("chapter"), value: scene.chapter, onChange: function (v) { props.onPatch("chapter", v); } }),
            React.createElement(InputField, { label: props.t("sceneTime"), value: scene.time, onChange: function (v) { props.onPatch("time", v); } }),
            React.createElement(InputField, { label: props.t("location"), value: scene.location, onChange: function (v) { props.onPatch("location", v); } }),
            React.createElement(SelectField, { label: props.t("scenePov"), empty: props.t("chooseCharacter"), value: scene.povCharacterId, options: options, onChange: function (v) { props.onPatch("povCharacterId", v); } })
          ),
          React.createElement(TextField, { label: props.t("participants"), value: scene.participants, onChange: function (v) { props.onPatch("participants", v); } })
        ),
        React.createElement(FieldGroup, { title: props.t("groupSceneDramatic") },
          React.createElement(TextField, { label: props.t("sceneGoal"), value: scene.goal, onChange: function (v) { props.onPatch("goal", v); } }),
          React.createElement(TextField, { label: props.t("sceneConflict"), value: scene.conflict, onChange: function (v) { props.onPatch("conflict", v); } }),
          React.createElement(TextField, { label: props.t("beats"), value: scene.beats, rows: 6, onChange: function (v) { props.onPatch("beats", v); } }),
          React.createElement(TextField, { label: props.t("emotionalTurn"), value: scene.emotionalTurn, onChange: function (v) { props.onPatch("emotionalTurn", v); } }),
          React.createElement(TextField, { label: props.t("sceneOutcome"), value: scene.outcome, onChange: function (v) { props.onPatch("outcome", v); } }),
          React.createElement(TextField, { label: props.t("nextHook"), value: scene.nextHook, onChange: function (v) { props.onPatch("nextHook", v); } })
        ),
        React.createElement(FieldGroup, { title: props.t("groupSceneContinuity") },
          React.createElement(TextField, { label: props.t("sensoryAnchor"), value: scene.sensoryAnchor, onChange: function (v) { props.onPatch("sensoryAnchor", v); } }),
          React.createElement(TextField, { label: props.t("knowledgeChanges"), value: scene.knowledgeChanges, onChange: function (v) { props.onPatch("knowledgeChanges", v); } }),
          React.createElement(TextField, { label: props.t("propChanges"), value: scene.propChanges, onChange: function (v) { props.onPatch("propChanges", v); } }),
          React.createElement(TextField, { label: props.t("continuity"), value: scene.continuity, rows: 6, onChange: function (v) { props.onPatch("continuity", v); } })
        ),
        React.createElement("div", { className: "dshwnw-section-title" }, props.t("progressTitle")),
        progress.length
          ? React.createElement("div", { className: "dshwnw-progress" }, progress.map(function (item) {
              return React.createElement("div", { key: item.id, className: "dshwnw-progress-item" },
                React.createElement("div", { className: "dshwnw-progress-head" },
                  React.createElement("span", { className: "dshwnw-progress-chapter" }, item.chapter || props.t("progressEntry")),
                  React.createElement("span", null, item.at || "")
                ),
                React.createElement("div", { className: "dshwnw-progress-copy" }, item.summary),
                item.canonChanges ? React.createElement("div", { className: "dshwnw-progress-copy" }, props.t("canonChanges") + ": " + item.canonChanges) : null,
                item.openThreads ? React.createElement("div", { className: "dshwnw-progress-copy" }, props.t("openThreads") + ": " + item.openThreads) : null
              );
            }))
          : React.createElement("div", { className: "dshwnw-empty" }, props.t("progressEmpty"))
      );
    }

    function OutlineSceneEditor(props) {
      var scene = props.scene;
      var options = props.characters.map(function (item) { return { value: item.id, label: item.name || props.t("unnamedCharacter") }; });
      return React.createElement("div", { className: "dshwnw-subsection" },
        React.createElement("div", { className: "dshwnw-card-head" },
          React.createElement("div", { className: "dshwnw-card-title" }, scene.title || props.t("unnamedScene")),
          React.createElement("button", { type: "button", className: "dshwnw-danger", onClick: props.onDelete }, props.t("delete"))
        ),
        React.createElement("div", { className: "dshwnw-grid" },
          React.createElement(InputField, { label: props.t("sceneName"), value: scene.title, onChange: function (v) { props.onPatch("title", v); } }),
          React.createElement(InputField, { label: props.t("location"), value: scene.location, onChange: function (v) { props.onPatch("location", v); } }),
          React.createElement(InputField, { label: props.t("sceneTime"), value: scene.time, onChange: function (v) { props.onPatch("time", v); } }),
          React.createElement(SelectField, { label: props.t("scenePov"), empty: props.t("chooseCharacter"), value: scene.povCharacterId, options: options, onChange: function (v) { props.onPatch("povCharacterId", v); } })
        ),
        React.createElement(TextField, { label: props.t("participants"), value: scene.participants, onChange: function (v) { props.onPatch("participants", v); } }),
        React.createElement(TextField, { label: props.t("sceneGoal"), value: scene.goal, onChange: function (v) { props.onPatch("goal", v); } }),
        React.createElement(TextField, { label: props.t("sceneConflict"), value: scene.conflict, onChange: function (v) { props.onPatch("conflict", v); } }),
        React.createElement(TextField, { label: props.t("beats"), value: scene.beats, rows: 5, onChange: function (v) { props.onPatch("beats", v); } }),
        React.createElement(TextField, { label: props.t("sceneOutcome"), value: scene.outcome, onChange: function (v) { props.onPatch("outcome", v); } }),
        React.createElement(TextField, { label: props.t("nextHook"), value: scene.nextHook, onChange: function (v) { props.onPatch("nextHook", v); } }),
        React.createElement(CustomFieldsEditor, { t: props.t, value: scene.customFields, onChange: function (value) { props.onPatch("customFields", value); } })
      );
    }

    function OutlineTab(props) {
      var volumes = props.project.volumes || [];
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-card-head" },
          React.createElement("div", { className: "dshwnw-section-title" }, props.t("outlineTitle")),
          React.createElement("button", { type: "button", className: "dshwnw-button", onClick: props.onAddVolume }, "+ " + props.t("addVolume"))
        ),
        React.createElement("div", { className: "dshwnw-section-hint" }, props.t("outlineHint")),
        volumes.length === 0 ? React.createElement("div", { className: "dshwnw-empty" }, props.t("outlineEmpty")) : null,
        volumes.map(function (volume) {
          return React.createElement("div", { className: "dshwnw-card dshwnw-outline-card", key: volume.id },
            React.createElement("div", { className: "dshwnw-card-head" },
              React.createElement("div", { className: "dshwnw-card-title" }, volume.title || props.t("unnamedVolume")),
              React.createElement("button", { type: "button", className: "dshwnw-danger", onClick: function () { props.onDeleteVolume(volume.id); } }, props.t("delete"))
            ),
            React.createElement("div", { className: "dshwnw-grid" },
              React.createElement(InputField, { label: props.t("volumeTitle"), value: volume.title, onChange: function (v) { props.onPatchVolume(volume.id, "title", v); } }),
              React.createElement(InputField, { label: props.t("outlineStatus"), value: volume.status, onChange: function (v) { props.onPatchVolume(volume.id, "status", v); } })
            ),
            React.createElement(TextField, { label: props.t("volumeSummary"), value: volume.summary, onChange: function (v) { props.onPatchVolume(volume.id, "summary", v); } }),
            React.createElement(CustomFieldsEditor, { t: props.t, value: volume.customFields, onChange: function (value) { props.onPatchVolume(volume.id, "customFields", value); } }),
            React.createElement("div", { className: "dshwnw-card-head" },
              React.createElement("div", { className: "dshwnw-subtitle" }, props.t("chaptersTitle") + " · " + volume.chapters.length),
              React.createElement("button", { type: "button", className: "dshwnw-button", onClick: function () { props.onAddChapter(volume.id); } }, "+ " + props.t("addChapter"))
            ),
            volume.chapters.map(function (chapter, chapterIndex) {
              return React.createElement("div", { className: "dshwnw-subsection", key: chapter.id },
                React.createElement("div", { className: "dshwnw-card-head" },
                  React.createElement("div", { className: "dshwnw-card-title" }, (chapter.number ? chapter.number + " · " : "") + (chapter.title || props.t("unnamedChapter"))),
                  React.createElement("button", { type: "button", className: "dshwnw-button", disabled: chapterIndex === 0, onClick: function () { props.onMoveChapter(volume.id, chapter.id, -1); } }, "↑"),
                  React.createElement("button", { type: "button", className: "dshwnw-button", disabled: chapterIndex === volume.chapters.length - 1, onClick: function () { props.onMoveChapter(volume.id, chapter.id, 1); } }, "↓"),
                  React.createElement("button", { type: "button", className: "dshwnw-danger", onClick: function () { props.onDeleteChapter(volume.id, chapter.id); } }, props.t("delete"))
                ),
                React.createElement("div", { className: "dshwnw-chapter-meta" },
                  React.createElement(InputField, { label: props.t("chapterNumber"), value: chapter.number, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "number", v); } }),
                  React.createElement(InputField, { label: props.t("chapterTitle"), value: chapter.title, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "title", v); } }),
                  React.createElement(InputField, { label: props.t("chapterWords"), value: chapter.targetWords, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "targetWords", v); } })
                ),
                React.createElement("div", { className: "dshwnw-grid" },
                  React.createElement(InputField, { label: props.t("outlineStatus"), value: chapter.status, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "status", v); } }),
                  React.createElement(InputField, { label: props.t("chapterLocations"), value: chapter.locations, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "locations", v); } })
                ),
                React.createElement(TextField, { label: props.t("chapterSummary"), value: chapter.summary, rows: 5, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "summary", v); } }),
                React.createElement(TextField, { label: props.t("chapterEvents"), value: (chapter.events || []).join("\n"), rows: 6, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "events", v.split(/\r?\n/).filter(function (item) { return item.trim(); })); } }),
                React.createElement(TextField, { label: props.t("dialogueNotes"), value: chapter.dialogueNotes, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "dialogueNotes", v); } }),
                React.createElement(TextField, { label: props.t("endingHook"), value: chapter.endingHook, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "endingHook", v); } }),
                React.createElement(CustomFieldsEditor, { t: props.t, value: chapter.customFields, onChange: function (value) { props.onPatchChapter(volume.id, chapter.id, "customFields", value); } }),
                React.createElement("div", { className: "dshwnw-card-head" },
                  React.createElement("div", { className: "dshwnw-subtitle" }, props.t("chapterScenes") + " · " + chapter.scenes.length),
                  React.createElement("button", { type: "button", className: "dshwnw-button", onClick: function () { props.onAddScene(volume.id, chapter.id); } }, "+ " + props.t("addScene"))
                ),
                chapter.scenes.map(function (scene) {
                  return React.createElement(OutlineSceneEditor, {
                    key: scene.id, scene: scene, characters: props.project.characters, t: props.t,
                    onPatch: function (key, value) { props.onPatchScene(volume.id, chapter.id, scene.id, key, value); },
                    onDelete: function () { props.onDeleteScene(volume.id, chapter.id, scene.id); },
                  });
                })
              );
            })
          );
        })
      );
    }

    function SettingIcon(props) {
      var content = props.kind === "export"
        ? [
            React.createElement("path", { key: "tray", d: "M4 13.5v1.2A1.3 1.3 0 0 0 5.3 16h9.4a1.3 1.3 0 0 0 1.3-1.3v-1.2" }),
            React.createElement("path", { key: "arrow", d: "M10 3v9m0 0 3-3m-3 3-3-3" }),
          ]
        : props.kind === "import"
          ? [
              React.createElement("path", { key: "tray", d: "M4 13.5v1.2A1.3 1.3 0 0 0 5.3 16h9.4a1.3 1.3 0 0 0 1.3-1.3v-1.2" }),
              React.createElement("path", { key: "arrow", d: "M10 12V3m0 0 3 3m-3-3L7 6" }),
            ]
          : [
              React.createElement("path", { key: "lid", d: "M4 6h12M8 3.5h4M6 6l.7 10h6.6L14 6" }),
              React.createElement("path", { key: "lines", d: "M8.2 9v4m3.6-4v4" }),
            ];
      return React.createElement("svg", { viewBox: "0 0 20 20", "aria-hidden": true }, content);
    }

    function SettingsTab(props) {
      var armedSlot = React.useState(false);
      var armed = armedSlot[0];
      var setArmed = armedSlot[1];
      var fileRef = React.useRef(null);
      React.useEffect(function () { setArmed(false); }, [props.workspaceId]);
      var locked = props.busy || props.dirty;
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-section-title" }, props.t("settingsTitle")),
        React.createElement("div", { className: "dshwnw-section-hint" }, props.t("settingsHint")),
        props.dirty ? React.createElement("div", { className: "dshwnw-warning" }, props.t("settingsDirty")) : null,
        React.createElement("div", { className: "dshwnw-settings" },
          React.createElement("div", { className: "dshwnw-setting-card" },
            React.createElement("div", { className: "dshwnw-setting-icon", "aria-hidden": true }, React.createElement(SettingIcon, { kind: "export" })),
            React.createElement("div", { className: "dshwnw-setting-main" },
              React.createElement("div", { className: "dshwnw-setting-title" }, props.t("exportTitle")),
              React.createElement("div", { className: "dshwnw-setting-copy" }, props.t("exportHint")),
              React.createElement("div", { className: "dshwnw-setting-actions" },
                React.createElement("button", { type: "button", className: "dshwnw-button", disabled: locked, onClick: props.onExport }, props.busy ? props.t("working") : props.t("exportAction"))
              )
            )
          ),
          React.createElement("div", { className: "dshwnw-setting-card" },
            React.createElement("div", { className: "dshwnw-setting-icon", "aria-hidden": true }, React.createElement(SettingIcon, { kind: "import" })),
            React.createElement("div", { className: "dshwnw-setting-main" },
              React.createElement("div", { className: "dshwnw-setting-title" }, props.t("importTitle")),
              React.createElement("div", { className: "dshwnw-setting-copy" }, props.t("importHint")),
              React.createElement("input", {
                ref: fileRef, type: "file", className: "dshwnw-file-input", accept: ".json,application/json",
                onChange: function (event) {
                  var file = event.target.files && event.target.files[0];
                  event.target.value = "";
                  if (file) props.onImport(file);
                },
              }),
              React.createElement("div", { className: "dshwnw-setting-actions" },
                React.createElement("button", { type: "button", className: "dshwnw-button", disabled: locked, onClick: function () { if (fileRef.current) fileRef.current.click(); } }, props.busy ? props.t("working") : props.t("importAction"))
              )
            )
          ),
          React.createElement("div", { className: "dshwnw-setting-card", "data-danger": "true" },
            React.createElement("div", { className: "dshwnw-setting-icon", "aria-hidden": true }, React.createElement(SettingIcon, { kind: "clear" })),
            React.createElement("div", { className: "dshwnw-setting-main" },
              React.createElement("div", { className: "dshwnw-setting-title" }, props.t("clearTitle")),
              React.createElement("div", { className: "dshwnw-setting-copy" }, props.t("clearHint")),
              armed
                ? React.createElement("div", { className: "dshwnw-confirm" },
                    React.createElement("span", null, props.t("clearConfirm")),
                    React.createElement("div", { className: "dshwnw-setting-actions" },
                      React.createElement("button", { type: "button", className: "dshwnw-button", disabled: props.busy, onClick: function () { setArmed(false); } }, props.t("cancel")),
                      React.createElement("button", { type: "button", className: "dshwnw-danger", disabled: props.busy, onClick: function () { setArmed(false); props.onClear(); } }, props.t("clearConfirmAction"))
                    )
                  )
                : React.createElement("div", { className: "dshwnw-setting-actions" },
                    React.createElement("button", { type: "button", className: "dshwnw-danger", disabled: locked, onClick: function () { setArmed(true); } }, props.t("clearAction"))
                  )
            )
          )
        )
      );
    }

    function NovelWriterPanel(props) {
      var t = typeof props.t === "function" ? props.t : function (key) { return key; };
      var writer = props.writer;
      var useSessions = typeof props.useSessions === "function" ? props.useSessions : function (selector) { return selector({ current: null }); };
      var useWorkspaces = typeof props.useWorkspaces === "function" ? props.useWorkspaces : function (selector) { return selector({ items: [], recentWorkspaceId: null }); };
      var sessionId = useSessions(function (value) { return value.current == null ? null : String(value.current); });
      var workspace = useWorkspaces(function (value) {
        var items = Array.isArray(value.items) ? value.items : [];
        var current = sessionId ? items.find(function (item) {
          return Array.isArray(item.sessionIds) && item.sessionIds.some(function (id) { return String(id) === sessionId; });
        }) : null;
        if (current) return current;
        return value.recentWorkspaceId == null ? null : items.find(function (item) { return String(item.workspaceId) === String(value.recentWorkspaceId); }) || null;
      });
      var workspaceId = workspace && workspace.workspaceId != null ? String(workspace.workspaceId) : null;
      var workspaceTitle = workspace ? (workspace.title || workspace.path || workspaceId) : "";
      var stateSlot = React.useState(null);
      var state = stateSlot[0];
      var setState = stateSlot[1];
      var draftSlot = React.useState(null);
      var draft = draftSlot[0];
      var setDraft = draftSlot[1];
      var tabSlot = React.useState("project");
      var tab = tabSlot[0];
      var setTab = tabSlot[1];
      var selectedSlot = React.useState("");
      var selectedId = selectedSlot[0];
      var setSelectedId = selectedSlot[1];
      var busySlot = React.useState(false);
      var busy = busySlot[0];
      var setBusy = busySlot[1];
      var dirtySlot = React.useState(false);
      var dirty = dirtySlot[0];
      var setDirty = dirtySlot[1];
      var noticeSlot = React.useState(null);
      var notice = noticeSlot[0];
      var setNotice = noticeSlot[1];
      var requestRef = React.useRef(0);
      var dirtyRef = React.useRef(false);
      var draftCacheRef = React.useRef(new Map());

      var load = React.useCallback(function (forceRemote) {
        if (forceRemote && dirtyRef.current && typeof window.confirm === "function" && !window.confirm(t("discardConfirm"))) return;
        var requestId = ++requestRef.current;
        if (!workspaceId) {
          setState(null);
          setDraft(null);
          setBusy(false);
          setNotice(null);
          return;
        }
        var cached = !forceRemote ? draftCacheRef.current.get(workspaceId) : null;
        if (cached) {
          setState(cached.state);
          setDraft(clone(cached.draft));
          setDirty(true);
          dirtyRef.current = true;
          setBusy(false);
          setNotice({ kind: "ok", text: t("draftRestored") });
          return;
        }
        setBusy(true);
        writer.getState(workspaceId).then(function (next) {
          if (requestId !== requestRef.current) return;
          setState(next);
          setDraft(clone(next.project));
          setDirty(false);
          dirtyRef.current = false;
          draftCacheRef.current.delete(workspaceId);
          setNotice(null);
        }).catch(function (error) {
          if (requestId === requestRef.current) setNotice({ kind: "error", text: t("loadFailed") + ": " + failureText(error) });
        }).finally(function () { if (requestId === requestRef.current) setBusy(false); });
      }, [writer, t, workspaceId]);

      React.useEffect(function () {
        load(false);
        return function () { requestRef.current += 1; };
      }, [load]);

      function updateProject(mutator) {
        setDraft(function (current) {
          var next = clone(current);
          mutator(next);
          if (workspaceId && state) draftCacheRef.current.set(workspaceId, { state: state, draft: clone(next) });
          return next;
        });
        setDirty(true);
        dirtyRef.current = true;
        setNotice(null);
      }

      function save() {
        if (!workspaceId || !state || !draft) return;
        var requestId = ++requestRef.current;
        setBusy(true);
        writer.saveProject(workspaceId, draft, state.revision).then(function (next) {
          if (requestId !== requestRef.current) return;
          setState(next);
          setDraft(clone(next.project));
          setDirty(false);
          dirtyRef.current = false;
          draftCacheRef.current.delete(workspaceId);
          setNotice({ kind: "ok", text: t("saved") });
        }).catch(function (error) {
          if (requestId === requestRef.current) setNotice({ kind: "error", text: t("saveFailed") + ": " + failureText(error) });
        }).finally(function () { if (requestId === requestRef.current) setBusy(false); });
      }

      function replaceWith(next, message) {
        setState(next);
        setDraft(clone(next.project));
        setDirty(false);
        dirtyRef.current = false;
        if (workspaceId) draftCacheRef.current.delete(workspaceId);
        setSelectedId("");
        setNotice({ kind: "ok", text: message });
      }

      function exportProject() {
        if (!workspaceId || busy || dirty) return;
        var requestId = ++requestRef.current;
        setBusy(true);
        writer.exportProject(workspaceId).then(function (documentValue) {
          if (requestId !== requestRef.current) return;
          var rawName = (documentValue.project && documentValue.project.title) || workspaceTitle || "novel-framework";
          var filename = String(rawName).replace(/[\\/:*?\"<>|\x00-\x1f]+/g, "-").replace(/^\s+|\s+$/g, "").slice(0, 80) || "novel-framework";
          var blob = new Blob([JSON.stringify(documentValue, null, 2) + "\n"], { type: "application/json;charset=utf-8" });
          var url = URL.createObjectURL(blob);
          var anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = filename + "-novel-framework.json";
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 0);
          setNotice({ kind: "ok", text: t("exported") });
        }).catch(function (error) {
          if (requestId === requestRef.current) setNotice({ kind: "error", text: t("exportFailed") + ": " + failureText(error) });
        }).finally(function () { if (requestId === requestRef.current) setBusy(false); });
      }

      function importProject(file) {
        if (!workspaceId || !state || busy || dirty || !file) return;
        if (file.size > 5 * 1024 * 1024) {
          setNotice({ kind: "error", text: t("importTooLarge") });
          return;
        }
        var requestId = ++requestRef.current;
        setBusy(true);
        file.text().then(function (source) {
          var parsed;
          try { parsed = JSON.parse(source); } catch (_) { throw new Error(t("importInvalidJson")); }
          return writer.importProject(workspaceId, parsed, state.revision);
        }).then(function (next) {
          if (requestId === requestRef.current) replaceWith(next, t("imported"));
        }).catch(function (error) {
          if (requestId === requestRef.current) setNotice({ kind: "error", text: t("importFailed") + ": " + failureText(error) });
        }).finally(function () { if (requestId === requestRef.current) setBusy(false); });
      }

      function resetProject() {
        if (!workspaceId || !state || busy || dirty) return;
        var requestId = ++requestRef.current;
        setBusy(true);
        writer.resetProject(workspaceId, state.revision).then(function (next) {
          if (requestId === requestRef.current) replaceWith(next, t("cleared"));
        }).catch(function (error) {
          if (requestId === requestRef.current) setNotice({ kind: "error", text: t("clearFailed") + ": " + failureText(error) });
        }).finally(function () { if (requestId === requestRef.current) setBusy(false); });
      }

      if (!workspaceId) {
        return React.createElement("div", { className: "dshwnw-root" },
          React.createElement("div", { className: "dshwnw-empty", style: { margin: 12 } }, t("noWorkspace"))
        );
      }

      if (!state || !draft) {
        return React.createElement("div", { className: "dshwnw-root" },
          React.createElement("div", { className: "dshwnw-empty", style: { margin: 12 } }, notice ? notice.text : t("loading"))
        );
      }

      var tabs = ["project", "characters", "relationships", "world", "plot", "outline", "scene", "settings"];
      var content;
      if (tab === "project") {
        content = React.createElement(ProjectTab, {
          project: draft, t: t,
          set: function (key, value) { updateProject(function (next) { next[key] = value; }); },
          setGenre: function (key, value) { updateProject(function (next) { next.genreProfile[key] = value; }); },
          setGenreFields: function (value) { updateProject(function (next) { next.genreProfile.customFields = value; }); },
        });
      } else if (tab === "characters") {
        content = React.createElement(CharacterTab, {
          project: draft, t: t, selectedId: selectedId, onSelect: setSelectedId,
          onAdd: function () {
            var newId = makeId("character");
            updateProject(function (next) {
              next.characters.push({
                id: newId, name: "", aliases: "", age: "", identity: "", role: "", status: "", appearance: "", traits: "", background: "",
                goal: "", motivation: "", stakes: "", conflict: "", abilities: "", weaknesses: "", secret: "", knowledge: "",
                possessions: "", voice: "", habits: "", arc: "", customFields: {},
              });
            });
            setSelectedId(newId);
          },
          onPatch: function (id, key, value) { updateProject(function (next) { var item = next.characters.find(function (entry) { return entry.id === id; }); if (item) item[key] = value; }); },
          onDelete: function (id) { updateProject(function (next) { next.characters = next.characters.filter(function (item) { return item.id !== id; }); next.relationships = next.relationships.filter(function (item) { return item.fromId !== id && item.toId !== id; }); if (next.scene.povCharacterId === id) next.scene.povCharacterId = ""; next.volumes.forEach(function (volume) { volume.chapters.forEach(function (chapter) { chapter.scenes.forEach(function (scene) { if (scene.povCharacterId === id) scene.povCharacterId = ""; }); }); }); }); setSelectedId(""); },
        });
      } else if (tab === "relationships") {
        content = React.createElement(RelationshipsTab, {
          project: draft, t: t,
          onAdd: function () { updateProject(function (next) { next.relationships.push({
            id: makeId("relationship"), fromId: next.characters[0].id, toId: next.characters[1].id, label: "", status: "", history: "",
            dynamic: "", powerBalance: "", publicFace: "", privateTruth: "", sharedSecret: "", tension: "", turningPoints: "", futureDirection: "", customFields: {},
          }); }); },
          onPatch: function (id, key, value) { updateProject(function (next) { var item = next.relationships.find(function (entry) { return entry.id === id; }); if (item) item[key] = value; }); },
          onDelete: function (id) { updateProject(function (next) { next.relationships = next.relationships.filter(function (item) { return item.id !== id; }); }); },
        });
      } else if (tab === "world") {
        content = React.createElement(SectionFields, {
          title: t("worldTitle"), hint: t("worldHint"), value: draft.world,
          groups: [
            { title: t("groupWorldFrame"), fields: [
              { key: "era", label: t("era") }, { key: "chronology", label: t("chronology") },
              { key: "geography", label: t("geography") }, { key: "environment", label: t("environment") },
              { key: "locations", label: t("locations") },
            ] },
            { title: t("groupWorldSystems"), fields: [
              { key: "rules", label: t("rules") }, { key: "factions", label: t("factions") },
              { key: "politics", label: t("politics") }, { key: "society", label: t("society") },
              { key: "economy", label: t("economy") }, { key: "conflicts", label: t("worldConflicts") },
            ] },
            { title: t("groupWorldCulture"), fields: [
              { key: "culture", label: t("culture") }, { key: "beliefs", label: t("beliefs") },
              { key: "technology", label: t("technology") }, { key: "lore", label: t("lore"), rows: 6 },
            ] },
          ],
          onPatch: function (key, value) { updateProject(function (next) { next.world[key] = value; }); },
        });
      } else if (tab === "plot") {
        content = React.createElement(SectionFields, {
          title: t("plotTitle"), hint: t("plotHint"), value: draft.plot,
          groups: [
            { title: t("groupPlotCore"), fields: [
              { key: "themes", label: t("themes") }, { key: "storyQuestion", label: t("storyQuestion") },
              { key: "protagonistGoal", label: t("protagonistGoal") }, { key: "stakes", label: t("plotStakes") },
              { key: "coreConflict", label: t("coreConflict") }, { key: "antagonisticForce", label: t("antagonisticForce") },
            ] },
            { title: t("groupPlotStructure"), fields: [
              { key: "opening", label: t("opening") }, { key: "midpoint", label: t("midpoint") },
              { key: "climax", label: t("climax") }, { key: "ending", label: t("ending") },
            ] },
            { title: t("groupPlotWeaving"), fields: [
              { key: "subplots", label: t("subplots") }, { key: "foreshadowing", label: t("foreshadowing") },
              { key: "reveals", label: t("reveals") }, { key: "pacing", label: t("pacing") },
              { key: "chapterPlan", label: t("chapterPlan"), rows: 7 }, { key: "outline", label: t("outline"), rows: 8 },
            ] },
          ],
          onPatch: function (key, value) { updateProject(function (next) { next.plot[key] = value; }); },
        });
      } else if (tab === "outline") {
        content = React.createElement(OutlineTab, {
          project: draft, t: t,
          onAddVolume: function () { updateProject(function (next) { next.volumes.push({ id: makeId("volume"), title: "", summary: "", status: "planned", chapters: [], customFields: {} }); }); },
          onPatchVolume: function (volumeId, key, value) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); if (volume) volume[key] = value; }); },
          onDeleteVolume: function (volumeId) { updateProject(function (next) { next.volumes = next.volumes.filter(function (item) { return item.id !== volumeId; }); }); },
          onAddChapter: function (volumeId) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); if (volume) volume.chapters.push({ id: makeId("chapter"), number: String(volume.chapters.length + 1), title: "", targetWords: "", status: "planned", summary: "", locations: "", events: [], dialogueNotes: "", endingHook: "", scenes: [], customFields: {} }); }); },
          onPatchChapter: function (volumeId, chapterId, key, value) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); var chapter = volume && volume.chapters.find(function (item) { return item.id === chapterId; }); if (chapter) chapter[key] = value; }); },
          onDeleteChapter: function (volumeId, chapterId) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); if (volume) volume.chapters = volume.chapters.filter(function (item) { return item.id !== chapterId; }); }); },
          onMoveChapter: function (volumeId, chapterId, delta) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); if (!volume) return; var index = volume.chapters.findIndex(function (item) { return item.id === chapterId; }); var target = index + delta; if (index < 0 || target < 0 || target >= volume.chapters.length) return; var moved = volume.chapters.splice(index, 1)[0]; volume.chapters.splice(target, 0, moved); }); },
          onAddScene: function (volumeId, chapterId) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); var chapter = volume && volume.chapters.find(function (item) { return item.id === chapterId; }); if (chapter) chapter.scenes.push({ id: makeId("scene"), title: "", time: "", location: "", povCharacterId: "", participants: "", goal: "", conflict: "", beats: "", emotionalTurn: "", sensoryAnchor: "", outcome: "", knowledgeChanges: "", propChanges: "", continuity: "", nextHook: "", customFields: {} }); }); },
          onPatchScene: function (volumeId, chapterId, sceneId, key, value) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); var chapter = volume && volume.chapters.find(function (item) { return item.id === chapterId; }); var scene = chapter && chapter.scenes.find(function (item) { return item.id === sceneId; }); if (scene) scene[key] = value; }); },
          onDeleteScene: function (volumeId, chapterId, sceneId) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); var chapter = volume && volume.chapters.find(function (item) { return item.id === chapterId; }); if (chapter) chapter.scenes = chapter.scenes.filter(function (item) { return item.id !== sceneId; }); }); },
        });
      } else if (tab === "scene") {
        content = React.createElement(SceneTab, {
          project: draft, t: t,
          onPatch: function (key, value) { updateProject(function (next) { next.scene[key] = value; }); },
        });
      } else {
        content = React.createElement(SettingsTab, {
          workspaceId: workspaceId, t: t, busy: busy, dirty: dirty,
          onExport: exportProject, onImport: importProject, onClear: resetProject,
        });
      }

      return React.createElement("div", { className: "dshwnw-root" },
        React.createElement("div", { className: "dshwnw-toolbar" },
          React.createElement("div", { className: "dshwnw-tabs" }, tabs.map(function (name) {
            return React.createElement("button", { key: name, type: "button", className: "dshwnw-tab", "data-active": tab === name ? "true" : undefined, onClick: function () { setTab(name); } }, t("tab_" + name));
          })),
          React.createElement("div", { className: "dshwnw-workspace", title: workspaceTitle }, t("workspaceLabel") + " · " + workspaceTitle)
        ),
        React.createElement("div", { className: "dshwnw-body" }, content),
        React.createElement("div", { className: "dshwnw-footer" },
          React.createElement("span", { className: "dshwnw-notice", "data-kind": notice ? notice.kind : undefined }, notice ? notice.text : dirty ? t("unsaved") : t("synced")),
          React.createElement("button", { type: "button", className: "dshwnw-button", disabled: busy || !dirty, onClick: load }, t("reload")),
          React.createElement("button", { type: "button", className: "dshwnw-primary", disabled: busy || !dirty, onClick: save }, busy ? t("saving") : t("save"))
        )
      );
    }

    function SidebarRail(props) {
      var t = typeof props.t === "function" ? props.t : function (key) { return key; };
      return React.createElement("button", {
        type: "button", className: "dshwnw-rail", title: t("rail"), "aria-label": t("rail"),
        "data-active": props.activeId === "noval-write" ? "true" : undefined,
        onClick: function () { props.onSelect("noval-write", t("title")); },
      }, React.createElement(IconQuill, null));
    }

    function SidebarCard(props) {
      var t = typeof props.t === "function" ? props.t : function (key) { return key; };
      return React.createElement("button", { type: "button", className: "dshwrs-tool-card", onClick: function () { props.onOpen("noval-write", t("title")); } },
        React.createElement("span", { className: "dshwrs-tool-card-icon" }, React.createElement(IconQuill, null)),
        React.createElement("span", { className: "dshwrs-tool-card-copy" },
          React.createElement("span", { className: "dshwrs-tool-card-title" }, t("title")),
          React.createElement("span", { className: "dshwrs-tool-card-description" }, t("cardDescription"))
        )
      );
    }

    function SidebarPage(props) {
      return React.createElement(NovelWriterPanel, {
        writer: props.writer,
        t: props.t,
        useSessions: props.useSessions,
        useWorkspaces: props.useWorkspaces,
      });
    }

    var NS = "dshWNovalWrite";
    var inject = ["slots", "locale", "remote", "conversationEvents"];
    var zh = {
      title: "小说写作", rail: "打开小说写作工作台", cardDescription: "工作区共享的角色、世界观、情节与连续性数据",
      writeActive: "小说写作", writeEdit: "编辑", writeClear: "解除", writeSave: "保存", writeCancel: "取消", writeObjectiveAria: "小说写作任务", writeCommandInput: "写作命令输入",
      loading: "正在载入小说项目…", loadFailed: "载入失败", saveFailed: "保存失败", noWorkspace: "当前没有可用工作区。请先打开或创建一个工作区。", workspaceLabel: "共享工作区",
      saved: "项目设定已保存。", saving: "保存中…", save: "保存", reload: "撤销", unsaved: "有未保存修改", synced: "已与模型上下文同步", draftRestored: "已恢复这个工作区未保存的草稿。",
      tab_project: "项目", tab_characters: "角色", tab_relationships: "关系", tab_world: "世界", tab_plot: "情节", tab_outline: "大纲", tab_scene: "场景", tab_settings: "设置",
      settingsTitle: "小说框架设置", settingsHint: "导入、导出或重置当前共享工作区的完整小说框架。操作对象不是单个对话。", settingsDirty: "请先保存或撤销当前修改，再执行导入、导出或清除。", working: "处理中…", cancel: "取消",
      exportTitle: "导出当前小说框架", exportHint: "下载一份可移植的 JSON，包含项目、角色、关系、世界观、情节、场景和推进记录。", exportAction: "导出 JSON", exported: "小说框架已导出。", exportFailed: "导出失败",
      importTitle: "导入小说框架", importHint: "导入本插件导出的 JSON 或完整项目 JSON；通过结构校验后原子替换当前框架。", importAction: "选择 JSON 文件", imported: "小说框架已导入。", importFailed: "导入失败", importInvalidJson: "文件不是有效 JSON", importTooLarge: "导入文件超过 5 MB 限制。",
      clearTitle: "清除当前小说框架", clearHint: "恢复为空白框架。该操作会清除当前工作区共享的全部角色、关系、世界观、情节、场景与推进记录。", clearAction: "清除框架", clearConfirm: "此操作不可撤销。建议先导出备份；确认后只清空当前工作区的小说框架。", clearConfirmAction: "确认清除", cleared: "当前工作区的小说框架已清空。", clearFailed: "清除失败",
      projectTitle: "项目总览", projectHint: "先定义作品契约，再让角色、世界与情节围绕它保持一致。", groupBasics: "作品定位", groupWritingContract: "写作契约", bookTitle: "书名", genre: "题材 / 类型", tone: "基调与文风", pov: "叙事视角", targetWords: "目标字数", audience: "目标读者", contentRating: "内容分级与边界", premise: "一句话梗概 / 核心命题", styleGuide: "文风指南（句式、节奏、叙述距离、禁用表达）", constraints: "创作约束（必须遵守 / 必须避免）", notes: "总备注",
      genreProfileTitle: "题材扩展配置", genreProfileType: "配置类型", genreProfilePlaceholder: "例如 romance、mystery、xianxia", customFields: "自定义字段", customFieldsHint: "自由定义本题材需要的数据；模型会按原键名读取和维护。", customFieldsEmpty: "还没有自定义字段。", customFieldDefault: "字段", customFieldName: "字段名", customFieldValue: "字段值", addCustomField: "新增自定义字段",
      charactersTitle: "角色卡", add: "新增", delete: "删除", charactersEmpty: "还没有角色。先建立主角和主要对手。", unnamedCharacter: "未命名角色", rolePlaceholder: "尚未填写角色定位",
      groupIdentity: "身份与现状", groupPortrait: "人物画像", groupDrive: "欲望与压力", groupResources: "能力、弱点与信息", groupPerformance: "表现方式与弧光", name: "姓名", aliases: "别名 / 称呼", age: "年龄 / 年龄段", identity: "身份、职业与社会位置", role: "故事功能", characterStatus: "当前状态（位置、健康、阵营）", appearance: "外貌、体态与辨识特征", traits: "性格、价值观与行为模式", background: "成长经历与关键往事", goal: "外在目标", motivation: "深层动机与缺失", stakes: "失败代价", conflict: "内外冲突", abilities: "能力、资源与优势", weaknesses: "弱点、恐惧与盲区", secret: "秘密与信息差", knowledge: "已知 / 未知 / 错误认知", possessions: "关键物品与资源", voice: "语言习惯 / 角色声音", habits: "习惯、动作与压力反应", arc: "人物弧光（起点—转折—终点）",
      relationshipsTitle: "角色关系", relationshipsNeedCharacters: "至少建立两名角色后才能添加关系。", relationshipsEmpty: "还没有关系线。", relationship: "关系线", relationshipInvalid: "关系端点无效或指向同一角色，请重新选择角色 A 与角色 B。", chooseCharacter: "请选择角色", groupRelationIdentity: "关系身份", groupRelationHistory: "历史与运作方式", groupRelationLayers: "公开层与真实层", groupRelationArc: "张力与关系弧", from: "角色 A（主动视角）", to: "角色 B（关系对象）", relationLabel: "关系标签", relationStatus: "当前关系状态", relationHistory: "共同历史与关键事件", dynamic: "日常互动模式", powerBalance: "权力、依赖与交换", publicFace: "他人眼中的关系", privateTruth: "私下真实关系", sharedSecret: "共同秘密与信息差", tension: "当前张力、误解与冲突", turningPoints: "已发生 / 计划中的关系转折", futureDirection: "下一阶段变化方向",
      worldTitle: "世界观设定", worldHint: "从时间空间、社会系统和文化认知三层写清会影响因果与选择的规则。", groupWorldFrame: "时间与空间", groupWorldSystems: "制度与资源", groupWorldCulture: "文化与公共认知", era: "时代、纪年与技术阶段", chronology: "历史时间线与关键年代", geography: "地理格局、距离与交通", environment: "自然环境、气候与生存条件", locations: "关键地点及其叙事功能", rules: "世界硬规则、代价与例外", factions: "势力、目标、资源与关系", politics: "权力结构、法律与治理", society: "阶层、家庭、组织与社会规范", economy: "生产、货币、稀缺资源与交易", worldConflicts: "系统性矛盾与当前危机", culture: "习俗、礼仪、禁忌与日常", beliefs: "宗教、价值观与公共信念", technology: "科技 / 魔法体系及限制", lore: "历史、传说、误传与公共认知",
      plotTitle: "情节骨架", plotHint: "先写清欲望—阻力—代价—选择，再组织转折、伏笔和章节节奏。", groupPlotCore: "戏剧核心", groupPlotStructure: "主线结构", groupPlotWeaving: "支线、伏笔与节奏", themes: "主题与母题", storyQuestion: "核心戏剧问题", protagonistGoal: "主角总体目标", plotStakes: "总体风险与失败代价", coreConflict: "核心冲突", antagonisticForce: "对抗力量及其逻辑", opening: "开局、常态与诱发事件", midpoint: "中点转折与认知改变", climax: "高潮、终极选择与代价", ending: "结局状态与主题回应", subplots: "支线及其与主线的交汇", foreshadowing: "伏笔清单、埋设与回收", reveals: "秘密、揭示顺序与知情范围", pacing: "节奏曲线与张弛安排", chapterPlan: "章节计划（目标、冲突、转折、钩子）", outline: "详细节拍 / 场景大纲",
      outlineTitle: "结构化卷章大纲", outlineHint: "每卷、每章、每场戏独立保存；模型可以按 ID 精确读取和修改，不必重发整份长大纲。类型专用路线写入自定义字段。", outlineEmpty: "还没有结构化大纲。先新增一卷。", addVolume: "新增卷", unnamedVolume: "未命名卷", volumeTitle: "卷名", volumeSummary: "本卷概要", outlineStatus: "状态", chaptersTitle: "章节", addChapter: "新增章", unnamedChapter: "未命名章节", chapterNumber: "章号", chapterTitle: "章名", chapterWords: "目标字数", chapterLocations: "主要场景", chapterSummary: "章节概要", chapterEvents: "事件列表（每行一项）", dialogueNotes: "对话示例与语言备注", endingHook: "收束与下一章钩子", chapterScenes: "场景拆分", addScene: "新增场景", unnamedScene: "未命名场景", sceneName: "场景名",
      discardConfirm: "当前工作区有未保存修改。确定丢弃这些修改并切换或重新加载吗？",
      sceneTitle: "当前场景", sceneHint: "把一场戏写成可执行单元：谁在何时何地，为何行动，发生哪些节拍，结束后什么永久改变。", groupSceneFrame: "场景坐标", groupSceneDramatic: "戏剧执行", groupSceneContinuity: "连续性与状态变化", chapter: "章节 / 场次", sceneTime: "具体时间 / 与上场间隔", location: "地点与空间条件", scenePov: "本场 POV 角色", participants: "出场角色与入退场", sceneGoal: "本场可验证目标", sceneConflict: "阻力、升级与两难", beats: "节拍序列（行动—反应—升级—转折）", emotionalTurn: "情绪起点、转折与终点", sensoryAnchor: "关键感官、意象与环境细节", sceneOutcome: "实际 / 预期结果与代价", knowledgeChanges: "谁获得、误解或隐瞒了什么", propChanges: "道具、伤势、位置与资源变化", continuity: "连续性账本（进入场景前必须成立的事实）", nextHook: "离场钩子与下一场承诺",
      progressTitle: "写作进展", progressEmpty: "还没有推进记录。AI 可在写作后自动写入。", progressEntry: "进展", canonChanges: "设定变更", openThreads: "待续线索",
    };
    var en = {
      title: "Novel Writing", rail: "Open Novel Writing", cardDescription: "Workspace-shared characters, world, plot, and continuity data",
      writeActive: "Novel Writing", writeEdit: "Edit", writeClear: "Unlink", writeSave: "Save", writeCancel: "Cancel", writeObjectiveAria: "Novel writing objective", writeCommandInput: "Writing command input",
      loading: "Loading novel project…", loadFailed: "Load failed", saveFailed: "Save failed", noWorkspace: "No workspace is available. Open or create a workspace first.", workspaceLabel: "Shared workspace",
      saved: "Project canon saved.", saving: "Saving…", save: "Save", reload: "Revert", unsaved: "Unsaved changes", synced: "Synced to model context", draftRestored: "Restored this workspace's unsaved draft.",
      tab_project: "Project", tab_characters: "Characters", tab_relationships: "Relations", tab_world: "World", tab_plot: "Plot", tab_outline: "Outline", tab_scene: "Scene", tab_settings: "Settings",
      settingsTitle: "Novel framework settings", settingsHint: "Import, export, or reset the complete framework shared by this workspace, not one conversation.", settingsDirty: "Save or revert current edits before importing, exporting, or clearing.", working: "Working…", cancel: "Cancel",
      exportTitle: "Export current framework", exportHint: "Download portable JSON with the project, characters, relationships, world, plot, scene, and progress.", exportAction: "Export JSON", exported: "Novel framework exported.", exportFailed: "Export failed",
      importTitle: "Import a framework", importHint: "Import an exported document or complete project JSON. It is validated before atomically replacing the current framework.", importAction: "Choose JSON file", imported: "Novel framework imported.", importFailed: "Import failed", importInvalidJson: "The file is not valid JSON", importTooLarge: "The import exceeds the 5 MB limit.",
      clearTitle: "Clear current framework", clearHint: "Restore an empty framework, removing all workspace-shared characters, relationships, world, plot, scene, and progress.", clearAction: "Clear framework", clearConfirm: "This cannot be undone. Export a backup first if needed; confirmation only clears the current workspace framework.", clearConfirmAction: "Confirm clear", cleared: "The current workspace framework was cleared.", clearFailed: "Clear failed",
      projectTitle: "Project overview", projectHint: "Define the book contract first, then keep characters, world, and plot aligned with it.", groupBasics: "Book positioning", groupWritingContract: "Writing contract", bookTitle: "Title", genre: "Genre", tone: "Tone and style", pov: "Point of view", targetWords: "Target length", audience: "Target audience", contentRating: "Content rating and boundaries", premise: "Premise", styleGuide: "Style guide", constraints: "Creative constraints", notes: "Notes",
      genreProfileTitle: "Genre extension profile", genreProfileType: "Profile type", genreProfilePlaceholder: "For example romance, mystery, xianxia", customFields: "Custom fields", customFieldsHint: "Define genre-specific data while preserving stable keys for the model.", customFieldsEmpty: "No custom fields yet.", customFieldDefault: "Field", customFieldName: "Field name", customFieldValue: "Field value", addCustomField: "Add custom field",
      charactersTitle: "Character cards", add: "Add", delete: "Delete", charactersEmpty: "No characters yet. Start with the protagonist and primary opposition.", unnamedCharacter: "Unnamed character", rolePlaceholder: "No role yet",
      groupIdentity: "Identity and status", groupPortrait: "Portrait", groupDrive: "Drive and pressure", groupResources: "Abilities and information", groupPerformance: "Performance and arc", name: "Name", aliases: "Aliases", age: "Age", identity: "Identity, occupation, social position", role: "Story function", characterStatus: "Current status", appearance: "Appearance and visual markers", traits: "Traits, values, behavior", background: "Background and formative events", goal: "External goal", motivation: "Deep motivation", stakes: "Personal stakes", conflict: "Internal / external conflict", abilities: "Abilities and resources", weaknesses: "Weaknesses and blind spots", secret: "Secrets and information gaps", knowledge: "Known, unknown, mistaken beliefs", possessions: "Key objects and resources", voice: "Voice and speech patterns", habits: "Habits and stress responses", arc: "Character arc",
      relationshipsTitle: "Relationships", relationshipsNeedCharacters: "Create at least two characters first.", relationshipsEmpty: "No relationship lines yet.", relationship: "Relationship", relationshipInvalid: "Invalid or self-referencing endpoints. Choose two distinct characters.", chooseCharacter: "Choose a character", groupRelationIdentity: "Relationship identity", groupRelationHistory: "History and operation", groupRelationLayers: "Public and private layers", groupRelationArc: "Tension and arc", from: "Character A", to: "Character B", relationLabel: "Label", relationStatus: "Current status", relationHistory: "Shared history", dynamic: "Interaction pattern", powerBalance: "Power, dependence, exchange", publicFace: "Public appearance", privateTruth: "Private truth", sharedSecret: "Shared secret", tension: "Current tension", turningPoints: "Turning points", futureDirection: "Direction of change",
      worldTitle: "Worldbuilding", worldHint: "Define time and space, social systems, and cultural beliefs that shape causality and choice.", groupWorldFrame: "Time and space", groupWorldSystems: "Systems and resources", groupWorldCulture: "Culture and belief", era: "Era and technology stage", chronology: "Historical chronology", geography: "Geography and travel", environment: "Environment and survival", locations: "Key locations", rules: "Hard rules, costs, exceptions", factions: "Factions and interests", politics: "Power, law, governance", society: "Class, family, institutions", economy: "Economy and scarce resources", worldConflicts: "Systemic conflicts", culture: "Culture and daily life", beliefs: "Beliefs and religion", technology: "Technology / magic", lore: "History, lore, public beliefs",
      plotTitle: "Plot spine", plotHint: "Define desire, resistance, cost, and choice before arranging turns, setups, and pacing.", groupPlotCore: "Dramatic core", groupPlotStructure: "Main structure", groupPlotWeaving: "Subplots and pacing", themes: "Themes", storyQuestion: "Dramatic question", protagonistGoal: "Protagonist goal", plotStakes: "Global stakes", coreConflict: "Core conflict", antagonisticForce: "Antagonistic force", opening: "Opening and inciting incident", midpoint: "Midpoint reversal", climax: "Climax and final choice", ending: "Ending state", subplots: "Subplots", foreshadowing: "Foreshadowing and payoff", reveals: "Reveals and knowledge order", pacing: "Pacing curve", chapterPlan: "Chapter plan", outline: "Detailed beat outline",
      outlineTitle: "Structured volume and chapter outline", outlineHint: "Store each volume, chapter, and scene independently so the model can read and patch by stable ID.", outlineEmpty: "No structured outline yet. Add a volume first.", addVolume: "Add volume", unnamedVolume: "Untitled volume", volumeTitle: "Volume title", volumeSummary: "Volume summary", outlineStatus: "Status", chaptersTitle: "Chapters", addChapter: "Add chapter", unnamedChapter: "Untitled chapter", chapterNumber: "Number", chapterTitle: "Chapter title", chapterWords: "Target words", chapterLocations: "Primary locations", chapterSummary: "Chapter summary", chapterEvents: "Events, one per line", dialogueNotes: "Dialogue examples and notes", endingHook: "Ending and next hook", chapterScenes: "Scene breakdown", addScene: "Add scene", unnamedScene: "Untitled scene", sceneName: "Scene name",
      discardConfirm: "This workspace has unsaved changes. Discard them and switch or reload?",
      sceneTitle: "Current scene", sceneHint: "Make the scene executable: who acts where and why, the beat sequence, and what permanently changes.", groupSceneFrame: "Scene coordinates", groupSceneDramatic: "Dramatic execution", groupSceneContinuity: "Continuity and state", chapter: "Chapter / scene", sceneTime: "Time / gap from prior scene", location: "Place and conditions", scenePov: "POV character", participants: "Participants and entrances", sceneGoal: "Verifiable scene goal", sceneConflict: "Obstacle, escalation, dilemma", beats: "Beat sequence", emotionalTurn: "Emotional turn", sensoryAnchor: "Sensory anchors", sceneOutcome: "Outcome and cost", knowledgeChanges: "Knowledge changes", propChanges: "Object and state changes", continuity: "Continuity ledger", nextHook: "Exit hook",
      progressTitle: "Writing progress", progressEmpty: "No progress entries yet. AI can record them after writing.", progressEntry: "Progress", canonChanges: "Canon changes", openThreads: "Open threads",
    };

    async function apply(ctx) {
      var style = installStyle();
      ctx.effect(function () { return function () { if (style.owned && style.node) style.node.remove(); }; }, "dsh-w-noval-write: styles");
      ctx.effect(function () { return ctx.locale.register(NS, { zh: zh, en: en }); });
      var t = ctx.locale.bind(NS);
      var unmount = await ctx.remote.$mount(TYPERT_REMOTE);
      ctx.effect(function () { return unmount; }, "dsh-w-noval-write: remote");
      var service = ctx.get("remote.novalWriter");
      if (!service) throw new Error("dsh-w-noval-write: remote.novalWriter did not mount");
      function unwrap(method, args) {
        return service[method].apply(service, args).then(function (result) {
          if (!result.ok) throw new Error(method + " failed: " + JSON.stringify(result.error));
          return result.value;
        });
      }
      function injected() {
        return { writer: {
          getState: function (workspaceId) { return unwrap("getState", [workspaceId]); },
          saveProject: function (workspaceId, input, revision) { return unwrap("saveProject", [workspaceId, input, revision]); },
          exportProject: function (workspaceId) { return unwrap("exportProject", [workspaceId]); },
          importProject: function (workspaceId, input, revision) { return unwrap("importProject", [workspaceId, input, revision]); },
          resetProject: function (workspaceId, revision) { return unwrap("resetProject", [workspaceId, revision]); },
          getLink: function (sessionId) { return unwrap("getLink", [sessionId]); },
          editLink: function (sessionId, objective, revision) { return unwrap("editLink", [sessionId, objective, revision]); },
          clearLink: function (sessionId, revision) { return unwrap("clearLink", [sessionId, revision]); },
        } };
      }
      ctx.conversationEvents.register(writeCommandInputDefinition);
      ctx.slots.inject("conversation.chat.node", function () {
        return ctx.slots.register({ name: "conversation.chat.node", key: "noval-write-command-input", locale: NS }, WriteCommandInputView);
      });
      ctx.slots.inject("conversation.input.dock", function () {
        return ctx.slots.register({
          name: "conversation.input.dock", id: "noval-write", order: 15, locale: NS,
          inject: function (sessionId) {
            return {
              loadLink: function () { return unwrap("getLink", [sessionId]); },
              onEdit: function (objective, revision) { return unwrap("editLink", [sessionId, objective, revision]); },
              onClear: function (revision) { return unwrap("clearLink", [sessionId, revision]); },
            };
          },
        }, function (props) { return React.createElement(WriteDock, { loadLink: props.loadLink, onEdit: props.onEdit, onClear: props.onClear, t: t }); });
      });
      ctx.slots.inject("right-sidebar.rail", function () {
        return ctx.slots.register({ name: "right-sidebar.rail", id: "noval-write", order: 110, label: function () { return t("title"); }, locale: NS }, SidebarRail);
      });
      ctx.slots.inject("right-sidebar.card", function () {
        return ctx.slots.register({ name: "right-sidebar.card", id: "noval-write", order: 110, label: function () { return t("title"); }, locale: NS }, SidebarCard);
      });
      ctx.slots.inject("right-sidebar.page", function () {
        return ctx.slots.register({
          name: "right-sidebar.page", priority: 110,
          select: function (owner) { return owner && owner.activeId === "noval-write" ? {} : null; },
          locale: NS, inject: injected,
        }, SidebarPage);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-noval-write";
    return module.exports;
  },
});
