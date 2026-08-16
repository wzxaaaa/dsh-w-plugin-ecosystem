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
      ".dshwar-slot{display:inline-flex;align-items:center;order:20;gap:6px}",
      ".dshwar-action{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:6px;border:0;border-radius:28px;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer}",
      ".dshwar-action:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}",
      ".dshwar-action[data-unavailable]{cursor:default;opacity:.4}",
      ".dshwar-action[data-unavailable]:hover{background:transparent;color:var(--dsw-alias-label-tertiary)}",
      ".dshwar-error{max-width:180px;overflow:hidden;color:var(--dsw-alias-state-danger-primary,#c33);font-size:12px;line-height:20px;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwar-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    ].join("\n");

    var zh = {
      refresh: "刷新回复",
      refreshing: "正在刷新回复…",
      unavailable: "当前回复暂时无法刷新",
      running: "请等待当前请求完成",
      failed: "刷新失败",
    };
    var en = {
      refresh: "Refresh reply",
      refreshing: "Refreshing reply…",
      unavailable: "This reply cannot be refreshed yet",
      running: "Wait for the current request to finish",
      failed: "Refresh failed",
    };

    function installStyle() {
      var selector = 'style[data-plugin-css="dsh-w-assistant-refresh/styles"]';
      var existing = document.querySelector(selector);
      if (existing) return;
      var node = document.createElement("style");
      node.dataset.plugin = "dsh-w-assistant-refresh";
      node.dataset.pluginCss = "dsh-w-assistant-refresh/styles";
      node.textContent = CSS;
      document.head.appendChild(node);
    }

    function sameId(left, right) {
      return left !== undefined && right !== undefined && String(left) === String(right);
    }

    function nodeMessageId(node) {
      if (node?.kind === "assistant") return node.messageId;
      if (node?.kind === "turn-tail") return node.data?.closing?.finalNode?.messageId;
      return undefined;
    }

    function nodeSeq(node) {
      if (typeof node?.seq === "number") return node.seq;
      if (typeof node?.data?.seq === "number") return node.data.seq;
      return undefined;
    }

    function nodeTurn(node) {
      if (typeof node?.turn === "number") return node.turn;
      if (typeof node?.data?.turn === "number") return node.data.turn;
      return undefined;
    }

    function findTarget(snapshot, messageId) {
      var nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : [];
      var assistant = nodes.find(node => sameId(nodeMessageId(node), messageId));
      if (assistant === undefined) return null;
      var assistantSeq = nodeSeq(assistant);
      var turn = nodeTurn(assistant);
      if (assistantSeq === undefined || turn === undefined) return null;
      var user = nodes
        .filter(node => (node?.kind === "user" || node?.kind === "steering") && nodeSeq(node) < assistantSeq)
        .sort((left, right) => nodeSeq(left) - nodeSeq(right))
        .at(-1);
      if (user === undefined || !Array.isArray(user.content)) return null;
      var cutSeq;
      if (snapshot?.turnEnds !== undefined && typeof snapshot.turnEnds[Symbol.iterator] === "function") {
        for (var pair of snapshot.turnEnds) {
          var candidateTurn = pair[0];
          var candidateSeq = pair[1];
          if (typeof candidateTurn !== "number" || candidateTurn >= turn || typeof candidateSeq !== "number") continue;
          if (cutSeq === undefined || candidateSeq > cutSeq) cutSeq = candidateSeq;
        }
      }
      return { content: user.content, ...(cutSeq === undefined ? {} : { cutSeq }) };
    }

    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    async function waitForBinding(sessions, sessionId) {
      for (var attempt = 0; attempt < 80; attempt += 1) {
        var binding = sessions.binding(sessionId);
        if (binding?.session !== undefined) return binding.session;
        await delay(25);
      }
      throw new Error("new session did not become available");
    }

    function bytesToBase64(data) {
      var binary = "";
      var chunk = 0x8000;
      for (var offset = 0; offset < data.length; offset += chunk) {
        binary += String.fromCharCode(...data.subarray(offset, offset + chunk));
      }
      return btoa(binary);
    }

    async function replayContent(sourceSession, content) {
      var parts = [];
      for (var block of content) {
        if (block?.type === "text" && typeof block.text === "string") {
          parts.push({ type: "text", text: block.text });
          continue;
        }
        if (block?.type !== "image" || block.attachment?.attachmentId === undefined) continue;
        var loaded = await sourceSession.readAttachment(block.attachment.attachmentId);
        if (!loaded.ok) throw new Error(loaded.error.message || "image replay failed");
        var attachment = loaded.value.attachment;
        parts.push({
          type: "image",
          mediaType: attachment.mediaType,
          data: bytesToBase64(loaded.value.data),
          ...(attachment.name === undefined ? {} : { name: attachment.name }),
        });
      }
      if (parts.length === 0) throw new Error("the original user prompt is unavailable");
      return parts;
    }

    async function createBlankSession(ctx, sessions, sessionId) {
      var summary = sessions.list.getSnapshot().byId[sessionId];
      var payload = {};
      if (summary?.cwd !== undefined) payload.cwd = summary.cwd;
      if (summary?.agentPreset !== undefined) payload.agentPreset = summary.agentPreset;
      var created = await ctx.remote.sessions.create(payload);
      if (!created.ok) throw new Error(created.error.message || "new session creation failed");
      return created.value.sessionId;
    }

    async function refreshAssistant(ctx, sessionId, target) {
      var sourceBinding = ctx.sessions.binding(sessionId);
      var sourceSession = sourceBinding?.session;
      if (sourceSession === undefined) throw new Error("source session is unavailable");
      var prompt = await replayContent(sourceSession, target.content);
      var childId = target.cutSeq === undefined
        ? await createBlankSession(ctx, ctx.sessions, sessionId)
        : await ctx.sessions.fork({ sessionId: sessionId, atSeq: target.cutSeq, increaseTitle: true });
      var childSession = await waitForBinding(ctx.sessions, childId);
      var accepted = await childSession.prompt(prompt, "queue");
      if (!accepted.ok) throw new Error(accepted.error.message || "reply refresh was rejected");
      ctx.sessions.open(childId);
      return childId;
    }

    function errorMessage(error) {
      return error instanceof Error ? error.message : String(error);
    }

    function RefreshAction(props) {
      var snapshot = props.useSession(value => value);
      var target = findTarget(snapshot, props.messageId);
      var unavailable = target === null || snapshot?.running === true;
      var unavailableLabel = snapshot?.running === true ? props.t("running") : props.t("unavailable");
      var failureState = React.useState(null);
      var failure = failureState[0];
      var setFailure = failureState[1];
      var pendingState = React.useState(false);
      var pending = pendingState[0];
      var setPending = pendingState[1];
      var onClick = function () {
        if (pending || unavailable) return;
        setFailure(null);
        setPending(true);
        Promise.resolve(props.refresh(target))
          .catch(error => { setFailure(errorMessage(error)); })
          .finally(() => { setPending(false); });
      };
      var label = pending ? props.t("refreshing") : failure === null ? props.t("refresh") : props.t("failed");
      return React.createElement("span", { className: "dshwar-slot" },
        React.createElement(Tooltip, { label: unavailable ? unavailableLabel : label, side: "bottom" },
          React.createElement("button", {
            type: "button",
            className: "dshwar-action",
            "aria-label": label,
            "aria-disabled": unavailable || pending || undefined,
            "data-unavailable": unavailable || pending || undefined,
            onClick: onClick,
          }, React.createElement(IconRefreshOutline16))),
        failure !== null && React.createElement("span", { className: "dshwar-error", role: "status" }, failure),
        failure !== null && React.createElement("span", { className: "dshwar-live", "aria-live": "polite" }, props.t("failed")),
      );
    }

    function apply(ctx) {
      installStyle();
      ctx.effect(() => ctx.locale.register(NS, { zh: zh, en: en }), "dsh-w-assistant-refresh: dictionaries");
      ctx.slots.inject("conversation.chat.assistant-actions", () => ctx.slots.register({
        name: "conversation.chat.assistant-actions",
        id: "assistant-refresh",
        order: 20,
        locale: NS,
        inject: (sessionId) => ({
          refresh: target => refreshAssistant(ctx, sessionId, target),
        }),
      }, RefreshAction));
    }

    exports.apply = apply;
    exports.inject = ["slots", "sessions", "remote", "locale"];
    module.exports = exports;
    return module.exports;
  },
});
