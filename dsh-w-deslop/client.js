window.__ModuleLoader__.load({
  id: "dsh-w-deslop",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    var CSS = [
      ".dsl-root{display:flex;flex-direction:column;gap:14px;color:var(--dsw-alias-label-primary);font-size:13px}",
      ".dsl-status{padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);line-height:19px}",
      ".dsl-status[data-kind=warn]{background:color-mix(in srgb,#e8a33a 14%,transparent);color:var(--dsw-alias-label-primary)}",
      ".dsl-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}",
      ".dsl-copy{display:flex;flex-direction:column;gap:2px;min-width:0}",
      ".dsl-title{font-weight:600;line-height:19px}",
      ".dsl-help{margin:0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}",
      ".dsl-switch{flex:none;position:relative;width:36px;height:20px;border:0;border-radius:999px;background:var(--dsw-alias-border-l2);cursor:pointer;padding:0}",
      ".dsl-switch[data-checked=true]{background:var(--dsw-alias-state-business-primary)}",
      ".dsl-switch:disabled{opacity:.5;cursor:default}",
      ".dsl-knob{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .15s}",
      ".dsl-switch[data-checked=true] .dsl-knob{transform:translateX(16px)}",
      ".dsl-field{display:flex;flex-direction:column;gap:5px}",
      ".dsl-label{font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary)}",
      ".dsl-text{box-sizing:border-box;width:100%;min-height:72px;padding:8px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;resize:vertical;outline:none}",
      ".dsl-text:focus-visible{border-color:var(--dsw-alias-state-business-primary)}",
      ".dsl-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
      ".dsl-button{height:30px;padding:0 14px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;cursor:pointer}",
      ".dsl-button[data-primary=true]{border-color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-primary);color:#fff}",
      ".dsl-button:disabled{opacity:.5;cursor:default}",
      ".dsl-hint{margin:0;font-size:12px;color:var(--dsw-alias-label-secondary)}",
      ".dsl-hint[data-kind=error]{color:#d9453d}",
      ".dsl-section{display:flex;flex-direction:column;gap:8px;padding-top:12px;border-top:1px solid var(--dsw-alias-border-l2)}",
      ".dsl-summary{font-weight:600}",
      ".dsl-hits{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;max-height:320px;overflow:auto}",
      ".dsl-hit{padding:6px 8px;border-radius:6px;background:var(--dsw-alias-bg-layer-2);line-height:18px}",
      ".dsl-tag{display:inline-block;margin-right:6px;padding:0 6px;border-radius:4px;font-size:11px;background:var(--dsw-alias-border-l2)}",
      ".dsl-tag[data-severity=high]{background:color-mix(in srgb,#d9453d 18%,transparent);color:#d9453d}",
      ".dsl-excerpt{color:var(--dsw-alias-label-secondary);font-size:12px}",
      ".dsl-preview{margin:0;max-height:260px;overflow:auto;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);white-space:pre-wrap;font:inherit;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}",
    ].join("\n");
    var tagId = "dsh-w-deslop/styles";
    if (typeof document !== "undefined") {
      var styleTag = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]");
      if (styleTag === null) {
        styleTag = document.createElement("style");
        styleTag.dataset.plugin = "dsh-w-deslop";
        styleTag.dataset.pluginCss = tagId;
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = CSS;
    }

    var passthrough = { parse: function (value) { return value; } };
    // Lazy schema factory for official Harness; schema keeps older source builds compatible.
    function jsonCodec() {
      return { mode: "strict", typeSymbol: "json", schema: passthrough, create: function () { return passthrough; } };
    }
    function parameter(name) {
      return { name: name, wire: name, source: "json", codec: jsonCodec() };
    }
    function descriptor(method, parameters) {
      return {
        id: "dsh-w-deslop#deslopWriter/" + method,
        service: "deslopWriter",
        namespace: "deslopWriter",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: jsonCodec(),
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-deslop",
      descriptors: [
        descriptor("getState"),
        descriptor("saveConfig", [parameter("input")]),
        descriptor("previewScan", [parameter("text")]),
      ],
    };

    function listText(words) { return Array.isArray(words) ? words.join("\n") : ""; }

    function Switch(props) {
      return React.createElement(
        "button",
        {
          type: "button", role: "switch", className: "dsl-switch",
          "aria-checked": props.checked, "aria-label": props.label,
          "data-checked": props.checked ? "true" : "false",
          disabled: props.disabled,
          onClick: function () { props.onChange(!props.checked); },
        },
        React.createElement("span", { className: "dsl-knob" }),
      );
    }

    function ToggleRow(props) {
      return React.createElement(
        "div",
        { className: "dsl-row" },
        React.createElement(
          "div",
          { className: "dsl-copy" },
          React.createElement("span", { className: "dsl-title" }, props.title),
          React.createElement("p", { className: "dsl-help" }, props.help),
        ),
        React.createElement(Switch, { checked: props.checked, label: props.title, disabled: props.disabled, onChange: props.onChange }),
      );
    }

    function DeslopSettings(props) {
      var getState = props.getState;
      var saveConfig = props.saveConfig;
      var previewScan = props.previewScan;
      var t = props.t;

      var loadSlot = React.useState({ status: "loading", novelPluginAvailable: false, promptPreview: "" });
      var load = loadSlot[0];
      var setLoad = loadSlot[1];
      var formSlot = React.useState(null);
      var form = formSlot[0];
      var setForm = formSlot[1];
      var busySlot = React.useState(false);
      var busy = busySlot[0];
      var setBusy = busySlot[1];
      var hintSlot = React.useState(null);
      var hint = hintSlot[0];
      var setHint = hintSlot[1];
      var sampleSlot = React.useState("");
      var sample = sampleSlot[0];
      var setSample = sampleSlot[1];
      var reportSlot = React.useState(null);
      var report = reportSlot[0];
      var setReport = reportSlot[1];
      var previewSlot = React.useState(false);
      var showPrompt = previewSlot[0];
      var setShowPrompt = previewSlot[1];

      function accept(state) {
        var config = state.config || {};
        setLoad({ status: "ready", novelPluginAvailable: state.novelPluginAvailable === true, promptPreview: state.promptPreview || "" });
        setForm({
          enabled: config.enabled !== false,
          strict: config.strict === true,
          autoCheck: config.autoCheck !== false,
          extraBanned: listText(config.extraBanned),
          whitelist: listText(config.whitelist),
        });
      }

      React.useEffect(function () {
        var alive = true;
        getState().then(
          function (state) { if (alive) accept(state); },
          function (error) {
            if (!alive) return;
            console.error("dsh-w-deslop: getState failed:", error);
            setLoad({ status: "error", novelPluginAvailable: false, promptPreview: "" });
          },
        );
        return function () { alive = false; };
      }, [getState]);

      function edit(field, value) {
        setForm(function (current) {
          var next = Object.assign({}, current);
          next[field] = value;
          return next;
        });
        setHint(null);
      }

      function onSave() {
        setBusy(true);
        setHint(null);
        saveConfig({
          enabled: form.enabled,
          strict: form.strict,
          autoCheck: form.autoCheck,
          extraBanned: form.extraBanned,
          whitelist: form.whitelist,
        }).then(
          function (state) { setBusy(false); accept(state); setHint({ kind: "success", text: t("saved") }); },
          function (error) { setBusy(false); setHint({ kind: "error", text: error && error.message ? error.message : t("error") }); },
        );
      }

      function onScan() {
        setBusy(true);
        setHint(null);
        previewScan(sample).then(
          function (result) { setBusy(false); setReport(result); },
          function (error) { setBusy(false); setHint({ kind: "error", text: error && error.message ? error.message : t("error") }); },
        );
      }

      if (load.status === "loading" || form === null && load.status !== "error") return React.createElement("p", { className: "dsl-hint" }, t("loading"));
      if (load.status === "error") return React.createElement("p", { className: "dsl-hint", "data-kind": "error" }, t("error"));

      return React.createElement(
        "div",
        { className: "dsl-root" },
        React.createElement(
          "p",
          { className: "dsl-status", "data-kind": load.novelPluginAvailable ? undefined : "warn" },
          load.novelPluginAvailable ? t("statusReady") : t("statusMissing"),
        ),
        React.createElement(ToggleRow, { title: t("enabled"), help: t("enabledHelp"), checked: form.enabled, disabled: busy, onChange: function (v) { edit("enabled", v); } }),
        React.createElement(ToggleRow, { title: t("strict"), help: t("strictHelp"), checked: form.strict, disabled: busy, onChange: function (v) { edit("strict", v); } }),
        React.createElement(ToggleRow, { title: t("autoCheck"), help: t("autoCheckHelp"), checked: form.autoCheck, disabled: busy, onChange: function (v) { edit("autoCheck", v); } }),
        React.createElement(
          "label",
          { className: "dsl-field" },
          React.createElement("span", { className: "dsl-label" }, t("extraBanned")),
          React.createElement("textarea", { className: "dsl-text", value: form.extraBanned, disabled: busy, spellCheck: false, placeholder: t("listPlaceholder"), onChange: function (event) { edit("extraBanned", event.currentTarget.value); } }),
        ),
        React.createElement(
          "label",
          { className: "dsl-field" },
          React.createElement("span", { className: "dsl-label" }, t("whitelist")),
          React.createElement("textarea", { className: "dsl-text", value: form.whitelist, disabled: busy, spellCheck: false, placeholder: t("whitelistPlaceholder"), onChange: function (event) { edit("whitelist", event.currentTarget.value); } }),
        ),
        React.createElement(
          "div",
          { className: "dsl-actions" },
          React.createElement("button", { type: "button", className: "dsl-button", "data-primary": "true", disabled: busy, onClick: onSave }, busy ? t("saving") : t("save")),
          React.createElement("button", { type: "button", className: "dsl-button", onClick: function () { setShowPrompt(!showPrompt); } }, showPrompt ? t("hidePrompt") : t("showPrompt")),
          hint !== null ? React.createElement("p", { className: "dsl-hint", "data-kind": hint.kind }, hint.text) : null,
        ),
        showPrompt ? React.createElement("pre", { className: "dsl-preview" }, load.promptPreview) : null,
        React.createElement(
          "div",
          { className: "dsl-section" },
          React.createElement("span", { className: "dsl-title" }, t("tryTitle")),
          React.createElement("p", { className: "dsl-help" }, t("tryHelp")),
          React.createElement("textarea", { className: "dsl-text", style: { minHeight: "120px" }, value: sample, disabled: busy, spellCheck: false, placeholder: t("tryPlaceholder"), onChange: function (event) { setSample(event.currentTarget.value); } }),
          React.createElement(
            "div",
            { className: "dsl-actions" },
            React.createElement("button", { type: "button", className: "dsl-button", disabled: busy || sample.trim() === "", onClick: onScan }, t("scan")),
          ),
          report !== null ? React.createElement(ScanReport, { report: report, t: t }) : null,
        ),
      );
    }

    function ScanReport(props) {
      var report = props.report;
      var t = props.t;
      var summary = report.summary;
      var stats = report.stats;
      return React.createElement(
        React.Fragment,
        null,
        React.createElement("span", { className: "dsl-summary" },
          t("reportSummary").replace("{verdict}", summary.verdict).replace("{chars}", summary.chars).replace("{high}", summary.high).replace("{advise}", summary.advise)),
        React.createElement("p", { className: "dsl-help" },
          t("reportStats").replace("{avg}", stats.averageSentence).replace("{short}", Math.round(stats.shortSentenceRatio * 100)).replace("{weak}", stats.weakAdverbsPerThousand).replace("{dialogue}", Math.round(stats.dialogueRatio * 100))),
        report.hits.length === 0
          ? React.createElement("p", { className: "dsl-hint" }, t("reportClean"))
          : React.createElement(
            "ul",
            { className: "dsl-hits" },
            report.hits.map(function (hit, index) {
              return React.createElement(
                "li",
                { className: "dsl-hit", key: hit.rule + ":" + hit.line + ":" + index },
                React.createElement("span", { className: "dsl-tag", "data-severity": hit.severity }, hit.severity === "high" ? t("high") : t("advise")),
                React.createElement("span", null, t("line").replace("{line}", hit.line) + " " + hit.label + (hit.match ? "「" + hit.match + "」" : "")),
                React.createElement("div", { className: "dsl-excerpt" }, hit.excerpt),
                React.createElement("div", { className: "dsl-excerpt" }, "→ " + hit.fix),
              );
            }),
          ),
      );
    }

    var NS = "dshWDeslop";
    var inject = ["slots", "locale", "remote"];
    var dicts = {
      zh: {
        statusReady: "小说插件已启用。去AI味只在用 /write 联动了小说的对话里生效，其他对话不受影响。",
        statusMissing: "没有检测到小说插件（dsh-w-noval-write），去AI味目前不会生效。安装并启用小说插件后自动联动。",
        enabled: "启用去AI味",
        enabledHelp: "关闭后不再注入写作规则，/deslop 和扫描工具也会停用。",
        strict: "严格模式",
        strictHelp: "额外禁止用破折号和省略号造停顿。喜欢用这两个符号的话保持关闭。",
        autoCheck: "保存前自查",
        autoCheckHelp: "让模型在保存章节前先扫描正文，把必改项处理完再保存。",
        extraBanned: "自定义禁用词（每行一个）",
        listPlaceholder: "例如：\n不由分说\n霸气侧漏",
        whitelist: "白名单（每行一个，这些词不再报）",
        whitelistPlaceholder: "例如：\n淡淡\n这一刻",
        save: "保存",
        saving: "保存中…",
        saved: "已保存，下一次模型请求开始生效。",
        showPrompt: "查看注入的规则",
        hidePrompt: "收起规则",
        tryTitle: "试扫一段文字",
        tryHelp: "粘贴一段正文，看看会命中哪些问题。只在本地扫描，不发给模型。",
        tryPlaceholder: "把一段正文粘贴到这里…",
        scan: "扫描",
        reportSummary: "{verdict}：{chars} 字，必改 {high} 处，建议复核 {advise} 处",
        reportStats: "叙述句平均 {avg} 字，短句占比 {short}%，弱化副词每千字 {weak} 个，对话占比 {dialogue}%",
        reportClean: "没有命中。仍建议通读一遍，看有没有作者跳出来解释的句子。",
        high: "必改",
        advise: "复核",
        line: "第{line}行",
        loading: "正在读取…",
        error: "操作失败。",
      },
      en: {
        statusReady: "The novel plugin is enabled. Deslop only applies in conversations linked to a novel with /write.",
        statusMissing: "dsh-w-noval-write was not found, so deslop is inactive. It links automatically once the novel plugin is enabled.",
        enabled: "Enable deslop",
        enabledHelp: "When off, no writing rules are injected and /deslop and the scan tool stop working.",
        strict: "Strict mode",
        strictHelp: "Also bans em dashes and ellipses used as pauses.",
        autoCheck: "Check before saving",
        autoCheckHelp: "The model scans a chapter and fixes the must-fix hits before saving it.",
        extraBanned: "Extra banned words (one per line)",
        listPlaceholder: "One word per line",
        whitelist: "Allow list (one per line, never reported)",
        whitelistPlaceholder: "One word per line",
        save: "Save",
        saving: "Saving…",
        saved: "Saved. Applies from the next model request.",
        showPrompt: "Show injected rules",
        hidePrompt: "Hide rules",
        tryTitle: "Try a passage",
        tryHelp: "Paste prose to see what it flags. Scanned locally, never sent to a model.",
        tryPlaceholder: "Paste prose here…",
        scan: "Scan",
        reportSummary: "{verdict}: {chars} chars, {high} must-fix, {advise} to review",
        reportStats: "Average narrative sentence {avg} chars, short sentences {short}%, weak adverbs {weak} per 1000, dialogue {dialogue}%",
        reportClean: "No hits. Still read it through for narrator explanations.",
        high: "Must fix",
        advise: "Review",
        line: "Line {line}",
        loading: "Loading…",
        error: "Operation failed.",
      },
    };

    async function apply(ctx) {
      ctx.effect(function () { return ctx.locale.register(NS, dicts); });
      var unmount = await ctx.remote.$mount(TYPERT_REMOTE);
      ctx.effect(function () { return unmount; }, "dsh-w-deslop: remote");
      var deslopWriter = ctx.get("remote.deslopWriter");
      if (!deslopWriter) throw new Error("dsh-w-deslop: remote.deslopWriter did not mount");

      async function unwrap(method, args) {
        var result = await deslopWriter[method].apply(deslopWriter, args);
        if (!result.ok) throw new Error("deslopWriter." + method + " failed: " + JSON.stringify(result.error));
        return result.value;
      }

      ctx.slots.inject("custom-plugin.settings", function () {
        return ctx.slots.register({
          name: "custom-plugin.settings",
          key: "dsh-w-deslop",
          locale: NS,
          inject: function () {
            return {
              getState: function () { return unwrap("getState", []); },
              saveConfig: function (input) { return unwrap("saveConfig", [input]); },
              previewScan: function (text) { return unwrap("previewScan", [text]); },
            };
          },
        }, DeslopSettings);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-deslop";
    return module.exports;
  },
});
