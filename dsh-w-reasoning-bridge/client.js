window.__ModuleLoader__.load({
  id: "dsh-w-reasoning-bridge",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    var LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
    var MANAGED_COMPAT = ["thinkingFormat", "supportsReasoningEffort", "supportsDeveloperRole"];
    var PRESETS = [
      { id: "openai", label: "OpenAI reasoning_effort", format: "openai", effortField: true, developerRole: false, efforts: { off: "none", minimal: "minimal", low: "low", medium: "medium", high: "high", xhigh: "xhigh", max: "max" } },
      { id: "deepseek", label: "DeepSeek thinking", format: "deepseek", effortField: false, developerRole: false, efforts: { off: null, high: "high" } },
      { id: "openrouter", label: "OpenRouter reasoning", format: "openrouter", effortField: false, developerRole: false, efforts: { off: "none", low: "low", medium: "medium", high: "high", xhigh: "xhigh" } },
      { id: "qwen", label: "Qwen enable_thinking", format: "qwen", effortField: false, developerRole: false, efforts: { off: null, high: "high" } },
      { id: "zai", label: "Z.ai / GLM thinking", format: "zai", effortField: false, developerRole: false, efforts: { off: null, high: "high" } },
      { id: "together", label: "Together reasoning", format: "together", effortField: false, developerRole: false, efforts: { off: null, high: "high" } },
      { id: "string-thinking", label: "thinking 字符串", format: "string-thinking", effortField: false, developerRole: false, efforts: { off: "off", low: "low", medium: "medium", high: "high" } },
      { id: "anthropic", label: "Anthropic 原生 thinking", format: "", effortField: null, developerRole: null, efforts: { off: null, low: "low", medium: "medium", high: "high", max: "max" } },
      { id: "passthrough", label: "仅 reasoning_effort", format: "", effortField: true, developerRole: false, efforts: { off: "none", low: "low", medium: "medium", high: "high" } },
    ];
    var CSS = [
      ".rwb-card{display:flex;flex-direction:column;gap:10px;margin-top:12px;padding:12px;border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary)}",
      ".rwb-head{display:flex;align-items:center;gap:10px}.rwb-copy{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0}",
      ".rwb-title{font-size:13px;line-height:20px;font-weight:600}.rwb-hint{margin:0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}",
      ".rwb-badge{flex:none;padding:2px 8px;border-radius:999px;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);font-size:11px;line-height:18px}",
      ".rwb-badge[data-active=true]{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 12%,transparent);color:var(--dsw-alias-state-business-primary)}",
      ".rwb-button{box-sizing:border-box;height:32px;padding:0 11px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;cursor:pointer}",
      ".rwb-button[data-primary=true]{border-color:transparent;background:var(--dsw-alias-state-business-primary);color:#fff;font-weight:600}.rwb-button:disabled,.rwb-select:disabled{cursor:default;opacity:.5}",
      ".rwb-editor{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;padding:12px;border-radius:10px;background:var(--dsw-alias-bg-layer-2)}",
      ".rwb-field{display:flex;flex-direction:column;gap:5px;min-width:0}.rwb-label{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;font-weight:600}",
      ".rwb-select{box-sizing:border-box;width:100%;height:34px;padding:0 9px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;outline:none;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px}",
      ".rwb-wide{grid-column:1/-1}.rwb-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.rwb-feedback{margin:0;color:var(--dsw-alias-state-success-primary);font-size:12px;line-height:18px}.rwb-feedback[data-error=true]{color:var(--dsw-alias-state-error-primary)}",
      "@media(max-width:720px){.rwb-editor{grid-template-columns:1fr}.rwb-wide{grid-column:auto}}",
    ].join("\n");

    function installStyle() {
      if (typeof document === "undefined") return null;
      var id = "dsh-w-reasoning-bridge/styles";
      var node = document.querySelector("style[data-plugin-css=" + JSON.stringify(id) + "]");
      if (!node) {
        node = document.createElement("style");
        node.dataset.plugin = "dsh-w-reasoning-bridge";
        node.dataset.pluginCss = id;
        document.head.appendChild(node);
      }
      node.textContent = CSS;
      return node;
    }
    function isRecord(value) {
      return !!value && typeof value === "object" && !Array.isArray(value);
    }
    function record(value) {
      return isRecord(value) ? value : {};
    }
    function clone(value) {
      return value === undefined ? undefined : structuredClone(value);
    }
    function profileOf(layer, provider) {
      return record(record(record(layer).providers)[provider]);
    }
    function modelEntry(profile, model) {
      var models = Array.isArray(profile.models) ? profile.models : [];
      var index = models.findIndex(function (entry) { return record(entry).id === model; });
      if (index >= 0) return { kind: "models", value: record(models[index]) };
      return { kind: "override", value: record(record(profile.modelOverrides)[model]) };
    }
    function currentDraft(namespace, provider, model) {
      var value = modelEntry(profileOf(record(namespace).value, provider), model).value;
      var compat = record(value.compat);
      var raw = value.reasoningEfforts;
      return {
        mode: isRecord(raw) && Object.keys(raw).length ? "enabled" : raw === false ? "disabled" : "inherit",
        format: typeof compat.thinkingFormat === "string" ? compat.thinkingFormat : "",
        effortField: typeof compat.supportsReasoningEffort === "boolean" ? compat.supportsReasoningEffort : null,
        developerRole: typeof compat.supportsDeveloperRole === "boolean" ? compat.supportsDeveloperRole : null,
      };
    }
    function configuredModel(previous, preset) {
      var next = clone(previous) || {};
      var compat = Object.assign({}, record(next.compat));
      if (preset === null) {
        delete next.reasoningEfforts;
        MANAGED_COMPAT.forEach(function (field) { delete compat[field]; });
      } else {
        next.reasoningEfforts = Object.assign({}, preset.efforts);
        if (preset.format) compat.thinkingFormat = preset.format;
        else delete compat.thinkingFormat;
        if (typeof preset.effortField === "boolean") compat.supportsReasoningEffort = preset.effortField;
        else delete compat.supportsReasoningEffort;
        if (typeof preset.developerRole === "boolean") compat.supportsDeveloperRole = preset.developerRole;
        else delete compat.supportsDeveloperRole;
      }
      if (Object.keys(compat).length) next.compat = compat;
      else delete next.compat;
      return next;
    }
    function buildOps(namespace, provider, model, preset) {
      var valueProfile = profileOf(record(namespace).value, provider);
      var userProfile = profileOf(record(namespace).user, provider);
      var valueLocation = modelEntry(valueProfile, model);
      var userLocation = modelEntry(userProfile, model);
      var base = ["providers", provider];
      if (valueLocation.kind === "models") {
        var source = Array.isArray(userProfile.models) && userLocation.kind === "models"
          ? clone(userProfile.models) : clone(valueProfile.models);
        var index = source.findIndex(function (entry) { return record(entry).id === model; });
        if (index < 0) throw new Error("模型不在当前提供方的模型列表中。");
        source[index] = configuredModel(record(source[index]), preset);
        return [{ op: "set", path: base.concat(["models"]), value: source }];
      }
      var target = base.concat(["modelOverrides", model]);
      var previous = userLocation.kind === "override" && Object.keys(userLocation.value).length
        ? userLocation.value : valueLocation.value;
      var next = configuredModel(previous, preset);
      return preset === null && Object.keys(next).length === 0
        ? [{ op: "unset", path: target }]
        : [{ op: "set", path: target, value: next }];
    }
    function inferPreset(provider, profile, model) {
      var route = (provider + " " + (profile.baseURL || "")).toLowerCase();
      var id = String(model || "").toLowerCase();
      if (profile.api === "anthropic-messages") return "anthropic";
      if (route.includes("openrouter")) return "openrouter";
      if (route.includes("together")) return "together";
      if (route.includes("zhipu") || route.includes("bigmodel") || route.includes("z.ai")) return "zai";
      if (id.includes("qwen") || id.includes("qwq")) return "qwen";
      if (id.includes("deepseek")) return "deepseek";
      if (id.includes("glm") || id.includes("zai")) return "zai";
      return "openai";
    }
    function messageOf(error) {
      return error instanceof Error ? error.message : String(error);
    }

    function ProviderReasoningCard(props) {
      var t = props.t;
      var providerId = props.provider.provider;
      var stateSlot = React.useState({
        status: "loading", namespace: null, groups: [], writable: false, error: null,
      });
      var state = stateSlot[0], setState = stateSlot[1];
      var modelSlot = React.useState("");
      var model = modelSlot[0], setModel = modelSlot[1];
      var presetSlot = React.useState("openai");
      var presetId = presetSlot[0], setPresetId = presetSlot[1];
      var expandedSlot = React.useState(false);
      var expanded = expandedSlot[0], setExpanded = expandedSlot[1];
      var busySlot = React.useState(false);
      var busy = busySlot[0], setBusy = busySlot[1];
      var feedbackSlot = React.useState(null);
      var feedback = feedbackSlot[0], setFeedback = feedbackSlot[1];
      var mountedRef = React.useRef(true);

      var load = React.useCallback(function (force) {
        setState(function (old) {
          return Object.assign({}, old, { status: "loading", error: null });
        });
        return props.readSnapshot(force).then(function (snapshot) {
          if (!mountedRef.current) return;
          var namespace = (snapshot.settings.namespaces || []).find(function (entry) {
            return entry.ns === "llm-pi-ai";
          });
          if (!namespace) throw new Error(t("missingAdapter"));
          setState({
            status: "ready",
            namespace: namespace,
            groups: snapshot.catalog.groups || [],
            writable: snapshot.settings.writable === true,
            error: null,
          });
        }).catch(function (error) {
          if (!mountedRef.current) return;
          setState(function (old) {
            return Object.assign({}, old, { status: "error", error: messageOf(error) });
          });
        });
      }, [props.readSnapshot, t]);

      React.useEffect(function () {
        mountedRef.current = true;
        void load(false);
        return function () { mountedRef.current = false; };
      }, [load]);

      var profile = state.namespace ? profileOf(state.namespace.value, providerId) : {};
      var group = state.groups.find(function (entry) { return entry.id === providerId; });
      var models = React.useMemo(function () {
        var ids = [];
        if (group) ids = ids.concat(group.models.map(function (entry) { return entry.id; }));
        if (Array.isArray(profile.models)) {
          ids = ids.concat(profile.models.map(function (entry) { return record(entry).id; }));
        }
        ids = ids.concat(Object.keys(record(profile.modelOverrides)));
        return Array.from(new Set(ids.filter(function (id) {
          return typeof id === "string" && id.length > 0;
        })));
      }, [group, profile.models, profile.modelOverrides]);
      var modelsKey = models.join("\u0000");

      React.useEffect(function () {
        setModel(function (selected) {
          return models.includes(selected) ? selected : (models[0] || "");
        });
      }, [modelsKey]);

      var current = state.namespace && model
        ? currentDraft(state.namespace, providerId, model)
        : { mode: "inherit", format: "", effortField: null, developerRole: null };
      var catalogModel = group
        ? group.models.find(function (entry) { return entry.id === model; })
        : undefined;
      var nativeReasoning = current.mode === "inherit" && !!(catalogModel && catalogModel.reasoning);
      var active = current.mode === "enabled" || nativeReasoning;
      var inferred = inferPreset(providerId, profile, model);

      React.useEffect(function () {
        if (!model) return;
        var match = current.mode === "enabled" && PRESETS.find(function (preset) {
          return preset.format === current.format
            && preset.effortField === current.effortField
            && preset.developerRole === current.developerRole;
        });
        setPresetId(match ? match.id : inferred);
      }, [model, current.mode, current.format, current.effortField, current.developerRole, inferred]);

      function write(preset, successText) {
        if (!state.namespace || !model || busy) return;
        setBusy(true);
        setFeedback(null);
        var ops;
        try {
          ops = buildOps(state.namespace, providerId, model, preset);
        } catch (error) {
          setBusy(false);
          setFeedback({ error: true, text: messageOf(error) });
          return;
        }
        props.mutateSettings("llm-pi-ai", ops, state.namespace.revision).then(function (answer) {
          if (!answer.ok) {
            throw new Error(answer.error && answer.error.message
              ? answer.error.message : t("saveFailed"));
          }
          props.invalidateSnapshot();
          setFeedback({ error: false, text: successText });
          return load(true);
        }).catch(function (error) {
          if (!mountedRef.current) return;
          setFeedback({ error: true, text: messageOf(error) });
        }).finally(function () {
          if (mountedRef.current) setBusy(false);
        });
      }

      if (props.provider.settingsNs !== "llm-pi-ai" || !props.configured) return null;
      var badge = state.status === "loading"
        ? t("loading")
        : state.status === "error"
          ? t("loadFailed")
          : current.mode === "disabled"
            ? t("disabled")
            : nativeReasoning
              ? t("native")
              : current.mode === "enabled" ? t("enabled") : t("notEnabled");

      return React.createElement(
        "div",
        { className: "rwb-card" },
        React.createElement(
          "div",
          { className: "rwb-head" },
          React.createElement(
            "div",
            { className: "rwb-copy" },
            React.createElement("span", { className: "rwb-title" }, t("title")),
            React.createElement("p", { className: "rwb-hint" }, t("hint")),
          ),
          React.createElement("span", {
            className: "rwb-badge", "data-active": active || undefined,
          }, badge),
          React.createElement(
            "button",
            {
              type: "button",
              className: "rwb-button",
              disabled: state.status === "loading",
              "aria-expanded": expanded,
              onClick: function () { setExpanded(!expanded); },
            },
            expanded ? t("collapse") : t("configure"),
          ),
        ),
        state.status === "error"
          ? React.createElement(
            "div",
            { className: "rwb-actions" },
            React.createElement("p", {
              className: "rwb-feedback", "data-error": true,
            }, state.error),
            React.createElement(
              "button",
              { type: "button", className: "rwb-button", onClick: function () { void load(true); } },
              t("retry"),
            ),
          )
          : null,
        expanded && state.status !== "error"
          ? React.createElement(
            "div",
            { className: "rwb-editor" },
            React.createElement(
              "label",
              { className: "rwb-field" },
              React.createElement("span", { className: "rwb-label" }, t("model")),
              React.createElement(
                "select",
                {
                  className: "rwb-select",
                  value: model,
                  disabled: busy || models.length === 0,
                  onChange: function (event) {
                    setModel(event.currentTarget.value);
                    setFeedback(null);
                  },
                },
                models.map(function (id) {
                  return React.createElement("option", { value: id, key: id }, id);
                }),
              ),
            ),
            React.createElement(
              "label",
              { className: "rwb-field" },
              React.createElement("span", { className: "rwb-label" }, t("protocol")),
              React.createElement(
                "select",
                {
                  className: "rwb-select",
                  value: presetId,
                  disabled: busy || !state.writable || models.length === 0,
                  onChange: function (event) {
                    setPresetId(event.currentTarget.value);
                    setFeedback(null);
                  },
                },
                PRESETS.map(function (preset) {
                  return React.createElement("option", {
                    value: preset.id, key: preset.id,
                  }, preset.label);
                }),
              ),
            ),
            React.createElement("p", { className: "rwb-hint rwb-wide" }, t("editorHint")),
            models.length === 0
              ? React.createElement("p", {
                className: "rwb-feedback rwb-wide", "data-error": true,
              }, t("noModels"))
              : null,
            !state.writable
              ? React.createElement("p", {
                className: "rwb-feedback rwb-wide", "data-error": true,
              }, t("readOnly"))
              : null,
            feedback
              ? React.createElement("p", {
                className: "rwb-feedback rwb-wide",
                "data-error": feedback.error || undefined,
                role: "status",
              }, feedback.text)
              : null,
            React.createElement(
              "div",
              { className: "rwb-actions rwb-wide" },
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "rwb-button",
                  "data-primary": true,
                  disabled: busy || !state.writable || !model,
                  onClick: function () {
                    var preset = PRESETS.find(function (entry) {
                      return entry.id === presetId;
                    }) || PRESETS[0];
                    write(preset, t("saved"));
                  },
                },
                busy ? t("saving") : active ? t("update") : t("enable"),
              ),
              current.mode !== "inherit"
                ? React.createElement(
                  "button",
                  {
                    type: "button",
                    className: "rwb-button",
                    disabled: busy || !state.writable,
                    onClick: function () { write(null, t("restored")); },
                  },
                  t("restore"),
                )
                : null,
            ),
          )
          : null,
      );
    }

    var NS = "dshWReasoningBridge";
    var inject = ["slots", "locale", "remote", "remote.settings", "remote.session"];
    var dicts = {
      zh: {
        title: "推理等级",
        hint: "启用后直接使用对话输入框里的 DSH 官方选择器。",
        configure: "配置",
        collapse: "收起",
        model: "模型",
        protocol: "中转协议",
        editorHint: "这里只声明模型能力和传输格式；日常的 Off、Low、High 等强度在对话输入框的官方菜单中切换。",
        loading: "读取中",
        loadFailed: "读取失败",
        retry: "重试",
        enabled: "已接入官方 UI",
        native: "官方已支持",
        disabled: "已标记不支持",
        notEnabled: "尚未启用",
        enable: "启用官方推理等级",
        update: "更新官方选项",
        restore: "恢复平台默认",
        saving: "保存中…",
        saved: "已保存。重新打开输入框的模型菜单即可看到“推理等级”。",
        restored: "已恢复平台默认能力声明。",
        missingAdapter: "未找到 llm-pi-ai 设置。",
        saveFailed: "设置写入失败。",
        readOnly: "当前设置存储是只读的。",
        noModels: "这个提供方没有可配置的模型。",
      },
      en: {
        title: "Reasoning effort",
        hint: "Enable it here, then use DSH's official composer selector.",
        configure: "Configure",
        collapse: "Collapse",
        model: "Model",
        protocol: "Gateway protocol",
        editorHint: "This declares capability and wire format. Switch Off, Low, High, and other efforts from the official composer menu.",
        loading: "Loading",
        loadFailed: "Load failed",
        retry: "Retry",
        enabled: "Connected to official UI",
        native: "Natively supported",
        disabled: "Marked unsupported",
        notEnabled: "Not enabled",
        enable: "Enable official effort picker",
        update: "Update official options",
        restore: "Restore platform default",
        saving: "Saving…",
        saved: "Saved. Reopen the composer model menu to see Reasoning effort.",
        restored: "Restored the platform capability declaration.",
        missingAdapter: "The llm-pi-ai settings namespace is unavailable.",
        saveFailed: "Settings write failed.",
        readOnly: "The settings provider is read-only.",
        noModels: "This provider has no configurable models.",
      },
    };

    async function apply(ctx) {
      var style = installStyle();
      ctx.effect(function () {
        return function () { if (style) style.remove(); };
      }, "dsh-w-reasoning-bridge: styles");
      ctx.effect(function () { return ctx.locale.register(NS, dicts); });
      var t = ctx.locale.bind(NS);
      var cached = null;
      var pending = null;

      function unwrap(result, label) {
        if (!result.ok) {
          throw new Error(label + ": " + (result.error && result.error.message
            ? result.error.message : JSON.stringify(result.error)));
        }
        return result.value;
      }
      function readSnapshot(force) {
        if (force) {
          cached = null;
          pending = null;
        }
        if (cached) return Promise.resolve(cached);
        if (pending) return pending;
        pending = Promise.all([
          ctx.remote.settings.describe(),
          ctx.remote.session.modelCatalog(),
        ]).then(function (results) {
          cached = {
            settings: unwrap(results[0], "settings.describe"),
            catalog: unwrap(results[1], "session.modelCatalog"),
          };
          pending = null;
          return cached;
        }, function (error) {
          pending = null;
          throw error;
        });
        return pending;
      }
      function invalidateSnapshot() {
        cached = null;
        pending = null;
      }
      function injected() {
        return {
          t: t,
          readSnapshot: readSnapshot,
          invalidateSnapshot: invalidateSnapshot,
          mutateSettings: function (ns, ops, revision) {
            return ctx.remote.settings.mutate(ns, ops, revision);
          },
        };
      }

      ctx.slots.inject("settings.models.provider-card", function () {
        return ctx.slots.register({
          name: "settings.models.provider-card",
          key: "llm-pi-ai",
          inject: injected,
        }, ProviderReasoningCard);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-reasoning-bridge";
    return module.exports;
  },
});
