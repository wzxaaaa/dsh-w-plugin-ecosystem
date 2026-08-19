window.__ModuleLoader__.load({
  id: "dsh-w-assistant-refresh",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");
    var primitives = require("@deepseek-ai/dsh-client-ui-primitives");
    var IconRefreshOutline16 = primitives.IconRefreshOutline16;
    var Tooltip = primitives.Tooltip;

    var NS = "assistantRefresh";
    var CSS = [
      ".dshwar-slot{display:inline-flex;align-items:center;order:1}",
      "[data-slot=\"conversation.chat.assistant-actions\"]~span{order:2!important}",
      ".dshwar-action{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:6px;border:0;border-radius:28px;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer}",
      ".dshwar-action:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}",
      ".dshwar-action[data-unavailable]{cursor:default;opacity:.4}",
      ".dshwar-action[data-unavailable]:hover{background:transparent;color:var(--dsw-alias-label-tertiary)}",
      ".dshwar-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    ].join("\n");

    var zh = {
      refresh: "刷新回复",
      refreshing: "正在刷新回复…",
      running: "请等待当前请求完成",
      failed: "刷新失败",
    };
    var en = {
      refresh: "Refresh reply",
      refreshing: "Refreshing reply…",
      running: "Wait for the current request to finish",
      failed: "Refresh failed",
    };

    // --- hidden chat-row manager ------------------------------------------
    // Same-session regeneration replaces the model surface, but the client
    // transcript still folds every append-origin event. The host computes the
    // exact chat-row keys that were shadowed plus the wake-up trigger rows,
    // and this client hides those rows with generated CSS. Rules are scoped
    // to the currently viewed session because row keys (e.g. assistant-step
    // turn:step) repeat across sessions.
    var hiddenBySession = new Map();   // sessionId -> Set<key>
    var fetchedSessions = new Set();   // sessionIds already asked the host
    var hideStyleNode = null;
    var appCtx = null;

    function ensureHideStyle() {
      if (hideStyleNode !== null) return;
      var selector = 'style[data-plugin-css="dsh-w-assistant-refresh/hide"]';
      var existing = document.querySelector(selector);
      if (existing) { hideStyleNode = existing; return; }
      var node = document.createElement("style");
      node.dataset.plugin = "dsh-w-assistant-refresh";
      node.dataset.pluginCss = "dsh-w-assistant-refresh/hide";
      document.head.appendChild(node);
      hideStyleNode = node;
    }

    function currentSessionId() {
      if (appCtx === null) return undefined;
      var state = appCtx.sessions.list.getSnapshot();
      return state === undefined ? undefined : state.current;
    }

    function cssEscapeKey(key) {
      return String(key).replace(/["\\]/g, function (ch) { return "\\" + ch; });
    }

    function rebuildHideStyle() {
      if (hideStyleNode === null) return;
      var current = currentSessionId();
      var keys = current === undefined ? [] : Array.from(hiddenBySession.get(current) || []);
      hideStyleNode.textContent = keys
        .map(function (key) { return '[data-chat-flow-key="' + cssEscapeKey(key) + '"]{display:none!important}'; })
        .join("\n");
    }

    function installHideKeys(sessionId, keys) {
      if (typeof sessionId !== "string" || !Array.isArray(keys) || keys.length === 0) return;
      var set = hiddenBySession.get(sessionId);
      if (set === undefined) { set = new Set(); hiddenBySession.set(sessionId, set); }
      keys.forEach(function (key) { set.add(String(key)); });
      rebuildHideStyle();
    }

    function installStyle() {
      var selector = 'style[data-plugin-css="dsh-w-assistant-refresh/styles"]';
      var existing = document.querySelector(selector);
      if (existing) {
        existing.textContent = CSS;
        return { node: existing, owned: false };
      }
      var node = document.createElement("style");
      node.dataset.plugin = "dsh-w-assistant-refresh";
      node.dataset.pluginCss = "dsh-w-assistant-refresh/styles";
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
        id: "dsh-w-assistant-refresh#assistantRefresh/" + method,
        service: "assistantRefresh",
        namespace: "assistantRefresh",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: { mode: "strict", typeSymbol: "json", schema: passthrough },
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-assistant-refresh",
      descriptors: [
        descriptor("regenerate", [parameter("sessionId"), parameter("assistantMessageId")]),
        descriptor("hiddenKeys", [parameter("sessionId")]),
      ],
    };

    function errorMessage(error) {
      return error instanceof Error ? error.message : String(error);
    }

    function RefreshAction(props) {
      var running = props.useSession(value => value?.running === true);
      var failureState = React.useState(null);
      var failure = failureState[0];
      var setFailure = failureState[1];
      var pendingState = React.useState(false);
      var pending = pendingState[0];
      var setPending = pendingState[1];
      var unavailable = running || pending;

      // Restore hidden rows after reload / session open: ask the host once
      // per session for the keys this plugin has hidden there so far.
      React.useEffect(function () {
        var sessionId = props.sessionId;
        if (typeof sessionId !== "string" || fetchedSessions.has(sessionId)) return;
        fetchedSessions.add(sessionId);
        Promise.resolve(props.fetchHidden()).catch(function () { fetchedSessions.delete(sessionId); });
      }, [props.sessionId]);

      var onClick = function () {
        if (unavailable) return;
        setFailure(null);
        setPending(true);
        Promise.resolve(props.refresh(props.messageId))
          .catch(error => { setFailure(errorMessage(error)); })
          .finally(() => { setPending(false); });
      };
      var label = pending ? props.t("refreshing") : failure === null ? props.t("refresh") : props.t("failed") + ": " + failure;
      return React.createElement("span", { className: "dshwar-slot" },
        React.createElement(Tooltip, { label: running ? props.t("running") : label, side: "bottom" },
          React.createElement("button", {
            type: "button",
            className: "dshwar-action",
            "aria-label": label,
            "aria-disabled": unavailable || undefined,
            "data-unavailable": unavailable || undefined,
            onClick: onClick,
          }, React.createElement(IconRefreshOutline16))),
        failure !== null && React.createElement("span", { className: "dshwar-live", "aria-live": "polite" }, props.t("failed")),
      );
    }

    async function apply(ctx) {
      appCtx = ctx;
      var style = installStyle();
      ctx.effect(function () { return function () { if (style.owned) style.node.remove(); }; }, "dsh-w-assistant-refresh: styles");
      ensureHideStyle();
      ctx.effect(function () {
        return function () {
          if (hideStyleNode !== null) { hideStyleNode.remove(); hideStyleNode = null; }
        };
      }, "dsh-w-assistant-refresh: hide styles");
      ctx.effect(() => ctx.locale.register(NS, { zh: zh, en: en }), "dsh-w-assistant-refresh: dictionaries");
      var unmount = await ctx.remote.$mount(TYPERT_REMOTE);
      ctx.effect(function () { return unmount; }, "dsh-w-assistant-refresh: remote");
      var remote = ctx.get("remote.assistantRefresh");
      if (!remote) throw new Error("dsh-w-assistant-refresh: remote.assistantRefresh did not mount");

      async function regenerate(sessionId, messageId) {
        var result = await remote.regenerate(sessionId, messageId);
        if (!result.ok) throw new Error("assistantRefresh.regenerate failed: " + JSON.stringify(result.error));
        var value = result.value;
        if (value && Array.isArray(value.hideKeys)) installHideKeys(sessionId, value.hideKeys);
        return value;
      }

      async function fetchHiddenKeys(sessionId) {
        var result = await remote.hiddenKeys(sessionId);
        if (!result.ok) throw new Error("assistantRefresh.hiddenKeys failed: " + JSON.stringify(result.error));
        installHideKeys(sessionId, result.value && Array.isArray(result.value.keys) ? result.value.keys : []);
      }

      function onListChange() {
        rebuildHideStyle();
        var current = currentSessionId();
        if (current === undefined || fetchedSessions.has(current)) return;
        fetchedSessions.add(current);
        Promise.resolve(fetchHiddenKeys(current)).catch(function () { fetchedSessions.delete(current); });
      }
      var unsubscribeList = ctx.sessions.list.subscribe(onListChange);
      ctx.effect(function () { return unsubscribeList; }, "dsh-w-assistant-refresh: session list");

      ctx.slots.inject("conversation.chat.assistant-actions", () => ctx.slots.register({
        name: "conversation.chat.assistant-actions",
        id: "assistant-refresh",
        order: 20,
        locale: NS,
        inject: (sessionId) => ({
          refresh: messageId => regenerate(sessionId, messageId),
          fetchHidden: () => fetchHiddenKeys(sessionId),
        }),
      }, RefreshAction));

      onListChange();
      rebuildHideStyle();
    }

    exports.apply = apply;
    exports.inject = ["slots", "sessions", "remote", "locale"];
    module.exports = exports;
    return module.exports;
  },
});
