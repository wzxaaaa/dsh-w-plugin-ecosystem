window.__ModuleLoader__.load({
  id: "dsh-w-persona",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    // ---- stylesheet (package-scoped, cleaned up with the run) ----
    var CSS = [
      ".pw-root{width:100%;max-width:760px;display:flex;flex-direction:column;gap:16px;color:var(--dsw-alias-label-primary)}",
      ".pw-block{display:flex;flex-direction:column;gap:8px}",
      ".pw-title{font-size:14px;font-weight:600;line-height:20px;margin:0}",
      ".pw-default{box-sizing:border-box;width:100%;margin:0;padding:12px 14px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:8px;font-family:var(--ds-font-family-code);font-size:12px;line-height:19px;color:var(--dsw-alias-label-secondary);white-space:pre-wrap;word-break:break-word;max-height:220px;overflow:auto}",
      ".pw-field{position:relative;display:flex;flex-direction:column;gap:6px}",
      ".pw-field-head{display:flex;align-items:center;justify-content:space-between;gap:8px}",
      ".pw-field-label{font-size:13px;font-weight:600;line-height:19px}",
      ".pw-reset{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);border-radius:7px;cursor:pointer;font-size:15px;line-height:1;padding:0}",
      ".pw-reset:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
      ".pw-reset:disabled{cursor:default;opacity:.5}",
      ".pw-input{box-sizing:border-box;width:100%;min-height:200px;resize:vertical;padding:10px 12px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:8px;color:var(--dsw-alias-label-primary);font-family:var(--ds-font-family-code);font-size:12px;line-height:19px;outline:none}",
      ".pw-input:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-business-primary) 18%,transparent)}",
      ".pw-actions{display:flex;align-items:center;gap:10px}",
      ".pw-save{font:inherit;cursor:pointer;border-radius:8px;padding:6px 16px;font-size:13px;line-height:20px;border:1px solid transparent;background:var(--dsw-alias-state-business-primary);color:#fff}",
      ".pw-save:disabled{cursor:default;opacity:.55}",
      ".pw-hint{font-size:12px;line-height:18px;margin:0;color:var(--dsw-alias-label-tertiary)}",
      ".pw-empty{font-size:13px;color:var(--dsw-alias-label-tertiary);margin:0}",
    ].join("\n");
    var tagId = "dsh-w-persona/styles";
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
      var styleTag = document.createElement("style");
      styleTag.dataset.plugin = "dsh-w-persona";
      styleTag.dataset.pluginCss = tagId;
      styleTag.textContent = CSS;
      document.head.appendChild(styleTag);
    }

    // ---- Remote contribution (client face of the Host `personaManager` service) ----
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
      ],
    };

    // ---- section component ----
    function PersonaSection(props) {
      var getState = props.getState;
      var save = props.save;
      var t = props.t;

      var dataSlot = React.useState({ status: "loading", current: "", defaultText: "" });
      var data = dataSlot[0];
      var setData = dataSlot[1];
      var textSlot = React.useState("");
      var text = textSlot[0];
      var setText = textSlot[1];
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
        setData({ status: "loading", current: "", defaultText: "" });
        getState().then(
          function (state) {
            if (!mountedRef.current || requestId !== loadSeq.current) return;
            setData({ status: "ready", current: state.current, defaultText: state.defaultText });
            if (editSeq.current === editAtStart) setText(state.current);
            setHint(null);
          },
          function (err) {
            if (!mountedRef.current || requestId !== loadSeq.current) return;
            console.error("dsh-w-persona: getState failed:", err);
            setData({ status: "error", current: "", defaultText: "" });
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

      function onSave() {
        if (saveBusyRef.current) return;
        saveBusyRef.current = true;
        var savedText = text;
        var editAtStart = editSeq.current;
        setSaving(true);
        save(savedText).then(
          function (state) {
            saveBusyRef.current = false;
            if (!mountedRef.current) return;
            setSaving(false);
            setData({ status: "ready", current: state.current, defaultText: state.defaultText });
            if (editSeq.current === editAtStart) setText(state.current);
            setHint(state.applied ? t("applied") : t("savedRestart"));
          },
          function (err) {
            saveBusyRef.current = false;
            if (!mountedRef.current) return;
            setSaving(false);
            console.error("dsh-w-persona: save failed:", err);
            setHint(t("error"));
          },
        );
      }

      function onReset() {
        editSeq.current += 1;
        setText(data.defaultText);
        setHint(null);
      }

      var ready = data.status === "ready";
      var dirty = ready && text !== data.current;

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

    // ---- plugin ----
    var NS = "dshWPersona";
    var inject = ["slots", "locale", "remote"];

    var dicts = {
      zh: {
        nav: "\u4eba\u8bbe",
        defaultTitle: "Harness \u9ed8\u8ba4\u63d0\u793a\u8bcd",
        fieldLabel: "System \u63d0\u793a\u8bcd",
        resetAria: "\u91cd\u7f6e\u4e3a\u9ed8\u8ba4\u63d0\u793a\u8bcd",
        save: "\u4fdd\u5b58",
        saving: "\u4fdd\u5b58\u4e2d\u2026",
        applied: "\u5df2\u751f\u6548",
        savedRestart: "\u5df2\u4fdd\u5b58\uff0c\u91cd\u542f\u540e\u751f\u6548",
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
        save: "Save",
        saving: "Saving\u2026",
        applied: "Applied",
        savedRestart: "Saved. Restart to apply.",
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
