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
      ".dshwkb-switcher{position:relative;flex:none}",
      ".dshwkb-switcher-button{display:flex;align-items:center;gap:7px;width:100%;height:34px;padding:0 10px;border:1px solid var(--kb-border);border-radius:9px;background:var(--kb-surface);color:var(--kb-fg);font-size:12.5px;text-align:left;cursor:pointer;transition:border-color .15s,box-shadow .15s}",
      ".dshwkb-switcher-button:hover:not(:disabled),.dshwkb-switcher-button[aria-expanded=true]{border-color:color-mix(in srgb,var(--kb-accent) 45%,var(--kb-border))}",
      ".dshwkb-switcher-button[aria-expanded=true]{box-shadow:0 0 0 3px var(--kb-accent-soft)}",
      ".dshwkb-switcher-button svg{margin-left:auto;flex:none;color:var(--kb-fg3)}",
      ".dshwkb-switcher-label{flex:none;color:var(--kb-fg3)}",
      ".dshwkb-switcher-name{min-width:0;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwkb-switcher-count{flex:none;color:var(--kb-fg3);font-size:11.5px}",
      ".dshwkb-switcher-menu{position:absolute;z-index:20;top:calc(100% + 6px);left:0;right:0;display:flex;flex-direction:column;gap:2px;max-height:320px;overflow:auto;padding:6px;border:1px solid var(--kb-border);border-radius:12px;background:var(--kb-surface);box-shadow:0 14px 34px color-mix(in srgb,var(--kb-fg) 16%,transparent);animation:dshwkb-in .16s ease-out}",
      ".dshwkb-switcher-option{display:flex;align-items:center;gap:9px;width:100%;padding:8px;border:0;border-radius:8px;background:transparent;color:var(--kb-fg);text-align:left;cursor:pointer}",
      ".dshwkb-switcher-option:hover,.dshwkb-switcher-option:focus-visible{background:var(--kb-hover);outline:none}",
      ".dshwkb-switcher-option[aria-selected=true]{background:var(--kb-accent-soft)}",
      ".dshwkb-switcher-option>svg{flex:none;color:var(--kb-accent)}",
      ".dshwkb-switcher-copy{flex:1;min-width:0;display:flex;flex-direction:column}",
      ".dshwkb-switcher-title{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600}",
      ".dshwkb-switcher-meta{font-size:11.5px;color:var(--kb-fg3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwkb-switcher-foot{display:flex;justify-content:space-between;gap:8px;margin-top:4px;padding:8px 6px 2px;border-top:1px solid var(--kb-border)}",
      ".dshwkb-corpus-dot{width:9px;height:9px;flex:none;border-radius:50%;background:hsl(var(--kb-hue,220) 60% 52%);box-shadow:0 0 0 3px hsl(var(--kb-hue,220) 60% 52% / .16)}",
      ".dshwkb-adult{flex:none;height:17px;padding:0 5px;border-radius:5px;background:color-mix(in srgb,var(--kb-danger) 14%,transparent);color:var(--kb-danger);font-size:10.5px;font-weight:700;line-height:17px}",
      ".dshwkb-drop-target{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;background:var(--kb-fill);font-size:12px;color:var(--kb-fg2)}",
      ".dshwkb-drop-target b{color:var(--kb-fg);font-weight:600}",
      ".dshwkb-corpora{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:10px;margin:0 -4px;padding:0 4px 8px}",
      ".dshwkb-corpus-list{display:flex;flex-direction:column;gap:8px}",
      ".dshwkb-corpus-card{display:flex;flex-direction:column;gap:8px;padding:12px;border:1px solid var(--kb-border);border-left:3px solid hsl(var(--kb-hue,220) 60% 52%);border-radius:12px;background:var(--kb-surface)}",
      ".dshwkb-corpus-card[data-active=true]{box-shadow:0 0 0 3px var(--kb-accent-soft);border-color:color-mix(in srgb,var(--kb-accent) 40%,var(--kb-border))}",
      ".dshwkb-corpus-card[data-new=true]{border-left-color:var(--kb-accent);border-style:dashed}",
      ".dshwkb-corpus-head{display:flex;align-items:center;gap:8px;min-width:0}",
      ".dshwkb-corpus-name{min-width:0;font-size:14px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwkb-corpus-head .dshwkb-badge{background:var(--kb-accent-soft);color:var(--kb-accent)}",
      ".dshwkb-corpus-desc{font-size:12px;line-height:18px;color:var(--kb-fg2)}",
      ".dshwkb-corpus-stats{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:12px;color:var(--kb-fg3)}",
      ".dshwkb-corpus-stats b{font-size:14px;font-weight:650;color:var(--kb-fg)}",
      ".dshwkb-corpus-actions{display:flex;flex-wrap:wrap;gap:6px}",
      ".dshwkb-corpus-actions .dshwkb-primary,.dshwkb-corpus-actions .dshwkb-ghost{height:28px;padding:0 10px}",
      ".dshwkb-corpus-warn{padding:8px 10px;border-radius:8px;background:color-mix(in srgb,var(--kb-danger) 9%,transparent);color:var(--kb-danger);font-size:12px;line-height:18px}",
      ".dshwkb-sources{display:flex;flex-direction:column;gap:2px;padding-top:8px;border-top:1px solid var(--kb-border)}",
      ".dshwkb-sources-hint{margin-bottom:4px;font-size:11.5px;line-height:17px;color:var(--kb-fg3)}",
      ".dshwkb-source{display:flex;align-items:center;gap:8px;min-height:32px;padding:2px 4px;border-radius:7px}",
      ".dshwkb-source:hover{background:var(--kb-hover)}",
      ".dshwkb-source-name{flex:1;min-width:0;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwkb-source-count{flex:none;font-size:11.5px;color:var(--kb-fg3)}",
      ".dshwkb-source-move{flex:none;width:92px;height:26px;padding:0 4px;border:1px solid var(--kb-border);border-radius:7px;background:var(--kb-surface);color:var(--kb-fg2);font:inherit;font-size:11.5px;cursor:pointer}",
      ".dshwkb-source-confirm{display:flex;align-items:center;gap:2px;flex:none}",
      ".dshwkb-source-confirm .dshwkb-primary{height:26px;padding:0 8px;font-size:11.5px}",
      ".dshwkb-add-corpus{display:flex;align-items:center;justify-content:center;gap:6px;flex:none;height:36px;border:1px dashed color-mix(in srgb,var(--kb-fg) 20%,var(--kb-border));border-radius:10px;background:transparent;color:var(--kb-fg2);font-size:12.5px;cursor:pointer}",
      ".dshwkb-add-corpus:hover{border-color:var(--kb-accent);color:var(--kb-accent);background:var(--kb-accent-soft)}",
      ".dshwkb-corpus-form{display:flex;flex-direction:column;gap:10px}",
      ".dshwkb-check{display:flex;align-items:flex-start;gap:8px;font-size:12px;line-height:18px;color:var(--kb-fg2);cursor:pointer}",
      ".dshwkb-check input{margin:2px 0 0;accent-color:var(--kb-accent)}",
      ".dshwkb-check span{display:flex;flex-direction:column}",
      ".dshwkb-check b{font-weight:600;color:var(--kb-fg)}",
      ".dshwkb-form-actions{display:flex;justify-content:flex-end;gap:6px}",
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
        descriptor("listCorpora", []),
        descriptor("createCorpus", [parameter("input")]),
        descriptor("updateCorpus", [parameter("corpusId"), parameter("patch")]),
        descriptor("deleteCorpus", [parameter("corpusId")]),
        descriptor("setActiveCorpus", [parameter("corpusId")]),
        descriptor("moveNotes", [parameter("fromId"), parameter("toId"), parameter("tag")]),
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
      chevron: ["M5.5 8l4.5 4.5L14.5 8"],
      check: ["M4.5 10.5l3.5 3.5 7.5-8"],
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

    // ── style corpora (writing mode) ─────────────────────────────────────
    function corpusHue(id) {
      var hash = 0;
      var source = String(id || "");
      for (var i = 0; i < source.length; i += 1) hash = (hash * 31 + source.charCodeAt(i)) % 3600;
      return Math.round(hash * 137.508) % 360;
    }

    // Adult libraries are always rose; everything else stays in cool hues so
    // an ordinary library never looks like the adult one at a glance.
    function corpusTone(corpus) {
      if (!corpus) return 220;
      return corpus.adult ? 348 : 140 + (corpusHue(corpus.id) % 160);
    }

    function CorpusDot(props) {
      return React.createElement("span", { className: "dshwkb-corpus-dot", style: { "--kb-hue": corpusTone(props.corpus) }, "aria-hidden": true });
    }

    function AdultBadge(props) {
      return props.corpus && props.corpus.adult ? React.createElement("span", { className: "dshwkb-adult", title: props.t("adultHint") }, "18+") : null;
    }

    function formatChars(n, t) {
      if (!(n > 0)) return "0";
      var unit = t("tenThousand");
      if (unit && n >= 10000) return (n / 10000).toFixed(n >= 1000000 ? 0 : 1).replace(/\.0$/, "") + unit;
      return n.toLocaleString("en-US");
    }

    // The writing-mode corpus picker under the header.
    function CorpusSwitcher(props) {
      var t = props.t;
      var openSlot = React.useState(false);
      var open = openSlot[0];
      var setOpen = openSlot[1];
      var rootRef = React.useRef(null);
      var active = props.corpora.find(function (item) { return item.active; }) || null;
      React.useEffect(function () {
        if (!open) return undefined;
        function onPointer(event) { if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false); }
        function onKey(event) { if (event.key === "Escape") setOpen(false); }
        document.addEventListener("mousedown", onPointer);
        document.addEventListener("keydown", onKey);
        return function () { document.removeEventListener("mousedown", onPointer); document.removeEventListener("keydown", onKey); };
      }, [open]);
      return React.createElement("div", { className: "dshwkb-switcher", ref: rootRef },
        React.createElement("button", {
          type: "button", className: "dshwkb-switcher-button", "aria-haspopup": "listbox", "aria-expanded": open, disabled: props.busy,
          onClick: function () { setOpen(!open); },
        },
          React.createElement("span", { className: "dshwkb-switcher-label" }, t("corpusLabel")),
          active ? React.createElement(CorpusDot, { corpus: active }) : null,
          React.createElement("span", { className: "dshwkb-switcher-name" }, active ? active.name : t("loading")),
          React.createElement(AdultBadge, { corpus: active, t: t }),
          active ? React.createElement("span", { className: "dshwkb-switcher-count" }, active.notes + " " + t("corpusNotesUnit")) : null,
          React.createElement(Icon, { name: "chevron", size: 14 })
        ),
        open ? React.createElement("div", { className: "dshwkb-switcher-menu", role: "listbox", "aria-label": t("corpusLabel") },
          props.corpora.map(function (corpus) {
            return React.createElement("button", {
              key: corpus.id, type: "button", role: "option", "aria-selected": corpus.active, className: "dshwkb-switcher-option",
              onClick: function () { setOpen(false); if (!corpus.active) props.onActivate(corpus.id); },
            },
              React.createElement(CorpusDot, { corpus: corpus }),
              React.createElement("span", { className: "dshwkb-switcher-copy" },
                React.createElement("span", { className: "dshwkb-switcher-title" }, corpus.name, React.createElement(AdultBadge, { corpus: corpus, t: t })),
                React.createElement("span", { className: "dshwkb-switcher-meta" }, corpus.notes + " " + t("corpusNotesUnit") + (corpus.description ? " · " + corpus.description : ""))
              ),
              corpus.active ? React.createElement(Icon, { name: "check", size: 15 }) : null
            );
          }),
          React.createElement("div", { className: "dshwkb-switcher-foot" },
            React.createElement("button", { type: "button", className: "dshwkb-link", onClick: function () { setOpen(false); props.onManage(true); } }, "+ " + t("corpusCreate")),
            React.createElement("button", { type: "button", className: "dshwkb-link", onClick: function () { setOpen(false); props.onManage(false); } }, t("corpusManage") + " →")
          )
        ) : null
      );
    }

    function CorpusForm(props) {
      var t = props.t;
      var initial = props.initial || { name: "", description: "", adult: false };
      var draftSlot = React.useState({ name: initial.name, description: initial.description, adult: initial.adult, activate: props.mode === "create" });
      var draft = draftSlot[0];
      var setDraft = draftSlot[1];
      function patch(key, value) { setDraft(function (current) { var next = Object.assign({}, current); next[key] = value; return next; }); }
      return React.createElement("form", {
        className: "dshwkb-corpus-form",
        onSubmit: function (event) { event.preventDefault(); if (draft.name.trim()) props.onSubmit(draft); },
      },
        React.createElement("div", { className: "dshwkb-field" },
          React.createElement("label", { className: "dshwkb-label" }, t("corpusName")),
          React.createElement("input", { className: "dshwkb-input", value: draft.name, maxLength: 24, autoFocus: true, placeholder: t("corpusNamePlaceholder"), onChange: function (event) { patch("name", event.target.value); } })
        ),
        React.createElement("div", { className: "dshwkb-field" },
          React.createElement("label", { className: "dshwkb-label" }, t("corpusDescription")),
          React.createElement("input", { className: "dshwkb-input", value: draft.description, maxLength: 200, placeholder: t("corpusDescriptionPlaceholder"), onChange: function (event) { patch("description", event.target.value); } })
        ),
        React.createElement("label", { className: "dshwkb-check" },
          React.createElement("input", { type: "checkbox", checked: draft.adult, onChange: function (event) { patch("adult", event.target.checked); } }),
          React.createElement("span", null, React.createElement("b", null, t("corpusAdult")), React.createElement("span", null, t("corpusAdultHint")))
        ),
        props.mode === "create" ? React.createElement("label", { className: "dshwkb-check" },
          React.createElement("input", { type: "checkbox", checked: draft.activate, onChange: function (event) { patch("activate", event.target.checked); } }),
          React.createElement("span", null, React.createElement("b", null, t("corpusActivateNow")))
        ) : null,
        React.createElement("div", { className: "dshwkb-form-actions" },
          React.createElement("button", { type: "button", className: "dshwkb-ghost", disabled: props.busy, onClick: props.onCancel }, t("cancel")),
          React.createElement("button", { type: "submit", className: "dshwkb-primary", disabled: props.busy || !draft.name.trim() }, props.busy ? t("saving") : props.mode === "create" ? t("corpusCreate") : t("save"))
        )
      );
    }

    function CorpusCard(props) {
      var t = props.t;
      var corpus = props.corpus;
      var editingSlot = React.useState(false);
      var editing = editingSlot[0];
      var setEditing = editingSlot[1];
      var confirmSlot = React.useState(false);
      var confirming = confirmSlot[0];
      var setConfirming = confirmSlot[1];
      var sourcesSlot = React.useState(false);
      var showSources = sourcesSlot[0];
      var setShowSources = sourcesSlot[1];
      var moveSlot = React.useState(null);
      var move = moveSlot[0];
      var setMove = moveSlot[1];
      var others = props.corpora.filter(function (item) { return item.id !== corpus.id; });
      if (editing) {
        return React.createElement("div", { className: "dshwkb-corpus-card", "data-active": corpus.active ? "true" : undefined },
          React.createElement(CorpusForm, {
            t: t, mode: "edit", busy: props.busy, initial: corpus,
            onCancel: function () { setEditing(false); },
            onSubmit: function (draft) { props.onUpdate(corpus.id, { name: draft.name, description: draft.description, adult: draft.adult }).then(function (ok) { if (ok) setEditing(false); }); },
          })
        );
      }
      return React.createElement("div", { className: "dshwkb-corpus-card", "data-active": corpus.active ? "true" : undefined, style: { "--kb-hue": corpusTone(corpus) } },
        React.createElement("div", { className: "dshwkb-corpus-head" },
          React.createElement(CorpusDot, { corpus: corpus }),
          React.createElement("span", { className: "dshwkb-corpus-name" }, corpus.name),
          React.createElement(AdultBadge, { corpus: corpus, t: t }),
          corpus.active ? React.createElement("span", { className: "dshwkb-badge" }, t("corpusCurrent")) : null
        ),
        corpus.description ? React.createElement("div", { className: "dshwkb-corpus-desc" }, corpus.description) : null,
        React.createElement("div", { className: "dshwkb-corpus-stats" },
          React.createElement("span", null, React.createElement("b", null, corpus.notes), " " + t("corpusNotesUnit")),
          React.createElement("span", null, React.createElement("b", null, formatChars(corpus.chars, t)), " " + t("charsLabel")),
          React.createElement("span", null, React.createElement("b", null, corpus.sources.length), " " + t("corpusSourcesUnit"))
        ),
        React.createElement("div", { className: "dshwkb-corpus-actions" },
          corpus.active ? null : React.createElement("button", { type: "button", className: "dshwkb-primary", disabled: props.busy, onClick: function () { props.onActivate(corpus.id); } }, t("corpusUse")),
          React.createElement("button", { type: "button", className: "dshwkb-ghost", disabled: props.busy, onClick: function () { setEditing(true); } }, t("edit")),
          corpus.sources.length > 0 ? React.createElement("button", { type: "button", className: "dshwkb-ghost", onClick: function () { setShowSources(!showSources); } }, showSources ? t("corpusHideSources") : t("corpusShowSources")) : null,
          React.createElement("button", {
            type: "button", className: "dshwkb-ghost", "data-danger": "true", "data-armed": confirming || undefined, style: { marginLeft: "auto" },
            disabled: props.busy || props.corpora.length <= 1, title: props.corpora.length <= 1 ? t("corpusLastHint") : undefined,
            onClick: function () {
              if (!confirming) { setConfirming(true); return; }
              setConfirming(false);
              props.onDelete(corpus.id);
            },
            onBlur: function () { setConfirming(false); },
          }, confirming ? t("corpusDeleteConfirm") : t("remove"))
        ),
        confirming ? React.createElement("div", { className: "dshwkb-corpus-warn" }, t("corpusDeleteHint")) : null,
        showSources ? React.createElement("div", { className: "dshwkb-sources" },
          React.createElement("div", { className: "dshwkb-sources-hint" }, t("corpusSourcesHint")),
          corpus.sources.map(function (source) {
            var pending = move && move.tag === source.tag;
            return React.createElement("div", { className: "dshwkb-source", key: source.tag },
              React.createElement("span", { className: "dshwkb-source-name", title: source.tag }, source.tag),
              React.createElement("span", { className: "dshwkb-source-count" }, source.count + " " + t("corpusNotesUnit")),
              others.length === 0 ? null : pending
                ? React.createElement("span", { className: "dshwkb-source-confirm" },
                  React.createElement("button", { type: "button", className: "dshwkb-primary", disabled: props.busy, onClick: function () { props.onMove(corpus.id, move.to, source.tag).then(function () { setMove(null); }); } },
                    t("corpusMoveConfirm").replace("{name}", (others.find(function (item) { return item.id === move.to; }) || {}).name || "")),
                  React.createElement("button", { type: "button", className: "dshwkb-icon-btn", "aria-label": t("cancel"), onClick: function () { setMove(null); } }, React.createElement(Icon, { name: "close", size: 13 })))
                : React.createElement("select", {
                  className: "dshwkb-source-move", value: "", "aria-label": t("corpusMoveTo"),
                  onChange: function (event) { if (event.target.value) setMove({ tag: source.tag, to: event.target.value }); },
                },
                  React.createElement("option", { value: "" }, t("corpusMoveTo")),
                  others.map(function (item) { return React.createElement("option", { key: item.id, value: item.id }, item.name + (item.adult ? " · 18+" : "")); })
                )
            );
          })
        ) : null
      );
    }

    function CorporaManager(props) {
      var t = props.t;
      return React.createElement("div", { className: "dshwkb-corpora" },
        React.createElement("div", { className: "dshwkb-callout" }, React.createElement(Icon, { name: "info" }), React.createElement("span", null, t("corporaIntro"))),
        props.creating
          ? React.createElement("div", { className: "dshwkb-corpus-card", "data-new": "true" },
            React.createElement("div", { className: "dshwkb-corpus-head" }, React.createElement("span", { className: "dshwkb-corpus-name" }, t("corpusCreate"))),
            React.createElement(CorpusForm, { t: t, mode: "create", busy: props.busy, onCancel: function () { props.onCreating(false); }, onSubmit: props.onCreate }))
          : React.createElement("button", { type: "button", className: "dshwkb-add-corpus", onClick: function () { props.onCreating(true); } }, React.createElement(Icon, { name: "plus", size: 14 }), t("corpusCreate")),
        props.status === "loading" && props.corpora.length === 0
          ? React.createElement("div", { className: "dshwkb-skeletons" }, [0, 1].map(function (index) { return React.createElement("div", { className: "dshwkb-skeleton", key: index }); }))
          : React.createElement("div", { className: "dshwkb-corpus-list" }, props.corpora.map(function (corpus) {
            return React.createElement(CorpusCard, {
              key: corpus.id, corpus: corpus, corpora: props.corpora, t: t, busy: props.busy,
              onActivate: props.onActivate, onUpdate: props.onUpdate, onDelete: props.onDelete, onMove: props.onMove,
            });
          }))
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
      var corporaSlot = React.useState({ status: "idle", list: [] });
      var corpora = corporaSlot[0];
      var setCorpora = corporaSlot[1];
      var corporaBusySlot = React.useState(false);
      var corporaBusy = corporaBusySlot[0];
      var setCorporaBusy = corporaBusySlot[1];
      var creatingSlot = React.useState(false);
      var creatingCorpus = creatingSlot[0];
      var setCreatingCorpus = creatingSlot[1];
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

      var canCorpora = typeof kb.listCorpora === "function";
      var loadCorpora = React.useCallback(function () {
        if (!canCorpora) return Promise.resolve();
        setCorpora(function (current) { return { status: "loading", list: current.list }; });
        return kb.listCorpora().then(function (value) {
          if (mountedRef.current) setCorpora({ status: "ready", list: (value && value.corpora) || [] });
        }, function (error) {
          if (!mountedRef.current) return;
          setCorpora(function (current) { return { status: "error", list: current.list }; });
          setNotice({ kind: "error", text: t("error") + ": " + failureText(error) });
        });
      }, [kb, t]);

      React.useEffect(function () { if (workMode === "writing") loadCorpora(); }, [workMode]);

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
            workMode === "writing" && activeCorpus
              ? React.createElement("span", { className: "dshwkb-drop-target" }, t("feedInto"), React.createElement(CorpusDot, { corpus: activeCorpus }), React.createElement("b", null, activeCorpus.name), React.createElement(AdultBadge, { corpus: activeCorpus, t: t }))
              : null,
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
            setMode("browse"); setSelected(null); setEditing(false); setCreatingCorpus(false);
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

      // Every corpus action ends by refreshing the corpus list and, when the
      // default corpus may have changed, the notes the panel shows.
      function corpusAction(run, message, reloadNotes) {
        setCorporaBusy(true);
        return run().then(function (value) {
          if (!mountedRef.current) return false;
          setCorporaBusy(false);
          if (message) setNotice({ kind: "ok", text: typeof message === "function" ? message(value) : message });
          loadCorpora();
          if (reloadNotes) { setSelected(null); setEditing(false); setQuery(""); setActiveTag(""); load("", ""); }
          return true;
        }, function (error) {
          if (!mountedRef.current) return false;
          setCorporaBusy(false);
          setNotice({ kind: "error", text: t("error") + ": " + failureText(error) });
          return false;
        });
      }
      function nameOf(id) {
        var match = corpora.list.find(function (item) { return item.id === id; });
        return match ? match.name : "";
      }
      function activateCorpus(id) {
        return corpusAction(function () { return kb.setActiveCorpus(id); }, t("corpusSwitched").replace("{name}", nameOf(id)), true);
      }
      function createCorpus(draft) {
        return corpusAction(function () { return kb.createCorpus({ name: draft.name, description: draft.description, adult: draft.adult, activate: draft.activate }); },
          function (value) { return t("corpusCreated").replace("{name}", value && value.corpus ? value.corpus.name : draft.name); }, draft.activate)
          .then(function (ok) { if (ok) setCreatingCorpus(false); return ok; });
      }
      function updateCorpus(id, patch) {
        return corpusAction(function () { return kb.updateCorpus(id, patch); }, t("saved"), false);
      }
      function deleteCorpus(id) {
        var wasActive = corpora.list.some(function (item) { return item.id === id && item.active; });
        return corpusAction(function () { return kb.deleteCorpus(id); }, t("corpusDeleted").replace("{name}", nameOf(id)), wasActive);
      }
      function moveSource(fromId, toId, tag) {
        return corpusAction(function () { return kb.moveNotes(fromId, toId, tag); },
          function (value) { return t("corpusMoved").replace("{n}", value && value.moved || 0).replace("{name}", nameOf(toId)); }, true);
      }
      var activeCorpus = corpora.list.find(function (item) { return item.active; }) || null;

      function renderBanned() {
        var phraseCount = banned.text.split(/\r?\n/).filter(function (line) {
          var trimmed = line.trim();
          return trimmed !== "" && trimmed.charAt(0) !== "#";
        }).length;
        return React.createElement("div", { className: "dshwkb-detail" },
          React.createElement("div", { className: "dshwkb-callout" }, React.createElement(Icon, { name: "info" }),
            React.createElement("span", null, activeCorpus ? t("bannedScope").replace("{name}", activeCorpus.name) + " " : "", t("bannedHint"), banned.isDefault ? " " + t("bannedDefault") : "")
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
          workMode === "writing" && canCorpora && corpora.list.length > 0
            ? React.createElement(CorpusSwitcher, {
              t: t, corpora: corpora.list, busy: corporaBusy,
              onActivate: activateCorpus,
              onManage: function (create) { setMode("corpora"); setSelected(null); setEditing(false); setNotice(null); setCreatingCorpus(create); },
            })
            : null,
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
                : null,
              workMode === "writing" && canCorpora
                ? React.createElement("button", {
                  type: "button",
                  className: "dshwkb-tab",
                  role: "tab",
                  "aria-selected": mode === "corpora",
                  "data-active": mode === "corpora" || undefined,
                  onClick: function () { setMode("corpora"); setSelected(null); setEditing(false); setNotice(null); loadCorpora(); },
                }, t("modeCorpora"))
                : null
            ),
            mode !== "banned" && mode !== "corpora" && selected === null
              ? React.createElement("button", { type: "button", className: "dshwkb-primary", onClick: startCreate }, React.createElement(Icon, { name: "plus", size: 14 }), t("create"))
              : null
          )
        ),
        workMode === "writing" && mode !== "banned" && mode !== "corpora" && selected === null
          ? React.createElement("div", { className: "dshwkb-callout" }, React.createElement(Icon, { name: "info" }),
            React.createElement("span", null, activeCorpus ? t("workHintCorpus").replace("{name}", activeCorpus.name) : t("workHintWriting")))
          : null,
        mode === "corpora"
          ? React.createElement(CorporaManager, {
            t: t, corpora: corpora.list, status: corpora.status, busy: corporaBusy, creating: creatingCorpus,
            onCreating: setCreatingCorpus, onCreate: createCorpus, onActivate: activateCorpus,
            onUpdate: updateCorpus, onDelete: deleteCorpus, onMove: moveSource,
          })
          : mode === "banned"
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
        "modeCorpora": "\u7d20\u6750\u5e93",
        "corpusLabel": "\u7d20\u6750\u5e93",
        "corpusNotesUnit": "\u6bb5",
        "corpusSourcesUnit": "\u4e2a\u6765\u6e90",
        "corpusCreate": "\u65b0\u5efa\u7d20\u6750\u5e93",
        "corpusManage": "\u7ba1\u7406\u7d20\u6750\u5e93",
        "corpusCurrent": "\u5f53\u524d",
        "corpusUse": "\u8bbe\u4e3a\u5f53\u524d",
        "corpusName": "\u540d\u79f0",
        "corpusNamePlaceholder": "\u4f8b\u5982 \u90fd\u5e02\u3001\u60ac\u7591\u3001\u6210\u4eba",
        "corpusDescription": "\u8bf4\u660e\uff08\u53ef\u9009\uff09",
        "corpusDescriptionPlaceholder": "\u8fd9\u4e2a\u5e93\u653e\u4ec0\u4e48\u7c7b\u578b\u7684\u53c2\u8003\u5c0f\u8bf4",
        "corpusAdult": "\u6807\u8bb0\u4e3a\u6210\u4eba\u5185\u5bb9\uff0818+\uff09",
        "corpusAdultHint": "\u53ea\u662f\u4e00\u4e2a\u9192\u76ee\u7684\u6807\u8bb0\uff0c\u65b9\u4fbf\u4f60\u5728\u5207\u6362\u548c\u7ed1\u5b9a\u65f6\u4e00\u773c\u8ba4\u51fa\u6765\u3002",
        "corpusActivateNow": "\u521b\u5efa\u540e\u7acb\u5373\u8bbe\u4e3a\u5f53\u524d\u7d20\u6750\u5e93",
        "corpusShowSources": "\u6309\u6765\u6e90\u6574\u7406",
        "corpusHideSources": "\u6536\u8d77\u6765\u6e90",
        "corpusSourcesHint": "\u6bcf\u4e2a\u6765\u6e90\u662f\u4e00\u672c\u6295\u5582\u8fdb\u6765\u7684\u4e66\uff08\u6216\u4e00\u4e2a\u6807\u7b7e\uff09\u3002\u628a\u5b83\u79fb\u5230\u5176\u4ed6\u7d20\u6750\u5e93\uff0c\u8fd9\u672c\u4e66\u7684\u6240\u6709\u6bb5\u843d\u4f1a\u6574\u4f53\u642c\u8fc7\u53bb\u3002",
        "corpusMoveTo": "\u79fb\u5230\u2026",
        "corpusMoveConfirm": "\u786e\u8ba4\u79fb\u5230\u300c{name}\u300d",
        "corpusDeleteConfirm": "\u786e\u8ba4\u5220\u9664\uff1f",
        "corpusDeleteHint": "\u6574\u4e2a\u7d20\u6750\u5e93\u4f1a\u79fb\u5230\u77e5\u8bc6\u5e93\u76ee\u5f55\u4e0b\u7684 .trash-corpora\uff0c\u53ef\u4ee5\u624b\u52a8\u6062\u590d\uff1b\u7ed1\u5b9a\u5b83\u7684\u5c0f\u8bf4\u4f1a\u6539\u7528\u5f53\u524d\u7d20\u6750\u5e93\u3002",
        "corpusLastHint": "\u81f3\u5c11\u8981\u4fdd\u7559\u4e00\u4e2a\u7d20\u6750\u5e93",
        "corpusSwitched": "\u5df2\u5207\u6362\u5230\u300c{name}\u300d\u7d20\u6750\u5e93\u3002",
        "corpusCreated": "\u5df2\u521b\u5efa\u300c{name}\u300d\u7d20\u6750\u5e93\u3002",
        "corpusDeleted": "\u300c{name}\u300d\u5df2\u79fb\u5165 .trash-corpora\u3002",
        "corpusMoved": "\u5df2\u628a {n} \u6bb5\u79fb\u5230\u300c{name}\u300d\u3002",
        "corporaIntro": "\u6bcf\u4e2a\u7d20\u6750\u5e93\u5b8c\u5168\u9694\u79bb\uff1a\u6a21\u578b\u53ea\u770b\u5f97\u5230\u6b63\u5728\u7528\u7684\u90a3\u4e00\u4e2a\uff0c\u7981\u7528\u5957\u8def\u8868\u4e5f\u662f\u6bcf\u4e2a\u5e93\u5404\u81ea\u4e00\u4efd\u3002\u300c\u5f53\u524d\u300d\u662f\u666e\u901a\u5bf9\u8bdd\u7684\u9ed8\u8ba4\u5e93\uff1b\u5728\u5c0f\u8bf4\u5199\u4f5c\u7684\u300c\u9879\u76ee\u300d\u9875\u53ef\u4ee5\u7ed9\u6bcf\u672c\u4e66\u5355\u72ec\u7ed1\u5b9a\u4e00\u4e2a\u5e93\uff0c\u7528 /write \u5199\u8fd9\u672c\u4e66\u65f6\u81ea\u52a8\u4f7f\u7528\u3002",
        "workHintCorpus": "\u5199\u4f5c\u6a21\u5f0f\u00b7\u6b63\u5728\u4f7f\u7528\u300c{name}\u300d\u7d20\u6750\u5e93\u3002\u6a21\u578b\u53ea\u4f1a\u68c0\u7d22\u8fd9\u4e2a\u5e93\uff1b\u5728\u5c0f\u8bf4\u5199\u4f5c\u91cc\u7ed1\u5b9a\u4e86\u5176\u4ed6\u5e93\u7684\u4e66\u4e0d\u53d7\u5f71\u54cd\u3002",
        "feedInto": "\u6295\u5582\u5230",
        "bannedScope": "\u8fd9\u662f\u300c{name}\u300d\u7d20\u6750\u5e93\u7684\u7981\u7528\u5957\u8def\u8868\u3002",
        "adultHint": "\u6210\u4eba\u5185\u5bb9\u7d20\u6750\u5e93",
        "tenThousand": "\u4e07",
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
        "modeCorpora": "Libraries",
        "corpusLabel": "Library",
        "corpusNotesUnit": "passages",
        "corpusSourcesUnit": "sources",
        "corpusCreate": "New library",
        "corpusManage": "Manage libraries",
        "corpusCurrent": "Current",
        "corpusUse": "Use this",
        "corpusName": "Name",
        "corpusNamePlaceholder": "e.g. Urban, Thriller, Adult",
        "corpusDescription": "Description (optional)",
        "corpusDescriptionPlaceholder": "What kind of reference fiction lives here",
        "corpusAdult": "Mark as adult content (18+)",
        "corpusAdultHint": "Only a visible label, so you can tell it apart when switching and binding.",
        "corpusActivateNow": "Make it the current library after creating it",
        "corpusShowSources": "Sort by source",
        "corpusHideSources": "Hide sources",
        "corpusSourcesHint": "Each source is one fed book (or a tag). Moving it carries all of its passages to the other library.",
        "corpusMoveTo": "Move to…",
        "corpusMoveConfirm": "Move to \"{name}\"",
        "corpusDeleteConfirm": "Delete it?",
        "corpusDeleteHint": "The whole library moves to .trash-corpora under the knowledge base and can be restored by hand; books bound to it fall back to the current library.",
        "corpusLastHint": "Keep at least one library",
        "corpusSwitched": "Switched to the \"{name}\" library.",
        "corpusCreated": "Created the \"{name}\" library.",
        "corpusDeleted": "\"{name}\" moved to .trash-corpora.",
        "corpusMoved": "Moved {n} passages to \"{name}\".",
        "corporaIntro": "Libraries are fully isolated: the model only sees the one in use, and each keeps its own banned list. \"Current\" is the default for ordinary conversations; in Novel Writing \u2192 Project each book can bind its own library, used automatically under /write.",
        "workHintCorpus": "Writing mode \u00b7 using the \"{name}\" library. The model only searches this one; books bound to another library in Novel Writing are unaffected.",
        "feedInto": "Feeding into",
        "bannedScope": "Banned list of the \"{name}\" library.",
        "adultHint": "Adult-content library",
        "tenThousand": "",
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
            listCorpora: function () { return unwrap("listCorpora", []); },
            createCorpus: function (input) { return unwrap("createCorpus", [input]); },
            updateCorpus: function (id, patch) { return unwrap("updateCorpus", [id, patch]); },
            deleteCorpus: function (id) { return unwrap("deleteCorpus", [id]); },
            setActiveCorpus: function (id) { return unwrap("setActiveCorpus", [id]); },
            moveNotes: function (fromId, toId, tag) { return unwrap("moveNotes", [fromId, toId, tag]); },
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
