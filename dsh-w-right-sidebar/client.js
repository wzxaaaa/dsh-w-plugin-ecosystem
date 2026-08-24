window.__ModuleLoader__.load({
  id: "dsh-w-right-sidebar",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    var CSS = [
      ".dshwrs-root{position:fixed;top:0;right:0;bottom:0;z-index:2147482990;width:56px;box-sizing:border-box;overflow:hidden;pointer-events:none;color:var(--dsw-alias-label-primary,#1f2329);font-family:var(--dsw-font-ui,ui-sans-serif,system-ui,sans-serif);transition:width var(--ds-transition-duration-slow,240ms) var(--ds-ease-in-out,cubic-bezier(.2,.8,.2,1))}",
      ".dshwrs-root[data-open]{width:356px}",
      "[data-dshwrs-right-sidebar]{width:max(0px,calc(100% - var(--dshwrs-right-sidebar-width,56px))) !important;box-sizing:border-box;transition:width var(--ds-transition-duration-slow,240ms) var(--ds-ease-in-out,cubic-bezier(.2,.8,.2,1))}",
      ".dshwrs-page{width:100%;min-width:0;height:100%;display:flex;flex-direction:column;overflow:hidden;box-sizing:border-box;background:var(--dsw-alias-bg-layer-1,#fff);border-left:1px solid var(--dsw-alias-border-l2,#d7dbe2);box-shadow:-8px 0 28px rgba(0,0,0,.12);pointer-events:auto}",
      ".dshwrs-page-header{height:60px;flex:none;display:flex;align-items:center;gap:10px;padding:0 12px;border-bottom:1px solid var(--dsw-alias-border-l1,#e6e9ee);font-size:16px;font-weight:600}",
      ".dshwrs-page-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwrs-page-body{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column}",
      ".dshwrs-tool-list{flex:1;min-height:0;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px}",
      ".dshwrs-tool-card{width:100%;display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:12px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#1f2329);text-align:left;cursor:pointer;box-shadow:0 1px 2px rgba(31,35,41,.04)}",
      ".dshwrs-tool-card:hover{border-color:var(--dsw-alias-state-business-primary,#3978e8);background:var(--dsw-alias-interactive-bg-hover,#f5f8ff)}",
      ".dshwrs-tool-card-icon{width:38px;height:38px;flex:none;display:flex;align-items:center;justify-content:center;border-radius:10px;background:var(--dsw-specific-sidebar-fill,#f7f8fa);font-size:22px;line-height:1}",
      ".dshwrs-tool-card-copy{min-width:0;display:flex;flex-direction:column;gap:3px}",
      ".dshwrs-tool-card-title{font-size:14px;font-weight:600;line-height:20px}",
      ".dshwrs-tool-card-description{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary,#68717e)}",
      ".dshwrs-rail{width:56px;height:100%;display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 10px 10px;box-sizing:border-box;background:var(--dsw-specific-sidebar-fill,#f7f8fa);border-left:1px solid var(--dsw-alias-border-l1,#e6e9ee);pointer-events:auto}",
      ".dshwrs-root[data-open] .dshwrs-rail{display:none}",
      ".dshwrs-root:not([data-open]) .dshwrs-page{display:none}",
      ".dshwrs-button{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:10px;padding:0;background:transparent;color:var(--dsw-alias-label-secondary,#68717e);cursor:pointer}",
      ".dshwrs-button:hover{background:var(--dsw-alias-interactive-bg-hover,#e9edf3);color:var(--dsw-alias-label-primary,#1f2329)}",
      ".dshwrs-button[data-active=true]{background:var(--dsw-alias-interactive-bg-selected,#dce8ff);color:var(--dsw-alias-state-business-primary,#3978e8)}",
      ".dshwrs-toggle{margin-bottom:6px;border-radius:50%}",
      ".dshwrs-feature{width:36px;height:36px;display:flex;align-items:center;justify-content:center}",
      ".dshwrs-empty{padding:28px;color:var(--dsw-alias-label-tertiary,#87909d);font-size:13px;line-height:20px}",
      "body[data-dshwrs-better-bridge] [data-dsh-better-sidebar] [data-dsh-panel]{right:56px}",
      "body[data-dshwrs-better-bridge] [data-dsh-better-sidebar] [data-dsh-toggle-cluster]{right:66px}",
      "body[data-dshwrs-better-bridge]:not([data-dshwrs-better-panel-open]) [data-dsh-better-sidebar] [data-dsh-toggle-cluster]{opacity:0;visibility:hidden;pointer-events:none}",
      "body[data-dshwrs-better-bridge][data-dshwrs-better-panel-open] [data-dsh-better-sidebar] [data-dsh-toggle-cluster]{opacity:1;visibility:visible;transition:opacity 120ms ease}",
      ".dshwrs-better-mark{position:relative;width:20px;height:18px;display:block}",
      ".dshwrs-better-mark:before,.dshwrs-better-mark:after{content:\"\";position:absolute;top:2px;bottom:2px;border:1.5px solid currentColor;border-radius:3px}",
      ".dshwrs-better-mark:before{left:1px;width:6px}",
      ".dshwrs-better-mark:after{right:1px;width:9px;background:currentColor;opacity:.18}",
      "@media (max-width:720px){.dshwrs-root[data-open]{width:min(356px,calc(100vw - 56px))}}",
      "@media (max-width:720px){body[data-dshwrs-better-bridge] [data-dsh-better-sidebar] [data-dsh-panel]{width:calc(100vw - 56px) !important}}",
      "@media (prefers-reduced-motion:reduce){.dshwrs-root,[data-dshwrs-right-sidebar]{transition:none}}",
    ].join("\n");
    var tagId = "dsh-w-right-sidebar/styles";

    function installStyle() {
      if (typeof document === "undefined") return { owned: false, node: null };
      var existing = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]");
      if (existing) return { owned: false, node: existing };
      var node = document.createElement("style");
      node.dataset.plugin = "dsh-w-right-sidebar";
      node.dataset.pluginCss = tagId;
      node.textContent = CSS;
      document.head.appendChild(node);
      return { owned: true, node: node };
    }

    function IconSidebar() {
      return React.createElement("svg", { viewBox: "0 0 20 20", width: 18, height: 18, "aria-hidden": true },
        React.createElement("rect", { x: 3, y: 3, width: 14, height: 14, rx: 2, fill: "none", stroke: "currentColor", strokeWidth: 1.5 }),
        React.createElement("path", { d: "M8 3v14", stroke: "currentColor", strokeWidth: 1.5 })
      );
    }

    function IconBack() {
      return React.createElement("svg", { viewBox: "0 0 20 20", width: 16, height: 16, "aria-hidden": true },
        React.createElement("path", { d: "M11.5 4.5L6 10l5.5 5.5M6.5 10H15", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" })
      );
    }

    function IconBetterSidebar() {
      return React.createElement("span", { className: "dshwrs-better-mark", "aria-hidden": true });
    }

    function isBetterSidebarService(value) {
      return !!value
        && typeof value === "object"
        && typeof value.getTabs === "function"
        && typeof value.openTab === "function"
        && typeof value.getSnapshot === "function"
        && typeof value.subscribe === "function"
        && typeof value.subscribeState === "function"
        && typeof value.version === "string";
    }

    function readBetterBridge(service) {
      var tabs = [];
      var panelOpen = false;
      try { tabs = Array.from(service.getTabs()); } catch (_) {}
      try { panelOpen = !!(service.getSnapshot().state && service.getSnapshot().state.panelOpen); } catch (_) {}
      return { service: service, version: service.version, tabs: tabs, panelOpen: panelOpen };
    }

    function useBetterSidebarBridge(ctx) {
      var slot = React.useState(null);
      var bridge = slot[0];
      var setBridge = slot[1];
      React.useEffect(function () {
        var disposed = false;
        var current = null;
        var offRegistry = null;
        var offState = null;
        var timer = null;
        var detach = function () {
          if (typeof offRegistry === "function") offRegistry();
          if (typeof offState === "function") offState();
          offRegistry = null;
          offState = null;
          current = null;
        };
        var publish = function () {
          if (disposed || !current) return;
          var next = readBetterBridge(current);
          if (next.panelOpen) document.body.setAttribute("data-dshwrs-better-panel-open", "");
          else document.body.removeAttribute("data-dshwrs-better-panel-open");
          setBridge(next);
        };
        var scan = function () {
          if (disposed) return;
          var candidate = null;
          try { candidate = ctx && typeof ctx.get === "function" ? ctx.get("betterSidebar") : null; } catch (_) {}
          if (!isBetterSidebarService(candidate)) candidate = null;
          var host = candidate && document.querySelector("[data-dsh-better-sidebar]");
          if (candidate && (!host || !host.querySelector("[data-dsh-panel]") || !host.querySelector("[data-dsh-toggle-cluster]"))) candidate = null;
          if (candidate !== current) {
            detach();
            if (candidate) {
              current = candidate;
              document.body.setAttribute("data-dshwrs-better-bridge", candidate.version || "available");
              publish();
              try { offRegistry = candidate.subscribe(publish); } catch (_) {}
              try { offState = candidate.subscribeState(publish); } catch (_) {}
            } else {
              document.body.removeAttribute("data-dshwrs-better-bridge");
              document.body.removeAttribute("data-dshwrs-better-panel-open");
              setBridge(null);
            }
          }
          timer = window.setTimeout(scan, current ? 1500 : 500);
        };
        scan();
        return function () {
          disposed = true;
          if (timer !== null) window.clearTimeout(timer);
          detach();
          document.body.removeAttribute("data-dshwrs-better-bridge");
          document.body.removeAttribute("data-dshwrs-better-panel-open");
        };
      }, [ctx]);
      return bridge;
    }

    function betterPanelToggle() {
      if (typeof document === "undefined") return null;
      var root = document.querySelector("[data-dsh-better-sidebar]");
      var cluster = root && root.querySelector("[data-dsh-toggle-cluster]");
      if (!cluster) return null;
      var buttons = cluster.querySelectorAll("button:not([aria-disabled=true])");
      return buttons.length ? buttons[buttons.length - 1] : null;
    }

    function requestBetterPanel(service, open, remaining) {
      if (!isBetterSidebarService(service)) return;
      var panelOpen = null;
      try {
        var snapshot = service.getSnapshot();
        panelOpen = snapshot.state ? !!snapshot.state.panelOpen : null;
      } catch (_) {}
      if (panelOpen === open) return;
      var toggle = betterPanelToggle();
      if (toggle) toggle.click();
      if (remaining > 0) {
        window.setTimeout(function () { requestBetterPanel(service, open, remaining - 1); }, 120);
      }
    }

    function treeHasBetterTabs(node) {
      if (!node || typeof node !== "object") return false;
      if (Array.isArray(node.tabs) && node.tabs.length) return true;
      if (!Array.isArray(node.children)) return false;
      return node.children.some(treeHasBetterTabs);
    }

    function openBetterSidebar(service) {
      if (!isBetterSidebarService(service)) return;
      try {
        var snapshot = service.getSnapshot();
        var state = snapshot.state;
        var hasTabs = !!state && (
          treeHasBetterTabs(state.splits)
          || treeHasBetterTabs(state.bottomSplits)
          || (Array.isArray(state.floats) && state.floats.length > 0)
        );
        if (!hasTabs) {
          var tabs = Array.from(service.getTabs());
          var descriptor = tabs.find(function (tab) {
            return tab.id === "explorer" && (!service.isTabEnabled || service.isTabEnabled(tab.id));
          }) || tabs.find(function (tab) {
            return tab.hidden !== true && tab.single === true && (!service.isTabEnabled || service.isTabEnabled(tab.id));
          });
          if (descriptor) {
            var title = typeof descriptor.title === "function" ? descriptor.title() : descriptor.title;
            service.openTab({ type: descriptor.id, title: title });
          }
        }
      } catch (error) {
        console.warn("[dsh-w-right-sidebar] Better Sidebar handoff failed:", error);
      }
      requestBetterPanel(service, true, 8);
    }

    function useFrameReservation(open) {
      React.useLayoutEffect(function () {
        if (typeof document === "undefined") return undefined;
        var overlay = document.querySelector("[data-shell-overlay]");
        var frame = overlay && overlay.parentElement;
        if (!frame) return undefined;
        var previousAttribute = frame.getAttribute("data-dshwrs-right-sidebar");
        var previousWidth = frame.style.getPropertyValue("--dshwrs-right-sidebar-width");
        var previousPriority = frame.style.getPropertyPriority("--dshwrs-right-sidebar-width");
        frame.setAttribute("data-dshwrs-right-sidebar", open ? "open" : "closed");
        frame.style.setProperty("--dshwrs-right-sidebar-width", open ? "min(356px, calc(100vw - 56px))" : "56px");
        return function () {
          if (previousAttribute === null) frame.removeAttribute("data-dshwrs-right-sidebar");
          else frame.setAttribute("data-dshwrs-right-sidebar", previousAttribute);
          if (previousWidth) frame.style.setProperty("--dshwrs-right-sidebar-width", previousWidth, previousPriority);
          else frame.style.removeProperty("--dshwrs-right-sidebar-width");
        };
      }, [open]);
    }

    function RightSidebarHost(props) {
      var t = typeof props.t === "function" ? props.t : function (key) { return key; };
      var openSlot = React.useState(false);
      var open = openSlot[0];
      var setOpen = openSlot[1];
      var activeSlot = React.useState(null);
      var activeId = activeSlot[0];
      var setActiveId = activeSlot[1];
      var modeSlot = React.useState("list");
      var mode = modeSlot[0];
      var setMode = modeSlot[1];
      var originSlot = React.useState("direct");
      var origin = originSlot[0];
      var setOrigin = originSlot[1];
      var titleSlot = React.useState(null);
      var activeTitle = titleSlot[0];
      var setActiveTitle = titleSlot[1];
      var better = useBetterSidebarBridge(props.ctx);
      useFrameReservation(open);
      React.useEffect(function () {
        if (open && better && better.panelOpen) requestBetterPanel(better.service, false, 4);
      }, [open, better && better.panelOpen, better && better.service]);
      var showList = function () {
        if (better) requestBetterPanel(better.service, false, 4);
        setOpen(true);
        setMode("list");
        setActiveId(null);
        setActiveTitle(null);
      };
      var collapse = function () {
        setOpen(false);
        setMode("list");
        setActiveId(null);
        setActiveTitle(null);
      };
      var openFromCard = function (id, title) {
        if (better) requestBetterPanel(better.service, false, 4);
        setActiveId(id);
        setActiveTitle(title || null);
        setOrigin("list");
        setMode("page");
        setOpen(true);
      };
      var openDirect = function (id, title) {
        if (better) requestBetterPanel(better.service, false, 4);
        setActiveId(id);
        setActiveTitle(title || null);
        setOrigin("direct");
        setMode("page");
        setOpen(true);
      };
      var handoffBetter = function () {
        collapse();
        if (better) openBetterSidebar(better.service);
      };
      var betterCard = better ? React.createElement("button", {
        type: "button",
        className: "dshwrs-tool-card",
        "data-dshwrs-better-sidebar": "card",
        onClick: handoffBetter,
      },
        React.createElement("span", { className: "dshwrs-tool-card-icon" }, React.createElement(IconBetterSidebar, null)),
        React.createElement("span", { className: "dshwrs-tool-card-copy" },
          React.createElement("span", { className: "dshwrs-tool-card-title" }, t("betterTitle")),
          React.createElement("span", { className: "dshwrs-tool-card-description" }, t("betterConnected") + " v" + better.version + " · " + better.tabs.length + " " + t("betterTools"))
        )
      ) : null;
      var body = mode === "list"
        ? React.createElement("div", { className: "dshwrs-tool-list" },
          props.renderSlot("right-sidebar.card", { onOpen: openFromCard }, {
            fallback: better ? null : React.createElement("div", { className: "dshwrs-empty" }, t("empty")),
          }),
          betterCard
        )
        : React.createElement("div", { className: "dshwrs-page-body" },
          props.renderSlotChain("right-sidebar.page", { activeId: activeId }, {
            fallback: React.createElement("div", { className: "dshwrs-empty" }, t("empty")),
          })
        );
      var rail = props.renderSlot("right-sidebar.rail", {
        activeId: activeId,
        onSelect: function (id, title) {
          openDirect(id, title);
        },
      });
      var betterRail = better ? React.createElement("div", { className: "dshwrs-feature" },
        React.createElement("button", {
          type: "button",
          className: "dshwrs-button",
          "data-active": better.panelOpen,
          "data-dshwrs-better-sidebar": "rail",
          title: t("betterTitle"),
          "aria-label": t("betterTitle"),
          onClick: handoffBetter,
        }, React.createElement(IconBetterSidebar, null))
      ) : null;
      var headerBack = mode === "page" && origin === "list";
      var headerTitle = mode === "page" && activeTitle ? activeTitle : t("title");
      return React.createElement("div", { className: "dshwrs-root", "data-open": open || undefined },
        open ? React.createElement("section", { className: "dshwrs-page", "aria-label": t("title") },
          React.createElement("header", { className: "dshwrs-page-header" },
            React.createElement("button", {
              type: "button",
              className: "dshwrs-button",
              title: headerBack ? t("back") : t("collapse"),
              "aria-label": headerBack ? t("back") : t("collapse"),
              onClick: headerBack ? showList : collapse,
            }, headerBack ? React.createElement(IconBack, null) : React.createElement(IconSidebar, null)),
            React.createElement("span", { className: "dshwrs-page-title" }, headerTitle),
          ),
          body
        ) : null,
        React.createElement("aside", { className: "dshwrs-rail", "aria-label": t("rail") },
          React.createElement("button", {
            type: "button",
            className: "dshwrs-button dshwrs-toggle",
            title: open ? t("collapse") : t("expand"),
            "aria-label": open ? t("collapse") : t("expand"),
            onClick: open ? collapse : showList,
          }, React.createElement(IconSidebar, null)),
          rail,
          betterRail
        )
      );
    }

    var NS = "dshWRightSidebar";
    var inject = ["slots", "locale"];
    var dicts = {
      zh: { title: "工具栏", rail: "右侧工具栏", collapse: "收起右侧栏", expand: "展开右侧栏", back: "返回工具列表", empty: "工具栏暂无已挂载工具。", betterTitle: "Better Sidebar", betterConnected: "已连接", betterTools: "个工具" },
      en: { title: "Tools", rail: "Right tools", collapse: "Collapse right sidebar", expand: "Expand right sidebar", back: "Back to tools", empty: "No tools are mounted.", betterTitle: "Better Sidebar", betterConnected: "Connected", betterTools: "tools" },
    };

    function apply(ctx) {
      var style = installStyle();
      ctx.effect(function () { return function () { if (style.owned && style.node) style.node.remove(); }; }, "dsh-w-right-sidebar: styles");
      ctx.effect(function () { return ctx.locale.register(NS, dicts); });
      ctx.slots.inject("shell.overlay", function () {
        return ctx.slots.register({
          name: "shell.overlay",
          id: "right-sidebar",
          order: 80,
          locale: NS,
          children: {
            "right-sidebar.rail": { kind: "list", scope: "root" },
            "right-sidebar.card": { kind: "list", scope: "root" },
            "right-sidebar.page": { kind: "chain", scope: "root" },
          },
        }, function BetterCompatibleRightSidebarHost(slotProps) {
          return React.createElement(RightSidebarHost, Object.assign({}, slotProps, { ctx: ctx }));
        });
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-right-sidebar";
    return module.exports;
  },
});
