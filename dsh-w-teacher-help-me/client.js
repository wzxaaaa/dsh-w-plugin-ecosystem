window.__ModuleLoader__.load({
  id: "dsh-w-teacher-help-me",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    var CSS = [
      ".thm-root{display:flex;flex-direction:column;gap:8px}",
      ".thm-field{display:flex;flex-direction:column;gap:4px}",
      ".thm-label{font-size:12px;font-weight:600;line-height:17px}",
      ".thm-input{box-sizing:border-box;width:100%;padding:6px 9px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:7px;color:var(--dsw-alias-label-primary);font-family:var(--ds-font-family-code);font-size:12px;line-height:18px;outline:none}",
      ".thm-input:focus-visible{border-color:var(--dsw-alias-state-business-primary)}",
      ".thm-actions{display:flex;align-items:center;gap:9px}",
      ".thm-save{font:inherit;cursor:pointer;border-radius:7px;padding:5px 14px;font-size:12px;line-height:18px;border:1px solid transparent;background:var(--dsw-alias-state-business-primary);color:#fff}",
      ".thm-save:disabled{cursor:default;opacity:.55}",
      ".thm-hint{font-size:12px;line-height:17px;margin:0;color:var(--dsw-alias-label-tertiary)}",
      ".thm-hint[data-kind=error]{color:var(--dsw-alias-state-danger-primary,#c33)}",
      ".thm-hint[data-kind=success]{color:var(--dsw-alias-state-success-primary)}",
    ].join("\n");
    var tagId = "dsh-w-teacher-help-me/styles";
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
      var styleTag = document.createElement("style");
      styleTag.dataset.plugin = "dsh-w-teacher-help-me";
      styleTag.dataset.pluginCss = tagId;
      styleTag.textContent = CSS;
      document.head.appendChild(styleTag);
    }

    var passthrough = { parse: function (value) { return value; } };
    function parameter(name) {
      return { name: name, wire: name, source: "json", codec: { mode: "strict", typeSymbol: "json", schema: passthrough } };
    }
    function descriptor(method, parameters) {
      return {
        id: "dsh-w-teacher-help-me#teacherHelp/" + method,
        service: "teacherHelp",
        namespace: "teacherHelp",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: { mode: "strict", typeSymbol: "json", schema: passthrough },
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-teacher-help-me",
      descriptors: [
        descriptor("getConfig"),
        descriptor("saveConfig", [parameter("input")]),
      ],
    };

    function TeacherSettings(props) {
      var getConfig = props.getConfig;
      var saveConfig = props.saveConfig;
      var t = props.t;
      var dataSlot = React.useState({ status: "loading", apiKeyConfigured: false });
      var data = dataSlot[0];
      var setData = dataSlot[1];
      var baseSlot = React.useState("");
      var base = baseSlot[0];
      var setBase = baseSlot[1];
      var keySlot = React.useState("");
      var apikey = keySlot[0];
      var setApiKey = keySlot[1];
      var modelSlot = React.useState("");
      var model = modelSlot[0];
      var setModel = modelSlot[1];
      var savingSlot = React.useState(false);
      var saving = savingSlot[0];
      var setSaving = savingSlot[1];
      var hintSlot = React.useState(null);
      var hint = hintSlot[0];
      var setHint = hintSlot[1];

      React.useEffect(function () {
        var alive = true;
        getConfig().then(
          function (config) {
            if (!alive) return;
            setBase(config.base || "");
            setApiKey("");
            setModel(config.modelname || "gpt-5.6-sol");
            setData({ status: "ready", apiKeyConfigured: config.apiKeyConfigured === true });
          },
          function (error) {
            if (!alive) return;
            console.error("dsh-w-teacher-help-me: getConfig failed:", error);
            setData({ status: "error", apiKeyConfigured: false });
          },
        );
        return function () { alive = false; };
      }, [getConfig]);

      function onSave() {
        setSaving(true);
        setHint(null);
        saveConfig({ base: base, apikey: apikey, modelname: model }).then(
          function (result) {
            setSaving(false);
            setApiKey("");
            setData({
              status: "ready",
              apiKeyConfigured: Boolean(result && result.config && result.config.apiKeyConfigured),
            });
            setHint({ kind: "success", text: t("saved") });
          },
          function (error) {
            setSaving(false);
            setHint({ kind: "error", text: error && error.message ? error.message : t("error") });
          },
        );
      }

      if (data.status === "loading") return React.createElement("p", { className: "thm-hint" }, t("loading"));
      if (data.status === "error") return React.createElement("p", { className: "thm-hint", "data-kind": "error" }, t("error"));

      return React.createElement(
        "div",
        { className: "thm-root" },
        React.createElement(
          "div",
          { className: "thm-field" },
          React.createElement("label", { className: "thm-label" }, t("baseLabel")),
          React.createElement("input", {
            className: "thm-input",
            type: "text",
            value: base,
            spellCheck: false,
            placeholder: "https://your-relay.example",
            onChange: function (event) { setBase(event.currentTarget.value); },
          }),
        ),
        React.createElement(
          "div",
          { className: "thm-field" },
          React.createElement("label", { className: "thm-label" }, t("apikeyLabel")),
          React.createElement("input", {
            className: "thm-input",
            type: "password",
            value: apikey,
            spellCheck: false,
            autoComplete: "new-password",
            placeholder: data.apiKeyConfigured ? t("keyConfigured") : "sk-...",
            onChange: function (event) { setApiKey(event.currentTarget.value); },
          }),
          data.apiKeyConfigured
            ? React.createElement("p", { className: "thm-hint" }, t("keyKeepHint"))
            : null,
        ),
        React.createElement(
          "div",
          { className: "thm-field" },
          React.createElement("label", { className: "thm-label" }, t("modelLabel")),
          React.createElement("input", {
            className: "thm-input",
            type: "text",
            value: model,
            spellCheck: false,
            placeholder: "gpt-5.6-sol",
            onChange: function (event) { setModel(event.currentTarget.value); },
          }),
        ),
        React.createElement(
          "div",
          { className: "thm-actions" },
          React.createElement(
            "button",
            { type: "button", className: "thm-save", disabled: saving, onClick: onSave },
            saving ? t("saving") : t("save"),
          ),
          hint !== null
            ? React.createElement("p", { className: "thm-hint", "data-kind": hint.kind }, hint.text)
            : null,
        ),
      );
    }

    var NS = "dshWTeacherHelpMe";
    var inject = ["slots", "locale", "remote"];
    var dicts = {
      zh: {
        baseLabel: "API Base URL",
        apikeyLabel: "API Key",
        modelLabel: "老师模型名",
        keyConfigured: "已配置，留空则保留",
        keyKeepHint: "API Key 不会回显；只在需要更换时输入新值。",
        save: "保存",
        saving: "保存中...",
        saved: "已保存",
        loading: "正在读取...",
        error: "操作失败。",
      },
      en: {
        baseLabel: "API Base URL",
        apikeyLabel: "API Key",
        modelLabel: "Teacher model",
        keyConfigured: "Configured; leave blank to keep",
        keyKeepHint: "The API key is never displayed. Enter a new value only to replace it.",
        save: "Save",
        saving: "Saving...",
        saved: "Saved",
        loading: "Loading...",
        error: "Operation failed.",
      },
    };

    async function apply(ctx) {
      ctx.effect(function () { return ctx.locale.register(NS, dicts); });
      var unmount = await ctx.remote.$mount(TYPERT_REMOTE);
      ctx.effect(function () { return unmount; }, "dsh-w-teacher-help-me: remote");
      var teacherHelp = ctx.get("remote.teacherHelp");
      if (!teacherHelp) throw new Error("dsh-w-teacher-help-me: remote.teacherHelp did not mount");

      async function unwrap(method, args) {
        var result = await teacherHelp[method].apply(teacherHelp, args);
        if (!result.ok) throw new Error("teacherHelp." + method + " failed: " + JSON.stringify(result.error));
        return result.value;
      }

      ctx.slots.inject("custom-plugin.settings", function () {
        return ctx.slots.register({
          name: "custom-plugin.settings",
          key: "dsh-w-teacher-help-me",
          locale: NS,
          inject: function () {
            return {
              getConfig: function () { return unwrap("getConfig", []); },
              saveConfig: function (input) { return unwrap("saveConfig", [input]); },
            };
          },
        }, TeacherSettings);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-teacher-help-me";
    return module.exports;
  },
});
