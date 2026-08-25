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
      ".pw-template-button:disabled,.pw-template-select:disabled,.pw-template-name:disabled{cursor:default;opacity:.5}",
      ".pw-default{box-sizing:border-box;width:100%;margin:0;padding:12px 14px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:8px;font-family:var(--ds-font-family-code);font-size:12px;line-height:19px;color:var(--dsw-alias-label-secondary);white-space:pre-wrap;word-break:break-word;max-height:220px;overflow:auto}",
      ".pw-field{position:relative;display:flex;flex-direction:column;gap:6px}",
      ".pw-field-head{display:flex;align-items:center;justify-content:space-between;gap:8px}",
      ".pw-field-label{font-size:13px;font-weight:600;line-height:19px}",
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
    function parameter(name) {
      return { name: name, wire: name, source: "json", codec: { mode: "strict", typeSymbol: "json", schema: passthrough } };
    }
    function descriptor(method, parameters) {
      return {
        id: "dsh-w-persona#personaManager/" + method,
        service: "personaManager",
        namespace: "personaManager",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: { mode: "strict", typeSymbol: "json", schema: passthrough },
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-persona",
      descriptors: [
        descriptor("getState"),
        descriptor("save", [parameter("text")]),
        descriptor("saveDialoguePreset", [parameter("value")]),
        descriptor("saveConfiguration", [parameter("text"), parameter("value")]),
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
              templates: nextTemplates,
              activeTemplateId: state.activeTemplateId || null,
            });
            if (editSeq.current === editAtStart) {
              setText(state.current);
              setPreset(nextPreset);
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
          templates: nextTemplates,
          activeTemplateId: state.activeTemplateId || null,
        });
        if (syncEditor) {
          editSeq.current += 1;
          setText(state.current);
          setPreset(nextPreset);
        }
        return nextTemplates;
      }

      function runBusy(action, onSuccess, successText) {
        if (saveBusyRef.current) return;
        saveBusyRef.current = true;
        setSaving(true);
        setHint(null);
        action().then(
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
            setHint(t("error"));
          },
        );
      }

      function onSave() {
        var savedText = text;
        var savedPreset = normalizePreset(preset);
        runBusy(
          function () { return saveConfiguration(savedText, savedPreset); },
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
        var input = { name: name, persona: text, dialoguePreset: normalizePreset(preset) };
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
        if (!selectedId || !window.confirm(t("templateDeleteConfirm"))) return;
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
      var dirty = ready && (text !== data.current || !samePreset(preset, data.dialoguePreset));
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
                  React.createElement("button", { type: "button", className: "pw-template-button", "data-danger": "true", disabled: saving || !selectedTemplate, onClick: onDeleteTemplate }, t("templateDelete")),
                ),
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
        templateDeleteConfirm: "\u786e\u5b9a\u5220\u9664\u8fd9\u4e2a\u4eba\u8bbe\u6a21\u677f\u5417\uff1f\u5f53\u524d\u5df2\u5e94\u7528\u7684\u4eba\u8bbe\u4e0d\u4f1a\u88ab\u6e05\u7a7a\u3002",
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
        templateDeleteConfirm: "Delete this persona template? The currently applied persona will not be cleared.",
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
          saveConfiguration: function (text, value) { return unwrap("saveConfiguration", [text, value]); },
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
