window.__ModuleLoader__.load({
  id: "dsh-w-vision",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    // ---- stylesheet (package-scoped) ----
    var CSS = [
      ".v-root{display:flex;flex-direction:column;gap:8px}",
      ".v-field{display:flex;flex-direction:column;gap:4px}",
      ".v-label{font-size:12px;font-weight:600;line-height:17px}",
      ".v-input{box-sizing:border-box;width:100%;padding:6px 9px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:7px;color:var(--dsw-alias-label-primary);font-family:var(--ds-font-family-code);font-size:12px;line-height:18px;outline:none}",
      ".v-input:focus-visible{border-color:var(--dsw-alias-state-business-primary)}",
      ".v-actions{display:flex;align-items:center;gap:9px}",
      ".v-save{font:inherit;cursor:pointer;border-radius:7px;padding:5px 14px;font-size:12px;line-height:18px;border:1px solid transparent;background:var(--dsw-alias-state-business-primary);color:#fff}",
      ".v-save:disabled{cursor:default;opacity:.55}",
      ".v-hint{font-size:12px;line-height:17px;margin:0;color:var(--dsw-alias-label-tertiary)}",
      ".v-hint[data-kind=error]{color:var(--dsw-alias-state-danger-primary,#c33)}",
      ".v-hint[data-kind=success]{color:var(--dsw-alias-state-success-primary)}",
    ].join("\n");
    var tagId = "dsh-w-vision/styles";
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
      var styleTag = document.createElement("style");
      styleTag.dataset.plugin = "dsh-w-vision";
      styleTag.dataset.pluginCss = tagId;
      styleTag.textContent = CSS;
      document.head.appendChild(styleTag);
    }

    // ---- Remote contribution (client face of the Host `vision` service) ----
    var passthrough = { parse: function (v) { return v; } };
    function parameter(name) {
      return { name: name, wire: name, source: "json", codec: { mode: "strict", typeSymbol: "json", schema: passthrough } };
    }
    function descriptor(method, parameters) {
      return {
        id: "dsh-w-vision#vision/" + method,
        service: "vision",
        namespace: "vision",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: { mode: "strict", typeSymbol: "json", schema: passthrough },
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-vision",
      descriptors: [
        descriptor("getConfig"),
        descriptor("saveConfig", [parameter("input")]),
      ],
    };

    // ---- settings form component (rendered inside the card via the protocol) ----
    function VisionSettings(props) {
      var getConfig = props.getConfig;
      var saveConfig = props.saveConfig;
      var t = props.t;

      var dataSlot = React.useState({ status: "loading" });
      var data = dataSlot[0];
      var setData = dataSlot[1];
      var baseSlot = React.useState("");
      var base = baseSlot[0];
      var setBase = baseSlot[1];
      var apikeySlot = React.useState("");
      var apikey = apikeySlot[0];
      var setApikey = apikeySlot[1];
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
          function (cfg) {
            if (!alive) return;
            setBase(cfg.base || "");
            setApikey(cfg.apikey || "");
            setModel(cfg.modelname || "");
            setData({ status: "ready" });
          },
          function (err) {
            if (!alive) return;
            console.error("dsh-w-vision: getConfig failed:", err);
            setData({ status: "error" });
          },
        );
        return function () { alive = false; };
      }, [getConfig]);

      function onSave() {
        setSaving(true);
        setHint(null);
        saveConfig({ base: base, apikey: apikey, modelname: model }).then(
          function () {
            setSaving(false);
            setHint({ kind: "success", text: t("saved") });
          },
          function (err) {
            setSaving(false);
            setHint({ kind: "error", text: (err && err.message) ? err.message : t("error") });
          },
        );
      }

      if (data.status === "loading") return React.createElement("p", { className: "v-hint" }, t("loading"));
      if (data.status === "error") {
        return React.createElement(
          "div",
          { className: "v-actions" },
          React.createElement("p", { className: "v-hint", "data-kind": "error" }, t("error")),
        );
      }

      return React.createElement(
        "div",
        { className: "v-root" },
        React.createElement(
          "div",
          { className: "v-field" },
          React.createElement("label", { className: "v-label" }, t("baseLabel")),
          React.createElement("input", {
            className: "v-input",
            type: "text",
            value: base,
            spellCheck: false,
            placeholder: "https://your-relay.example",
            onChange: function (event) { setBase(event.currentTarget.value); },
          }),
        ),
        React.createElement(
          "div",
          { className: "v-field" },
          React.createElement("label", { className: "v-label" }, t("apikeyLabel")),
          React.createElement("input", {
            className: "v-input",
            type: "password",
            value: apikey,
            spellCheck: false,
            autoComplete: "off",
            placeholder: "sk-...",
            onChange: function (event) { setApikey(event.currentTarget.value); },
          }),
        ),
        React.createElement(
          "div",
          { className: "v-field" },
          React.createElement("label", { className: "v-label" }, t("modelLabel")),
          React.createElement("input", {
            className: "v-input",
            type: "text",
            value: model,
            spellCheck: false,
            placeholder: "gpt-5.6-sol",
            onChange: function (event) { setModel(event.currentTarget.value); },
          }),
        ),
        React.createElement(
          "div",
          { className: "v-actions" },
          React.createElement(
            "button",
            { type: "button", className: "v-save", disabled: saving, onClick: onSave },
            saving ? t("saving") : t("save"),
          ),
          hint !== null
            ? React.createElement("p", { className: "v-hint", "data-kind": hint.kind }, hint.text)
            : null,
        ),
      );
    }

    // ---- plugin ----
    var NS = "dshWVision";
    var inject = ["slots", "locale", "remote"];

    var dicts = {
      zh: {
        baseLabel: "API Base URL",
        apikeyLabel: "API Key",
        modelLabel: "\u6a21\u578b\u540d",
        save: "\u4fdd\u5b58",
        saving: "\u4fdd\u5b58\u4e2d\u2026",
        saved: "\u5df2\u4fdd\u5b58",
        loading: "\u6b63\u5728\u8bfb\u53d6\u2026",
        error: "\u64cd\u4f5c\u5931\u8d25\u3002",
      },
      en: {
        baseLabel: "API Base URL",
        apikeyLabel: "API Key",
        modelLabel: "Model name",
        save: "Save",
        saving: "Saving\u2026",
        saved: "Saved",
        loading: "Loading\u2026",
        error: "Operation failed.",
      },
    };

    async function apply(ctx) {
      ctx.effect(function () { return ctx.locale.register(NS, dicts); });
      var t = ctx.locale.bind(NS);

      var unmount = await ctx.remote.$mount(TYPERT_REMOTE);
      ctx.effect(function () { return unmount; }, "dsh-w-vision: remote");

      var vision = ctx.get("remote.vision");
      if (!vision) throw new Error("dsh-w-vision: remote.vision did not mount");

      async function unwrap(method, args) {
        var result = await vision[method].apply(vision, args);
        if (!result.ok) throw new Error("vision." + method + " failed: " + JSON.stringify(result.error));
        return result.value;
      }

      function injected() {
        return {
          getConfig: function () { return unwrap("getConfig", []); },
          saveConfig: function (input) { return unwrap("saveConfig", [input]); },
        };
      }

      // Settings protocol: register the settings form under this package's own
      // name, so dsh-w-custom-plugins shows the gear icon on our card.
      ctx.slots.inject("custom-plugin.settings", function () {
        return ctx.slots.register({
          name: "custom-plugin.settings",
          key: "dsh-w-vision",
          locale: NS,
          inject: injected,
        }, VisionSettings);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-vision";
    return module.exports;
  },
});
