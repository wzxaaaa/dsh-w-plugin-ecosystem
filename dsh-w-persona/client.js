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
      ".pw-title-row{display:flex;align-items:center;justify-content:space-between;gap:12px}",
      ".pw-title{font-size:14px;font-weight:600;line-height:20px;margin:0}",
      ".pw-default{box-sizing:border-box;width:100%;margin:0;padding:12px 14px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:8px;font-family:var(--ds-font-family-code);font-size:12px;line-height:19px;color:var(--dsw-alias-label-secondary);white-space:pre-wrap;word-break:break-word;max-height:220px;overflow:auto}",
      ".pw-field{position:relative;display:flex;flex-direction:column;gap:6px}",
      ".pw-field-head{display:flex;align-items:center;justify-content:space-between;gap:8px}",
      ".pw-field-label{font-size:13px;font-weight:600;line-height:19px}",
      ".pw-reset{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);border-radius:7px;cursor:pointer;font-size:15px;line-height:1;padding:0}",
      ".pw-reset:hover,.pw-secondary:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
      ".pw-reset:disabled,.pw-secondary:disabled{cursor:default;opacity:.5}",
      ".pw-input{box-sizing:border-box;width:100%;min-height:200px;resize:vertical;padding:10px 12px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:8px;color:var(--dsw-alias-label-primary);font-family:var(--ds-font-family-code);font-size:12px;line-height:19px;outline:none}",
      ".pw-input:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-business-primary) 18%,transparent)}",
      ".pw-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
      ".pw-save{font:inherit;cursor:pointer;border-radius:8px;padding:6px 16px;font-size:13px;line-height:20px;border:1px solid transparent;background:var(--dsw-alias-state-business-primary);color:#fff}",
      ".pw-save:disabled{cursor:default;opacity:.55}",
      ".pw-secondary{font:inherit;cursor:pointer;border-radius:7px;padding:4px 10px;font-size:12px;line-height:18px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary)}",
      ".pw-hint{font-size:12px;line-height:18px;margin:0;color:var(--dsw-alias-label-tertiary)}",
      ".pw-empty{font-size:13px;color:var(--dsw-alias-label-tertiary);margin:0}",
      ".pw-status{display:flex;flex-direction:column;gap:5px;padding:10px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}",
      ".pw-status-line{display:flex;align-items:flex-start;gap:7px}",
      ".pw-dot{width:7px;height:7px;margin-top:5px;border-radius:50%;flex:0 0 auto;background:var(--dsw-alias-label-tertiary)}",
      ".pw-dot-active{background:var(--dsw-alias-state-business-primary)}",
      ".pw-path{font-family:var(--ds-font-family-code);word-break:break-all;color:var(--dsw-alias-label-tertiary)}",
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
        descriptor("refreshDefault"),
      ],
    };

    function normalizeState(state) {
      return {
        status: "ready",
        current: typeof state.current === "string" ? state.current : "",
        defaultText: typeof state.defaultText === "string" ? state.defaultText : "",
        hasOverride: state.hasOverride === true,
        canRefreshDefault: state.canRefreshDefault === true,
        diagnostics: state.diagnostics || null,
      };
    }

    // ---- section component ----
    function PersonaSection(props) {
      var getState = props.getState;
      var save = props.save;
      var refreshDefault = props.refreshDefault;
      var t = props.t;

      var dataSlot = React.useState({ status: "loading", current: "", defaultText: "", hasOverride: false, canRefreshDefault: false, diagnostics: null });
      var data = dataSlot[0];
      var setData = dataSlot[1];
      var textSlot = React.useState("");
      var text = textSlot[0];
      var setText = textSlot[1];
      var savingSlot = React.useState(false);
      var saving = savingSlot[0];
      var setSaving = savingSlot[1];
      var refreshingSlot = React.useState(false);
      var refreshing = refreshingSlot[0];
      var setRefreshing = refreshingSlot[1];
      var hintSlot = React.useState(null);
      var hint = hintSlot[0];
      var setHint = hintSlot[1];
      var mountedRef = React.useRef(true);
      var loadSeq = React.useRef(0);
      var editSeq = React.useRef(0);
      var saveBusyRef = React.useRef(false);
      var refreshBusyRef = React.useRef(false);

      var load = React.useCallback(function () {
        var requestId = loadSeq.current + 1;
        var editAtStart = editSeq.current;
        loadSeq.current = requestId;
        setData(function (previous) { return Object.assign({}, previous, { status: "loading" }); });
        getState().then(
          function (state) {
            if (!mountedRef.current || requestId !== loadSeq.current) return;
            setData(normalizeState(state));
            if (editSeq.current === editAtStart) setText(state.current);
            setHint(null);
          },
          function (err) {
            if (!mountedRef.current || requestId !== loadSeq.current) return;
            console.error("dsh-w-persona: getState failed:", err);
            setData({ status: "error", current: "", defaultText: "", hasOverride: false, canRefreshDefault: false, diagnostics: null });
          },
        );
      }, [getState]);

      React.useEffect(function () {
        mountedRef.current = true;
        return function () {
          mountedRef.current = false;
          loadSeq.current += 1;
          saveBusyRef.current = false;
          refreshBusyRef.current = false;
        };
      }, []);

      React.useEffect(function () { load(); }, [load]);

      function onSave() {
        if (saveBusyRef.current || refreshBusyRef.current) return;
        saveBusyRef.current = true;
        var savedText = text;
        var editAtStart = editSeq.current;
        setSaving(true);
        save(savedText).then(
          function (state) {
            saveBusyRef.current = false;
            if (!mountedRef.current) return;
            setSaving(false);
            setData(normalizeState(state));
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

      function onRefreshDefault() {
        if (refreshBusyRef.current || saveBusyRef.current) return;
        if (!data.canRefreshDefault) {
          setHint(t("refreshBlocked"));
          return;
        }
        refreshBusyRef.current = true;
        var editAtStart = editSeq.current;
        setRefreshing(true);
        refreshDefault().then(
          function (state) {
            refreshBusyRef.current = false;
            if (!mountedRef.current) return;
            setRefreshing(false);
            setData(normalizeState(state));
            if (editSeq.current === editAtStart) setText(state.current);
            setHint(state.refreshed ? t("refreshed") : t("refreshBlocked"));
          },
          function (err) {
            refreshBusyRef.current = false;
            if (!mountedRef.current) return;
            setRefreshing(false);
            console.error("dsh-w-persona: refreshDefault failed:", err);
            setHint(t("error"));
          },
        );
      }

      function onReset() {
        editSeq.current += 1;
        setText(data.defaultText);
        setHint(null);
      }

      function assemblyMessage(lastAssembly) {
        if (!lastAssembly) return t("assemblyNone");
        if (!lastAssembly.customActive) return t("assemblyDefault");
        if (lastAssembly.inserted) return t("assemblyInserted");
        if (lastAssembly.applied) return t("assemblyReplaced");
        return t("assemblyUnavailable");
      }

      var ready = data.status === "ready";
      var busy = saving || refreshing;
      var dirty = ready && text !== data.current;
      var diagnostics = data.diagnostics || {};

      return React.createElement(
        "div",
        { className: "pw-root" },
        data.status === "loading" ? React.createElement("p", { className: "pw-empty" }, t("loading")) : null,
        data.status === "error"
          ? React.createElement(
              "div",
              { className: "pw-actions" },
              React.createElement("p", { className: "pw-empty", role: "alert" }, t("error")),
              React.createElement("button", { type: "button", className: "pw-secondary", onClick: load }, t("retry")),
            )
          : null,
        ready
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "div",
                { className: "pw-status", "aria-live": "polite" },
                React.createElement(
                  "div",
                  { className: "pw-status-line" },
                  React.createElement("span", { className: "pw-dot " + (data.hasOverride ? "pw-dot-active" : "") }),
                  React.createElement("span", null, data.hasOverride ? t("overrideActive") : t("overrideDefault")),
                ),
                React.createElement(
                  "div",
                  { className: "pw-status-line" },
                  React.createElement("span", { className: "pw-dot " + (diagnostics.lastAssembly && diagnostics.lastAssembly.applied ? "pw-dot-active" : "") }),
                  React.createElement("span", null, assemblyMessage(diagnostics.lastAssembly)),
                ),
                diagnostics.patchPath
                  ? React.createElement("div", { className: "pw-path", title: diagnostics.patchPath }, t("patchPath") + ": " + diagnostics.patchPath)
                  : null,
              ),
              React.createElement(
                "div",
                { className: "pw-block" },
                React.createElement(
                  "div",
                  { className: "pw-title-row" },
                  React.createElement("h3", { className: "pw-title" }, t("defaultTitle")),
                  React.createElement(
                    "button",
                    {
                      type: "button",
                      className: "pw-secondary",
                      title: data.canRefreshDefault ? t("refreshHelp") : t("refreshBlocked"),
                      disabled: busy || !data.canRefreshDefault,
                      onClick: onRefreshDefault,
                    },
                    refreshing ? t("refreshing") : t("refreshDefault"),
                  ),
                ),
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
                        disabled: busy || text === data.defaultText,
                        onClick: onReset,
                      },
                      "\u21ba",
                    ),
                  ),
                  React.createElement("textarea", {
                    className: "pw-input",
                    value: text,
                    disabled: busy,
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
                    { type: "button", className: "pw-save", disabled: busy || !dirty, onClick: onSave },
                    saving ? t("saving") : t("save"),
                  ),
                  hint !== null ? React.createElement("p", { className: "pw-hint", role: "status" }, hint) : null,
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
        nav: "人设",
        defaultTitle: "Harness 默认提示词",
        fieldLabel: "System 提示词",
        resetAria: "重置为默认提示词",
        save: "保存",
        saving: "保存中…",
        applied: "已保存，将从下一次模型请求开始生效",
        savedRestart: "已保存，重启后生效",
        loading: "正在读取…",
        error: "操作失败。",
        retry: "重试",
        emptyDefault: "（空）",
        refreshDefault: "刷新默认",
        refreshing: "刷新中…",
        refreshed: "Harness 默认提示词已刷新",
        refreshHelp: "从当前 system-prompt 配置重新读取 Harness 默认提示词",
        refreshBlocked: "当前存在自定义覆盖，请先重置为默认并保存",
        overrideActive: "当前使用自定义人设覆盖",
        overrideDefault: "当前使用 Harness 默认人设",
        assemblyNone: "尚未发生模型提示词装配",
        assemblyReplaced: "最近一次请求已将 Persona 置于 system prompt 第一段",
        assemblyInserted: "最近一次请求已在 system prompt 最前面插入 Persona",
        assemblyDefault: "最近一次请求未启用自定义 Persona",
        assemblyUnavailable: "最近一次提示词装配中无法应用 Persona",
        patchPath: "配置文件",
      },
      en: {
        nav: "Persona",
        defaultTitle: "Harness default prompt",
        fieldLabel: "System prompt",
        resetAria: "Reset to default prompt",
        save: "Save",
        saving: "Saving…",
        applied: "Saved; it will apply from the next model request",
        savedRestart: "Saved. Restart to apply.",
        loading: "Loading…",
        error: "Operation failed.",
        retry: "Retry",
        emptyDefault: "(empty)",
        refreshDefault: "Refresh default",
        refreshing: "Refreshing…",
        refreshed: "Harness default prompt refreshed",
        refreshHelp: "Read the Harness default prompt again from the active system-prompt configuration",
        refreshBlocked: "A custom override is active. Reset to default and save first.",
        overrideActive: "Using a custom persona override",
        overrideDefault: "Using the Harness default persona",
        assemblyNone: "No model prompt assembly has occurred yet",
        assemblyReplaced: "The latest request moved Persona to the first system-prompt section",
        assemblyInserted: "The latest request inserted Persona at the very front of the system prompt",
        assemblyDefault: "The latest request used no custom Persona override",
        assemblyUnavailable: "Persona could not be applied during the latest assembly",
        patchPath: "Config file",
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
          refreshDefault: function () { return unwrap("refreshDefault", []); },
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
