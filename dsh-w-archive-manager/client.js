window.__ModuleLoader__.load({
  id: "dsh-w-archive-manager",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");
    var primitives = require("@deepseek-ai/dsh-client-ui-primitives");
    var IconRefreshOutline16 = primitives.IconRefreshOutline16;
    var IconTrashOutline16 = primitives.IconTrashOutline16;

    var CSS = [
      ".dshwam-root{display:flex;min-height:100%;flex-direction:column;color:var(--dsw-alias-label-primary)}",
      ".dshwam-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin:8px 0 28px}",
      ".dshwam-title{min-width:0}",
      ".dshwam-title h3{margin:0;font-size:22px;line-height:32px;font-weight:500;letter-spacing:0;color:var(--dsw-alias-label-primary)}",
      ".dshwam-title p{margin:6px 0 0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}",
      ".dshwam-clear{flex:none;display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;cursor:pointer}",
      ".dshwam-clear:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}",
      ".dshwam-clear:disabled{cursor:default;opacity:.45}",
      ".dshwam-list{overflow:hidden;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}",
      ".dshwam-empty{display:flex;min-height:94px;align-items:center;justify-content:center;padding:20px;color:var(--dsw-alias-label-tertiary);font-size:14px;line-height:22px;text-align:center}",
      ".dshwam-row{display:flex;align-items:center;gap:16px;min-height:72px;padding:12px 14px 12px 16px;box-sizing:border-box}",
      ".dshwam-row+.dshwam-row{border-top:1px solid var(--dsw-alias-border-l2)}",
      ".dshwam-info{min-width:0;flex:1}",
      ".dshwam-name{overflow:hidden;margin:0;color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px;font-weight:500;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwam-meta{display:flex;align-items:center;gap:8px;min-width:0;margin-top:3px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}",
      ".dshwam-meta span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwam-actions{display:flex;flex:none;align-items:center;gap:6px}",
      ".dshwam-action{display:inline-flex;align-items:center;justify-content:center;gap:5px;height:30px;padding:0 10px;border:1px solid transparent;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer}",
      ".dshwam-action:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
      ".dshwam-action[data-kind=delete]:hover:not(:disabled){color:var(--dsw-alias-state-danger-primary,#c33)}",
      ".dshwam-action:disabled{cursor:default;opacity:.4}",
      ".dshwam-status{margin:12px 0 0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}",
      ".dshwam-status[data-kind=error]{color:var(--dsw-alias-state-danger-primary,#c33)}",
      "@media(max-width:700px){.dshwam-heading{align-items:stretch;flex-direction:column;margin-bottom:20px}.dshwam-clear{align-self:flex-start}.dshwam-row{align-items:flex-start;flex-direction:column;gap:8px}.dshwam-actions{align-self:flex-end}}",
    ].join("\n");

    function installStyle() {
      var selector = 'style[data-plugin-css="dsh-w-archive-manager/styles"]';
      var existing = document.querySelector(selector);
      if (existing) return { node: existing, owned: false };
      var node = document.createElement("style");
      node.dataset.plugin = "dsh-w-archive-manager";
      node.dataset.pluginCss = "dsh-w-archive-manager/styles";
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
        id: "dsh-w-archive-manager#archiveManager/" + method,
        service: "archiveManager",
        namespace: "archiveManager",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: { mode: "strict", typeSymbol: "json", schema: passthrough },
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-archive-manager",
      descriptors: [
        descriptor("listArchived"),
        descriptor("restore", [parameter("sessionId")]),
        descriptor("deleteOne", [parameter("sessionId")]),
        descriptor("clearAll"),
        descriptor("finalizeDeleted", [parameter("input")]),
      ],
    };

    function formatDate(timestamp, locale) {
      try {
        return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
          year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
        }).format(new Date(timestamp));
      } catch (_) {
        return new Date(timestamp).toLocaleString();
      }
    }

    function ArchivedSection(props) {
      var t = props.t;
      var useSessions = props.useSessions;
      var listArchived = props.listArchived;
      var restore = props.restore;
      var deleteOne = props.deleteOne;
      var clearAll = props.clearAll;
      var finalizeDeleted = props.finalizeDeleted;
      var refreshSessions = props.refreshSessions;
      var refreshWorkspaces = props.refreshWorkspaces;
      var sessions = useSessions(function (state) { return state; });
      var dataSlot = React.useState({ status: "loading", items: [], retentionDays: 30 });
      var data = dataSlot[0];
      var setData = dataSlot[1];
      var busySlot = React.useState({});
      var busy = busySlot[0];
      var setBusy = busySlot[1];
      var statusSlot = React.useState(null);
      var status = statusSlot[0];
      var setStatus = statusSlot[1];

      var load = React.useCallback(function () {
        setData(function (current) { return { status: "loading", items: current.items, retentionDays: current.retentionDays }; });
        return listArchived().then(
          function (result) {
            setData({ status: "ready", items: Array.isArray(result.items) ? result.items : [], retentionDays: result.retentionDays || 30 });
          },
          function (error) {
            console.error("dsh-w-archive-manager: list failed:", error);
            setData(function (current) { return { status: "error", items: current.items, retentionDays: current.retentionDays }; });
            setStatus({ kind: "error", text: error && error.message ? error.message : t("error") });
          },
        );
      }, [listArchived, t]);

      React.useEffect(function () {
        var alive = true;
        listArchived().then(
          function (result) {
            if (!alive) return;
            setData({ status: "ready", items: Array.isArray(result.items) ? result.items : [], retentionDays: result.retentionDays || 30 });
          },
          function (error) {
            if (!alive) return;
            console.error("dsh-w-archive-manager: initial list failed:", error);
            setData({ status: "error", items: [], retentionDays: 30 });
            setStatus({ kind: "error", text: error && error.message ? error.message : t("error") });
          },
        );
        return function () { alive = false; };
      }, [listArchived, t]);

      var rows = data.items.map(function (item) {
        var summary = sessions.byId[item.sessionId];
        return {
          sessionId: item.sessionId,
          archivedAt: item.archivedAt,
          title: summary ? summary.displayTitle : item.sessionId,
          updatedAt: summary ? summary.updatedAt : item.archivedAt,
        };
      }).sort(function (left, right) { return right.updatedAt - left.updatedAt; });

      function markBusy(key, value) {
        setBusy(function (current) {
          var next = Object.assign({}, current);
          if (value) next[key] = true;
          else delete next[key];
          return next;
        });
      }

      function onRestore(sessionId) {
        markBusy(sessionId, true);
        setStatus(null);
        restore(sessionId).then(function () {
          return refreshWorkspaces();
        }).then(function () {
          setData(function (current) {
            return Object.assign({}, current, { items: current.items.filter(function (item) { return item.sessionId !== sessionId; }) });
          });
          setStatus({ kind: "success", text: t("restored") });
          markBusy(sessionId, false);
        }, function (error) {
          markBusy(sessionId, false);
          setStatus({ kind: "error", text: error && error.message ? error.message : t("error") });
        });
      }

      function settleDeleted(results) {
        var deleted = results.filter(function (item) { return item.status === "deleted"; }).map(function (item) { return item.sessionId; });
        var scheduled = results.filter(function (item) { return item.status === "scheduled"; }).length;
        var hidden = new Set(results.map(function (item) { return item.sessionId; }));
        setData(function (current) {
          return Object.assign({}, current, { items: current.items.filter(function (item) { return !hidden.has(item.sessionId); }) });
        });
        var sync = deleted.length === 0
          ? Promise.resolve()
          : refreshSessions().then(function () { return finalizeDeleted(deleted); }).then(function () { return refreshWorkspaces(); });
        return sync.then(function () {
          setStatus({ kind: "success", text: scheduled > 0 ? t("scheduled") : t("deleted") });
        });
      }

      function onDelete(sessionId) {
        markBusy(sessionId, true);
        setStatus(null);
        deleteOne(sessionId).then(function (result) {
          return settleDeleted([result]);
        }).then(function () {
          markBusy(sessionId, false);
        }, function (error) {
          markBusy(sessionId, false);
          setStatus({ kind: "error", text: error && error.message ? error.message : t("error") });
        });
      }

      function onClear() {
        markBusy("__all__", true);
        setStatus(null);
        clearAll().then(function (result) {
          return settleDeleted(Array.isArray(result.results) ? result.results : []);
        }).then(function () {
          markBusy("__all__", false);
        }, function (error) {
          markBusy("__all__", false);
          setStatus({ kind: "error", text: error && error.message ? error.message : t("error") });
        });
      }

      var anyBusy = Object.keys(busy).length > 0;
      return React.createElement(
        "section",
        { className: "dshwam-root" },
        React.createElement(
          "div",
          { className: "dshwam-heading" },
          React.createElement(
            "div",
            { className: "dshwam-title" },
            React.createElement("h3", null, t("title")),
            React.createElement("p", null, t("retention", { days: data.retentionDays })),
          ),
          React.createElement(
            "button",
            { type: "button", className: "dshwam-clear", disabled: rows.length === 0 || anyBusy, onClick: onClear },
            React.createElement(IconTrashOutline16, { size: 16 }),
            t("clear"),
          ),
        ),
        React.createElement(
          "div",
          { className: "dshwam-list" },
          rows.length === 0
            ? React.createElement("div", { className: "dshwam-empty" }, data.status === "loading" ? t("loading") : t("empty"))
            : rows.map(function (row) {
                var rowBusy = busy[row.sessionId] === true || busy.__all__ === true;
                return React.createElement(
                  "div",
                  { className: "dshwam-row", key: row.sessionId },
                  React.createElement(
                    "div",
                    { className: "dshwam-info" },
                    React.createElement("p", { className: "dshwam-name", title: row.title }, row.title),
                    React.createElement(
                      "div",
                      { className: "dshwam-meta" },
                      React.createElement("span", null, t("archivedAt") + " " + formatDate(row.archivedAt, t("locale"))),
                    ),
                  ),
                  React.createElement(
                    "div",
                    { className: "dshwam-actions" },
                    React.createElement(
                      "button",
                      { type: "button", className: "dshwam-action", disabled: rowBusy, onClick: function () { onRestore(row.sessionId); } },
                      React.createElement(IconRefreshOutline16, { size: 15 }),
                      t("restore"),
                    ),
                    React.createElement(
                      "button",
                      { type: "button", className: "dshwam-action", "data-kind": "delete", disabled: rowBusy, onClick: function () { onDelete(row.sessionId); } },
                      React.createElement(IconTrashOutline16, { size: 15 }),
                      t("delete"),
                    ),
                  ),
                );
              }),
        ),
        data.status === "error"
          ? React.createElement("button", { type: "button", className: "dshwam-action", onClick: load }, t("retry"))
          : null,
        status !== null ? React.createElement("p", { className: "dshwam-status", "data-kind": status.kind }, status.text) : null,
      );
    }

    var NS = "dshWArchiveManager";
    var inject = ["slots", "locale", "remote", "sessions", "workspaces"];
    var dicts = {
      zh: {
        nav: "已归档",
        title: "已归档对话",
        retention: "标记为归档的对话将在{days}天后被永久删除",
        clear: "一键清理",
        empty: "暂无已归档的对话",
        loading: "正在读取已归档对话...",
        restore: "还原",
        delete: "删除",
        archivedAt: "归档于",
        restored: "对话已还原",
        deleted: "对话已永久删除",
        scheduled: "仍挂载的对话已进入删除队列，释放后会自动永久删除",
        error: "操作失败。",
        retry: "重试",
        locale: "zh",
      },
      en: {
        nav: "Archived",
        title: "Archived conversations",
        retention: "Archived conversations are permanently deleted after {days} days",
        clear: "Clear all",
        empty: "No archived conversations",
        loading: "Loading archived conversations...",
        restore: "Restore",
        delete: "Delete",
        archivedAt: "Archived",
        restored: "Conversation restored",
        deleted: "Conversation permanently deleted",
        scheduled: "Attached conversations are queued for deletion and will be removed after release",
        error: "Operation failed.",
        retry: "Retry",
        locale: "en",
      },
    };

    async function apply(ctx) {
      var style = installStyle();
      ctx.effect(function () { return function () { if (style.owned) style.node.remove(); }; }, "dsh-w-archive-manager: styles");
      ctx.effect(function () { return ctx.locale.register(NS, dicts); });
      var unmount = await ctx.remote.$mount(TYPERT_REMOTE);
      ctx.effect(function () { return unmount; }, "dsh-w-archive-manager: remote");
      var archiveManager = ctx.get("remote.archiveManager");
      if (!archiveManager) throw new Error("dsh-w-archive-manager: remote.archiveManager did not mount");

      async function unwrap(method, args) {
        var result = await archiveManager[method].apply(archiveManager, args);
        if (!result.ok) throw new Error("archiveManager." + method + " failed: " + JSON.stringify(result.error));
        return result.value;
      }

      var t = ctx.locale.bind(NS);
      ctx.slots.inject("settings.section", function () {
        return ctx.slots.register({
          name: "settings.section",
          id: "archived-conversations",
          order: 1000,
          label: function () { return t("nav"); },
          locale: NS,
          inject: function () {
            return {
              listArchived: function () { return unwrap("listArchived", []); },
              restore: function (sessionId) { return unwrap("restore", [sessionId]); },
              deleteOne: function (sessionId) { return unwrap("deleteOne", [sessionId]); },
              clearAll: function () { return unwrap("clearAll", []); },
              finalizeDeleted: function (sessionIds) { return unwrap("finalizeDeleted", [sessionIds]); },
              refreshSessions: function () {
                return typeof ctx.sessions.refresh === "function" ? ctx.sessions.refresh() : Promise.resolve();
              },
              refreshWorkspaces: function () {
                return typeof ctx.workspaces.refresh === "function" ? ctx.workspaces.refresh() : Promise.resolve();
              },
            };
          },
        }, ArchivedSection);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-archive-manager";
    return module.exports;
  },
});
