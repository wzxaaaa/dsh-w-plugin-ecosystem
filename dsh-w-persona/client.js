window.__ModuleLoader__.load({
  id: "dsh-w-persona",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    var CSS = [
      ".pw-root{width:100%;max-width:760px;display:flex;flex-direction:column;gap:16px;color:var(--dsw-alias-label-primary)}",
      ".pw-block{display:flex;flex-direction:column;gap:8px}",
      ".pw-title{font-size:14px;font-weight:600;line-height:20px;margin:0}",
      ".pw-template{display:flex;flex-direction:column;gap:12px;padding:14px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:12px}",
      ".pw-template-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}",
      ".pw-template-copy{display:flex;flex-direction:column;gap:3px;min-width:0}",
      ".pw-template-title{font-size:15px;font-weight:650;line-height:21px}",
      ".pw-template-active{flex:none;padding:3px 8px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 12%,transparent);color:var(--dsw-alias-state-business-primary);font-size:11px;line-height:16px;font-weight:600}",
      ".pw-template-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px}",
      ".pw-template-field{display:flex;flex-direction:column;gap:5px;min-width:0}",
      ".pw-template-label{font-size:12px;font-weight:600;line-height:18px;color:var(--dsw-alias-label-secondary)}",
      ".pw-template-select,.pw-template-name{box-sizing:border-box;width:100%;height:36px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;outline:none}",
      ".pw-template-select:focus-visible,.pw-template-name:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-business-primary) 18%,transparent)}",
      ".pw-template-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      ".pw-template-button{height:34px;padding:0 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;cursor:pointer}",
      ".pw-template-button[data-primary=true]{border-color:transparent;background:var(--dsw-alias-state-business-primary);color:#fff;font-weight:600}",
      ".pw-template-button[data-danger=true]{color:var(--dsw-alias-state-error-primary,#d64545)}",
      ".pw-template-button[data-armed=true]{border-color:transparent;background:var(--dsw-alias-state-error-primary,#d64545);color:#fff;font-weight:600}",
      ".pw-confirm{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:8px;padding:8px 10px;border-radius:8px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#d64545) 9%,transparent);color:var(--dsw-alias-state-error-primary,#d64545);font-size:12px;line-height:18px}",
      ".pw-confirm span{flex:1;min-width:0}",
      ".pw-template-button:disabled,.pw-template-select:disabled,.pw-template-name:disabled{cursor:default;opacity:.5}",
      ".pw-default{box-sizing:border-box;width:100%;margin:0;padding:12px 14px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:8px;font-family:var(--ds-font-family-code);font-size:12px;line-height:19px;color:var(--dsw-alias-label-secondary);white-space:pre-wrap;word-break:break-word;max-height:220px;overflow:auto}",
      ".pw-field{position:relative;display:flex;flex-direction:column;gap:6px}",
      ".pw-field-head{display:flex;align-items:center;justify-content:space-between;gap:8px}",
      ".pw-field-label{font-size:13px;font-weight:600;line-height:19px}",
      ".pw-help{position:relative;display:inline-flex;flex:none;margin-left:auto}",
      ".pw-help-trigger{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;padding:0;border:1px solid currentColor;border-radius:50%;background:transparent;color:var(--dsw-alias-label-secondary);font:600 12px/1 sans-serif;cursor:help}",
      ".pw-help-trigger:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:3px}",
      ".pw-help-tip{display:none;position:absolute;right:0;bottom:calc(100% + 8px);z-index:50;box-sizing:border-box;width:min(310px,calc(100vw - 64px));padding:12px 14px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-2,#fff);color:var(--dsw-alias-label-primary);box-shadow:0 6px 24px #0002;font-size:12px;font-weight:400;line-height:19px;white-space:pre-wrap;overflow-wrap:anywhere}",
      ".pw-help:hover .pw-help-tip,.pw-help:focus-within .pw-help-tip{display:block}",
      ".pw-new-fields{display:flex;flex-direction:column;gap:14px;padding:14px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px}",
      ".pw-new-field{display:flex;flex-direction:column;gap:7px;min-width:0}",
      ".pw-new-field .pw-preset-input{min-height:90px}",
      ".pw-status{display:flex;flex-direction:column;gap:8px;padding:12px 14px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;font-size:12px;line-height:19px;overflow-wrap:anywhere}",
      ".pw-reset{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);border-radius:7px;cursor:pointer;font-size:15px;line-height:1;padding:0}",
      ".pw-reset:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
      ".pw-reset:disabled{cursor:default;opacity:.5}",
      ".pw-input{box-sizing:border-box;width:100%;min-height:200px;resize:vertical;padding:10px 12px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:8px;color:var(--dsw-alias-label-primary);font-family:var(--ds-font-family-code);font-size:12px;line-height:19px;outline:none}",
      ".pw-input:focus-visible,.pw-preset-input:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-business-primary) 18%,transparent)}",
      ".pw-preset-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:4px}",
      ".pw-preset-copy{display:flex;flex-direction:column;gap:3px}",
      ".pw-preset-title{font-size:14px;font-weight:600;line-height:20px}",
      ".pw-switch{position:relative;width:38px;height:22px;flex:0 0 auto;border:0;border-radius:999px;padding:0;cursor:pointer;background:var(--dsw-alias-border-l2);transition:background .16s ease}",
      ".pw-switch[data-checked=true]{background:var(--dsw-alias-state-business-primary)}",
      ".pw-switch:disabled{cursor:default;opacity:.55}",
      ".pw-switch-knob{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.24);transition:transform .16s ease}",
      ".pw-switch[data-checked=true] .pw-switch-knob{transform:translateX(16px)}",
      ".pw-preset-card{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:14px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px}",
      ".pw-preset-field{display:flex;flex-direction:column;gap:6px;min-width:0}",
      ".pw-preset-label{font-size:12px;font-weight:600;line-height:18px;color:var(--dsw-alias-label-secondary)}",
      ".pw-preset-input{box-sizing:border-box;width:100%;min-height:108px;resize:vertical;padding:9px 10px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);border-radius:8px;color:var(--dsw-alias-label-primary);font-family:var(--ds-font-family-code);font-size:12px;line-height:18px;outline:none}",
      ".pw-actions{display:flex;align-items:center;gap:10px}",
      ".pw-save{font:inherit;cursor:pointer;border-radius:8px;padding:6px 16px;font-size:13px;line-height:20px;border:1px solid transparent;background:var(--dsw-alias-state-business-primary);color:#fff}",
      ".pw-save:disabled{cursor:default;opacity:.55}",
      ".pw-hint{font-size:12px;line-height:18px;margin:0;color:var(--dsw-alias-label-tertiary)}",
      ".pw-warning{font-size:12px;line-height:18px;margin:0;color:var(--dsw-alias-label-secondary)}",
      ".pw-incomplete{font-size:12px;line-height:18px;margin:0;color:var(--dsw-alias-state-warning)}",
      ".pw-empty{font-size:13px;color:var(--dsw-alias-label-tertiary);margin:0}",
      "@media(max-width:720px){.pw-preset-card,.pw-template-grid{grid-template-columns:1fr}}",
    ].join("\n");
    var tagId = "dsh-w-persona/styles";
    if (typeof document !== "undefined") {
      var styleTag = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]");
      if (styleTag === null) {
        styleTag = document.createElement("style");
        styleTag.dataset.plugin = "dsh-w-persona";
        styleTag.dataset.pluginCss = tagId;
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = CSS;
    }

    var passthrough = { parse: function (v) { return v; } };
    // Lazy schema factory for official Harness; schema keeps older source builds compatible.
    function jsonCodec() {
      return { mode: "strict", typeSymbol: "json", schema: passthrough, create: function () { return passthrough; } };
    }
    function parameter(name) {
      return { name: name, wire: name, source: "json", codec: jsonCodec() };
    }
    function descriptor(method, parameters) {
      return {
        id: "dsh-w-persona#personaManager/" + method,
        service: "personaManager",
        namespace: "personaManager",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: jsonCodec(),
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-persona",
      descriptors: [
        descriptor("getState"),
        descriptor("save", [parameter("text")]),
        descriptor("saveDialoguePreset", [parameter("value")]),
        descriptor("saveConfiguration", [parameter("text"), parameter("value"), parameter("settings")]),
        descriptor("saveTemplate", [parameter("value")]),
        descriptor("deleteTemplate", [parameter("id")]),
        descriptor("applyTemplate", [parameter("id")]),
      ],
    };

    function emptyPreset() {
      return { enabled: false, user1: "", assistant1: "", user2: "", assistant2: "" };
    }
    function normalizePreset(value) {
      var source = value || {};
      return {
        enabled: source.enabled === true,
        user1: typeof source.user1 === "string" ? source.user1 : "",
        assistant1: typeof source.assistant1 === "string" ? source.assistant1 : "",
        user2: typeof source.user2 === "string" ? source.user2 : "",
        assistant2: typeof source.assistant2 === "string" ? source.assistant2 : "",
      };
    }
    function samePreset(a, b) {
      return a.enabled === b.enabled
        && a.user1 === b.user1
        && a.assistant1 === b.assistant1
        && a.user2 === b.user2
        && a.assistant2 === b.assistant2;
    }
    function completePreset(value) {
      return ["user1", "assistant1", "user2", "assistant2"].every(function (field) {
        return value[field].trim().length > 0;
      });
    }
    function normalizeTemplates(value) {
      return Array.isArray(value) ? value.filter(function (template) {
        return template && typeof template.id === "string" && typeof template.name === "string";
      }) : [];
    }

    function normalizeSettings(value) {
      var source = value || {};
      return { applyMode: source.applyMode || "immediate", textMode: source.textMode || "template",
        characterName: source.characterName || "", userName: source.userName || "", suffix: source.suffix || "" };
    }

    function Help(props) {
      var id = React.useId();
      return React.createElement("span", { className: "pw-help" },
        React.createElement("button", { type: "button", className: "pw-help-trigger", "aria-label": props.label, "aria-describedby": id }, "!"),
        React.createElement("span", { id: id, className: "pw-help-tip", role: "tooltip" }, props.text));
    }

    function PersonaSection(props) {
      var getState = props.getState;
      var saveConfiguration = props.saveConfiguration;
      var saveTemplate = props.saveTemplate;
      var deleteTemplate = props.deleteTemplate;
      var applyTemplate = props.applyTemplate;
      var t = props.t;

      var dataSlot = React.useState({
        status: "loading",
        current: "",
        defaultText: "",
        dialoguePreset: emptyPreset(),
        templates: [],
        activeTemplateId: null,
      });
      var data = dataSlot[0];
      var setData = dataSlot[1];
      var textSlot = React.useState("");
      var text = textSlot[0];
      var setText = textSlot[1];
      var presetSlot = React.useState(emptyPreset());
      var preset = presetSlot[0];
      var setPreset = presetSlot[1];
      var settingsSlot = React.useState(normalizeSettings());
      var settings = settingsSlot[0];
      var setSettings = settingsSlot[1];
      var selectedSlot = React.useState("");
      var selectedId = selectedSlot[0];
      var setSelectedId = selectedSlot[1];
      var templateNameSlot = React.useState("");
      var templateName = templateNameSlot[0];
      var setTemplateName = templateNameSlot[1];
      var savingSlot = React.useState(false);
      var saving = savingSlot[0];
      var setSaving = savingSlot[1];
      var hintSlot = React.useState(null);
      var hint = hintSlot[0];
      var setHint = hintSlot[1];
      // Deleting asks inside the panel. A native window.confirm() dialog leaves
      // the Electron window without keyboard focus on Windows, which froze the
      // template list and the chat input until the window was refocused.
      var armedSlot = React.useState("");
      var armedId = armedSlot[0];
      var setArmedId = armedSlot[1];
      var mountedRef = React.useRef(true);
      var loadSeq = React.useRef(0);
      var editSeq = React.useRef(0);
      var saveBusyRef = React.useRef(false);

      var load = React.useCallback(function () {
        var requestId = loadSeq.current + 1;
        var editAtStart = editSeq.current;
        loadSeq.current = requestId;
        setData({ status: "loading", current: "", defaultText: "", dialoguePreset: emptyPreset(), templates: [], activeTemplateId: null });
        getState().then(
          function (state) {
            if (!mountedRef.current || requestId !== loadSeq.current) return;
            var nextPreset = normalizePreset(state.dialoguePreset);
            var nextTemplates = normalizeTemplates(state.templates);
            var preferredId = typeof state.activeTemplateId === "string" ? state.activeTemplateId : (nextTemplates[0] ? nextTemplates[0].id : "");
            var preferredTemplate = nextTemplates.find(function (template) { return template.id === preferredId; });
            setData({
              status: "ready",
              current: state.current,
              defaultText: state.defaultText,
              dialoguePreset: nextPreset,
              settings: normalizeSettings(state.settings),
              injectionStatus: state.injectionStatus,
              currentRevision: state.currentRevision,
              templates: nextTemplates,
              activeTemplateId: state.activeTemplateId || null,
            });
            if (editSeq.current === editAtStart) {
              setText(state.current);
              setPreset(nextPreset);
              setSettings(normalizeSettings(state.settings));
              setSelectedId(preferredId);
              setTemplateName(preferredTemplate ? preferredTemplate.name : "");
            }
            setHint(null);
          },
          function (err) {
            if (!mountedRef.current || requestId !== loadSeq.current) return;
            console.error("dsh-w-persona: getState failed:", err);
            setData({ status: "error", current: "", defaultText: "", dialoguePreset: emptyPreset(), templates: [], activeTemplateId: null });
          },
        );
      }, [getState]);

      React.useEffect(function () {
        mountedRef.current = true;
        return function () {
          mountedRef.current = false;
          loadSeq.current += 1;
          saveBusyRef.current = false;
        };
      }, []);
      React.useEffect(function () { load(); }, [load]);
      React.useEffect(function () {
        if (!armedId) return undefined;
        var timer = setTimeout(function () { setArmedId(""); }, 6000);
        return function () { clearTimeout(timer); };
      }, [armedId]);

      function editPreset(field, value) {
        editSeq.current += 1;
        setPreset(function (current) {
          var next = Object.assign({}, current);
          next[field] = value;
          return next;
        });
        setHint(null);
      }

      function acceptRemoteState(state, syncEditor) {
        var nextPreset = normalizePreset(state.dialoguePreset);
        var nextTemplates = normalizeTemplates(state.templates);
        setData({
          status: "ready",
          current: state.current,
          defaultText: state.defaultText,
          dialoguePreset: nextPreset,
          settings: normalizeSettings(state.settings),
          injectionStatus: state.injectionStatus,
          currentRevision: state.currentRevision,
          templates: nextTemplates,
          activeTemplateId: state.activeTemplateId || null,
        });
        if (syncEditor) {
          editSeq.current += 1;
          setText(state.current);
          setPreset(nextPreset);
          setSettings(normalizeSettings(state.settings));
        }
        return nextTemplates;
      }

      function withTimeout(promise) {
        return new Promise(function (resolve, reject) {
          var timer = setTimeout(function () { reject(new Error("timed out")); }, 30000);
          promise.then(function (value) { clearTimeout(timer); resolve(value); }, function (error) { clearTimeout(timer); reject(error); });
        });
      }

      function runBusy(action, onSuccess, successText) {
        if (saveBusyRef.current) return;
        saveBusyRef.current = true;
        setSaving(true);
        setHint(null);
        withTimeout(action()).then(
          function (state) {
            saveBusyRef.current = false;
            if (!mountedRef.current) return;
            setSaving(false);
            onSuccess(state);
            setHint(successText);
          },
          function (err) {
            saveBusyRef.current = false;
            if (!mountedRef.current) return;
            setSaving(false);
            console.error("dsh-w-persona: operation failed:", err);
            setHint(t("error") + " " + (err.message || String(err)));
          },
        );
      }

      function onSave() {
        var savedText = text;
        var savedPreset = normalizePreset(preset);
        runBusy(
          function () { return saveConfiguration(savedText, savedPreset, settings); },
          function (state) {
            acceptRemoteState(state, true);
            if (state.activeTemplateId) {
              var active = normalizeTemplates(state.templates).find(function (template) { return template.id === state.activeTemplateId; });
              if (active) { setSelectedId(active.id); setTemplateName(active.name); }
            }
          },
          t("applied"),
        );
      }

      function onSaveTemplate(overwrite) {
        var name = templateName.trim();
        if (!name) { setHint(t("templateNameRequired")); return; }
        var input = { name: name, persona: text, dialoguePreset: normalizePreset(preset), settings: settings };
        if (overwrite) {
          if (!selectedId) return;
          input.id = selectedId;
        }
        runBusy(
          function () { return saveTemplate(input); },
          function (state) {
            acceptRemoteState(state, false);
            setSelectedId(state.template.id);
            setTemplateName(state.template.name);
          },
          overwrite ? t("templateUpdated") : t("templateSaved"),
        );
      }

      function onApplyTemplate() {
        if (!selectedId) return;
        runBusy(
          function () { return applyTemplate(selectedId); },
          function (state) {
            acceptRemoteState(state, true);
            var applied = normalizeTemplates(state.templates).find(function (template) { return template.id === selectedId; });
            if (applied) setTemplateName(applied.name);
          },
          t("templateApplied"),
        );
      }

      function onDeleteTemplate() {
        if (!selectedId) return;
        if (armedId !== selectedId) { setArmedId(selectedId); setHint(null); return; }
        setArmedId("");
        runBusy(
          function () { return deleteTemplate(selectedId); },
          function (state) {
            var templates = acceptRemoteState(state, false);
            var nextId = state.activeTemplateId || (templates[0] ? templates[0].id : "");
            var next = templates.find(function (template) { return template.id === nextId; });
            setSelectedId(nextId);
            setTemplateName(next ? next.name : "");
          },
          t("templateDeleted"),
        );
      }

      function onReset() {
        editSeq.current += 1;
        setText(data.defaultText);
        setHint(null);
      }

      var ready = data.status === "ready";
      var dirty = ready && (text !== data.current || !samePreset(preset, data.dialoguePreset)
        || JSON.stringify(settings) !== JSON.stringify(normalizeSettings(data.settings)));
      var presetComplete = completePreset(preset);
      var selectedTemplate = data.templates.find(function (template) { return template.id === selectedId; });
      var presetFields = [
        ["user1", "user1"],
        ["assistant1", "assistant1"],
        ["user2", "user2"],
        ["assistant2", "assistant2"],
      ];

      return React.createElement(
        "div",
        { className: "pw-root" },
        data.status === "loading" ? React.createElement("p", { className: "pw-empty" }, t("loading")) : null,
        data.status === "error"
          ? React.createElement(
              "div",
              { className: "pw-actions" },
              React.createElement("p", { className: "pw-empty", role: "alert" }, t("error")),
              React.createElement("button", { type: "button", onClick: load }, t("retry")),
            )
          : null,
        ready
          ? React.createElement(
            React.Fragment,
            null,
              React.createElement(
                "section",
                { className: "pw-template", "aria-label": t("templateTitle") },
                React.createElement(
                  "div",
                  { className: "pw-template-head" },
                  React.createElement(
                    "div",
                    { className: "pw-template-copy" },
                    React.createElement("span", { className: "pw-template-title" }, t("templateTitle")),
                    React.createElement("p", { className: "pw-warning" }, t("templateHelp")),
                  ),
                  data.activeTemplateId
                    ? React.createElement("span", { className: "pw-template-active" }, t("templateActive"))
                    : null,
                ),
                React.createElement(
                  "div",
                  { className: "pw-template-grid" },
                  React.createElement(
                    "label",
                    { className: "pw-template-field" },
                    React.createElement("span", { className: "pw-template-label" }, t("templateChoose")),
                    React.createElement(
                      "select",
                      {
                        className: "pw-template-select",
                        value: selectedId,
                        disabled: saving || data.templates.length === 0,
                        onChange: function (event) {
                          var id = event.currentTarget.value;
                          var chosen = data.templates.find(function (template) { return template.id === id; });
                          setSelectedId(id);
                          setTemplateName(chosen ? chosen.name : "");
                          setArmedId("");
                          setHint(null);
                        },
                      },
                      data.templates.length === 0
                        ? React.createElement("option", { value: "" }, t("templateEmpty"))
                        : data.templates.map(function (template) {
                            return React.createElement("option", { value: template.id, key: template.id }, template.name);
                          }),
                    ),
                  ),
                  React.createElement(
                    "label",
                    { className: "pw-template-field" },
                    React.createElement("span", { className: "pw-template-label" }, t("templateName")),
                    React.createElement("input", {
                      className: "pw-template-name",
                      type: "text",
                      value: templateName,
                      maxLength: 80,
                      disabled: saving,
                      placeholder: t("templateNamePlaceholder"),
                      onChange: function (event) { setTemplateName(event.currentTarget.value); setHint(null); },
                    }),
                  ),
                ),
                React.createElement(
                  "div",
                  { className: "pw-template-actions" },
                  React.createElement("button", { type: "button", className: "pw-template-button", "data-primary": "true", disabled: saving || !selectedTemplate, onClick: onApplyTemplate }, t("templateApply")),
                  React.createElement("button", { type: "button", className: "pw-template-button", disabled: saving || !templateName.trim(), onClick: function () { onSaveTemplate(false); } }, t("templateSaveNew")),
                  React.createElement("button", { type: "button", className: "pw-template-button", disabled: saving || !selectedTemplate || !templateName.trim(), onClick: function () { onSaveTemplate(true); } }, t("templateOverwrite")),
                  React.createElement("button", {
                    type: "button", className: "pw-template-button", "data-danger": "true",
                    "data-armed": armedId && armedId === selectedId ? "true" : undefined,
                    disabled: saving || !selectedTemplate, onClick: onDeleteTemplate,
                  }, armedId && armedId === selectedId ? t("templateDeleteArmed") : t("templateDelete")),
                ),
                armedId && armedId === selectedId && selectedTemplate
                  ? React.createElement(
                    "div",
                    { className: "pw-confirm", role: "alert" },
                    React.createElement("span", null, t("templateDeleteConfirm").replace("{name}", selectedTemplate.name)),
                    React.createElement("button", { type: "button", className: "pw-template-button", onClick: function () { setArmedId(""); } }, t("cancel")),
                  )
                  : null,
              ),
              React.createElement(
                "div",
                { className: "pw-block" },
                React.createElement("h3", { className: "pw-title" }, t("defaultTitle")),
                React.createElement(
                  "pre",
                  { className: "pw-default" },
                  data.defaultText.length > 0 ? data.defaultText : t("emptyDefault"),
                ),
              ),
              React.createElement(
                "div",
                { className: "pw-block" },
                React.createElement(
                  "div",
                  { className: "pw-field" },
                  React.createElement(
                    "div",
                    { className: "pw-field-head" },
                    React.createElement("span", { className: "pw-field-label" }, t("fieldLabel")),
                    React.createElement(
                      "button",
                      {
                        type: "button",
                        className: "pw-reset",
                        title: t("resetAria"),
                        "aria-label": t("resetAria"),
                        disabled: saving || text === data.defaultText,
                        onClick: onReset,
                      },
                      "\u21ba",
                    ),
                  ),
                  React.createElement("textarea", {
                    className: "pw-input",
                    value: text,
                    disabled: saving,
                    spellCheck: false,
                    onChange: function (event) {
                      editSeq.current += 1;
                      setText(event.currentTarget.value);
                      setHint(null);
                    },
                  }),
                ),
                React.createElement("div", { className: "pw-new-fields" },
                  ["applyMode", "textMode", "characterName", "userName", "suffix"].map(function (field) {
                    var choices = field === "applyMode" ? ["immediate", "new-conversations"] : field === "textMode" ? ["template", "plain"] : null;
                    var label = t(field + "Label");
                    var inputProps = { className: choices || field !== "suffix" ? "pw-template-name" : "pw-preset-input",
                      "aria-label": label, value: settings[field], disabled: saving,
                      onChange: function (event) { var value = event.currentTarget.value; editSeq.current += 1;
                        setSettings(function (current) { return Object.assign({}, current, { [field]: value }); }); setHint(null); } };
                    return React.createElement("div", { className: "pw-new-field", key: field },
                      React.createElement("div", { className: "pw-field-head" }, React.createElement("span", { className: "pw-field-label" }, label),
                        React.createElement(Help, { label: label + t("helpLabel"), text: t(field + "Help") })),
                      choices ? React.createElement("select", inputProps, choices.map(function (choice) { return React.createElement("option", { key: choice, value: choice }, t(choice)); }))
                        : React.createElement(field === "suffix" ? "textarea" : "input", Object.assign({}, inputProps, { placeholder: t(field + "Placeholder") })));
                  })),
                React.createElement("div", { className: "pw-status", role: "status" },
                  React.createElement("div", { className: "pw-field-head" }, React.createElement("strong", null, t("injectionLabel")),
                    React.createElement(Help, { label: t("injectionLabel") + t("helpLabel"), text: t("injectionHelp") })),
                  React.createElement("span", null, !data.injectionStatus || data.injectionStatus.state === "pending" ? t("injectionPending")
                    : data.injectionStatus.state === "error" ? t("error") + " " + data.injectionStatus.message
                    : t("injectionPrepared") + " · " + data.injectionStatus.model + " · " + t("route-" + data.injectionStatus.route)
                      + " · " + t("exampleCount") + ": " + data.injectionStatus.exampleMessages),
                  data.injectionStatus && data.injectionStatus.state === "prepared" && data.injectionStatus.matchesCurrent === false
                    ? React.createElement("span", { className: "pw-warning" }, t("previousConfiguration")) : null,
                  data.injectionStatus && data.injectionStatus.revision ? React.createElement("span", { className: "pw-hint" },
                    t("revision") + ": " + data.injectionStatus.revision + " · " + t("session") + ": " + data.injectionStatus.sessionId
                    + " · " + new Date(data.injectionStatus.at).toLocaleString()) : null,
                  React.createElement("button", { type: "button", className: "pw-template-button", disabled: saving,
                    onClick: function () { runBusy(getState, function (state) {
                      setData(function (current) { return Object.assign({}, current, { injectionStatus: state.injectionStatus }); });
                    }, t("statusRefreshed")); } }, t("refreshStatus"))),
                React.createElement(
                  "div",
                  { className: "pw-preset-head" },
                  React.createElement(
                    "div",
                    { className: "pw-preset-copy" },
                    React.createElement("span", { className: "pw-preset-title" }, t("presetTitle")),
                    React.createElement("p", { className: "pw-warning" }, t("presetHelp")),
                  ),
                  React.createElement(
                    "button",
                    {
                      type: "button",
                      role: "switch",
                      "aria-checked": preset.enabled,
                      "aria-label": t("presetTitle"),
                      className: "pw-switch",
                      "data-checked": preset.enabled ? "true" : "false",
                      disabled: saving,
                      onClick: function () { editPreset("enabled", !preset.enabled); },
                    },
                    React.createElement("span", { className: "pw-switch-knob" }),
                  ),
                ),
                preset.enabled
                  ? React.createElement(
                      React.Fragment,
                      null,
                      React.createElement(
                        "div",
                        { className: "pw-preset-card" },
                        presetFields.map(function (entry) {
                          var field = entry[0];
                          return React.createElement(
                            "label",
                            { className: "pw-preset-field", key: field },
                            React.createElement("span", { className: "pw-preset-label" }, t(entry[1])),
                            React.createElement("textarea", {
                              className: "pw-preset-input",
                              value: preset[field],
                              disabled: saving,
                              spellCheck: false,
                              onChange: function (event) { editPreset(field, event.currentTarget.value); },
                            }),
                          );
                        }),
                      ),
                      !presetComplete
                        ? React.createElement("p", { className: "pw-incomplete" }, t("presetIncomplete"))
                        : null,
                    )
                  : null,
                React.createElement(
                  "div",
                  { className: "pw-actions" },
                  React.createElement(
                    "button",
                    { type: "button", className: "pw-save", disabled: saving || !dirty, onClick: onSave },
                    saving ? t("saving") : t("save"),
                  ),
                  hint !== null ? React.createElement("p", { className: "pw-hint" }, hint) : null,
                ),
              ),
            )
          : null,
      );
    }

    var NS = "dshWPersona";
    var inject = ["slots", "locale", "remote"];
    var dicts = {
      zh: {
        nav: "\u4eba\u8bbe",
        defaultTitle: "Harness \u9ed8\u8ba4\u63d0\u793a\u8bcd",
        fieldLabel: "System \u63d0\u793a\u8bcd",
        resetAria: "\u91cd\u7f6e\u4e3a\u9ed8\u8ba4\u63d0\u793a\u8bcd",
        templateTitle: "\u4eba\u8bbe\u6a21\u677f",
        templateHelp: "\u6bcf\u4e2a\u6a21\u677f\u540c\u65f6\u4fdd\u5b58 System \u63d0\u793a\u8bcd\u548c DeepSeek \u5bf9\u8bdd\u9884\u8bbe\uff0c\u53ef\u4e00\u952e\u5207\u6362\u3002",
        templateActive: "\u5f53\u524d\u5df2\u5339\u914d\u6a21\u677f",
        templateChoose: "\u5df2\u4fdd\u5b58\u7684\u6a21\u677f",
        templateEmpty: "\u6682\u65e0\u6a21\u677f",
        templateName: "\u6a21\u677f\u540d\u79f0",
        templateNamePlaceholder: "\u4f8b\u5982\uff1a\u5199\u5b9e\u4f5c\u5bb6\u3001\u63a8\u7406\u52a9\u624b",
        templateApply: "\u5e94\u7528\u6a21\u677f",
        templateSaveNew: "\u4fdd\u5b58\u4e3a\u65b0\u6a21\u677f",
        templateOverwrite: "\u8986\u76d6\u6a21\u677f",
        templateDelete: "\u5220\u9664",
        templateDeleteConfirm: "\u786e\u5b9a\u5220\u9664\u6a21\u677f\u300c{name}\u300d\uff1f\u5f53\u524d\u5df2\u5e94\u7528\u7684\u4eba\u8bbe\u4e0d\u4f1a\u88ab\u6e05\u9664\u3002\u518d\u70b9\u4e00\u6b21\u7ea2\u8272\u6309\u94ae\u786e\u8ba4\u3002",
        templateDeleteArmed: "\u786e\u8ba4\u5220\u9664",
        cancel: "\u53d6\u6d88",
        templateNameRequired: "\u8bf7\u5148\u8f93\u5165\u6a21\u677f\u540d\u79f0\u3002",
        templateSaved: "\u5df2\u4fdd\u5b58\u4e3a\u65b0\u6a21\u677f\u3002",
        templateUpdated: "\u5df2\u8986\u76d6\u9009\u4e2d\u7684\u6a21\u677f\u3002",
        templateApplied: "\u6a21\u677f\u5df2\u5e94\u7528\uff1bPersona \u7acb\u5373\u751f\u6548\uff0c\u5bf9\u8bdd\u9884\u8bbe\u7528\u4e8e\u65b0\u5bf9\u8bdd\u3002",
        templateDeleted: "\u6a21\u677f\u5df2\u5220\u9664\u3002",
        presetTitle: "DeepSeek \u5bf9\u8bdd\u9884\u8bbe",
        presetHelp: "\u5f00\u542f\u540e\uff0c\u56db\u6761\u9884\u8bbe\u4f1a\u4ee5\u9690\u85cf\u7684 user/assistant \u4e0a\u4e0b\u6587\u53d1\u9001\u7ed9\u6240\u6709\u6a21\u578b\uff1b\u5176\u4ed6\u6a21\u578b\u4e0d\u517c\u5bb9\u65f6\u8bf7\u5173\u95ed\u3002",
        presetIncomplete: "\u9700\u8981\u5b8c\u6574\u586b\u5199\u4e24\u8f6e\u56db\u9879\u5185\u5bb9\u540e\u624d\u4f1a\u6ce8\u5165\u3002",
        user1: "\u7528\u6237\u8f93\u5165 1",
        assistant1: "AI \u8f93\u51fa 1",
        user2: "\u7528\u6237\u8f93\u5165 2",
        assistant2: "AI \u8f93\u51fa 2",
        save: "\u4fdd\u5b58",
        saving: "\u4fdd\u5b58\u4e2d\u2026",
        applied: "\u5df2\u4fdd\u5b58\uff1b\u5bf9\u8bdd\u9884\u8bbe\u5c06\u4ece\u65b0\u5bf9\u8bdd\u5f00\u59cb\u751f\u6548",
        loading: "\u6b63\u5728\u8bfb\u53d6\u2026",
        error: "\u64cd\u4f5c\u5931\u8d25\u3002",
        retry: "\u91cd\u8bd5",
        emptyDefault: "\uff08\u7a7a\uff09",
      },
      en: {
        nav: "Persona",
        defaultTitle: "Harness default prompt",
        fieldLabel: "System prompt",
        resetAria: "Reset to default prompt",
        templateTitle: "Persona templates",
        templateHelp: "Each template stores the system prompt and DeepSeek conversation preset together for one-click switching.",
        templateActive: "Current configuration matches a template",
        templateChoose: "Saved template",
        templateEmpty: "No templates yet",
        templateName: "Template name",
        templateNamePlaceholder: "For example: literary writer or research assistant",
        templateApply: "Apply template",
        templateSaveNew: "Save as new",
        templateOverwrite: "Overwrite template",
        templateDelete: "Delete",
        templateDeleteConfirm: "Delete template \"{name}\"? The currently applied persona is not cleared. Click the red button again to confirm.",
        templateDeleteArmed: "Confirm delete",
        cancel: "Cancel",
        templateNameRequired: "Enter a template name first.",
        templateSaved: "Saved as a new template.",
        templateUpdated: "Updated the selected template.",
        templateApplied: "Template applied. Persona takes effect immediately; the dialogue preset is used by new conversations.",
        templateDeleted: "Template deleted.",
        presetTitle: "DeepSeek conversation preset",
        presetHelp: "When enabled, the four hidden user/assistant messages are sent to every model. Turn this off if another model is incompatible.",
        presetIncomplete: "Complete all four fields before the two preset turns are injected.",
        user1: "User input 1",
        assistant1: "AI output 1",
        user2: "User input 2",
        assistant2: "AI output 2",
        save: "Save",
        saving: "Saving\u2026",
        applied: "Saved. The conversation preset applies to new conversations.",
        loading: "Loading\u2026",
        error: "Operation failed.",
        retry: "Retry",
        emptyDefault: "(empty)",
      },
    };

    Object.assign(dicts.zh, {
      helpLabel: "：说明与示例",
      applyModeLabel: "生效范围", immediate: "当前及新对话，下次请求同步更新", "new-conversations": "仅新对话，已有对话保持原人设",
      applyModeHelp: "正文、行为约束和示例一起切换。正在生成的回复不受影响。\n示例：从侦探切换为老师，选择“当前及新对话”后，旧对话的下一次请求也会使用老师。\n选择“仅新对话”时，本次运行已捕获人设的对话保持原配置；重启后重新捕获。",
      textModeLabel: "文本解析", template: "变量模板", plain: "普通文本（原样保留双花括号）",
      textModeHelp: "变量模板支持 {{char}}、{{user}}、{{model}}、{{provider}}、{{cwd}}，保存前检查变量。\n示例：你是 {{char}}，称呼用户为 {{user}}。\n普通文本不会替换任何双花括号。角色名和称呼也会作为独立人设信息注入。",
      characterNameLabel: "角色名", characterNamePlaceholder: "例如：小鲸",
      characterNameHelp: "填写后作为角色身份注入，也可用 {{char}} 引用。\n示例：角色名填“小鲸”，正文写“你是 {{char}}，擅长耐心解释问题”。",
      userNameLabel: "用户称呼", userNamePlaceholder: "例如：阿林",
      userNameHelp: "填写后作为用户称呼注入，也可用 {{user}} 引用。\n示例：称呼填“阿林”，示例回答写“{{user}}，我们一步一步来”。",
      suffixLabel: "简短行为约束", suffixPlaceholder: "例如：用中文，语气温和，称呼用户为 {{user}}；技术解释保持准确。",
      suffixHelp: "追加到 System 提示词末尾，适合简短的语气、称呼与回答习惯。保留官方工具说明。\n示例：默认用中文，先回应情绪，再给出两到三条具体建议。\n完整提示词模式会在请求发送前补入此约束。",
      injectionLabel: "最近一次请求的注入状态", injectionHelp: "反映最近一次请求准备时的配置，不代表模型保证遵循，也不是服务端接收回执。点击刷新查看。\n示例：“组装注入 · 示例消息: 4”表示本次请求已包含人设和两轮示例。\n切换模型、对话压缩后也会重新检查。",
      injectionPending: "等待下一次模型请求验证。", injectionPrepared: "已进入待发送请求",
      previousConfiguration: "此请求使用已有会话保留的旧配置。选择“当前及新对话”并保存，可在下次请求同步更新。",
      "route-assembly": "组装注入", "route-complete-fallback": "完整提示词模式补入", "route-request-fallback": "请求补入", "route-default": "使用官方默认人设",
      exampleCount: "示例消息", revision: "人设版本", session: "会话", refreshStatus: "刷新状态", statusRefreshed: "状态已刷新。",
      templateHelp: "模板保存正文、行为约束、变量、示例与生效范围，可一键切换。",
      templateApplied: "模板已保存为当前配置，将按所选生效范围用于下一次请求。",
      applied: "已保存，将按所选生效范围用于下一次请求。",
      presetHelp: "完整的两轮示例会放在首条 System 之后，随所选生效范围同步切换；不写入聊天记录。",
    });
    Object.assign(dicts.en, {
      helpLabel: ": help and example",
      applyModeLabel: "Apply to", immediate: "Current and new conversations, from the next request", "new-conversations": "New conversations only",
      applyModeHelp: "Switch persona, style and examples together. In-flight replies are unaffected.\nExample: switch detective to teacher; current conversations use the teacher on their next request.\nNew-only keeps configurations captured during this runtime; restart captures them again.",
      textModeLabel: "Text parsing", template: "Variable template", plain: "Plain text (keep braces literally)",
      textModeHelp: "Supported: {{char}}, {{user}}, {{model}}, {{provider}}, {{cwd}}.\nExample: You are {{char}}. Call the user {{user}}.\nPlain text keeps all braces. Names are also injected as persona facts.",
      characterNameLabel: "Character name", characterNamePlaceholder: "Example: Whale",
      characterNameHelp: "Injected as the character identity; use {{char}} in templates.\nExample: You are {{char}}, a patient tutor.",
      userNameLabel: "User name", userNamePlaceholder: "Example: Alex",
      userNameHelp: "Injected as the user's preferred name; use {{user}} in templates.\nExample: {{user}}, let's work through this together.",
      suffixLabel: "Brief behavior rules", suffixPlaceholder: "Example: Be warm and concise. Call the user {{user}}. Keep technical answers accurate.",
      suffixHelp: "Appended after System guidance; keep this brief.\nExample: Acknowledge feelings, then give two concrete suggestions.\nAlso applied before dispatch in complete-prompt modes.",
      injectionLabel: "Latest request injection", injectionHelp: "Shows the last prepared request, not a server receipt or a guarantee of model behavior. Refresh to inspect it.\nExample: Assembly injection, 4 example messages means both example turns were included.",
      injectionPending: "Waiting for the next model request.", injectionPrepared: "Included in prepared request",
      previousConfiguration: "This request used an older session configuration. Select current and new conversations, then save to switch on the next request.",
      "route-assembly": "Assembly injection", "route-complete-fallback": "Complete-prompt fallback", "route-request-fallback": "Request fallback", "route-default": "Official default persona",
      exampleCount: "Example messages", revision: "Persona version", session: "Session", refreshStatus: "Refresh status", statusRefreshed: "Status refreshed.",
      templateHelp: "Templates store persona, style, variables, examples and application scope.",
      templateApplied: "Template saved as current configuration; applies according to the selected scope on the next request.",
      applied: "Saved; applies according to the selected scope on the next request.",
      presetHelp: "Both example turns follow the leading System message and switch with the selected scope. They are not stored in chat history.",
    });

    async function apply(ctx) {
      ctx.effect(function () { return ctx.locale.register(NS, dicts); });
      var t = ctx.locale.bind(NS);
      var unmount = await ctx.remote.$mount(TYPERT_REMOTE);
      ctx.effect(function () { return unmount; }, "dsh-w-persona: remote");
      var personaManager = ctx.get("remote.personaManager");
      if (!personaManager) throw new Error("dsh-w-persona: remote.personaManager did not mount");

      async function unwrap(method, args) {
        var result = await personaManager[method].apply(personaManager, args);
        if (!result.ok) throw new Error("personaManager." + method + " failed: " + JSON.stringify(result.error));
        return result.value;
      }
      function injected() {
        return {
          getState: function () { return unwrap("getState", []); },
          save: function (text) { return unwrap("save", [text]); },
          saveDialoguePreset: function (value) { return unwrap("saveDialoguePreset", [value]); },
          saveConfiguration: function (text, value, settings) { return unwrap("saveConfiguration", [text, value, settings]); },
          saveTemplate: function (value) { return unwrap("saveTemplate", [value]); },
          deleteTemplate: function (id) { return unwrap("deleteTemplate", [id]); },
          applyTemplate: function (id) { return unwrap("applyTemplate", [id]); },
        };
      }

      ctx.slots.inject("settings.section", function () {
        return ctx.slots.register({
          name: "settings.section",
          id: "persona",
          order: 21,
          label: function () { return t("nav"); },
          locale: NS,
          inject: injected,
        }, PersonaSection);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-persona";
    return module.exports;
  },
});
