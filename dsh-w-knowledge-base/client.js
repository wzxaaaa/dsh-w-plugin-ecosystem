window.__ModuleLoader__.load({
  id: "dsh-w-knowledge-base",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    // ── styles ───────────────────────────────────────────────────────────
    var CSS = [
      ".dshwkb-panel{--kb-accent:var(--dsw-alias-state-business-primary,#3978e8);--kb-fg:var(--dsw-alias-label-primary,#1f2329);--kb-fg2:var(--dsw-alias-label-secondary,#646a73);--kb-fg3:var(--dsw-alias-label-tertiary,#8f959e);--kb-surface:var(--dsw-alias-bg-layer-1,#fff);--kb-border:var(--dsw-alias-border-l1,#e5e7eb);--kb-hover:var(--dsw-alias-interactive-bg-hover,#f2f5fa);--kb-fill:color-mix(in srgb,var(--kb-fg) 5%,transparent);--kb-accent-soft:color-mix(in srgb,var(--kb-accent) 11%,transparent);--kb-danger:var(--dsw-alias-state-error-primary,#d64545);--kb-ok:#2e9d6a;container:knowledge-panel / inline-size;display:flex;flex-direction:column;gap:10px;min-height:0;height:100%;box-sizing:border-box;padding:4px 2px;color:var(--kb-fg);font-family:var(--dsw-font-ui,ui-sans-serif,system-ui,sans-serif);font-size:13px}",
      ".dshwkb-panel *,.dshwkb-panel *:before,.dshwkb-panel *:after{box-sizing:border-box}",
      ".dshwkb-panel button{font-family:inherit}",
      ".dshwkb-panel :focus-visible{outline:2px solid var(--kb-accent);outline-offset:1px}",
      ".dshwkb-panel[data-surface=sidebar]{padding:12px 12px 10px;background:var(--dsw-specific-sidebar-fill,#f7f8fa)}",
      ".dshwkb-head{display:flex;flex-direction:column;gap:8px;min-width:0}",
      ".dshwkb-head-top,.dshwkb-head-actions{display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0}",
      ".dshwkb-head-actions{flex-wrap:nowrap;border-bottom:1px solid var(--kb-border)}",
      ".dshwkb-headings{flex:1;min-width:0;display:flex;align-items:center;gap:8px}",
      ".dshwkb-title{font-size:16px;font-weight:650;line-height:22px;white-space:nowrap}",
      ".dshwkb-meta{display:inline-flex;align-items:center;gap:4px;flex:none;height:22px;padding:0 8px;border-radius:999px;background:var(--kb-fill);color:var(--kb-fg2);font-size:12px;line-height:1;white-space:nowrap}",
      ".dshwkb-meta b{color:var(--kb-fg);font-weight:650}",
      ".dshwkb-modebar{display:inline-flex;flex:none;gap:2px;padding:2px;border-radius:8px;background:var(--kb-fill)}",
      ".dshwkb-mode{height:26px;padding:0 10px;border:0;border-radius:6px;background:transparent;color:var(--kb-fg2);font-size:12px;font-weight:500;white-space:nowrap;cursor:pointer;transition:background .15s,color .15s}",
      ".dshwkb-mode:hover:not([data-active]){color:var(--kb-fg)}",
      ".dshwkb-mode[data-active=true]{background:var(--kb-surface);color:var(--kb-fg);font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.08),0 0 0 1px var(--kb-border)}",
      ".dshwkb-mode:disabled{cursor:progress}",
      ".dshwkb-tabs{display:flex;gap:18px;min-width:0}",
      ".dshwkb-tab{position:relative;height:34px;padding:0 1px;border:0;background:transparent;color:var(--kb-fg2);font-size:13px;font-weight:500;white-space:nowrap;cursor:pointer;transition:color .15s}",
      ".dshwkb-tab:hover{color:var(--kb-fg)}",
      ".dshwkb-tab[data-active=true]{color:var(--kb-fg);font-weight:600}",
      ".dshwkb-tab[data-active=true]:after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:2px;border-radius:2px;background:var(--kb-accent)}",
      ".dshwkb-primary,.dshwkb-ghost{display:inline-flex;align-items:center;justify-content:center;gap:5px;flex:none;height:30px;padding:0 12px;border-radius:8px;font-size:12.5px;white-space:nowrap;cursor:pointer;transition:filter .15s,border-color .15s,color .15s,background .15s}",
      ".dshwkb-primary{border:0;background:var(--kb-accent);color:#fff;font-weight:600}",
      ".dshwkb-primary:hover:not(:disabled){filter:brightness(1.08)}",
      ".dshwkb-ghost{border:1px solid var(--kb-border);background:var(--kb-surface);color:var(--kb-fg);font-weight:500}",
      ".dshwkb-ghost:hover:not(:disabled){border-color:color-mix(in srgb,var(--kb-accent) 45%,var(--kb-border));color:var(--kb-accent)}",
      ".dshwkb-ghost[data-danger=true]{color:var(--kb-danger)}",
      ".dshwkb-ghost[data-danger=true]:hover:not(:disabled){border-color:var(--kb-danger);color:var(--kb-danger);background:color-mix(in srgb,var(--kb-danger) 7%,var(--kb-surface))}",
      ".dshwkb-ghost[data-armed=true],.dshwkb-ghost[data-armed=true]:hover:not(:disabled){border-color:var(--kb-danger);background:var(--kb-danger);color:#fff}",
      ".dshwkb-primary:disabled,.dshwkb-ghost:disabled{opacity:.55;cursor:default}",
      ".dshwkb-head-actions>.dshwkb-primary{height:28px;padding:0 10px 0 8px;margin:0 0 4px auto}",
      ".dshwkb-icon-btn{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;flex:none;padding:0;border:0;border-radius:7px;background:transparent;color:var(--kb-fg3);cursor:pointer;transition:background .15s,color .15s}",
      ".dshwkb-icon-btn:hover:not(:disabled){background:var(--kb-hover);color:var(--kb-fg)}",
      ".dshwkb-link{align-self:flex-start;padding:0;border:0;background:none;color:var(--kb-accent);font-size:12px;line-height:18px;text-align:left;cursor:pointer}",
      ".dshwkb-link:hover{text-decoration:underline}",
      ".dshwkb-searchrow{display:flex;align-items:center;gap:2px;flex:none;height:34px;padding:0 3px 0 10px;border:1px solid var(--kb-border);border-radius:9px;background:var(--kb-surface);color:var(--kb-fg3);transition:border-color .15s,box-shadow .15s}",
      ".dshwkb-searchrow:focus-within{border-color:var(--kb-accent);box-shadow:0 0 0 3px var(--kb-accent-soft)}",
      ".dshwkb-input{flex:1;width:100%;min-width:0;height:34px;padding:0 10px;border:1px solid var(--kb-border);border-radius:8px;background:var(--kb-surface);color:var(--kb-fg);font:inherit;font-size:13px;transition:border-color .15s,box-shadow .15s}",
      ".dshwkb-input:focus,.dshwkb-textarea:focus{outline:none;border-color:var(--kb-accent);box-shadow:0 0 0 3px var(--kb-accent-soft)}",
      ".dshwkb-searchrow .dshwkb-input,.dshwkb-searchrow .dshwkb-input:focus{height:32px;padding:0 6px;border:0;background:transparent;box-shadow:none}",
      ".dshwkb-input::placeholder,.dshwkb-textarea::placeholder{color:var(--kb-fg3)}",
      ".dshwkb-textarea{width:100%;min-height:200px;flex:1;padding:10px 12px;border:1px solid var(--kb-border);border-radius:8px;background:var(--kb-surface);color:var(--kb-fg);font-size:12.5px;line-height:1.7;font-family:var(--dsw-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);resize:vertical;transition:border-color .15s,box-shadow .15s}",
      ".dshwkb-tags{display:flex;flex-wrap:nowrap;flex:none;gap:6px;min-height:24px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;scroll-snap-type:x proximity;-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 20px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 20px),transparent)}",
      ".dshwkb-tags::-webkit-scrollbar{display:none}",
      ".dshwkb-chip{display:inline-flex;align-items:center;gap:4px;height:24px;flex:none;padding:0 9px;border:1px solid var(--kb-border);border-radius:999px;background:var(--kb-surface);color:var(--kb-fg2);font-size:12px;white-space:nowrap;scroll-snap-align:start;cursor:pointer;transition:border-color .15s,color .15s,background .15s}",
      ".dshwkb-chip:hover{color:var(--kb-fg);border-color:color-mix(in srgb,var(--kb-fg) 22%,var(--kb-border))}",
      ".dshwkb-chip-count{color:var(--kb-fg3);font-size:11px}",
      ".dshwkb-chip[data-active=true]{border-color:transparent;background:var(--kb-accent-soft);color:var(--kb-accent);font-weight:600}",
      ".dshwkb-chip[data-active=true] .dshwkb-chip-count{color:inherit;opacity:.7}",
      ".dshwkb-list{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:6px;margin:0 -4px;padding:1px 4px 6px;scrollbar-width:thin}",
      ".dshwkb-row{width:100%;display:flex;flex-direction:column;flex:none;gap:3px;padding:10px 12px;border:1px solid var(--kb-border);border-radius:10px;background:var(--kb-surface);color:inherit;font:inherit;text-align:left;cursor:pointer;transition:border-color .15s,box-shadow .15s}",
      ".dshwkb-row:hover{border-color:color-mix(in srgb,var(--kb-accent) 40%,var(--kb-border));box-shadow:0 2px 10px color-mix(in srgb,var(--kb-fg) 7%,transparent)}",
      ".dshwkb-row-title{font-size:13.5px;font-weight:600;line-height:20px;overflow-wrap:anywhere}",
      ".dshwkb-row-preview{font-size:12.5px;line-height:18px;color:var(--kb-fg2);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",
      ".dshwkb-row-foot{display:flex;flex-wrap:wrap;align-items:center;gap:3px 8px;margin-top:3px;font-size:11px;line-height:16px;color:var(--kb-fg3)}",
      ".dshwkb-row-tag{color:var(--kb-accent);font-weight:500}",
      ".dshwkb-row-sep{width:3px;height:3px;flex:none;border-radius:50%;background:currentColor;opacity:.55}",
      ".dshwkb-score{margin-left:auto;padding:0 6px;border-radius:999px;background:var(--kb-fill);color:var(--kb-fg2)}",
      ".dshwkb-detail{flex:1;min-height:0;display:flex;flex-direction:column;gap:10px}",
      ".dshwkb-detail-bar{display:flex;align-items:center;gap:6px;min-width:0}",
      ".dshwkb-back{display:inline-flex;align-items:center;gap:2px;height:28px;margin-right:auto;padding:0 8px 0 3px;border:0;border-radius:7px;background:transparent;color:var(--kb-fg2);font-size:12.5px;cursor:pointer}",
      ".dshwkb-back:hover{background:var(--kb-hover);color:var(--kb-fg)}",
      ".dshwkb-detail-title{font-size:16px;font-weight:650;line-height:23px;overflow-wrap:anywhere}",
      ".dshwkb-detail-meta{display:flex;flex-wrap:wrap;gap:3px 12px;font-size:11.5px;line-height:17px;color:var(--kb-fg3);overflow-wrap:anywhere}",
      ".dshwkb-detail-meta b{margin-right:4px;font-weight:500;color:var(--kb-fg2)}",
      ".dshwkb-detail-tags{display:flex;flex-wrap:wrap;gap:4px 8px;font-size:12px}",
      ".dshwkb-body{flex:1;min-height:0;margin:0;overflow:auto;padding:14px 16px;border:1px solid var(--kb-border);border-radius:10px;background:var(--kb-surface);font-family:inherit;font-size:13px;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere}",
      ".dshwkb-field{display:flex;flex-direction:column;gap:5px}",
      ".dshwkb-field>.dshwkb-input{flex:none}",
      ".dshwkb-label{font-size:12px;font-weight:500;line-height:17px;color:var(--kb-fg2)}",
      ".dshwkb-status{font-size:12px;line-height:18px;color:var(--kb-fg2);overflow-wrap:anywhere}",
      ".dshwkb-callout{display:flex;flex:none;gap:8px;align-items:flex-start;padding:8px 10px;border-radius:8px;background:var(--kb-accent-soft);color:var(--kb-fg2);font-size:12px;line-height:18px;overflow-wrap:anywhere}",
      ".dshwkb-callout svg{flex:none;margin-top:1px;color:var(--kb-accent)}",
      ".dshwkb-callout[data-kind=warn]{background:color-mix(in srgb,#d98a1f 12%,transparent)}",
      ".dshwkb-callout[data-kind=warn] svg{color:#c77a12}",
      ".dshwkb-notice{display:flex;align-items:center;gap:6px;flex:none;padding:6px 5px 6px 10px;border-radius:8px;font-size:12px;line-height:18px;overflow-wrap:anywhere;animation:dshwkb-in .18s ease-out}",
      ".dshwkb-notice[data-kind=ok]{background:color-mix(in srgb,var(--kb-ok) 12%,transparent);color:var(--kb-ok)}",
      ".dshwkb-notice[data-kind=error]{background:color-mix(in srgb,var(--kb-danger) 10%,transparent);color:var(--kb-danger)}",
      ".dshwkb-notice-text{flex:1;min-width:0}",
      ".dshwkb-notice .dshwkb-icon-btn{width:22px;height:22px;color:inherit;opacity:.7}",
      ".dshwkb-notice .dshwkb-icon-btn:hover:not(:disabled){opacity:1;background:transparent;color:inherit}",
      ".dshwkb-empty{display:flex;flex-direction:column;align-items:center;gap:8px;padding:36px 16px;text-align:center;color:var(--kb-fg3);font-size:12.5px;line-height:19px}",
      ".dshwkb-empty-icon{width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:var(--kb-fill);color:var(--kb-fg3)}",
      ".dshwkb-skeletons{display:flex;flex-direction:column;gap:6px}",
      ".dshwkb-skeleton{height:72px;border-radius:10px;background:linear-gradient(90deg,var(--kb-fill) 25%,color-mix(in srgb,var(--kb-fg) 9%,transparent) 50%,var(--kb-fill) 75%);background-size:200% 100%;animation:dshwkb-shimmer 1.3s linear infinite}",
      ".dshwkb-rail-button{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:10px;background:transparent;color:var(--dsw-alias-label-secondary,#68717e);cursor:pointer}",
      ".dshwkb-rail-button:hover{background:var(--dsw-alias-interactive-bg-hover,#e9edf3);color:var(--dsw-alias-label-primary,#1f2329)}",
      ".dshwkb-rail-button[data-active=true]{background:var(--dsw-alias-interactive-bg-selected,#dce8ff);color:var(--dsw-alias-state-business-primary,#3978e8)}",
      ".dshwkb-dropzone{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;flex:none;min-height:190px;padding:22px 18px;border:1.5px dashed color-mix(in srgb,var(--kb-accent) 35%,var(--kb-border));border-radius:12px;background:color-mix(in srgb,var(--kb-accent) 3%,var(--kb-surface));text-align:center;transition:border-color .15s,background .15s}",
      ".dshwkb-dropzone[data-over=true]{border-color:var(--kb-accent);background:var(--kb-accent-soft)}",
      ".dshwkb-drop-icon{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:var(--kb-accent-soft);color:var(--kb-accent)}",
      ".dshwkb-drop-title{font-size:14px;font-weight:600;line-height:20px}",
      ".dshwkb-drop-hint{max-width:420px;font-size:12px;line-height:18px;color:var(--kb-fg2)}",
      ".dshwkb-drop-note{max-width:440px;font-size:11px;line-height:16px;color:var(--kb-fg3)}",
      ".dshwkb-dropzone .dshwkb-primary{margin-top:4px}",
      ".dshwkb-imports-head{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;font-weight:600;color:var(--kb-fg2)}",
      ".dshwkb-imports{display:flex;flex-direction:column;gap:6px;overflow:auto;flex:1;min-height:0}",
      ".dshwkb-import-card{display:flex;flex-direction:column;flex:none;gap:6px;padding:10px 12px;border:1px solid var(--kb-border);border-left:3px solid var(--kb-ok);border-radius:10px;background:var(--kb-surface)}",
      ".dshwkb-import-card[data-kind=error]{border-left-color:var(--kb-danger)}",
      ".dshwkb-import-head{display:flex;flex-wrap:wrap;gap:6px;align-items:center}",
      ".dshwkb-import-name{flex:1;min-width:0;font-size:13px;font-weight:600;line-height:20px;overflow-wrap:anywhere}",
      ".dshwkb-badge{display:inline-flex;align-items:center;flex:none;height:20px;padding:0 7px;border-radius:999px;background:color-mix(in srgb,var(--kb-ok) 13%,transparent);color:var(--kb-ok);font-size:11px;font-weight:600}",
      ".dshwkb-badge[data-kind=error]{background:color-mix(in srgb,var(--kb-danger) 12%,transparent);color:var(--kb-danger)}",
      ".dshwkb-import-summary{font-size:12px;line-height:18px;color:var(--kb-fg2)}",
      ".dshwkb-import-notes{display:flex;flex-direction:column;gap:2px;max-height:120px;overflow:auto;font-size:11.5px;line-height:17px;color:var(--kb-fg3)}",
      ".dshwkb-import-stale{color:#c77a12}",
      ".dshwkb-import-actions{display:flex;align-items:center;gap:8px}",
      ".dshwkb-banned-foot{display:flex;align-items:center;justify-content:space-between;gap:8px}",
      "@keyframes dshwkb-in{from{opacity:0;transform:translateY(4px)}}",
      "@keyframes dshwkb-shimmer{to{background-position:-200% 0}}",
      "@container knowledge-panel (max-width:380px){.dshwkb-tabs{gap:14px}.dshwkb-mode{padding:0 8px}.dshwkb-row{padding:9px 11px}.dshwkb-head-actions>.dshwkb-primary{padding:0 8px 0 6px}.dshwkb-body{padding:12px 13px}}",
    ].join("\n");
    var tagId = "dsh-w-knowledge-base/styles";

    function installStyle() {
      if (typeof document === "undefined") return { owned: false, node: null };
      var existing = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]");
      if (existing) return { owned: false, node: existing };
      var node = document.createElement("style");
      node.dataset.plugin = "dsh-w-knowledge-base";
      node.dataset.pluginCss = tagId;
      node.textContent = CSS;
      document.head.appendChild(node);
      return { owned: true, node: node };
    }

    // ── Remote contribution (client face of the Host knowledgeBase service) ──
    var passthrough = { parse: function (value) { return value; } };
    function parameter(name) {
      return { name: name, wire: name, source: "json", codec: { mode: "strict", typeSymbol: "json", schema: passthrough } };
    }
    function descriptor(method, parameters) {
      return {
        id: "dsh-w-knowledge-base#knowledgeBase/" + method,
        service: "knowledgeBase",
        namespace: "knowledgeBase",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: { mode: "strict", typeSymbol: "json", schema: passthrough },
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-knowledge-base",
      descriptors: [
        descriptor("listNotes", [parameter("query"), parameter("tag"), parameter("limit")]),
        descriptor("readNote", [parameter("id")]),
        descriptor("saveNote", [parameter("input")]),
        descriptor("deleteNote", [parameter("id"), parameter("hard")]),
        descriptor("importDocument", [parameter("input")]),
        descriptor("getStats", []),
        descriptor("getMode", []),
        descriptor("setMode", [parameter("mode")]),
        descriptor("getBanned", []),
        descriptor("setBanned", [parameter("text")]),
      ],
    };

    // ── helpers ──────────────────────────────────────────────────────────
    function shortDate(iso) {
      if (typeof iso !== "string" || iso.length < 10) return "";
      return iso.slice(0, 10);
    }

    function parseTagInput(text) {
      return String(text || "").split(",").map(function (part) { return part.trim(); }).filter(function (part) { return part !== ""; });
    }

    function failureText(error) {
      if (!error) return "unknown error";
      if (typeof error === "string") return error;
      if (error.message) return String(error.message);
      try {
        return JSON.stringify(error);
      } catch (_) {
        return String(error);
      }
    }

    function IconBook() {
      return React.createElement("svg", { viewBox: "0 0 20 20", width: 18, height: 18, "aria-hidden": true },
        React.createElement("path", { d: "M4 4.5h5a2 2 0 012 2V16a2 2 0 00-2-1.6H4z", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinejoin: "round" }),
        React.createElement("path", { d: "M16 4.5h-5a2 2 0 00-2 2V16a2 2 0 012-1.6h5z", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinejoin: "round" })
      );
    }

    // Small stroke icons for buttons and empty states.
    function Icon(props) {
      var size = props.size || 16;
      return React.createElement("svg", { viewBox: "0 0 20 20", width: size, height: size, "aria-hidden": true, fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" },
        ICON_PATHS[props.name].map(function (d, index) { return React.createElement("path", { key: index, d: d }); })
      );
    }
    var ICON_PATHS = {
      search: ["M9 15.2a6.2 6.2 0 100-12.4 6.2 6.2 0 000 12.4z", "M13.5 13.5l3.7 3.7"],
      refresh: ["M16 10a6 6 0 01-10.5 4", "M4 10a6 6 0 0110.5-4", "M14.5 2.8V6h-3.2", "M5.5 17.2V14h3.2"],
      plus: ["M10 4.5v11", "M4.5 10h11"],
      back: ["M12 4.5L6.5 10l5.5 5.5"],
      upload: ["M10 13V3.5", "M6.5 7L10 3.5 13.5 7", "M4 12.5v2.2c0 .7.6 1.3 1.3 1.3h9.4c.7 0 1.3-.6 1.3-1.3v-2.2"],
      info: ["M10 17a7 7 0 100-14 7 7 0 000 14z", "M10 9.2v4.3", "M10 6.6v.1"],
      close: ["M5.5 5.5l9 9", "M14.5 5.5l-9 9"],
      notes: ["M5.5 3h6.5l3.5 3.5V16a1 1 0 01-1 1h-9a1 1 0 01-1-1V4a1 1 0 011-1z", "M11.5 3v4h4", "M7.5 10.5h5", "M7.5 13.5h3.5"],
    };

    // ── note list ────────────────────────────────────────────────────────
    function NoteRow(props) {
      var note = props.note;
      var t = props.t;
      var foot = (note.tags || []).map(function (tag) {
        return React.createElement("span", { className: "dshwkb-row-tag", key: "tag-" + tag }, "#" + tag);
      });
      if (foot.length > 0) foot.push(React.createElement("span", { className: "dshwkb-row-sep", key: "sep-tags", "aria-hidden": true }));
      foot.push(
        React.createElement("span", { key: "updated" }, shortDate(note.updated)),
        React.createElement("span", { className: "dshwkb-row-sep", key: "sep-chars", "aria-hidden": true }),
        React.createElement("span", { key: "chars" }, note.chars + " " + t("charsLabel"))
      );
      if (note.score > 0) foot.push(React.createElement("span", { className: "dshwkb-score", key: "score", title: t("scoreLabel") }, t("scoreLabel") + " " + note.score));
      return React.createElement("button", {
        type: "button",
        className: "dshwkb-row",
        onClick: function () { props.onOpen(note.id); },
      },
        React.createElement("span", { className: "dshwkb-row-title" }, note.title),
        note.preview ? React.createElement("span", { className: "dshwkb-row-preview" }, note.preview) : null,
        React.createElement("span", { className: "dshwkb-row-foot" }, foot)
      );
    }

    // ── one note, viewed or edited ────────────────────────────────────────
    function NoteDetail(props) {
      var t = props.t;
      var note = props.note;
      var editing = props.editing;
      var draft = props.draft;
      function metaItem(key, label, value) {
        return value ? React.createElement("span", { key: key }, React.createElement("b", null, label), value) : null;
      }
      var meta = editing && note.id === ""
        ? null
        : [
          metaItem("updated", t("updatedLabel"), shortDate(note.updated)),
          metaItem("created", t("createdLabel"), shortDate(note.created)),
          metaItem("source", t("sourceLabel"), note.source),
          metaItem("workspace", t("workspaceLabel"), note.workspace),
          metaItem("path", t("pathLabel"), note.path),
          metaItem("id", t("idLabel"), note.id),
        ];
      var actions = editing
        ? [
          React.createElement("button", { key: "cancel", type: "button", className: "dshwkb-ghost", disabled: props.busy, onClick: props.onCancel }, t("cancel")),
          React.createElement("button", { key: "save", type: "button", className: "dshwkb-primary", disabled: props.busy, onClick: props.onSave }, props.busy ? t("saving") : t("save")),
        ]
        : [
          React.createElement("button", { key: "edit", type: "button", className: "dshwkb-ghost", onClick: props.onEdit }, t("edit")),
          React.createElement("button", {
            key: "delete",
            type: "button",
            className: "dshwkb-ghost",
            "data-danger": "true",
            "data-armed": props.confirming || undefined,
            disabled: props.busy,
            onClick: props.onDelete,
          }, props.busy ? t("removing") : props.confirming ? t("confirmRemove") : t("remove")),
        ];
      var tags = !editing && note.tags && note.tags.length > 0
        ? React.createElement("div", { className: "dshwkb-detail-tags" }, note.tags.map(function (tag) {
          return React.createElement("span", { className: "dshwkb-row-tag", key: tag }, "#" + tag);
        }))
        : null;
      return React.createElement("div", { className: "dshwkb-detail" },
        React.createElement("div", { className: "dshwkb-detail-bar" },
          React.createElement("button", { type: "button", className: "dshwkb-back", onClick: props.onBack }, React.createElement(Icon, { name: "back" }), t("back")),
          actions
        ),
        React.createElement("div", { className: "dshwkb-detail-title" }, editing ? (draft.title || t("newNote")) : note.title),
        tags,
        meta ? React.createElement("div", { className: "dshwkb-detail-meta" }, meta) : null,
        editing
          ? React.createElement(React.Fragment, null,
            React.createElement("div", { className: "dshwkb-field" },
              React.createElement("label", { className: "dshwkb-label", htmlFor: "dshwkb-title" }, t("titleLabel")),
              React.createElement("input", {
                id: "dshwkb-title",
                className: "dshwkb-input",
                value: draft.title,
                placeholder: t("titlePlaceholder"),
                onChange: function (event) { props.onDraft({ title: event.target.value }); },
              })
            ),
            React.createElement("div", { className: "dshwkb-field" },
              React.createElement("label", { className: "dshwkb-label", htmlFor: "dshwkb-tags" }, t("tagsLabel")),
              React.createElement("input", {
                id: "dshwkb-tags",
                className: "dshwkb-input",
                value: draft.tags,
                onChange: function (event) { props.onDraft({ tags: event.target.value }); },
              })
            ),
            React.createElement("div", { className: "dshwkb-field", style: { flex: 1, minHeight: 0 } },
              React.createElement("label", { className: "dshwkb-label", htmlFor: "dshwkb-content" }, t("contentLabel")),
              React.createElement("textarea", {
                id: "dshwkb-content",
                className: "dshwkb-textarea",
                value: draft.content,
                placeholder: t("contentPlaceholder"),
                onChange: function (event) { props.onDraft({ content: event.target.value }); },
              })
            )
          )
          : React.createElement("pre", { className: "dshwkb-body" }, note.content)
      );
    }

    // ── the panel, mounted in Settings and in the right sidebar ───────────
    function KnowledgeBasePanel(props) {
      var t = typeof props.t === "function" ? props.t : function (key) { return key; };
      var kb = props.kb;
      var surface = props.surface === "sidebar" ? "sidebar" : "settings";

      var viewSlot = React.useState({ status: "loading", notes: [], total: 0, tags: [], root: "", warnings: [] });
      var view = viewSlot[0];
      var setView = viewSlot[1];
      var querySlot = React.useState("");
      var query = querySlot[0];
      var setQuery = querySlot[1];
      var tagSlot = React.useState("");
      var activeTag = tagSlot[0];
      var setActiveTag = tagSlot[1];
      var selectedSlot = React.useState(null);
      var selected = selectedSlot[0];
      var setSelected = selectedSlot[1];
      var editingSlot = React.useState(false);
      var editing = editingSlot[0];
      var setEditing = editingSlot[1];
      var draftSlot = React.useState({ title: "", tags: "", content: "" });
      var draft = draftSlot[0];
      var setDraft = draftSlot[1];
      var busySlot = React.useState(false);
      var busy = busySlot[0];
      var setBusy = busySlot[1];
      var modeSlot = React.useState("browse");
      var mode = modeSlot[0];
      var setMode = modeSlot[1];
      var importSlot = React.useState([]);
      var imports = importSlot[0];
      var setImports = importSlot[1];
      var importingSlot = React.useState(false);
      var importing = importingSlot[0];
      var setImporting = importingSlot[1];
      var dropOverSlot = React.useState(false);
      var dropOver = dropOverSlot[0];
      var setDropOver = dropOverSlot[1];
      var noticeSlot = React.useState(null);
      var notice = noticeSlot[0];
      var setNotice = noticeSlot[1];
      var confirmSlot = React.useState(false);
      var confirming = confirmSlot[0];
      var setConfirming = confirmSlot[1];
      // Working mode (assistant vs writing) is a host-side, cross-session
      // setting, distinct from the panel's own browse/feed view `mode` above.
      var workModeSlot = React.useState("assistant");
      var workMode = workModeSlot[0];
      var setWorkMode = workModeSlot[1];
      var switchingSlot = React.useState(false);
      var switching = switchingSlot[0];
      var setSwitching = switchingSlot[1];
      var bannedSlot = React.useState({ status: "idle", text: "", isDefault: false });
      var banned = bannedSlot[0];
      var setBanned = bannedSlot[1];
      var bannedSavingSlot = React.useState(false);
      var bannedSaving = bannedSavingSlot[0];
      var setBannedSaving = bannedSavingSlot[1];
      var mountedRef = React.useRef(true);
      var requestRef = React.useRef(0);

      React.useEffect(function () {
        mountedRef.current = true;
        return function () { mountedRef.current = false; };
      }, []);

      // Success notices fade on their own; errors stay until dismissed.
      React.useEffect(function () {
        if (!notice || notice.kind !== "ok") return undefined;
        var handle = window.setTimeout(function () { if (mountedRef.current) setNotice(null); }, 3200);
        return function () { window.clearTimeout(handle); };
      }, [notice]);

      React.useEffect(function () {
        if (typeof kb.getMode !== "function") return;
        kb.getMode().then(function (value) {
          if (mountedRef.current && value && value.mode) setWorkMode(value.mode);
        }, function () {});
      }, []);

      var load = React.useCallback(function (nextQuery, nextTag) {
        var requestId = ++requestRef.current;
        kb.list(nextQuery, nextTag).then(
          function (value) {
            if (!mountedRef.current || requestId !== requestRef.current) return;
            setView({
              status: "ready",
              notes: value.notes || [],
              total: value.total || 0,
              tags: value.tags || [],
              root: value.root || "",
              warnings: value.warnings || [],
            });
          },
          function (error) {
            if (!mountedRef.current || requestId !== requestRef.current) return;
            setView(function (current) {
              return { status: "error", notes: [], total: 0, tags: current.tags, root: current.root, warnings: [] };
            });
            setNotice({ kind: "error", text: t("error") + ": " + failureText(error) });
          }
        );
      }, [kb, t]);

      React.useEffect(function () {
        var handle = window.setTimeout(function () { load(query, activeTag); }, query === "" ? 0 : 260);
        return function () { window.clearTimeout(handle); };
      }, [load, query, activeTag]);

      function openNote(id) {
        setNotice(null);
        setConfirming(false);
        kb.read(id).then(
          function (value) {
            if (!mountedRef.current) return;
            if (!value || !value.note) {
              setNotice({ kind: "error", text: t("error") + ": " + id });
              load(query, activeTag);
              return;
            }
            setSelected(value.note);
            setEditing(false);
          },
          function (error) {
            if (!mountedRef.current) return;
            setNotice({ kind: "error", text: t("error") + ": " + failureText(error) });
          }
        );
      }

      function startCreate() {
        setNotice(null);
        setConfirming(false);
        setSelected({ id: "", title: "", tags: [], content: "", created: "", updated: "", chars: 0, path: "", source: "", workspace: "" });
        setDraft({ title: "", tags: "", content: "" });
        setEditing(true);
      }

      function feedReason(result) {
        var error = result && result.error ? result.error : null;
        var code = error && error.code ? error.code : "";
        if (code === "KB_IMPORT_BINARY") return t("reasonBinaryContent");
        if (code === "KB_IMPORT_EMPTY") return t("reasonEmpty");
        if (code === "KB_IMPORT_TOO_LARGE") return t("reasonTooLarge") + failureText(error);
        return failureText(error);
      }

      // Novel .txt files are frequently GBK/GB18030, not UTF-8, so decode the
      // raw bytes ourselves: a strict UTF-8 attempt first, then the legacy CJK
      // codecs the browser's own TextDecoder ships with. A plain readAsText()
      // would assume UTF-8 and turn a GBK book into mojibake.
      function decodeBytes(buffer) {
        var bytes = new Uint8Array(buffer);
        if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
          return new TextDecoder("utf-8").decode(bytes.subarray(3));
        }
        if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
          return new TextDecoder("utf-16le").decode(bytes.subarray(2));
        }
        if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
          return new TextDecoder("utf-16be").decode(bytes.subarray(2));
        }
        try {
          return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
        } catch (utf8Error) {
          var codecs = ["gb18030", "big5"];
          for (var i = 0; i < codecs.length; i += 1) {
            try {
              var text = new TextDecoder(codecs[i]).decode(bytes);
              if (text.indexOf("�") === -1) return text;
            } catch (legacyError) { /* try the next codec */ }
          }
          return new TextDecoder("gb18030").decode(bytes);
        }
      }

      function readFileText(file) {
        var readBuffer = file && typeof file.arrayBuffer === "function"
          ? file.arrayBuffer()
          : new Promise(function (resolveFile, rejectFile) {
              var reader = new FileReader();
              reader.onload = function () { resolveFile(reader.result); };
              reader.onerror = function () { rejectFile(new Error("could not read " + file.name)); };
              reader.readAsArrayBuffer(file);
            });
        return Promise.resolve(readBuffer).then(function (buffer) { return decodeBytes(buffer); });
      }

      function feedFiles(list) {
        var files = Array.prototype.slice.call(list || []);
        if (files.length === 0) return;
        setImporting(true);
        setNotice(null);
        var chain = Promise.resolve();
        files.forEach(function (file) {
          chain = chain.then(function () {
            return readFileText(file).then(function (text) {
              return kb.importDocument({ name: file.name, text: text, tags: [] }).then(function (value) {
                if (!mountedRef.current) return;
                setImports(function (current) {
                  var next = current.slice();
                  next.unshift({ name: file.name, ok: true, value: value });
                  return next;
                });
              });
            }).catch(function (error) {
              if (!mountedRef.current) return;
              var message;
              if (error && error.code && (error.code === "KB_IMPORT_BINARY" || error.code === "KB_IMPORT_EMPTY" || error.code === "KB_IMPORT_TOO_LARGE")) {
                message = feedReason({ error: error });
              } else {
                message = failureText(error);
              }
              setImports(function (current) {
                var next = current.slice();
                next.unshift({ name: file.name, ok: false, error: message });
                return next;
              });
            });
          });
        });
        chain.then(function () {
          if (mountedRef.current) setImporting(false);
        });
      }

      function startEdit() {
        if (selected === null) return;
        setNotice(null);
        setDraft({ title: selected.title, tags: (selected.tags || []).join(", "), content: selected.content || "" });
        setEditing(true);
      }

      function backToList() {
        setSelected(null);
        setEditing(false);
        setConfirming(false);
        setNotice(null);
        load(query, activeTag);
      }

      function commit() {
        if (selected === null) return;
        if (draft.title.trim() === "" || draft.content.trim() === "") {
          setNotice({ kind: "error", text: t("needTitle") });
          return;
        }
        setBusy(true);
        var payload = { title: draft.title, content: draft.content, tags: parseTagInput(draft.tags) };
        if (selected.id !== "") payload.id = selected.id;
        kb.save(payload).then(
          function (value) {
            if (!mountedRef.current) return;
            setBusy(false);
            setEditing(false);
            setSelected(value && value.note ? value.note : null);
            setNotice({ kind: "ok", text: t("saved") });
            load(query, activeTag);
          },
          function (error) {
            if (!mountedRef.current) return;
            setBusy(false);
            setNotice({ kind: "error", text: t("error") + ": " + failureText(error) });
          }
        );
      }

      function removeNote() {
        if (selected === null || selected.id === "") return;
        if (!confirming) {
          setConfirming(true);
          return;
        }
        setBusy(true);
        kb.remove(selected.id).then(
          function () {
            if (!mountedRef.current) return;
            setBusy(false);
            setConfirming(false);
            setSelected(null);
            setEditing(false);
            setNotice({ kind: "ok", text: t("removed") });
            load(query, activeTag);
          },
          function (error) {
            if (!mountedRef.current) return;
            setBusy(false);
            setNotice({ kind: "error", text: t("error") + ": " + failureText(error) });
          }
        );
      }

      var chips = view.tags.length === 0 ? null : React.createElement("div", { className: "dshwkb-tags" },
        React.createElement("button", {
          type: "button",
          className: "dshwkb-chip",
          "data-active": activeTag === "" || undefined,
          onClick: function () { setActiveTag(""); },
        }, t("allTags")),
        view.tags.map(function (entry) {
          return React.createElement("button", {
            type: "button",
            className: "dshwkb-chip",
            key: "chip-" + entry.tag,
            "data-active": activeTag === entry.tag || undefined,
            onClick: function () { setActiveTag(activeTag === entry.tag ? "" : entry.tag); },
          }, entry.tag, React.createElement("span", { className: "dshwkb-chip-count" }, entry.count));
        })
      );

      var body;
      if (selected !== null) {
        body = React.createElement(NoteDetail, {
          t: t,
          note: selected,
          editing: editing,
          draft: draft,
          busy: busy,
          confirming: confirming,
          onBack: backToList,
          onEdit: startEdit,
          onSave: commit,
          onCancel: function () {
            if (selected.id === "") backToList();
            else setEditing(false);
          },
          onDelete: removeNote,
          onDraft: function (patch) {
            setDraft(function (current) {
              return {
                title: patch.title === undefined ? current.title : patch.title,
                tags: patch.tags === undefined ? current.tags : patch.tags,
                content: patch.content === undefined ? current.content : patch.content,
              };
            });
          },
        });
      } else if (view.status === "loading") {
        body = React.createElement("div", { className: "dshwkb-skeletons", "aria-busy": "true", "aria-label": t("loading") },
          [0, 1, 2].map(function (index) { return React.createElement("div", { className: "dshwkb-skeleton", key: index, style: { opacity: 1 - index * 0.25 } }); })
        );
      } else if (view.notes.length === 0) {
        var pristine = query === "" && activeTag === "";
        body = React.createElement("div", { className: "dshwkb-empty" },
          React.createElement("span", { className: "dshwkb-empty-icon" }, React.createElement(Icon, { name: pristine ? "notes" : "search", size: 20 })),
          pristine ? t("empty") : t("emptyQuery"),
          pristine ? React.createElement("button", { type: "button", className: "dshwkb-link", style: { alignSelf: "center" }, onClick: function () { setMode("feed"); } }, t("browseHint")) : null
        );
      } else {
        body = React.createElement("div", { className: "dshwkb-list" },
          view.notes.map(function (note) {
            return React.createElement(NoteRow, { key: note.id, note: note, t: t, onOpen: openNote });
          })
        );
      }

      var pickerRef = React.useRef(null);

      function pickFiles() {
        if (pickerRef.current) pickerRef.current.click();
      }

      function onFilePicked(event) {
        feedFiles(event.target.files);
        event.target.value = "";
      }

      function viewNotes(slug) {
        setMode("browse");
        setActiveTag(slug);
        setQuery("");
        setSelected(null);
        setNotice(null);
      }

      function renderImportResult(entry, index) {
        var inner;
        if (!entry.ok) {
          inner = React.createElement("div", { className: "dshwkb-import-summary" }, t("importFailed") + ": " + entry.error);
        } else {
          var value = entry.value || {};
          var counts = value.counts || { created: 0, updated: 0, stale: 0 };
          var summaryParts = [];
          summaryParts.push(t("resultCreated").replace("{created}", String(counts.created)));
          summaryParts.push(t("resultUpdated").replace("{updated}", String(counts.updated)));
          var summary = summaryParts.join(t("resultComma"));
          var noteLines = (value.notes || []).map(function (note) {
            return "· " + note.title;
          });
          var staleLines = (value.stale || []).map(function (note) {
            return t("resultStale").replace("{stale}", "1") + ": " + note.title;
          });
          inner = React.createElement(React.Fragment, null,
            React.createElement("div", { className: "dshwkb-import-summary" }, summary),
            noteLines.length > 0
              ? React.createElement("div", { className: "dshwkb-import-notes" },
                noteLines.map(function (line, lineIndex) {
                  return React.createElement("span", { key: "note-" + lineIndex }, line);
                }))
              : null,
            counts.stale > 0 && staleLines.length > 0
              ? React.createElement("div", { className: "dshwkb-import-notes dshwkb-import-stale" },
                staleLines.map(function (line, lineIndex) {
                  return React.createElement("span", { key: "stale-" + lineIndex }, line);
                }))
              : null,
            React.createElement("button", { type: "button", className: "dshwkb-link", onClick: function () { viewNotes(value.docSlug || ""); } }, t("viewNotes") + " →")
          );
        }
        return React.createElement("div", { className: "dshwkb-import-card", "data-kind": entry.ok ? "ok" : "error", key: "import-" + index + "-" + entry.name },
          React.createElement("div", { className: "dshwkb-import-head" },
            React.createElement("span", { className: "dshwkb-import-name" }, entry.name),
            React.createElement("span", { className: "dshwkb-badge", "data-kind": entry.ok ? "ok" : "error" }, t(entry.ok ? "dropped" : "importFailed"))
          ),
          inner
        );
      }

      function renderFeed() {
        return React.createElement(React.Fragment, null,
          React.createElement("div", {
            className: "dshwkb-dropzone",
            "data-over": dropOver || undefined,
            onDragEnter: function (event) {
              event.preventDefault();
              setDropOver(true);
            },
            onDragOver: function (event) {
              event.preventDefault();
              setDropOver(true);
            },
            onDragLeave: function (event) {
              // dragleave also fires when the pointer crosses into a child
              // element; only clear the highlight when it leaves the zone.
              if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget)) return;
              setDropOver(false);
            },
            onDrop: function (event) {
              event.preventDefault();
              setDropOver(false);
              feedFiles(event.dataTransfer && event.dataTransfer.files);
            },
          },
            React.createElement("span", { className: "dshwkb-drop-icon" }, React.createElement(Icon, { name: "upload", size: 22 })),
            React.createElement("span", { className: "dshwkb-drop-title" }, importing ? t("feeding") : t("dropTitle")),
            React.createElement("span", { className: "dshwkb-drop-hint" }, t("dropHint")),
            React.createElement("button", { type: "button", className: "dshwkb-primary", onClick: pickFiles, disabled: importing }, t("dropBrowse")),
            React.createElement("span", { className: "dshwkb-drop-note" }, t("dropNote"))
          ),
          React.createElement("input", {
            ref: pickerRef,
            type: "file",
            multiple: true,
            accept: ".md,.markdown,.txt,.log,.csv,.json,.yaml,.yml,.tsv",
            style: { display: "none" },
            onChange: onFilePicked,
          }),
          imports.length === 0
            ? null
            : React.createElement(React.Fragment, null,
              React.createElement("div", { className: "dshwkb-imports-head" },
                React.createElement("span", null, t("importResults")),
                React.createElement("button", { type: "button", className: "dshwkb-link", disabled: importing, onClick: function () { setImports([]); } }, t("clearResults"))
              ),
              React.createElement("div", { className: "dshwkb-imports" }, imports.map(renderImportResult))
            )
        );
      }

      function switchWorkingMode(next) {
        if (next === workMode || switching) return;
        setSwitching(true);
        kb.setMode(next).then(
          function (value) {
            if (!mountedRef.current) return;
            setSwitching(false);
            var applied = (value && value.mode) || next;
            setWorkMode(applied);
            setMode("browse"); setSelected(null); setEditing(false);
            setQuery(""); setActiveTag("");
            setNotice({ kind: "ok", text: applied === "writing" ? t("switchedWriting") : t("switchedAssistant") });
            load("", "");
          },
          function (error) {
            if (!mountedRef.current) return;
            setSwitching(false);
            setNotice({ kind: "error", text: t("error") + ": " + failureText(error) });
          }
        );
      }

      function openBanned() {
        setMode("banned"); setSelected(null); setEditing(false); setNotice(null);
        setBanned({ status: "loading", text: "", isDefault: false });
        kb.getBanned().then(
          function (value) {
            if (!mountedRef.current) return;
            setBanned({ status: "ready", text: (value && value.text) || "", isDefault: !!(value && value.isDefault) });
          },
          function (error) {
            if (!mountedRef.current) return;
            setBanned({ status: "error", text: "", isDefault: false });
            setNotice({ kind: "error", text: t("error") + ": " + failureText(error) });
          }
        );
      }

      function saveBanned() {
        setBannedSaving(true);
        kb.setBanned(banned.text).then(
          function () {
            if (!mountedRef.current) return;
            setBannedSaving(false);
            setBanned(function (current) { return { status: "ready", text: current.text, isDefault: false }; });
            setNotice({ kind: "ok", text: t("bannedSaved") });
          },
          function (error) {
            if (!mountedRef.current) return;
            setBannedSaving(false);
            setNotice({ kind: "error", text: t("error") + ": " + failureText(error) });
          }
        );
      }

      function renderBanned() {
        var phraseCount = banned.text.split(/\r?\n/).filter(function (line) {
          var trimmed = line.trim();
          return trimmed !== "" && trimmed.charAt(0) !== "#";
        }).length;
        return React.createElement("div", { className: "dshwkb-detail" },
          React.createElement("div", { className: "dshwkb-callout" }, React.createElement(Icon, { name: "info" }),
            React.createElement("span", null, t("bannedHint"), banned.isDefault ? " " + t("bannedDefault") : "")
          ),
          React.createElement("textarea", {
            className: "dshwkb-textarea",
            value: banned.text,
            placeholder: t("bannedPlaceholder"),
            spellCheck: false,
            onChange: function (event) {
              var val = event.target.value;
              setBanned(function () { return { status: "ready", text: val, isDefault: false }; });
            },
          }),
          React.createElement("div", { className: "dshwkb-banned-foot" },
            React.createElement("span", { className: "dshwkb-status" }, banned.status === "ready" ? phraseCount + " " + t("bannedCount") : ""),
            React.createElement("button", {
              type: "button",
              className: "dshwkb-primary",
              // After a failed load the editor holds "", and saving would wipe the stored list.
              disabled: bannedSaving || banned.status !== "ready",
              onClick: saveBanned,
            }, bannedSaving ? t("saving") : t("bannedSave"))
          )
        );
      }

      return React.createElement("section", { className: "dshwkb-panel", "data-surface": surface },
        React.createElement("div", { className: "dshwkb-head" },
          React.createElement("div", { className: "dshwkb-head-top" },
            React.createElement("div", { className: "dshwkb-headings" },
              surface === "settings" ? React.createElement("div", { className: "dshwkb-title" }, t("title")) : null,
              React.createElement("div", { className: "dshwkb-meta", title: view.root || undefined }, React.createElement("b", null, view.total), t("countLabel"))
            ),
            React.createElement("div", { className: "dshwkb-modebar", "data-role": "working", role: "radiogroup", "aria-label": t("workModeLabel") },
              React.createElement("button", {
                type: "button",
                className: "dshwkb-mode",
                role: "radio",
                "aria-checked": workMode === "assistant",
                disabled: switching,
                "data-active": workMode === "assistant" || undefined,
                onClick: function () { switchWorkingMode("assistant"); },
              }, t("workAssistant")),
              React.createElement("button", {
                type: "button",
                className: "dshwkb-mode",
                role: "radio",
                "aria-checked": workMode === "writing",
                disabled: switching,
                "data-active": workMode === "writing" || undefined,
                onClick: function () { switchWorkingMode("writing"); },
              }, t("workWriting"))
            )
          ),
          React.createElement("div", { className: "dshwkb-head-actions" },
            React.createElement("div", { className: "dshwkb-tabs", role: "tablist" },
              React.createElement("button", {
                type: "button",
                className: "dshwkb-tab",
                role: "tab",
                "aria-selected": mode === "browse",
                "data-active": mode === "browse" || undefined,
                onClick: function () { setMode("browse"); setSelected(null); setEditing(false); setNotice(null); },
              }, t("modeNotes")),
              React.createElement("button", {
                type: "button",
                className: "dshwkb-tab",
                role: "tab",
                "aria-selected": mode === "feed",
                "data-active": mode === "feed" || undefined,
                onClick: function () { setMode("feed"); setSelected(null); setEditing(false); setNotice(null); },
              }, t("modeFeed")),
              workMode === "writing"
                ? React.createElement("button", {
                  type: "button",
                  className: "dshwkb-tab",
                  role: "tab",
                  "aria-selected": mode === "banned",
                  "data-active": mode === "banned" || undefined,
                  onClick: openBanned,
                }, t("modeBanned"))
                : null
            ),
            mode !== "banned" && selected === null
              ? React.createElement("button", { type: "button", className: "dshwkb-primary", onClick: startCreate }, React.createElement(Icon, { name: "plus", size: 14 }), t("create"))
              : null
          )
        ),
        workMode === "writing" && mode !== "banned" && selected === null
          ? React.createElement("div", { className: "dshwkb-callout" }, React.createElement(Icon, { name: "info" }), React.createElement("span", null, t("workHintWriting")))
          : null,
        mode === "banned"
          ? renderBanned()
          : mode === "feed"
          ? renderFeed()
          : React.createElement(React.Fragment, null,
            selected === null
              ? React.createElement("div", { className: "dshwkb-searchrow" },
                React.createElement(Icon, { name: "search", size: 15 }),
                React.createElement("input", {
                  className: "dshwkb-input",
                  type: "search",
                  value: query,
                  placeholder: t("searchPlaceholder"),
                  "aria-label": t("searchPlaceholder"),
                  onChange: function (event) { setQuery(event.target.value); },
                }),
                React.createElement("button", { type: "button", className: "dshwkb-icon-btn", title: t("refresh"), "aria-label": t("refresh"), onClick: function () { load(query, activeTag); } }, React.createElement(Icon, { name: "refresh", size: 15 }))
              )
              : null,
            selected === null ? chips : null,
            view.warnings.length > 0 && selected === null
              ? React.createElement("div", { className: "dshwkb-callout", "data-kind": "warn" }, React.createElement(Icon, { name: "info" }), React.createElement("span", null, t("warnings") + ": " + view.warnings.join("; ")))
              : null,
            body
          ),
        notice !== null
          ? React.createElement("div", { className: "dshwkb-notice", "data-kind": notice.kind, role: notice.kind === "error" ? "alert" : "status" },
            React.createElement("span", { className: "dshwkb-notice-text" }, notice.text),
            React.createElement("button", { type: "button", className: "dshwkb-icon-btn", "aria-label": t("dismiss"), onClick: function () { setNotice(null); } }, React.createElement(Icon, { name: "close", size: 13 }))
          )
          : null
      );
    }

    function SettingsSection(props) {
      return React.createElement(KnowledgeBasePanel, Object.assign({}, props, { surface: "settings" }));
    }

    function SidebarPage(props) {
      return React.createElement(KnowledgeBasePanel, Object.assign({}, props, { surface: "sidebar" }));
    }

    function SidebarCard(props) {
      var t = typeof props.t === "function" ? props.t : function (key) { return key; };
      return React.createElement("button", {
        type: "button",
        className: "dshwrs-tool-card",
        onClick: function () { props.onOpen("knowledge-base", t("title")); },
        "aria-label": t("title"),
      },
        React.createElement("span", { className: "dshwrs-tool-card-icon", "aria-hidden": true }, React.createElement(IconBook, null)),
        React.createElement("span", { className: "dshwrs-tool-card-copy" },
          React.createElement("span", { className: "dshwrs-tool-card-title" }, t("title")),
          React.createElement("span", { className: "dshwrs-tool-card-description" }, t("cardDescription"))
        )
      );
    }

    function SidebarRail(props) {
      var t = typeof props.t === "function" ? props.t : function (key) { return key; };
      return React.createElement("button", {
        type: "button",
        className: "dshwkb-rail-button",
        "data-active": props.activeId === "knowledge-base" || undefined,
        title: t("rail"),
        "aria-label": t("rail"),
        onClick: function () { props.onSelect("knowledge-base", t("title")); },
      }, React.createElement(IconBook, null));
    }

    // ── plugin ───────────────────────────────────────────────────────────
    var NS = "dshWKnowledgeBase";
    var inject = ["slots", "locale", "remote"];
    var dicts = {
      zh: {
        "nav": "\u77e5\u8bc6\u5e93",
        "title": "\u77e5\u8bc6\u5e93",
        "cardDescription": "\u6d4f\u89c8\u3001\u641c\u7d22\u5e76\u7f16\u8f91 AI \u7684\u957f\u671f\u7b14\u8bb0",
        "rail": "\u6253\u5f00\u77e5\u8bc6\u5e93",
        "searchPlaceholder": "\u641c\u7d22\u6807\u9898\u3001\u6b63\u6587\u6216\u6807\u7b7e\u2026",
        "refresh": "\u5237\u65b0",
        "create": "\u65b0\u5efa\u7b14\u8bb0",
        "loading": "\u6b63\u5728\u8bfb\u53d6\u77e5\u8bc6\u5e93\u2026",
        "empty": "\u77e5\u8bc6\u5e93\u8fd8\u662f\u7a7a\u7684\u3002AI \u7528 kb_save \u4fdd\u5b58\u7684\u7b14\u8bb0\u4f1a\u51fa\u73b0\u5728\u8fd9\u91cc\u3002",
        "emptyQuery": "\u6ca1\u6709\u5339\u914d\u7684\u7b14\u8bb0\u3002",
        "allTags": "\u5168\u90e8",
        "countLabel": "\u6761\u7b14\u8bb0",
        "charsLabel": "\u5b57",
        "back": "\u8fd4\u56de\u5217\u8868",
        "edit": "\u7f16\u8f91",
        "save": "\u4fdd\u5b58",
        "saving": "\u4fdd\u5b58\u4e2d\u2026",
        "cancel": "\u53d6\u6d88",
        "remove": "\u5220\u9664",
        "confirmRemove": "\u786e\u8ba4\u5220\u9664\uff1f",
        "removing": "\u5220\u9664\u4e2d\u2026",
        "removed": "\u7b14\u8bb0\u5df2\u79fb\u5165\u56de\u6536\u76ee\u5f55 .trash\u3002",
        "saved": "\u5df2\u4fdd\u5b58\u3002",
        "titleLabel": "\u6807\u9898",
        "tagsLabel": "\u6807\u7b7e\uff08\u82f1\u6587\u9017\u53f7\u5206\u9694\uff09",
        "contentLabel": "\u6b63\u6587\uff08Markdown\uff09",
        "titlePlaceholder": "\u8fd9\u6761\u7b14\u8bb0\u56de\u7b54\u7684\u95ee\u9898",
        "contentPlaceholder": "\u7ed3\u8bba\u3001\u547d\u4ee4\u3001\u8def\u5f84\u3001\u5751\u70b9\u2026",
        "newNote": "\u65b0\u7b14\u8bb0",
        "idLabel": "\u7f16\u53f7",
        "updatedLabel": "\u66f4\u65b0\u4e8e",
        "createdLabel": "\u521b\u5efa\u4e8e",
        "sourceLabel": "\u6765\u6e90",
        "workspaceLabel": "\u5de5\u4f5c\u533a",
        "pathLabel": "\u6587\u4ef6",
        "error": "\u64cd\u4f5c\u5931\u8d25",
        "retry": "\u91cd\u8bd5",
        "needTitle": "\u8bf7\u5148\u586b\u5199\u6807\u9898\u548c\u6b63\u6587\u3002",
        "warnings": "\u7d22\u5f15\u63d0\u793a",
        "scoreLabel": "\u76f8\u5173\u5ea6",
        "modeNotes": "\u7b14\u8bb0",
        "modeFeed": "\u6295\u5582",
        "dropTitle": "\u628a\u6587\u6863\u62d6\u5230\u8fd9\u91cc",
        "dropHint": "\u81ea\u52a8\u5207\u6bb5\u3001\u81ea\u52a8\u8d77\u6807\u9898\u548c\u6807\u7b7e\uff1b\u91cd\u590d\u6295\u5582\u540c\u4e00\u4efd\u6587\u6863\u4f1a\u66f4\u65b0\u65e7\u7b14\u8bb0\u800c\u4e0d\u662f\u65b0\u5efa\u4e00\u5806\u3002",
        "dropNote": "\u652f\u6301 .md / .txt / .log / .csv / .json / .yaml \u7b49\u6587\u672c\uff1bPDF\u3001Word\u3001\u538b\u7f29\u5305\u8bf7\u5148\u8f6c\u6210\u6587\u672c\u3002\u5355\u6587\u4ef6\u4e0a\u9650\u7ea6 400 KB\uff08\u53ef\u914d\u7f6e\uff09\u3002",
        "dropBrowse": "\u9009\u62e9\u6587\u4ef6",
        "feeding": "\u6b63\u5728\u6295\u5582\u2026",
        "browseHint": "\u4e0d\u60f3\u4e00\u6761\u6761\u5199\uff1f\u628a\u6587\u6863\u62d6\u8fdb\u8fd9\u91cc\u76f4\u63a5\u6295\u5582 \u2192",
        "resultCreated": "\u65b0\u5efa {created} \u6761",
        "resultUpdated": "\u66f4\u65b0 {updated} \u6761",
        "resultStale": "\u65e7\u7b14\u8bb0 {stale} \u6761\u5df2\u65e0\u5bf9\u5e94\u7ae0\u8282",
        "resultComma": "\uff0c",
        "resultEmpty": "\u8fd9\u4efd\u6587\u6863\u6ca1\u6709\u53ef\u5199\u5165\u7684\u6587\u672c\u3002",
        "viewNotes": "\u67e5\u770b\u8fd9\u4e9b\u7b14\u8bb0",
        "reasonBinaryType": "\u4e0d\u652f\u6301\u7684\u6587\u4ef6\u7c7b\u578b\uff1a",
        "reasonBinaryContent": "\u8fd9\u4e2a\u6587\u4ef6\u662f\u4e8c\u8fdb\u5236\u5185\u5bb9\uff0c\u4e0d\u662f\u6587\u672c\u3002",
        "reasonEmpty": "\u6587\u4ef6\u91cc\u6ca1\u6709\u6587\u5b57\u3002",
        "reasonTooLarge": "\u6587\u4ef6\u592a\u5927\uff1a",
        "importFailed": "\u6295\u5582\u5931\u8d25",
        "dropped": "\u5df2\u6295\u5582",
        "partsLabel": "\u6bb5",
        "workAssistant": "\u52a9\u624b\u6a21\u5f0f",
        "workWriting": "\u5199\u4f5c\u6a21\u5f0f",
        "workHintWriting": "\u5199\u4f5c\u6a21\u5f0f\uff1a\u8fd9\u91cc\u662f\u4f9b\u6a21\u578b\u5b66\u6587\u98ce\u7684\u771f\u4eba\u5c0f\u8bf4\u7d20\u6750\u5e93\uff08\u4e0e\u52a9\u624b\u7b14\u8bb0\u5206\u5f00\u5b58\u653e\uff09\u3002\u628a\u53c2\u8003\u5c0f\u8bf4 txt \u6295\u5582\u8fdb\u6765\u3002",
        "switchedWriting": "\u5df2\u5207\u5230\u5199\u4f5c\u6a21\u5f0f\u3002",
        "switchedAssistant": "\u5df2\u5207\u56de\u52a9\u624b\u6a21\u5f0f\u3002",
        "modeBanned": "\u7981\u7528\u5957\u8def",
        "bannedTitle": "\u7981\u7528\u5957\u8def\u8868",
        "bannedHint": "\u5199\u4f5c\u6a21\u5f0f\u4e0b\u6ce8\u5165\u7ed9\u6a21\u578b\uff0c\u8ba9\u5b83\u907f\u5f00\u8fd9\u4e9b\u88ab\u5199\u70c2\u7684 AI \u8154\u8868\u8fbe\u3002\u4e00\u884c\u4e00\u4e2a\uff0c# \u5f00\u5934\u662f\u6ce8\u91ca\u3002",
        "bannedPlaceholder": "\u4e94\u5473\u6742\u9648\n\u5634\u89d2\u52fe\u8d77\u4e00\u62b9\u5f27\u5ea6\n\u2026",
        "bannedSave": "\u4fdd\u5b58\u5957\u8def\u8868",
        "bannedSaved": "\u5df2\u4fdd\u5b58\u7981\u7528\u5957\u8def\u8868\u3002",
        "bannedDefault": "\u5f53\u524d\u7528\u7684\u662f\u5185\u7f6e\u9ed8\u8ba4\u8868\uff0c\u4fdd\u5b58\u540e\u53d8\u4e3a\u4f60\u81ea\u5df1\u7684\u3002",
        "bannedCount": "\u6761",
        "workModeLabel": "\u5de5\u4f5c\u6a21\u5f0f",
        "dismiss": "\u5173\u95ed\u63d0\u793a",
        "importResults": "\u672c\u6b21\u6295\u5582",
        "clearResults": "\u6e05\u7a7a\u8bb0\u5f55",
      },
      en: {
        "nav": "Knowledge base",
        "title": "Knowledge base",
        "cardDescription": "Browse, search, and edit the agent's long-term notes",
        "rail": "Open the knowledge base",
        "searchPlaceholder": "Search titles, bodies, and tags\u2026",
        "refresh": "Refresh",
        "create": "New note",
        "loading": "Reading the knowledge base\u2026",
        "empty": "The knowledge base is empty. Notes saved with kb_save show up here.",
        "emptyQuery": "No note matches this query.",
        "allTags": "All",
        "countLabel": "notes",
        "charsLabel": "chars",
        "back": "Back to list",
        "edit": "Edit",
        "save": "Save",
        "saving": "Saving\u2026",
        "cancel": "Cancel",
        "remove": "Delete",
        "confirmRemove": "Delete this note?",
        "removing": "Deleting\u2026",
        "removed": "The note was moved to the .trash directory.",
        "saved": "Saved.",
        "titleLabel": "Title",
        "tagsLabel": "Tags (comma separated)",
        "contentLabel": "Body (Markdown)",
        "titlePlaceholder": "The question this note answers",
        "contentPlaceholder": "Conclusion, commands, paths, pitfalls\u2026",
        "newNote": "New note",
        "idLabel": "id",
        "updatedLabel": "updated",
        "createdLabel": "created",
        "sourceLabel": "source",
        "workspaceLabel": "workspace",
        "pathLabel": "file",
        "error": "Operation failed",
        "retry": "Retry",
        "needTitle": "A title and a body are required.",
        "warnings": "Index warnings",
        "scoreLabel": "score",
        "modeNotes": "Notes",
        "modeFeed": "Feed",
        "dropTitle": "Drop documents here",
        "dropHint": "Each file is split into focused notes automatically: derived titles, import tags, and re-feeding the same document updates its notes instead of duplicating them.",
        "dropNote": "Text files work (.md/.txt/.log/.csv/.json/.yaml); convert PDF, Word, and archives to text first. About 400 KB per file (configurable).",
        "dropBrowse": "Choose a file",
        "feeding": "Feeding…",
        "browseHint": "Don't want to write notes one by one? Drop a document here to feed it →",
        "resultCreated": "{created} created",
        "resultUpdated": "{updated} updated",
        "resultStale": "{stale} older notes no longer have a section",
        "resultComma": ", ",
        "resultEmpty": "This document has no text to write.",
        "viewNotes": "View these notes",
        "reasonBinaryType": "Unsupported file type: ",
        "reasonBinaryContent": "This file is binary, not text.",
        "reasonEmpty": "There is no text in this file.",
        "reasonTooLarge": "File too large: ",
        "importFailed": "Feed failed",
        "dropped": "Fed",
        "partsLabel": "parts",
        "workAssistant": "Assistant",
        "workWriting": "Writing",
        "workHintWriting": "Writing mode: a corpus of real, human-written prose the model studies for texture (kept separate from your assistant notes). Feed reference novels in as .txt.",
        "switchedWriting": "Switched to writing mode.",
        "switchedAssistant": "Switched back to assistant mode.",
        "modeBanned": "Clichés",
        "bannedTitle": "Banned clichés",
        "bannedHint": "Injected in writing mode so the model avoids these overused AI-tells. One per line; # starts a comment.",
        "bannedPlaceholder": "opened her mouth to speak\na complicated look flashed in his eyes\n…",
        "bannedSave": "Save list",
        "bannedSaved": "Banned-cliché list saved.",
        "bannedDefault": "Showing the built-in default list; saving makes it your own.",
        "bannedCount": "phrases",
        "workModeLabel": "Working mode",
        "dismiss": "Dismiss",
        "importResults": "This session's feeds",
        "clearResults": "Clear list",
      },
    };

    async function apply(ctx) {
      var style = installStyle();
      ctx.effect(function () { return function () { if (style.owned && style.node) style.node.remove(); }; }, "dsh-w-knowledge-base: styles");
      ctx.effect(function () { return ctx.locale.register(NS, dicts); });
      var t = ctx.locale.bind(NS);

      var unmount = await ctx.remote.$mount(TYPERT_REMOTE);
      ctx.effect(function () { return unmount; }, "dsh-w-knowledge-base: remote");

      // Namespace services are resolved with ctx.get(): dotted property access
      // does not reliably cross the fiber that mounted them.
      var knowledgeBase = ctx.get("remote.knowledgeBase");
      if (!knowledgeBase) throw new Error("dsh-w-knowledge-base: remote.knowledgeBase did not mount");

      function unwrap(method, args) {
        return knowledgeBase[method].apply(knowledgeBase, args).then(function (result) {
          if (!result.ok) {
            // Keep the host's code so the panel can map known failures
            // (KB_IMPORT_BINARY, ...) to readable text instead of raw JSON.
            var detail = result.error;
            var message = detail && typeof detail.message === "string" ? detail.message : JSON.stringify(detail);
            var error = new Error(method + " failed: " + message);
            if (detail && typeof detail.code === "string") error.code = detail.code;
            throw error;
          }
          return result.value;
        });
      }

      function injected() {
        return {
          kb: {
            list: function (query, tag, limit) { return unwrap("listNotes", [query || "", tag || "", limit || 0]); },
            read: function (id) { return unwrap("readNote", [id]); },
            save: function (note) { return unwrap("saveNote", [note]); },
            remove: function (id, hard) { return unwrap("deleteNote", [id, hard === true]); },
            stats: function () { return unwrap("getStats", []); },
            importDocument: function (input) { return unwrap("importDocument", [input]); },
            getMode: function () { return unwrap("getMode", []); },
            setMode: function (mode) { return unwrap("setMode", [mode]); },
            getBanned: function () { return unwrap("getBanned", []); },
            setBanned: function (text) { return unwrap("setBanned", [text]); },
          },
        };
      }

      ctx.slots.inject("settings.section", function () {
        return ctx.slots.register({
          name: "settings.section",
          id: "knowledge-base",
          order: 24,
          label: function () { return t("nav"); },
          locale: NS,
          inject: injected,
        }, SettingsSection);
      });

      // The right sidebar host is optional: these three injections simply stay
      // dormant when dsh-w-right-sidebar is not installed.
      ctx.slots.inject("right-sidebar.rail", function () {
        return ctx.slots.register({
          name: "right-sidebar.rail",
          id: "knowledge-base",
          order: 120,
          label: function () { return t("title"); },
          locale: NS,
        }, SidebarRail);
      });
      ctx.slots.inject("right-sidebar.card", function () {
        return ctx.slots.register({
          name: "right-sidebar.card",
          id: "knowledge-base",
          order: 120,
          label: function () { return t("title"); },
          locale: NS,
        }, SidebarCard);
      });
      ctx.slots.inject("right-sidebar.page", function () {
        return ctx.slots.register({
          name: "right-sidebar.page",
          priority: 120,
          select: function (owner) {
            return owner && owner.activeId === "knowledge-base" ? {} : null;
          },
          locale: NS,
          inject: injected,
        }, SidebarPage);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-knowledge-base";
    return module.exports;
  },
});
