window.__ModuleLoader__.load({
  id: "dsh-w-noval-write",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    var CSS = [
      ".dshwnw-root{--nw-accent:var(--dsw-alias-state-business-primary,#3978e8);--nw-fg:var(--dsw-alias-label-primary,#1f2329);--nw-fg2:var(--dsw-alias-label-secondary,#646a73);--nw-fg3:var(--dsw-alias-label-tertiary,#8f959e);--nw-surface:var(--dsw-alias-bg-layer-1,#fff);--nw-border:var(--dsw-alias-border-l1,#e5e7eb);--nw-hover:var(--dsw-alias-interactive-bg-hover,#f2f5fa);--nw-fill:color-mix(in srgb,var(--nw-fg) 5%,transparent);--nw-accent-soft:color-mix(in srgb,var(--nw-accent) 11%,transparent);--nw-danger:var(--dsw-alias-state-error-primary,#d64545);--nw-ok:#2e9d6a;--nw-warn:#d98a1f;container:novel-panel / inline-size;position:relative;overflow:hidden;height:100%;min-height:0;display:flex;flex-direction:column;color:var(--nw-fg);font-family:var(--dsw-font-ui,ui-sans-serif,system-ui,sans-serif);font-size:13px;background:var(--dsw-specific-sidebar-fill,#f7f8fa)}",
      ".dshwnw-root *,.dshwnw-root *:before,.dshwnw-root *:after{box-sizing:border-box}",
      ".dshwnw-root button{font-family:inherit}",
      ".dshwnw-root :focus-visible{outline:2px solid var(--nw-accent);outline-offset:1px}",
      ".dshwnw-toolbar{position:relative;z-index:3;flex:none;padding:12px 12px 10px;border-bottom:1px solid var(--nw-border);display:flex;flex-direction:column;gap:10px;background:var(--nw-surface)}",
      ".dshwnw-headline{display:flex;align-items:center;gap:8px;min-width:0}",
      ".dshwnw-book{flex:1;min-width:0;font-size:15px;font-weight:650;line-height:21px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-book[data-empty=true]{color:var(--nw-fg3);font-weight:500}",
      ".dshwnw-workspace{position:relative;flex:none;max-width:48%;height:22px;padding:0 8px 0 18px;border-radius:999px;background:var(--nw-fill);font-size:11.5px;line-height:22px;color:var(--nw-fg2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-workspace:before{content:'';position:absolute;left:8px;top:8px;width:6px;height:6px;border-radius:50%;background:var(--nw-ok)}",
      ".dshwnw-body{flex:1;min-height:0;overflow:auto;padding:14px 12px 20px;display:flex;flex-direction:column;gap:12px;scrollbar-gutter:stable;scrollbar-width:thin}",
      ".dshwnw-section{display:flex;flex-direction:column;gap:10px}",
      ".dshwnw-section-title{flex:1;min-width:0;font-size:15px;font-weight:650;line-height:22px}",
      ".dshwnw-section-hint{margin-top:-6px;font-size:12px;line-height:18px;color:var(--nw-fg3)}",
      ".dshwnw-group{border:1px solid var(--nw-border);border-radius:10px;background:var(--nw-surface)}",
      ".dshwnw-group>summary{display:flex;align-items:center;gap:6px;height:38px;padding:0 12px 0 10px;list-style:none;cursor:pointer;user-select:none;font-size:12.5px;font-weight:600;color:var(--nw-fg)}",
      ".dshwnw-group>summary::-webkit-details-marker{display:none}",
      ".dshwnw-group>summary:hover{color:var(--nw-accent)}",
      ".dshwnw-group-count{margin-left:auto;font-size:11px;font-weight:500;color:var(--nw-fg3)}",
      ".dshwnw-chevron{flex:none;color:var(--nw-fg3);transition:transform .15s}",
      "details[open]>summary>.dshwnw-chevron{transform:rotate(90deg)}",
      ".dshwnw-group-body{display:flex;flex-direction:column;gap:12px;padding:2px 12px 14px}",
      ".dshwnw-subsection{display:flex;flex-direction:column;gap:12px}",
      ".dshwnw-subtitle{font-size:12px;line-height:17px;font-weight:600;color:var(--nw-fg2)}",
      ".dshwnw-field{display:flex;flex-direction:column;gap:5px;min-width:0}",
      ".dshwnw-label{font-size:12px;font-weight:500;line-height:17px;color:var(--nw-fg2)}",
      ".dshwnw-input,.dshwnw-select,.dshwnw-textarea{width:100%;border:1px solid var(--nw-border);border-radius:8px;background:var(--nw-surface);color:inherit;font:inherit;font-size:13px;transition:border-color .15s,box-shadow .15s,background .15s}",
      ".dshwnw-input,.dshwnw-select{height:34px;padding:0 10px}",
      ".dshwnw-textarea{min-height:72px;padding:8px 10px;line-height:1.6;resize:vertical}",
      ".dshwnw-input:hover,.dshwnw-select:hover,.dshwnw-textarea:hover{border-color:color-mix(in srgb,var(--nw-fg) 22%,var(--nw-border))}",
      ".dshwnw-input:focus,.dshwnw-select:focus,.dshwnw-textarea:focus{outline:none;border-color:var(--nw-accent);box-shadow:0 0 0 3px var(--nw-accent-soft)}",
      ".dshwnw-input::placeholder,.dshwnw-textarea::placeholder{color:var(--nw-fg3)}",
      ".dshwnw-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 10px}",
      ".dshwnw-card{border:1px solid var(--nw-border);border-radius:12px;background:var(--nw-surface);padding:12px;display:flex;flex-direction:column;gap:12px}",
      ".dshwnw-card-head{display:flex;align-items:center;gap:6px;min-width:0}",
      ".dshwnw-card-title{flex:1;min-width:0;font-size:14px;font-weight:650;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-card-subtitle{font-size:11.5px;color:var(--nw-fg3)}",
      ".dshwnw-warning{padding:8px 10px;border-radius:8px;background:color-mix(in srgb,var(--nw-danger) 9%,transparent);color:var(--nw-danger);font-size:12px;line-height:18px}",
      ".dshwnw-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}",
      ".dshwnw-list-row{display:flex;align-items:center;gap:9px;width:100%;min-width:0;padding:7px 9px;border:1px solid var(--nw-border);border-radius:10px;background:var(--nw-surface);color:inherit;font:inherit;text-align:left;cursor:pointer;transition:border-color .15s,background .15s}",
      ".dshwnw-list-row:hover{border-color:color-mix(in srgb,var(--nw-accent) 40%,var(--nw-border))}",
      ".dshwnw-list-row[data-active=true]{border-color:var(--nw-accent);background:var(--nw-accent-soft)}",
      ".dshwnw-avatar{width:30px;height:30px;flex:none;border-radius:9px;background:hsl(var(--nw-hue,220) 62% 55%);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:650}",
      ".dshwnw-avatar[data-size=lg]{width:40px;height:40px;border-radius:12px;font-size:17px}",
      ".dshwnw-list-copy{min-width:0;display:flex;flex-direction:column}",
      ".dshwnw-list-name{font-size:13px;font-weight:600;line-height:18px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-list-meta{font-size:11px;line-height:16px;color:var(--nw-fg3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-actions{display:flex;gap:6px;flex-wrap:wrap}",
      ".dshwnw-primary,.dshwnw-button,.dshwnw-danger{display:inline-flex;align-items:center;justify-content:center;gap:4px;flex:none;height:30px;padding:0 11px;border-radius:8px;font-size:12.5px;font-weight:500;white-space:nowrap;cursor:pointer;transition:filter .15s,border-color .15s,color .15s,background .15s}",
      ".dshwnw-primary{border:0;background:var(--nw-accent);color:#fff;font-weight:600}",
      ".dshwnw-primary:hover:not(:disabled){filter:brightness(1.08)}",
      ".dshwnw-button,.dshwnw-danger{border:1px solid var(--nw-border);background:var(--nw-surface);color:var(--nw-fg)}",
      ".dshwnw-button:hover:not(:disabled){border-color:color-mix(in srgb,var(--nw-accent) 45%,var(--nw-border));color:var(--nw-accent)}",
      ".dshwnw-danger{color:var(--nw-danger)}",
      ".dshwnw-danger:hover:not(:disabled){border-color:var(--nw-danger);background:color-mix(in srgb,var(--nw-danger) 7%,var(--nw-surface))}",
      ".dshwnw-primary:disabled,.dshwnw-button:disabled,.dshwnw-danger:disabled{opacity:.5;cursor:default}",
      ".dshwnw-icon-btn{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;flex:none;padding:0;border:0;border-radius:7px;background:transparent;color:var(--nw-fg3);cursor:pointer;transition:background .15s,color .15s}",
      ".dshwnw-icon-btn:hover:not(:disabled){background:var(--nw-hover);color:var(--nw-fg)}",
      ".dshwnw-icon-btn[data-danger=true]:hover:not(:disabled){background:color-mix(in srgb,var(--nw-danger) 10%,transparent);color:var(--nw-danger)}",
      ".dshwnw-icon-btn:disabled{opacity:.35;cursor:default}",
      ".dshwnw-add{display:inline-flex;align-items:center;justify-content:center;gap:5px;width:100%;height:34px;border:1px dashed color-mix(in srgb,var(--nw-fg) 20%,var(--nw-border));border-radius:9px;background:transparent;color:var(--nw-fg2);font-size:12.5px;cursor:pointer;transition:border-color .15s,color .15s,background .15s}",
      ".dshwnw-add:hover:not(:disabled){border-color:var(--nw-accent);color:var(--nw-accent);background:var(--nw-accent-soft)}",
      ".dshwnw-add:disabled{opacity:.5;cursor:default}",
      ".dshwnw-empty{display:flex;flex-direction:column;align-items:center;gap:8px;padding:26px 14px;text-align:center;color:var(--nw-fg3);font-size:12.5px;line-height:19px;border:1px dashed color-mix(in srgb,var(--nw-fg) 16%,var(--nw-border));border-radius:12px}",
      ".dshwnw-empty .dshwnw-button,.dshwnw-empty .dshwnw-primary{margin-top:4px}",
      ".dshwnw-pill{display:inline-flex;align-items:center;flex:none;height:20px;padding:0 7px;border-radius:999px;background:var(--nw-fill);color:var(--nw-fg2);font-size:11px;font-weight:500;white-space:nowrap}",
      ".dshwnw-pill[data-tone=done]{background:color-mix(in srgb,var(--nw-ok) 14%,transparent);color:var(--nw-ok)}",
      ".dshwnw-pill[data-tone=active]{background:var(--nw-accent-soft);color:var(--nw-accent)}",
      ".dshwnw-pill[data-tone=hold]{background:color-mix(in srgb,var(--nw-warn) 15%,transparent);color:#b86e0c}",
      ".dshwnw-progress{display:flex;flex-direction:column;gap:0;padding-left:4px}",
      ".dshwnw-progress-item{position:relative;padding:0 0 14px 18px;display:flex;flex-direction:column;gap:3px}",
      ".dshwnw-progress-item:before{content:'';position:absolute;left:0;top:5px;width:8px;height:8px;border-radius:50%;background:var(--nw-accent);box-shadow:0 0 0 3px var(--nw-accent-soft)}",
      ".dshwnw-progress-item:after{content:'';position:absolute;left:3.5px;top:17px;bottom:0;width:1px;background:var(--nw-border)}",
      ".dshwnw-progress-item:last-child:after{display:none}",
      ".dshwnw-progress-head{display:flex;gap:8px;align-items:center;font-size:11.5px;color:var(--nw-fg3)}",
      ".dshwnw-progress-chapter{font-weight:600;color:var(--nw-fg)}",
      ".dshwnw-progress-copy{font-size:12.5px;line-height:19px;color:var(--nw-fg2);white-space:pre-wrap;overflow-wrap:anywhere}",
      ".dshwnw-progress-copy b{font-weight:600;color:var(--nw-fg)}",
      ".dshwnw-footer{flex:none;padding:9px 12px;border-top:1px solid var(--nw-border);display:flex;align-items:center;gap:8px;background:var(--nw-surface);z-index:1}",
      ".dshwnw-notice{display:flex;align-items:center;gap:7px;flex:1;min-width:0;font-size:12px;line-height:17px;color:var(--nw-fg2)}",
      ".dshwnw-notice-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-notice:before{content:'';width:7px;height:7px;flex:none;border-radius:50%;background:var(--nw-ok)}",
      ".dshwnw-notice[data-dirty=true]:before{background:var(--nw-warn)}",
      ".dshwnw-notice[data-kind=error]{color:var(--nw-danger)}",
      ".dshwnw-notice[data-kind=error]:before{background:var(--nw-danger)}",
      ".dshwnw-rail{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:10px;background:transparent;color:var(--dsw-alias-label-secondary,#68717e);cursor:pointer}",
      ".dshwnw-rail:hover{background:var(--dsw-alias-interactive-bg-hover,#e9edf3);color:var(--dsw-alias-label-primary,#1f2329)}",
      ".dshwnw-rail[data-active=true]{background:var(--dsw-alias-interactive-bg-selected,#dce8ff);color:var(--dsw-alias-state-business-primary,#3978e8)}",
      ".dshwnw-dock{box-sizing:border-box;width:calc(100% - 4 * var(--dsh-composer-dock-inset,8px) - 2 * var(--dsh-composer-side-clearance,0px));margin:0 auto}",
      ".dshwnw-writebar{box-sizing:border-box;width:100%;max-width:calc(var(--dsh-composer-card-max-width,760px) - 4 * var(--dsh-composer-dock-inset,8px));min-height:36px;margin:0 auto;padding:4px 5px 4px 10px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-business-primary,#3978e8) 22%,var(--dsw-alias-border-l1,#e1e5eb));border-radius:12px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3978e8) 5%,var(--dsw-alias-bg-layer-1,#fff));display:flex;align-items:center;gap:8px}",
      ".dshwnw-writebar-icon{display:inline-flex;flex:none;color:var(--dsw-alias-state-business-primary,#3978e8)}",
      ".dshwnw-writebar-label{flex:none;font-size:12.5px;font-weight:600;color:var(--dsw-alias-state-business-primary,#3978e8)}",
      ".dshwnw-writebar-objective{flex:1;min-width:0;font-size:13px;color:var(--dsw-alias-label-primary,#1f2329);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-writebar-input{flex:1;min-width:0;height:28px;box-sizing:border-box;padding:0 8px;border:1px solid var(--dsw-alias-border-l2,#d7dbe2);border-radius:7px;background:var(--dsw-alias-bg-base,#fff);color:inherit;font-size:13px;outline:none}",
      ".dshwnw-writebar-input:focus{border-color:var(--dsw-alias-state-business-primary,#3978e8)}",
      ".dshwnw-writebar-actions{display:flex;align-items:center;gap:2px;flex:none}",
      ".dshwnw-writebar-action{height:26px;padding:0 9px;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary,#68717e);font-size:12px;cursor:pointer}",
      ".dshwnw-writebar-action:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,#e9edf3);color:var(--dsw-alias-label-primary,#1f2329)}",
      ".dshwnw-writebar-action:disabled{opacity:.45;cursor:default}",
      ".dshwnw-writebar-error{flex:1;min-width:0;color:var(--dsw-alias-state-error-primary,#d64545);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-command-row{display:flex;flex-direction:column;align-items:flex-end;gap:6px}",
      ".dshwnw-command-bubble{max-width:min(525px,82%);box-sizing:border-box;padding:10px 16px;border-radius:22px;background:var(--dsw-specific-bubble,#edf3ff);color:var(--dsw-alias-label-primary,#1f2329);font:var(--dsw-font-markdown-code,13px ui-monospace,monospace);white-space:pre-wrap;overflow-wrap:anywhere}",
      ".dshwnw-settings{display:flex;flex-direction:column;gap:8px}",
      ".dshwnw-setting-card{display:grid;grid-template-columns:36px minmax(0,1fr);gap:12px;padding:12px;border:1px solid var(--nw-border);border-radius:12px;background:var(--nw-surface)}",
      ".dshwnw-setting-card[data-danger=true]{border-color:color-mix(in srgb,var(--nw-danger) 28%,var(--nw-border))}",
      ".dshwnw-setting-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--nw-accent-soft);color:var(--nw-accent)}",
      ".dshwnw-setting-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}",
      ".dshwnw-setting-card[data-danger=true] .dshwnw-setting-icon{background:color-mix(in srgb,var(--nw-danger) 10%,transparent);color:var(--nw-danger)}",
      ".dshwnw-setting-main{min-width:0;display:flex;flex-direction:column;gap:4px}",
      ".dshwnw-setting-title{font-size:13.5px;font-weight:650;line-height:20px}",
      ".dshwnw-setting-copy{font-size:12px;line-height:18px;color:var(--nw-fg2)}",
      ".dshwnw-setting-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}",
      ".dshwnw-confirm{display:flex;flex-direction:column;gap:6px;margin-top:6px;padding:9px 10px;border-radius:8px;background:color-mix(in srgb,var(--nw-danger) 8%,transparent);color:var(--nw-danger);font-size:12px;line-height:18px}",
      ".dshwnw-file-input{display:none}",
      ".dshwnw-custom-list{display:flex;flex-direction:column;gap:6px}",
      ".dshwnw-custom-row{display:grid;grid-template-columns:minmax(90px,.7fr) minmax(120px,1.3fr) 28px;gap:6px;align-items:start}",
      ".dshwnw-custom-row .dshwnw-textarea{min-height:34px;padding-block:6px}",
      ".dshwnw-custom-row .dshwnw-icon-btn{margin-top:3px}",
      ".dshwnw-outline-card{content-visibility:auto;contain-intrinsic-size:0 240px;gap:10px}",
      ".dshwnw-outline-list{display:flex;flex-direction:column;gap:6px}",
      ".dshwnw-node{border:1px solid var(--nw-border);border-radius:10px;background:var(--nw-surface)}",
      ".dshwnw-node[open]{border-color:color-mix(in srgb,var(--nw-accent) 30%,var(--nw-border))}",
      ".dshwnw-node>summary{display:flex;align-items:center;gap:6px;min-height:40px;padding:4px 4px 4px 8px;list-style:none;cursor:pointer;user-select:none}",
      ".dshwnw-node>summary::-webkit-details-marker{display:none}",
      ".dshwnw-node-num{flex:none;min-width:22px;height:20px;padding:0 5px;border-radius:6px;background:var(--nw-fill);color:var(--nw-fg2);font-size:11px;font-weight:600;line-height:20px;text-align:center}",
      ".dshwnw-node-copy{flex:1;min-width:0;display:flex;flex-direction:column}",
      ".dshwnw-node-title{font-size:13px;font-weight:600;line-height:18px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-node-title[data-empty=true]{color:var(--nw-fg3);font-weight:500}",
      ".dshwnw-node-meta{font-size:11px;line-height:15px;color:var(--nw-fg3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-node-body{display:flex;flex-direction:column;gap:12px;padding:6px 12px 12px;border-top:1px solid var(--nw-border)}",
      ".dshwnw-node .dshwnw-node{background:var(--nw-fill);border-color:transparent}",
      ".dshwnw-node .dshwnw-node[open]{background:var(--nw-surface);border-color:var(--nw-border)}",
      ".dshwnw-chapter-meta{display:grid;grid-template-columns:72px 1fr 100px;gap:10px}",
      ".dshwnw-divider{display:flex;align-items:center;gap:8px;margin-top:2px;font-size:12px;font-weight:600;color:var(--nw-fg2)}",
      ".dshwnw-divider:after{content:'';flex:1;height:1px;background:var(--nw-border)}",
      ".dshwnw-hero{display:flex;align-items:center;gap:10px;min-width:0}",
      ".dshwnw-hero .dshwnw-list-copy{flex:1}",
      ".dshwnw-hero .dshwnw-list-name{font-size:15px;line-height:21px}",
      ".dshwnw-relation-title{display:flex;align-items:center;gap:6px;flex:1;min-width:0;font-size:14px;font-weight:650}",
      ".dshwnw-relation-title span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-relation-arrow{flex:none;color:var(--nw-fg3)}",
      ".dshwnw-nav-trigger{align-self:center;display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 10px 0 5px;border:1px solid var(--nw-border);border-radius:999px;background:var(--nw-surface);color:var(--nw-fg);font-size:13px;font-weight:600;cursor:pointer;transition:border-color .15s,box-shadow .15s}",
      ".dshwnw-nav-trigger:hover{border-color:color-mix(in srgb,var(--nw-accent) 45%,var(--nw-border))}",
      ".dshwnw-nav-trigger[aria-expanded=true]{border-color:var(--nw-accent);box-shadow:0 0 0 3px var(--nw-accent-soft)}",
      ".dshwnw-nav-trigger .dshwnw-chevron{transform:rotate(90deg)}",
      ".dshwnw-nav-trigger[aria-expanded=true] .dshwnw-chevron{transform:rotate(-90deg)}",
      ".dshwnw-nav-dot{width:22px;height:22px;flex:none;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--nw-accent);color:#fff}",
      ".dshwnw-nav-alert{width:7px;height:7px;flex:none;border-radius:50%;background:var(--nw-danger);box-shadow:0 0 0 2px var(--nw-surface)}",
      ".dshwnw-nav-scrim{position:absolute;left:0;right:0;top:100%;height:100vh;background:color-mix(in srgb,var(--dsw-specific-sidebar-fill,#f7f8fa) 55%,transparent);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);animation:dshwnw-fade .18s ease-out}",
      ".dshwnw-nav-grid{position:absolute;top:calc(100% - 2px);left:50%;width:min(312px,calc(100cqw - 20px));margin-left:calc(min(312px,calc(100cqw - 20px)) / -2);display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;padding:8px;border:1px solid var(--nw-border);border-radius:16px;background:var(--nw-surface);box-shadow:0 14px 36px color-mix(in srgb,var(--nw-fg) 16%,transparent);transform-origin:50% -14px;animation:dshwnw-pop .24s cubic-bezier(.2,.9,.3,1.15)}",
      ".dshwnw-nav-tile{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:0;height:80px;padding:6px 4px;border:1px solid transparent;border-radius:12px;background:var(--nw-fill);color:var(--nw-fg);cursor:pointer;opacity:0;animation:dshwnw-tile .22s ease-out forwards;transition:background .15s,border-color .15s,color .15s}",
      ".dshwnw-nav-tile:hover,.dshwnw-nav-tile:focus-visible{outline:none;border-color:color-mix(in srgb,var(--nw-accent) 45%,var(--nw-border));color:var(--nw-accent)}",
      ".dshwnw-nav-tile[data-active=true]{background:var(--nw-accent-soft);color:var(--nw-accent)}",
      ".dshwnw-nav-tile-label{font-size:12.5px;font-weight:600;line-height:17px}",
      ".dshwnw-nav-tile-meta{max-width:100%;font-size:10.5px;line-height:14px;color:var(--nw-fg3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-nav-badge{position:absolute;top:6px;right:8px;min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:var(--nw-danger);color:#fff;font-size:10px;font-weight:650;line-height:16px;text-align:center}",
      "@keyframes dshwnw-pop{from{opacity:0;transform:scale(.25)}to{opacity:1;transform:none}}",
      "@keyframes dshwnw-tile{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}",
      "@keyframes dshwnw-fade{from{opacity:0}}",
      "@media (prefers-reduced-motion:reduce){.dshwnw-nav-grid,.dshwnw-nav-tile,.dshwnw-nav-scrim{animation:none;opacity:1}}",
      ".dshwnw-grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}",
      ".dshwnw-pill[data-tone=danger]{background:color-mix(in srgb,var(--nw-danger) 13%,transparent);color:var(--nw-danger)}",
      ".dshwnw-segment{display:inline-flex;flex:none;gap:2px;padding:2px;border-radius:8px;background:var(--nw-fill)}",
      ".dshwnw-segment button{height:24px;padding:0 9px;border:0;border-radius:6px;background:transparent;color:var(--nw-fg2);font-size:12px;cursor:pointer}",
      ".dshwnw-segment button[data-active=true]{background:var(--nw-surface);color:var(--nw-fg);font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.08),0 0 0 1px var(--nw-border)}",
      ".dshwnw-cursor{padding:8px 10px;border-radius:9px;background:var(--nw-accent-soft);color:var(--nw-fg2);font-size:12px;line-height:18px}",
      ".dshwnw-cursor b{font-weight:600;color:var(--nw-fg)}",
      ".dshwnw-cursor[data-kind=warn]{background:color-mix(in srgb,var(--nw-warn) 13%,transparent)}",
      ".dshwnw-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}",
      ".dshwnw-stat{display:flex;flex-direction:column;align-items:flex-start;min-width:0;padding:7px 9px;border:1px solid var(--nw-border);border-radius:10px;background:var(--nw-surface);color:var(--nw-fg2);font-size:11.5px;line-height:16px;text-align:left;white-space:nowrap;cursor:pointer;transition:border-color .15s,box-shadow .15s}",
      ".dshwnw-stat b{font-size:19px;line-height:24px;font-weight:650;color:var(--nw-fg)}",
      ".dshwnw-stat[data-tone=overdue] b{color:var(--nw-danger)}",
      ".dshwnw-stat[data-tone=due] b{color:var(--nw-accent)}",
      ".dshwnw-stat[data-tone=soon] b{color:#b86e0c}",
      ".dshwnw-stat[data-zero=true] b{color:var(--nw-fg3)}",
      ".dshwnw-stat[data-active=true]{border-color:var(--nw-accent);box-shadow:0 0 0 3px var(--nw-accent-soft)}",
      ".dshwnw-filters{display:flex;flex-wrap:wrap;gap:6px}",
      ".dshwnw-chip{height:26px;padding:0 10px;border:1px solid var(--nw-border);border-radius:999px;background:var(--nw-surface);color:var(--nw-fg2);font-size:12px;white-space:nowrap;cursor:pointer}",
      ".dshwnw-chip[data-active=true]{border-color:transparent;background:var(--nw-accent-soft);color:var(--nw-accent);font-weight:600}",
      ".dshwnw-chip-count{margin-left:4px;opacity:.7}",
      ".dshwnw-toolrow{display:flex;gap:6px}",
      ".dshwnw-toolrow .dshwnw-input{flex:1;height:30px}",
      ".dshwnw-toolrow .dshwnw-select{width:auto;flex:none;height:30px;padding:0 6px;font-size:12px}",
      ".dshwnw-thread{border-left:3px solid var(--nw-border)}",
      ".dshwnw-thread[data-state=overdue]{border-left-color:var(--nw-danger)}",
      ".dshwnw-thread[data-state=due]{border-left-color:var(--nw-accent)}",
      ".dshwnw-thread[data-state=soon]{border-left-color:var(--nw-warn)}",
      ".dshwnw-thread[data-state=open]{border-left-color:color-mix(in srgb,var(--nw-accent) 45%,var(--nw-border))}",
      ".dshwnw-thread[data-state=resolved]{border-left-color:var(--nw-ok)}",
      ".dshwnw-thread[data-state=dropped]{border-left-color:var(--nw-border);opacity:.7}",
      ".dshwnw-thread-top{display:flex;align-items:center;gap:6px;min-width:0}",
      ".dshwnw-kind{flex:none;height:18px;padding:0 6px;border-radius:5px;background:var(--nw-fill);color:var(--nw-fg2);font-size:10.5px;font-weight:600;line-height:18px}",
      ".dshwnw-core{flex:none;font-size:10.5px;font-weight:700;color:var(--nw-accent)}",
      ".dshwnw-track{display:flex;align-items:center;gap:6px;min-width:0;margin-top:3px;font-size:11px;line-height:15px;color:var(--nw-fg3);white-space:nowrap}",
      ".dshwnw-track-bar{position:relative;flex:1;min-width:24px;max-width:120px;height:4px;border-radius:2px;background:color-mix(in srgb,var(--nw-fg) 9%,transparent);overflow:hidden}",
      ".dshwnw-track-bar i{position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:var(--nw-accent)}",
      ".dshwnw-track[data-state=overdue] .dshwnw-track-bar i{background:var(--nw-danger)}",
      ".dshwnw-track[data-state=resolved] .dshwnw-track-bar i{background:var(--nw-ok)}",
      ".dshwnw-track[data-state=dropped] .dshwnw-track-bar i{background:var(--nw-fg3)}",
      ".dshwnw-flag{overflow:hidden;text-overflow:ellipsis;color:#b86e0c}",
      ".dshwnw-secret .dshwnw-textarea{border-style:dashed;background:color-mix(in srgb,var(--nw-accent) 3%,var(--nw-surface))}",
      ".dshwnw-people{display:flex;flex-wrap:wrap;gap:6px}",
      ".dshwnw-person{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px 0 3px;border:1px solid var(--nw-border);border-radius:999px;background:var(--nw-surface);color:var(--nw-fg2);font-size:12px;cursor:pointer}",
      ".dshwnw-person .dshwnw-avatar{width:22px;height:22px;border-radius:50%;font-size:11px}",
      ".dshwnw-person[aria-pressed=true]{border-color:var(--nw-accent);background:var(--nw-accent-soft);color:var(--nw-fg);font-weight:600}",
      ".dshwnw-person:not([aria-pressed=true]) .dshwnw-avatar{filter:grayscale(1);opacity:.5}",
      ".dshwnw-beat{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.6fr) 28px;gap:6px;align-items:start}",
      ".dshwnw-beat .dshwnw-textarea{min-height:34px;padding-block:6px}",
      ".dshwnw-beat .dshwnw-icon-btn{margin-top:3px}",
      ".dshwnw-timeline{display:grid;grid-template-columns:96px minmax(0,1fr);border:1px solid var(--nw-border);border-radius:12px;background:var(--nw-surface);overflow:hidden}",
      ".dshwnw-timeline-labels{border-right:1px solid var(--nw-border);min-width:0}",
      ".dshwnw-timeline-corner{height:24px;padding:0 8px;font-size:10.5px;line-height:24px;color:var(--nw-fg3)}",
      ".dshwnw-timeline-label{display:flex;align-items:center;gap:6px;width:100%;height:30px;padding:0 8px;border:0;background:none;color:var(--nw-fg);font-size:12px;text-align:left;white-space:nowrap;overflow:hidden;cursor:pointer}",
      ".dshwnw-timeline-label:hover{background:var(--nw-hover)}",
      ".dshwnw-timeline-label i{width:6px;height:6px;flex:none;border-radius:50%;background:var(--nw-accent)}",
      ".dshwnw-timeline-label[data-state=overdue] i{background:var(--nw-danger)}",
      ".dshwnw-timeline-label[data-state=soon] i{background:var(--nw-warn)}",
      ".dshwnw-timeline-label[data-state=resolved] i{background:var(--nw-ok)}",
      ".dshwnw-timeline-label[data-state=dropped] i,.dshwnw-timeline-label[data-state=unplanned] i{background:var(--nw-fg3)}",
      ".dshwnw-timeline-scroll{overflow-x:auto;scrollbar-width:thin}",
      ".dshwnw-timeline svg{display:block}",
      ".dshwnw-timeline text{font-size:10px;fill:var(--nw-fg3)}",
      ".dshwnw-timeline .tl-head-current{fill:var(--nw-accent);font-weight:700}",
      ".dshwnw-timeline .tl-current{fill:var(--nw-accent-soft)}",
      ".dshwnw-timeline .tl-volume{stroke:var(--nw-border);stroke-dasharray:2 3}",
      ".dshwnw-timeline .tl-hit{fill:transparent;cursor:pointer}",
      ".dshwnw-timeline .tl-row:hover .tl-hit{fill:var(--nw-hover)}",
      ".dshwnw-timeline .tl-span{stroke:color-mix(in srgb,var(--nw-accent) 55%,transparent);stroke-width:3;stroke-linecap:round}",
      ".dshwnw-timeline .tl-late{stroke:var(--nw-danger);stroke-width:3;stroke-linecap:round;stroke-dasharray:3 3}",
      ".dshwnw-timeline .tl-row[data-state=resolved] .tl-span{stroke:color-mix(in srgb,var(--nw-ok) 60%,transparent)}",
      ".dshwnw-timeline .tl-row[data-state=dropped] .tl-span{stroke:var(--nw-fg3);stroke-dasharray:3 3}",
      ".dshwnw-timeline .tl-plant{fill:var(--nw-accent)}",
      ".dshwnw-timeline .tl-row[data-state=dropped] .tl-plant{fill:var(--nw-fg3)}",
      ".dshwnw-timeline .tl-beat{fill:var(--nw-surface);stroke:var(--nw-accent);stroke-width:1.5}",
      ".dshwnw-timeline .tl-payoff{fill:var(--nw-surface);stroke:var(--nw-accent);stroke-width:2}",
      ".dshwnw-timeline .tl-row[data-state=overdue] .tl-payoff{stroke:var(--nw-danger)}",
      ".dshwnw-timeline .tl-resolved{fill:var(--nw-ok)}",
      ".dshwnw-legend{font-size:11px;line-height:16px;color:var(--nw-fg3)}",
      ".dshwnw-book-card{display:flex;flex-direction:column;gap:7px;padding:12px;border:1px solid var(--nw-border);border-radius:12px;background:var(--nw-surface)}",
      ".dshwnw-book-figures{font-size:12.5px;color:var(--nw-fg2)}",
      ".dshwnw-book-figures b{font-size:22px;line-height:28px;font-weight:650;color:var(--nw-fg)}",
      ".dshwnw-book-meta{display:flex;flex-wrap:wrap;gap:2px 12px;font-size:11.5px;line-height:17px;color:var(--nw-fg3)}",
      ".dshwnw-book-card>.dshwnw-button{align-self:flex-start}",
      ".dshwnw-text-danger{color:var(--nw-danger)}",
      ".dshwnw-progressbar{position:relative;display:block;height:6px;border-radius:3px;background:color-mix(in srgb,var(--nw-fg) 8%,transparent);overflow:hidden}",
      ".dshwnw-progressbar i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:var(--nw-accent);transition:width .3s}",
      ".dshwnw-progressbar[data-over=true] i{background:var(--nw-ok)}",
      ".dshwnw-file-badge{display:inline-flex;flex:none;color:var(--nw-ok)}",
      ".dshwnw-file-badge[data-missing=true]{color:var(--nw-danger)}",
      ".dshwnw-manuscript{display:flex;flex-direction:column;gap:8px;padding:10px;border-radius:10px;background:var(--nw-fill)}",
      ".dshwnw-manuscript-stats{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px;font-size:12px;color:var(--nw-fg2)}",
      ".dshwnw-manuscript-stats b{font-size:16px;font-weight:650;color:var(--nw-fg)}",
      ".dshwnw-manuscript-stats span{color:var(--nw-fg3)}",
      ".dshwnw-preview{max-height:260px;overflow:auto;padding:10px 12px;border:1px solid var(--nw-border);border-radius:8px;background:var(--nw-surface);font-size:12.5px;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere}",
      "@container novel-panel (max-width:430px){.dshwnw-chapter-meta{grid-template-columns:64px minmax(0,1fr)}.dshwnw-chapter-meta>:last-child{grid-column:1 / -1}.dshwnw-custom-row{grid-template-columns:minmax(80px,.7fr) minmax(100px,1.3fr) 28px}.dshwnw-toolbar{padding-inline:12px}.dshwnw-body{padding-inline:10px}.dshwnw-card{padding:11px}.dshwnw-group-body{padding-inline:11px}}",
      "@container novel-panel (max-width:340px){.dshwnw-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.dshwnw-grid-3{grid-template-columns:minmax(0,1fr)}.dshwnw-timeline{grid-template-columns:80px minmax(0,1fr)}.dshwnw-grid,.dshwnw-chapter-meta{grid-template-columns:minmax(0,1fr)}.dshwnw-chapter-meta>:last-child{grid-column:auto}.dshwnw-setting-card{grid-template-columns:1fr}.dshwnw-footer{gap:6px}.dshwnw-footer .dshwnw-button,.dshwnw-footer .dshwnw-primary{padding:0 9px}}",
    ].join("\n");
    var tagId = "dsh-w-noval-write/styles";

    function installStyle() {
      if (typeof document === "undefined") return { owned: false, node: null };
      var existing = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]");
      if (existing) return { owned: false, node: existing };
      var node = document.createElement("style");
      node.dataset.plugin = "dsh-w-noval-write";
      node.dataset.pluginCss = tagId;
      node.textContent = CSS;
      document.head.appendChild(node);
      return { owned: true, node: node };
    }

    var passthrough = { parse: function (value) { return value; } };
    function parameter(name) {
      return { name: name, wire: name, source: "json", codec: { mode: "strict", typeSymbol: "json", schema: passthrough } };
    }
    function descriptor(method, parameters) {
      return {
        id: "dsh-w-noval-write#novalWriter/" + method,
        service: "novalWriter",
        namespace: "novalWriter",
        method: method,
        invocation: { kind: "direct" },
        parameters: parameters || [],
        result: { mode: "strict", typeSymbol: "json", schema: passthrough },
      };
    }
    var TYPERT_REMOTE = {
      package: "dsh-w-noval-write",
      descriptors: [
        descriptor("getState", [parameter("workspaceId")]),
        descriptor("saveProject", [parameter("workspaceId"), parameter("input"), parameter("expectedRevision")]),
        descriptor("exportProject", [parameter("workspaceId")]),
        descriptor("importProject", [parameter("workspaceId"), parameter("input"), parameter("expectedRevision")]),
        descriptor("resetProject", [parameter("workspaceId"), parameter("expectedRevision")]),
        descriptor("getLink", [parameter("sessionId")]),
        descriptor("editLink", [parameter("sessionId"), parameter("objective"), parameter("expectedRevision")]),
        descriptor("clearLink", [parameter("sessionId"), parameter("expectedRevision")]),
        descriptor("listManuscripts", [parameter("workspaceId")]),
        descriptor("readManuscript", [parameter("workspaceId"), parameter("filename")]),
      ],
    };

    function failureText(error) {
      if (!error) return "unknown error";
      if (error.message) return String(error.message);
      try { return JSON.stringify(error); } catch (_) { return String(error); }
    }

    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }

    function makeId(prefix) {
      return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    }

    function IconQuill() {
      return React.createElement("svg", { viewBox: "0 0 20 20", width: 18, height: 18, "aria-hidden": true },
        React.createElement("path", { d: "M15.8 3.2c-3.9.5-7.4 2.7-9.4 6.1-.9 1.5-1.4 3.1-1.6 4.6 1.5-.2 3.1-.7 4.6-1.6 3.4-2 5.6-5.5 6.4-9.1Z", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinejoin: "round" }),
        React.createElement("path", { d: "M4 16c2.4-3.5 5.4-6.5 9-9", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" })
      );
    }

    var ICON_PATHS = {
      chevron: ["M7.5 5l5 5-5 5"],
      plus: ["M10 4.5v11", "M4.5 10h11"],
      trash: ["M4.5 6h11", "M8 3.8h4", "M6.2 6l.6 9.2c0 .5.5.8 1 .8h4.4c.5 0 1-.3 1-.8L13.8 6"],
      up: ["M10 15.5v-11", "M5.5 9L10 4.5 14.5 9"],
      down: ["M10 4.5v11", "M5.5 11l4.5 4.5 4.5-4.5"],
      arrow: ["M4 10h12", "M11.5 5.5L16 10l-4.5 4.5"],
      check: ["M4.5 10.5l3.5 3.5 7.5-8"],
      refresh: ["M16 10a6 6 0 01-10.5 4", "M4 10a6 6 0 0110.5-4", "M14.5 2.8V6h-3.2", "M5.5 17.2V14h3.2"],
      link: ["M8.5 11.5l3-3", "M7 9l-1.5 1.5a2.5 2.5 0 003.5 3.5l1.5-1.5", "M13 11l1.5-1.5A2.5 2.5 0 0011 6L9.5 7.5"],
      file: ["M5.5 3h6.5l3.5 3.5V16a1 1 0 01-1 1h-9a1 1 0 01-1-1V4a1 1 0 011-1z", "M11.5 3v4h4"],
      undo: ["M7.5 5.5L4 9l3.5 3.5", "M4.5 9h7a4 4 0 010 8H9"],
      section_project: ["M5 3.5h8.5A1.5 1.5 0 0115 5v11.5H6.5A1.5 1.5 0 015 15V3.5z", "M5 15a1.5 1.5 0 011.5-1.5H15"],
      section_characters: ["M10 9.5a3 3 0 100-6 3 3 0 000 6z", "M4.5 16.5c.6-2.8 2.8-4.5 5.5-4.5s4.9 1.7 5.5 4.5"],
      section_relationships: ["M8.5 11.5l3-3", "M7 9l-1.5 1.5a2.5 2.5 0 003.5 3.5l1.5-1.5", "M13 11l1.5-1.5A2.5 2.5 0 0011 6L9.5 7.5"],
      section_world: ["M10 16.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z", "M3.5 10h13", "M10 3.5c1.8 1.8 2.6 4 2.6 6.5s-.8 4.7-2.6 6.5c-1.8-1.8-2.6-4-2.6-6.5s.8-4.7 2.6-6.5z"],
      section_plot: ["M4 15.5l4-5 3 3 5-7", "M13 6.5h3v3"],
      section_outline: ["M7.5 5.5h8", "M7.5 10h8", "M7.5 14.5h8", "M4.2 5.5h.1", "M4.2 10h.1", "M4.2 14.5h.1"],
      section_scene: ["M3.5 7.5h13v8a1 1 0 01-1 1h-11a1 1 0 01-1-1v-8z", "M3.5 7.5l1.2-3.3h11l-.7 3.3", "M8 4.2l-1 3.3", "M12.3 4.2l-1 3.3"],
      section_threads: ["M5 16.5V4", "M5 4.5h8.5l-1.8 3 1.8 3H5"],
      section_settings: ["M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z", "M10 3v1.8", "M10 15.2V17", "M3 10h1.8", "M15.2 10H17", "M5 5l1.3 1.3", "M13.7 13.7L15 15", "M5 15l1.3-1.3", "M13.7 6.3L15 5"],
    };
    function NwIcon(props) {
      var size = props.size || 15;
      return React.createElement("svg", { viewBox: "0 0 20 20", width: size, height: size, "aria-hidden": true, className: props.className, fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" },
        ICON_PATHS[props.name].map(function (d, index) { return React.createElement("path", { key: index, d: d }); })
      );
    }

    function IconButton(props) {
      return React.createElement("button", {
        type: "button", className: "dshwnw-icon-btn", title: props.label, "aria-label": props.label,
        "data-danger": props.danger ? "true" : undefined, disabled: props.disabled,
        onClick: function (event) {
          // Buttons live inside <summary>; keep a click from toggling the fold.
          event.preventDefault();
          event.stopPropagation();
          props.onClick();
        },
      }, React.createElement(NwIcon, { name: props.icon }));
    }

    function AddButton(props) {
      return React.createElement("button", { type: "button", className: "dshwnw-add", disabled: props.disabled, onClick: props.onClick },
        React.createElement(NwIcon, { name: "plus", size: 14 }), props.children);
    }

    // Stable per-character avatar tint derived from the id.
    function hueOf(text) {
      var hash = 0;
      var source = String(text || "");
      for (var i = 0; i < source.length; i += 1) hash = (hash * 31 + source.charCodeAt(i)) % 3600;
      return Math.round(hash * 137.508) % 360;
    }

    function Avatar(props) {
      return React.createElement("span", { className: "dshwnw-avatar", "data-size": props.size, style: { "--nw-hue": hueOf(props.seed) } }, (props.name || "?").slice(0, 1));
    }

    // Status fields are free text; colour the common words, leave the rest neutral.
    function statusTone(status) {
      var value = String(status || "").trim().toLowerCase();
      if (!value) return null;
      if (/done|complete|finish|final|完成|完稿|定稿|已写/.test(value)) return "done";
      if (/draft|writ|progress|active|revis|写作|进行|草稿|初稿|修改|在写/.test(value)) return "active";
      if (/hold|block|pause|搁置|暂停|待定|卡/.test(value)) return "hold";
      return "plain";
    }

    function StatusPill(props) {
      var tone = statusTone(props.status);
      return tone ? React.createElement("span", { className: "dshwnw-pill", "data-tone": tone }, props.status) : null;
    }

    function WriteDock(props) {
      var linkSlot = React.useState(null);
      var link = linkSlot[0];
      var setLink = linkSlot[1];
      var editingSlot = React.useState(false);
      var editing = editingSlot[0];
      var setEditing = editingSlot[1];
      var draftSlot = React.useState("");
      var draft = draftSlot[0];
      var setDraft = draftSlot[1];
      var pendingSlot = React.useState(false);
      var pending = pendingSlot[0];
      var setPending = pendingSlot[1];
      var errorSlot = React.useState("");
      var actionError = errorSlot[0];
      var setActionError = errorSlot[1];
      var pendingRef = React.useRef(false);
      var mountedRef = React.useRef(true);
      var revision = link ? link.revision : 0;

      React.useEffect(function () {
        mountedRef.current = true;
        var stopped = false;
        function refresh() {
          props.loadLink().then(function (value) {
            if (!stopped && mountedRef.current && !pendingRef.current) setLink(value || null);
          }).catch(function () {});
        }
        refresh();
        var timer = setInterval(refresh, 3000);
        return function () { stopped = true; mountedRef.current = false; clearInterval(timer); };
      }, [props.loadLink]);

      React.useEffect(function () {
        setEditing(false);
        setActionError("");
      }, [revision]);

      function run(action, onSuccess) {
        if (pendingRef.current) return;
        pendingRef.current = true;
        setPending(true);
        setActionError("");
        action().then(function (value) {
          if (mountedRef.current && typeof onSuccess === "function") onSuccess(value);
        }).catch(function (error) {
          if (mountedRef.current) setActionError(failureText(error));
        }).finally(function () {
          pendingRef.current = false;
          if (mountedRef.current) setPending(false);
        });
      }

      if (!link) return null;
      if (editing) {
        return React.createElement("div", { className: "dshwnw-dock", "data-noval-write-bar": "true" },
          React.createElement("div", { className: "dshwnw-writebar" },
            React.createElement("span", { className: "dshwnw-writebar-icon" }, React.createElement(IconQuill, null)),
            React.createElement("input", {
              className: "dshwnw-writebar-input", type: "text", value: draft, autoFocus: true,
              "aria-label": props.t("writeObjectiveAria"),
              onChange: function (event) { setDraft(event.target.value); },
              onKeyDown: function (event) {
                if (event.key === "Enter" && draft.trim()) run(function () { return props.onEdit(draft.trim(), link.revision); }, function (value) { setLink(value); setEditing(false); });
                if (event.key === "Escape") setEditing(false);
              },
            }),
            actionError ? React.createElement("span", { className: "dshwnw-writebar-error", role: "alert" }, actionError) : null,
            React.createElement("div", { className: "dshwnw-writebar-actions" },
              React.createElement("button", { type: "button", className: "dshwnw-writebar-action", disabled: pending || !draft.trim(), onClick: function () { run(function () { return props.onEdit(draft.trim(), link.revision); }, function (value) { setLink(value); setEditing(false); }); } }, props.t("writeSave")),
              React.createElement("button", { type: "button", className: "dshwnw-writebar-action", disabled: pending, onClick: function () { setEditing(false); } }, props.t("writeCancel"))
            )
          )
        );
      }
      return React.createElement("div", { className: "dshwnw-dock", "data-noval-write-bar": "true" },
        React.createElement("div", { className: "dshwnw-writebar", title: link.workspaceTitle || link.workspaceId },
          React.createElement("span", { className: "dshwnw-writebar-icon" }, React.createElement(IconQuill, null)),
          React.createElement("span", { className: "dshwnw-writebar-label" }, props.t("writeActive")),
          actionError
            ? React.createElement("span", { className: "dshwnw-writebar-error", role: "alert" }, actionError)
            : React.createElement("span", { className: "dshwnw-writebar-objective" }, link.objective),
          React.createElement("div", { className: "dshwnw-writebar-actions" },
            React.createElement("button", { type: "button", className: "dshwnw-writebar-action", disabled: pending, onClick: function () { setDraft(link.objective); setEditing(true); } }, props.t("writeEdit")),
            React.createElement("button", { type: "button", className: "dshwnw-writebar-action", disabled: pending, onClick: function () { run(function () { return props.onClear(link.revision); }, function () { setLink(null); }); } }, props.t("writeClear"))
          )
        )
      );
    }

    var writeCommandInputDefinition = {
      kind: "noval-write-command-input",
      target: "chat",
      match: function (event) {
        return event.type === "command/run" && event.data && event.data.name === "write"
          ? { id: String(event.data.commandId), role: "start" }
          : null;
      },
      start: function (_context, match) {
        var event = match.event;
        return {
          commandId: event.data.commandId,
          seq: event.seq,
          time: event.time,
          text: "/" + event.data.name + String(event.data.args || "").trimEnd(),
        };
      },
      update: function (context) { return context.state; },
      buildViewNode: function (context) {
        if (!context.state) return null;
        return {
          key: context.key,
          kind: "noval-write-command-input",
          id: context.id,
          target: "chat",
          anchorSeq: context.state.seq - 0.1,
          location: context.start && context.start.location ? context.start.location : { kind: "unresolved" },
          visibility: "visible",
          data: context.state,
        };
      },
    };

    function WriteCommandInputView(props) {
      return React.createElement("div", { className: "dshwnw-command-row", role: "group", "aria-label": props.t("writeCommandInput") },
        React.createElement("div", { className: "dshwnw-command-bubble" }, props.node.data.text)
      );
    }

    function InputField(props) {
      return React.createElement("label", { className: "dshwnw-field" },
        React.createElement("span", { className: "dshwnw-label" }, props.label),
        React.createElement("input", {
          className: "dshwnw-input",
          value: props.value || "",
          placeholder: props.placeholder || "",
          onChange: function (event) { props.onChange(event.target.value); },
        })
      );
    }

    function TextField(props) {
      return React.createElement("label", { className: "dshwnw-field" },
        React.createElement("span", { className: "dshwnw-label" }, props.label),
        React.createElement("textarea", {
          className: "dshwnw-textarea",
          value: props.value || "",
          placeholder: props.placeholder || "",
          rows: props.rows || 4,
          onChange: function (event) { props.onChange(event.target.value); },
        })
      );
    }

    function SelectField(props) {
      return React.createElement("label", { className: "dshwnw-field" },
        React.createElement("span", { className: "dshwnw-label" }, props.label),
        React.createElement("select", {
          className: "dshwnw-select",
          value: props.value || "",
          onChange: function (event) { props.onChange(event.target.value); },
        }, props.empty === null ? null : React.createElement("option", { value: "" }, props.empty || "—"), props.options.map(function (option) {
          return React.createElement("option", { key: option.value, value: option.value }, option.label);
        }))
      );
    }

    // A titled group folds away; `open` only seeds the initial state, after
    // which the browser owns the toggle.
    function FieldGroup(props) {
      if (!props.title) return React.createElement("div", { className: "dshwnw-subsection" }, props.children);
      return React.createElement("details", { className: "dshwnw-group", open: props.collapsed ? undefined : true },
        React.createElement("summary", null,
          React.createElement(NwIcon, { name: "chevron", size: 14, className: "dshwnw-chevron" }),
          props.title,
          props.count ? React.createElement("span", { className: "dshwnw-group-count" }, props.count) : null
        ),
        React.createElement("div", { className: "dshwnw-group-body" }, props.children)
      );
    }

    // Field names are object keys, so they are edited locally and committed on
    // blur: renaming keystroke-by-keystroke would drop the field the moment
    // the name went empty, or overwrite a sibling that shares a prefix.
    function CustomFieldKey(props) {
      var draftSlot = React.useState(props.value);
      var draft = draftSlot[0];
      var setDraft = draftSlot[1];
      React.useEffect(function () { setDraft(props.value); }, [props.value]);
      function commit() {
        var clean = draft.trim();
        if (!clean || clean === props.value || props.taken(clean)) setDraft(props.value);
        else props.onRename(clean);
      }
      return React.createElement("input", {
        className: "dshwnw-input", value: draft, "aria-label": props.label,
        onChange: function (event) { setDraft(event.target.value); },
        onBlur: commit,
        onKeyDown: function (event) {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") { setDraft(props.value); event.currentTarget.blur(); }
        },
      });
    }

    function CustomFieldsEditor(props) {
      var fields = props.value && typeof props.value === "object" ? props.value : {};
      var entries = Object.entries(fields);
      function replaceKey(oldKey, nextKey) {
        var next = {};
        entries.forEach(function (entry) {
          if (entry[0] === oldKey) next[nextKey] = entry[1];
          else next[entry[0]] = entry[1];
        });
        props.onChange(next);
      }
      function setValue(key, value) {
        props.onChange(Object.assign({}, fields, { [key]: value }));
      }
      function remove(key) {
        var next = Object.assign({}, fields);
        delete next[key];
        props.onChange(next);
      }
      function addField() {
        var index = entries.length + 1;
        var key = props.t("customFieldDefault") + index;
        while (Object.hasOwn(fields, key)) { index += 1; key = props.t("customFieldDefault") + index; }
        props.onChange(Object.assign({}, fields, { [key]: "" }));
      }
      return React.createElement(FieldGroup, { title: props.title || props.t("customFields"), count: entries.length || null, collapsed: entries.length === 0 },
        React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, props.t("customFieldsHint")),
        entries.length > 0 ? React.createElement("div", { className: "dshwnw-custom-list" }, entries.map(function (entry, entryIndex) {
          return React.createElement("div", { className: "dshwnw-custom-row", key: entryIndex },
            React.createElement(CustomFieldKey, {
              value: entry[0], label: props.t("customFieldName"),
              taken: function (key) { return Object.hasOwn(fields, key); },
              onRename: function (key) { replaceKey(entry[0], key); },
            }),
            React.createElement("textarea", { className: "dshwnw-textarea", rows: 1, value: entry[1], "aria-label": props.t("customFieldValue"), onChange: function (event) { setValue(entry[0], event.target.value); } }),
            React.createElement(IconButton, { icon: "trash", danger: true, label: props.t("delete"), onClick: function () { remove(entry[0]); } })
          );
        })) : null,
        React.createElement(AddButton, { onClick: addField }, props.t("addCustomField"))
      );
    }

    function ProjectTab(props) {
      var p = props.project;
      var set = props.set;
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-section-title" }, props.t("projectTitle")),
        React.createElement("div", { className: "dshwnw-section-hint" }, props.t("projectHint")),
        React.createElement(FieldGroup, { title: props.t("groupBasics") },
          React.createElement("div", { className: "dshwnw-grid" },
            React.createElement(InputField, { label: props.t("bookTitle"), value: p.title, onChange: function (v) { set("title", v); } }),
            React.createElement(InputField, { label: props.t("genre"), value: p.genre, onChange: function (v) { set("genre", v); } }),
            React.createElement(InputField, { label: props.t("tone"), value: p.tone, onChange: function (v) { set("tone", v); } }),
            React.createElement(InputField, { label: props.t("pov"), value: p.pov, onChange: function (v) { set("pov", v); } }),
            React.createElement(InputField, { label: props.t("targetWords"), value: p.targetWords, onChange: function (v) { set("targetWords", v); } }),
            React.createElement(InputField, { label: props.t("audience"), value: p.audience, onChange: function (v) { set("audience", v); } }),
            React.createElement(InputField, { label: props.t("contentRating"), value: p.contentRating, onChange: function (v) { set("contentRating", v); } })
          ),
          React.createElement(TextField, { label: props.t("premise"), value: p.premise, onChange: function (v) { set("premise", v); } })
        ),
        React.createElement(FieldGroup, { title: props.t("groupWritingContract") },
          React.createElement(TextField, { label: props.t("styleGuide"), value: p.styleGuide, rows: 6, onChange: function (v) { set("styleGuide", v); } }),
          React.createElement(TextField, { label: props.t("constraints"), value: p.constraints, rows: 5, onChange: function (v) { set("constraints", v); } }),
          React.createElement(TextField, { label: props.t("notes"), value: p.notes, onChange: function (v) { set("notes", v); } })
        ),
        React.createElement(FieldGroup, { title: props.t("genreProfileTitle") },
          React.createElement(InputField, { label: props.t("genreProfileType"), value: p.genreProfile.type, placeholder: props.t("genreProfilePlaceholder"), onChange: function (v) { props.setGenre("type", v); } })
        ),
        React.createElement(CustomFieldsEditor, { t: props.t, value: p.genreProfile.customFields, onChange: props.setGenreFields })
      );
    }

    function CharacterTab(props) {
      var characters = props.project.characters;
      var selected = characters.find(function (item) { return item.id === props.selectedId; }) || characters[0] || null;
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-card-head" },
          React.createElement("div", { className: "dshwnw-section-title" }, props.t("charactersTitle")),
          characters.length > 0 ? React.createElement("span", { className: "dshwnw-pill" }, characters.length) : null
        ),
        characters.length === 0
          ? React.createElement("div", { className: "dshwnw-empty" }, props.t("charactersEmpty"),
            React.createElement("button", { type: "button", className: "dshwnw-primary", onClick: props.onAdd }, React.createElement(NwIcon, { name: "plus", size: 14 }), props.t("addCharacter")))
          : React.createElement(React.Fragment, null,
            React.createElement("div", { className: "dshwnw-list" }, characters.map(function (character) {
              return React.createElement("button", {
                key: character.id, type: "button", className: "dshwnw-list-row",
                "data-active": selected && selected.id === character.id ? "true" : undefined,
                onClick: function () { props.onSelect(character.id); },
              },
                React.createElement(Avatar, { seed: character.id, name: character.name }),
                React.createElement("span", { className: "dshwnw-list-copy" },
                  React.createElement("span", { className: "dshwnw-list-name" }, character.name || props.t("unnamedCharacter")),
                  React.createElement("span", { className: "dshwnw-list-meta" }, character.role || props.t("rolePlaceholder"))
                )
              );
            })),
            React.createElement(AddButton, { onClick: props.onAdd }, props.t("addCharacter")),
            selected ? React.createElement("div", { className: "dshwnw-card", key: selected.id },
              React.createElement("div", { className: "dshwnw-hero" },
                React.createElement(Avatar, { seed: selected.id, name: selected.name, size: "lg" }),
                React.createElement("span", { className: "dshwnw-list-copy" },
                  React.createElement("span", { className: "dshwnw-list-name" }, selected.name || props.t("unnamedCharacter")),
                  React.createElement("span", { className: "dshwnw-list-meta" }, [selected.role, selected.identity].filter(Boolean).join(" · ") || props.t("rolePlaceholder"))
                ),
                React.createElement(IconButton, { icon: "trash", danger: true, label: props.t("delete"), onClick: function () { props.onDelete(selected.id); } })
              ),
              React.createElement(FieldGroup, { title: props.t("groupIdentity") },
                React.createElement("div", { className: "dshwnw-grid" },
                  React.createElement(InputField, { label: props.t("name"), value: selected.name, onChange: function (v) { props.onPatch(selected.id, "name", v); } }),
                  React.createElement(InputField, { label: props.t("aliases"), value: selected.aliases, onChange: function (v) { props.onPatch(selected.id, "aliases", v); } }),
                  React.createElement(InputField, { label: props.t("age"), value: selected.age, onChange: function (v) { props.onPatch(selected.id, "age", v); } }),
                  React.createElement(InputField, { label: props.t("identity"), value: selected.identity, onChange: function (v) { props.onPatch(selected.id, "identity", v); } }),
                  React.createElement(InputField, { label: props.t("role"), value: selected.role, onChange: function (v) { props.onPatch(selected.id, "role", v); } }),
                  React.createElement(InputField, { label: props.t("characterStatus"), value: selected.status, onChange: function (v) { props.onPatch(selected.id, "status", v); } })
                )
              ),
              React.createElement(FieldGroup, { title: props.t("groupPortrait"), collapsed: true },
                React.createElement(TextField, { label: props.t("appearance"), value: selected.appearance, onChange: function (v) { props.onPatch(selected.id, "appearance", v); } }),
                React.createElement(TextField, { label: props.t("traits"), value: selected.traits, onChange: function (v) { props.onPatch(selected.id, "traits", v); } }),
                React.createElement(TextField, { label: props.t("background"), value: selected.background, onChange: function (v) { props.onPatch(selected.id, "background", v); } })
              ),
              React.createElement(FieldGroup, { title: props.t("groupDrive") },
                React.createElement(TextField, { label: props.t("goal"), value: selected.goal, onChange: function (v) { props.onPatch(selected.id, "goal", v); } }),
                React.createElement(TextField, { label: props.t("motivation"), value: selected.motivation, onChange: function (v) { props.onPatch(selected.id, "motivation", v); } }),
                React.createElement(TextField, { label: props.t("stakes"), value: selected.stakes, onChange: function (v) { props.onPatch(selected.id, "stakes", v); } }),
                React.createElement(TextField, { label: props.t("conflict"), value: selected.conflict, onChange: function (v) { props.onPatch(selected.id, "conflict", v); } })
              ),
              React.createElement(FieldGroup, { title: props.t("groupResources"), collapsed: true },
                React.createElement(TextField, { label: props.t("abilities"), value: selected.abilities, onChange: function (v) { props.onPatch(selected.id, "abilities", v); } }),
                React.createElement(TextField, { label: props.t("weaknesses"), value: selected.weaknesses, onChange: function (v) { props.onPatch(selected.id, "weaknesses", v); } }),
                React.createElement(TextField, { label: props.t("knowledge"), value: selected.knowledge, onChange: function (v) { props.onPatch(selected.id, "knowledge", v); } }),
                React.createElement(TextField, { label: props.t("possessions"), value: selected.possessions, onChange: function (v) { props.onPatch(selected.id, "possessions", v); } })
              ),
              React.createElement(FieldGroup, { title: props.t("groupPerformance"), collapsed: true },
                React.createElement(TextField, { label: props.t("secret"), value: selected.secret, onChange: function (v) { props.onPatch(selected.id, "secret", v); } }),
                React.createElement(TextField, { label: props.t("voice"), value: selected.voice, onChange: function (v) { props.onPatch(selected.id, "voice", v); } }),
                React.createElement(TextField, { label: props.t("habits"), value: selected.habits, onChange: function (v) { props.onPatch(selected.id, "habits", v); } }),
                React.createElement(TextField, { label: props.t("arc"), value: selected.arc, onChange: function (v) { props.onPatch(selected.id, "arc", v); } })
              ),
              React.createElement(CustomFieldsEditor, { t: props.t, value: selected.customFields, onChange: function (value) { props.onPatch(selected.id, "customFields", value); } })
            ) : null
          )
      );
    }

    function RelationshipsTab(props) {
      var characters = props.project.characters;
      var options = characters.map(function (item) { return { value: item.id, label: item.name || props.t("unnamedCharacter") }; });
      var relationships = props.project.relationships;
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-card-head" },
          React.createElement("div", { className: "dshwnw-section-title" }, props.t("relationshipsTitle")),
          relationships.length > 0 ? React.createElement("span", { className: "dshwnw-pill" }, relationships.length) : null
        ),
        characters.length < 2
          ? React.createElement("div", { className: "dshwnw-empty" }, props.t("relationshipsNeedCharacters"))
          : relationships.length === 0
            ? React.createElement("div", { className: "dshwnw-empty" }, props.t("relationshipsEmpty"),
              React.createElement("button", { type: "button", className: "dshwnw-primary", onClick: props.onAdd }, React.createElement(NwIcon, { name: "plus", size: 14 }), props.t("addRelationship")))
            : relationships.map(function (relation) {
              var fromCharacter = characters.find(function (item) { return item.id === relation.fromId; });
              var toCharacter = characters.find(function (item) { return item.id === relation.toId; });
              var fromOptions = options.filter(function (option) { return option.value !== relation.toId; });
              var toOptions = options.filter(function (option) { return option.value !== relation.fromId; });
              return React.createElement("div", { className: "dshwnw-card", key: relation.id },
                React.createElement("div", { className: "dshwnw-card-head" },
                  fromCharacter && toCharacter
                    ? React.createElement("div", { className: "dshwnw-relation-title" },
                      React.createElement(Avatar, { seed: fromCharacter.id, name: fromCharacter.name }),
                      React.createElement("span", null, fromCharacter.name || props.t("unnamedCharacter")),
                      React.createElement(NwIcon, { name: "arrow", size: 14, className: "dshwnw-relation-arrow" }),
                      React.createElement(Avatar, { seed: toCharacter.id, name: toCharacter.name }),
                      React.createElement("span", null, toCharacter.name || props.t("unnamedCharacter"))
                    )
                    : React.createElement("div", { className: "dshwnw-card-title" }, props.t("relationship")),
                  relation.label ? React.createElement("span", { className: "dshwnw-pill", "data-tone": "active" }, relation.label) : null,
                  React.createElement(IconButton, { icon: "trash", danger: true, label: props.t("delete"), onClick: function () { props.onDelete(relation.id); } })
                ),
                !fromCharacter || !toCharacter || relation.fromId === relation.toId
                  ? React.createElement("div", { className: "dshwnw-warning" }, props.t("relationshipInvalid"))
                  : null,
                React.createElement(FieldGroup, { title: props.t("groupRelationIdentity") },
                  React.createElement("div", { className: "dshwnw-grid" },
                    React.createElement(SelectField, { label: props.t("from"), empty: props.t("chooseCharacter"), value: relation.fromId, options: fromOptions, onChange: function (v) { props.onPatch(relation.id, "fromId", v); } }),
                    React.createElement(SelectField, { label: props.t("to"), empty: props.t("chooseCharacter"), value: relation.toId, options: toOptions, onChange: function (v) { props.onPatch(relation.id, "toId", v); } }),
                    React.createElement(InputField, { label: props.t("relationLabel"), value: relation.label, onChange: function (v) { props.onPatch(relation.id, "label", v); } }),
                    React.createElement(InputField, { label: props.t("relationStatus"), value: relation.status, onChange: function (v) { props.onPatch(relation.id, "status", v); } })
                  )
                ),
                React.createElement(FieldGroup, { title: props.t("groupRelationHistory"), collapsed: true },
                  React.createElement(TextField, { label: props.t("relationHistory"), value: relation.history, onChange: function (v) { props.onPatch(relation.id, "history", v); } }),
                  React.createElement(TextField, { label: props.t("dynamic"), value: relation.dynamic, onChange: function (v) { props.onPatch(relation.id, "dynamic", v); } }),
                  React.createElement(TextField, { label: props.t("powerBalance"), value: relation.powerBalance, onChange: function (v) { props.onPatch(relation.id, "powerBalance", v); } })
                ),
                React.createElement(FieldGroup, { title: props.t("groupRelationLayers"), collapsed: true },
                  React.createElement(TextField, { label: props.t("publicFace"), value: relation.publicFace, onChange: function (v) { props.onPatch(relation.id, "publicFace", v); } }),
                  React.createElement(TextField, { label: props.t("privateTruth"), value: relation.privateTruth, onChange: function (v) { props.onPatch(relation.id, "privateTruth", v); } }),
                  React.createElement(TextField, { label: props.t("sharedSecret"), value: relation.sharedSecret, onChange: function (v) { props.onPatch(relation.id, "sharedSecret", v); } })
                ),
                React.createElement(FieldGroup, { title: props.t("groupRelationArc"), collapsed: true },
                  React.createElement(TextField, { label: props.t("tension"), value: relation.tension, onChange: function (v) { props.onPatch(relation.id, "tension", v); } }),
                  React.createElement(TextField, { label: props.t("turningPoints"), value: relation.turningPoints, onChange: function (v) { props.onPatch(relation.id, "turningPoints", v); } }),
                  React.createElement(TextField, { label: props.t("futureDirection"), value: relation.futureDirection, onChange: function (v) { props.onPatch(relation.id, "futureDirection", v); } })
                ),
                React.createElement(CustomFieldsEditor, { t: props.t, value: relation.customFields, onChange: function (value) { props.onPatch(relation.id, "customFields", value); } })
              );
            }).concat(React.createElement(AddButton, { key: "add", onClick: props.onAdd }, props.t("addRelationship")))
      );
    }

    function SectionFields(props) {
      var groups = props.groups || [{ title: "", fields: props.fields || [] }];
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-section-title" }, props.title),
        props.hint ? React.createElement("div", { className: "dshwnw-section-hint" }, props.hint) : null,
        groups.map(function (group, groupIndex) {
          return React.createElement(FieldGroup, { key: group.title || groupIndex, title: group.title }, group.fields.map(function (field) {
            return React.createElement(TextField, {
              key: field.key,
              label: field.label,
              value: props.value[field.key],
              rows: field.rows || 4,
              onChange: function (v) { props.onPatch(field.key, v); },
            });
          }));
        })
      );
    }

    function SceneTab(props) {
      var scene = props.project.scene;
      var options = props.project.characters.map(function (item) { return { value: item.id, label: item.name || props.t("unnamedCharacter") }; });
      var progress = (props.project.progress || []).slice(-20).reverse();
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-section-title" }, props.t("sceneTitle")),
        React.createElement("div", { className: "dshwnw-section-hint" }, props.t("sceneHint")),
        React.createElement(FieldGroup, { title: props.t("groupSceneFrame") },
          React.createElement("div", { className: "dshwnw-grid" },
            React.createElement(InputField, { label: props.t("chapter"), value: scene.chapter, onChange: function (v) { props.onPatch("chapter", v); } }),
            React.createElement(InputField, { label: props.t("sceneTime"), value: scene.time, onChange: function (v) { props.onPatch("time", v); } }),
            React.createElement(InputField, { label: props.t("location"), value: scene.location, onChange: function (v) { props.onPatch("location", v); } }),
            React.createElement(SelectField, { label: props.t("scenePov"), empty: props.t("chooseCharacter"), value: scene.povCharacterId, options: options, onChange: function (v) { props.onPatch("povCharacterId", v); } })
          ),
          React.createElement(TextField, { label: props.t("participants"), value: scene.participants, onChange: function (v) { props.onPatch("participants", v); } })
        ),
        React.createElement(FieldGroup, { title: props.t("groupSceneDramatic") },
          React.createElement(TextField, { label: props.t("sceneGoal"), value: scene.goal, onChange: function (v) { props.onPatch("goal", v); } }),
          React.createElement(TextField, { label: props.t("sceneConflict"), value: scene.conflict, onChange: function (v) { props.onPatch("conflict", v); } }),
          React.createElement(TextField, { label: props.t("beats"), value: scene.beats, rows: 6, onChange: function (v) { props.onPatch("beats", v); } }),
          React.createElement(TextField, { label: props.t("emotionalTurn"), value: scene.emotionalTurn, onChange: function (v) { props.onPatch("emotionalTurn", v); } }),
          React.createElement(TextField, { label: props.t("sceneOutcome"), value: scene.outcome, onChange: function (v) { props.onPatch("outcome", v); } }),
          React.createElement(TextField, { label: props.t("nextHook"), value: scene.nextHook, onChange: function (v) { props.onPatch("nextHook", v); } })
        ),
        React.createElement(FieldGroup, { title: props.t("groupSceneContinuity"), collapsed: true },
          React.createElement(TextField, { label: props.t("sensoryAnchor"), value: scene.sensoryAnchor, onChange: function (v) { props.onPatch("sensoryAnchor", v); } }),
          React.createElement(TextField, { label: props.t("knowledgeChanges"), value: scene.knowledgeChanges, onChange: function (v) { props.onPatch("knowledgeChanges", v); } }),
          React.createElement(TextField, { label: props.t("propChanges"), value: scene.propChanges, onChange: function (v) { props.onPatch("propChanges", v); } }),
          React.createElement(TextField, { label: props.t("continuity"), value: scene.continuity, rows: 6, onChange: function (v) { props.onPatch("continuity", v); } })
        ),
        React.createElement("div", { className: "dshwnw-divider" }, props.t("progressTitle")),
        progress.length
          ? React.createElement("div", { className: "dshwnw-progress" }, progress.map(function (item) {
              return React.createElement("div", { key: item.id, className: "dshwnw-progress-item" },
                React.createElement("div", { className: "dshwnw-progress-head" },
                  React.createElement("span", { className: "dshwnw-progress-chapter" }, item.chapter || props.t("progressEntry")),
                  React.createElement("span", null, item.at || "")
                ),
                React.createElement("div", { className: "dshwnw-progress-copy" }, item.summary),
                item.canonChanges ? React.createElement("div", { className: "dshwnw-progress-copy" }, React.createElement("b", null, props.t("canonChanges") + " "), item.canonChanges) : null,
                item.openThreads ? React.createElement("div", { className: "dshwnw-progress-copy" }, React.createElement("b", null, props.t("openThreads") + " "), item.openThreads) : null
              );
            }))
          : React.createElement("div", { className: "dshwnw-empty" }, props.t("progressEmpty"))
      );
    }

    // One foldable outline row. The fold state is owned by OutlineTab so that
    // a freshly added chapter or scene can open itself.
    function OutlineNode(props) {
      return React.createElement("details", {
        className: "dshwnw-node", open: props.open,
        onToggle: function (event) { if (event.currentTarget.open !== props.open) props.onToggle(event.currentTarget.open); },
      },
        React.createElement("summary", null,
          React.createElement(NwIcon, { name: "chevron", size: 14, className: "dshwnw-chevron" }),
          props.number ? React.createElement("span", { className: "dshwnw-node-num" }, props.number) : null,
          React.createElement("span", { className: "dshwnw-node-copy" },
            React.createElement("span", { className: "dshwnw-node-title", "data-empty": props.title ? undefined : "true" }, props.title || props.untitled),
            props.meta ? React.createElement("span", { className: "dshwnw-node-meta" }, props.meta) : null
          ),
          props.badge || null,
          React.createElement(StatusPill, { status: props.status }),
          props.actions
        ),
        props.open ? React.createElement("div", { className: "dshwnw-node-body" }, props.children) : null
      );
    }

    function OutlineSceneEditor(props) {
      var scene = props.scene;
      var options = props.characters.map(function (item) { return { value: item.id, label: item.name || props.t("unnamedCharacter") }; });
      var pov = props.characters.find(function (item) { return item.id === scene.povCharacterId; });
      var meta = [scene.location, scene.time, pov ? pov.name : ""].filter(Boolean).join(" · ");
      return React.createElement(OutlineNode, {
        open: props.open, onToggle: props.onToggle, title: scene.title, untitled: props.t("unnamedScene"), meta: meta,
        actions: React.createElement(IconButton, { icon: "trash", danger: true, label: props.t("delete"), onClick: props.onDelete }),
      },
        React.createElement("div", { className: "dshwnw-grid" },
          React.createElement(InputField, { label: props.t("sceneName"), value: scene.title, onChange: function (v) { props.onPatch("title", v); } }),
          React.createElement(InputField, { label: props.t("location"), value: scene.location, onChange: function (v) { props.onPatch("location", v); } }),
          React.createElement(InputField, { label: props.t("sceneTime"), value: scene.time, onChange: function (v) { props.onPatch("time", v); } }),
          React.createElement(SelectField, { label: props.t("scenePov"), empty: props.t("chooseCharacter"), value: scene.povCharacterId, options: options, onChange: function (v) { props.onPatch("povCharacterId", v); } })
        ),
        React.createElement(TextField, { label: props.t("participants"), value: scene.participants, rows: 2, onChange: function (v) { props.onPatch("participants", v); } }),
        React.createElement(TextField, { label: props.t("sceneGoal"), value: scene.goal, rows: 2, onChange: function (v) { props.onPatch("goal", v); } }),
        React.createElement(TextField, { label: props.t("sceneConflict"), value: scene.conflict, rows: 3, onChange: function (v) { props.onPatch("conflict", v); } }),
        React.createElement(TextField, { label: props.t("beats"), value: scene.beats, rows: 5, onChange: function (v) { props.onPatch("beats", v); } }),
        React.createElement(TextField, { label: props.t("sceneOutcome"), value: scene.outcome, rows: 3, onChange: function (v) { props.onPatch("outcome", v); } }),
        React.createElement(TextField, { label: props.t("nextHook"), value: scene.nextHook, rows: 2, onChange: function (v) { props.onPatch("nextHook", v); } }),
        React.createElement(CustomFieldsEditor, { t: props.t, value: scene.customFields, onChange: function (value) { props.onPatch("customFields", value); } })
      );
    }

    // ── manuscripts linked to outline chapters
    var CJK_DIGITS = "零一二三四五六七八九";

    function chineseNumeral(n) {
      if (n <= 0 || n >= 1000) return "";
      var hundreds = Math.floor(n / 100);
      var tens = Math.floor((n % 100) / 10);
      var ones = n % 10;
      var text = "";
      if (hundreds) text += CJK_DIGITS[hundreds] + "百";
      if (tens) text += (tens === 1 && !hundreds ? "" : CJK_DIGITS[tens]) + "十";
      else if (hundreds && ones) text += "零";
      if (ones) text += CJK_DIGITS[ones];
      return text;
    }

    // "30 万" → 300000, "4000" → 4000, "3k" / "3千" → 3000, "1.5w" → 15000; ranges take the upper bound.
    function parseWordTarget(value) {
      var best = 0;
      String(value || "").replace(/,/g, "").replace(/(\d+(?:\.\d+)?)\s*(万|w|千|k)?/gi, function (_, number, unit) {
        var scale = !unit ? 1 : /万|w/i.test(unit) ? 10000 : 1000;
        best = Math.max(best, Math.round(parseFloat(number) * scale));
        return _;
      });
      return best;
    }

    function formatWords(n, t) {
      if (!(n >= 0)) return "—";
      if (t("numberStyle") === "cjk" && n >= 10000) return (n / 10000).toFixed(n >= 1000000 ? 0 : 1).replace(/\.0$/, "") + t("tenThousand");
      if (t("numberStyle") !== "cjk" && n >= 10000) return (n / 1000).toFixed(n >= 1000000 ? 0 : 1).replace(/\.0$/, "") + "k";
      return t("numberStyle") === "cjk" ? String(n) : n.toLocaleString("en-US");
    }

    function shortTime(iso) {
      if (typeof iso !== "string" || iso.length < 16) return "";
      var date = new Date(iso);
      if (isNaN(date.getTime())) return "";
      function pad(value) { return String(value).padStart(2, "0"); }
      return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
    }

    function manuscriptMatches(filename, chapter) {
      var stem = filename.replace(/\.(md|txt)$/i, "").replace(/\s+/g, "");
      var n = /^\d+$/.test(String(chapter.number || "").trim()) ? parseInt(chapter.number, 10) : 0;
      if (n > 0) {
        if (new RegExp("第0*" + n + "[章回节]").test(stem)) return true;
        var numeral = chineseNumeral(n);
        if (numeral && new RegExp("第" + numeral + "[章回节]").test(stem)) return true;
        if (new RegExp("^(?:ch|chapter|c)[_.\\-]?0*" + n + "(?!\\d)", "i").test(stem)) return true;
        if (new RegExp("^0*" + n + "(?!\\d)[_.\\-、 ]").test(filename)) return true;
      }
      var title = String(chapter.title || "").replace(/\s+/g, "");
      return title.length >= 2 && stem.indexOf(title) !== -1;
    }

    // Pair unlinked chapters with unlinked files; only unambiguous matches on both sides count.
    function autoMatchManuscripts(project, files) {
      var outline = [];
      (project.volumes || []).forEach(function (volume) { (volume.chapters || []).forEach(function (chapter) { outline.push({ volumeId: volume.id, chapter: chapter }); }); });
      var linked = new Set(outline.map(function (entry) { return entry.chapter.manuscriptFile; }).filter(Boolean));
      var free = files.filter(function (file) { return !linked.has(file.filename); });
      var candidates = outline.filter(function (entry) { return !entry.chapter.manuscriptFile; }).map(function (entry) {
        return { entry: entry, files: free.filter(function (file) { return manuscriptMatches(file.filename, entry.chapter); }) };
      });
      var claims = {};
      candidates.forEach(function (candidate) { candidate.files.forEach(function (file) { claims[file.filename] = (claims[file.filename] || 0) + 1; }); });
      return candidates
        .filter(function (candidate) { return candidate.files.length === 1 && claims[candidate.files[0].filename] === 1; })
        .map(function (candidate) { return { volumeId: candidate.entry.volumeId, chapterId: candidate.entry.chapter.id, filename: candidate.files[0].filename }; });
    }

    function ProgressBar(props) {
      var ratio = props.total > 0 ? Math.max(0, Math.min(1, props.value / props.total)) : 0;
      return React.createElement("span", { className: "dshwnw-progressbar", "data-over": props.total > 0 && props.value > props.total ? "true" : undefined },
        React.createElement("i", { style: { width: Math.round(ratio * 100) + "%" } }));
    }

    function BookProgress(props) {
      var t = props.t;
      var project = props.project;
      var files = props.files;
      var byName = props.byName;
      var chapters = [];
      (project.volumes || []).forEach(function (volume) { (volume.chapters || []).forEach(function (chapter) { chapters.push(chapter); }); });
      var linked = chapters.filter(function (chapter) { return chapter.manuscriptFile; });
      var present = linked.filter(function (chapter) { return byName[chapter.manuscriptFile]; });
      var missing = files.status === "ready" ? linked.length - present.length : 0;
      var written = present.filter(function (chapter) { return byName[chapter.manuscriptFile].words > 0; }).length;
      var words = present.reduce(function (sum, chapter) { return sum + Math.max(0, byName[chapter.manuscriptFile].words); }, 0);
      var chapterTargets = chapters.reduce(function (sum, chapter) { return sum + parseWordTarget(chapter.targetWords); }, 0);
      var target = parseWordTarget(project.targetWords) || chapterTargets;
      var linkedNames = new Set(linked.map(function (chapter) { return chapter.manuscriptFile; }));
      var orphan = (files.list || []).filter(function (file) { return !linkedNames.has(file.filename); }).length;
      var suggestions = files.status === "ready" ? autoMatchManuscripts(project, files.list) : [];
      return React.createElement("div", { className: "dshwnw-book-card" },
        React.createElement("div", { className: "dshwnw-card-head" },
          React.createElement("span", { className: "dshwnw-subtitle" }, t("bookProgress")),
          React.createElement("span", { className: "dshwnw-group-count", style: { marginLeft: "auto" } }, files.status === "loading" ? t("scanning") : files.status === "error" ? t("scanFailed") : ""),
          React.createElement(IconButton, { icon: "refresh", label: t("rescanManuscripts"), disabled: files.status === "loading", onClick: props.onRefresh })
        ),
        React.createElement("div", { className: "dshwnw-book-figures" },
          React.createElement("b", null, formatWords(words, t)),
          React.createElement("span", null, target > 0 ? " / " + formatWords(target, t) + " " + t("wordsUnit") : " " + t("wordsUnit"))
        ),
        React.createElement(ProgressBar, { value: words, total: target }),
        React.createElement("div", { className: "dshwnw-book-meta" },
          React.createElement("span", null, t("chaptersWritten").replace("{n}", written).replace("{total}", chapters.length)),
          missing > 0 ? React.createElement("span", { className: "dshwnw-text-danger" }, t("filesMissing").replace("{n}", missing)) : null,
          orphan > 0 ? React.createElement("span", null, t("filesUnlinked").replace("{n}", orphan)) : null
        ),
        files.status === "error" ? React.createElement("div", { className: "dshwnw-warning" }, t("scanFailed") + ": " + files.error) : null,
        suggestions.length > 0
          ? React.createElement("button", { type: "button", className: "dshwnw-button", onClick: function () { props.onLink(suggestions); } },
            React.createElement(NwIcon, { name: "link", size: 14 }), t("autoLink").replace("{n}", suggestions.length))
          : null
      );
    }

    function ManuscriptSection(props) {
      var t = props.t;
      var chapter = props.chapter;
      var file = chapter.manuscriptFile ? props.byName[chapter.manuscriptFile] : null;
      var ready = props.files.status === "ready";
      var target = parseWordTarget(chapter.targetWords);
      var owners = props.owners;
      var preview = props.preview;
      var options = (props.files.list || []).map(function (entry) {
        var owner = owners[entry.filename];
        var suffix = owner && owner !== chapter.id ? " · " + t("linkedElsewhere") : "";
        return React.createElement("option", { key: entry.filename, value: entry.filename }, entry.filename + " · " + formatWords(entry.words, t) + " " + t("wordsUnit") + suffix);
      });
      if (chapter.manuscriptFile && !file) options.unshift(React.createElement("option", { key: "missing", value: chapter.manuscriptFile }, chapter.manuscriptFile + (ready ? " · " + t("fileMissingShort") : "")));
      return React.createElement("div", { className: "dshwnw-manuscript" },
        React.createElement("label", { className: "dshwnw-field" },
          React.createElement("span", { className: "dshwnw-label" }, t("manuscriptFile")),
          React.createElement("select", {
            className: "dshwnw-select", value: chapter.manuscriptFile || "",
            onChange: function (event) { props.onLink(event.target.value); },
          }, React.createElement("option", { value: "" }, t("manuscriptNone")), options)
        ),
        file
          ? React.createElement(React.Fragment, null,
            React.createElement("div", { className: "dshwnw-manuscript-stats" },
              React.createElement("b", null, formatWords(file.words, t)),
              target > 0 ? " / " + formatWords(target, t) + " " + t("wordsUnit") : " " + t("wordsUnit"),
              file.updatedAt ? React.createElement("span", null, t("updatedAt") + " " + shortTime(file.updatedAt)) : null
            ),
            target > 0 ? React.createElement(ProgressBar, { value: file.words, total: target }) : null,
            React.createElement("div", { className: "dshwnw-actions" },
              React.createElement("button", { type: "button", className: "dshwnw-button", onClick: props.onTogglePreview },
                preview && preview.open ? t("hidePreview") : t("showPreview"))
            ),
            preview && preview.open
              ? React.createElement("div", { className: "dshwnw-preview", "aria-busy": preview.status === "loading" ? "true" : undefined },
                preview.status === "loading" ? t("loadingPreview")
                  : preview.status === "error" ? preview.error
                  : preview.data && preview.data.exists
                    ? preview.data.excerpt + (preview.data.truncated ? "\n\n" + t("previewTruncated").replace("{n}", formatWords(preview.data.characters, t)) : "")
                    : t("fileMissingShort"))
              : null
          )
          : chapter.manuscriptFile && ready
            ? React.createElement("div", { className: "dshwnw-warning" }, t("fileMissing").replace("{file}", chapter.manuscriptFile))
            : !chapter.manuscriptFile
              ? React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, ready && props.files.list.length === 0 ? t("noManuscriptFiles") : t("manuscriptHint"))
              : null
      );
    }

    function OutlineTab(props) {
      var volumes = props.project.volumes || [];
      var openSlot = React.useState({});
      var openIds = openSlot[0];
      var setOpenIds = openSlot[1];
      function isOpen(id, fallback) { return Object.hasOwn(openIds, id) ? openIds[id] : fallback; }
      function setOpen(id, value) {
        setOpenIds(function (current) { var next = Object.assign({}, current); next[id] = value; return next; });
      }
      var t = props.t;
      var filesSlot = React.useState({ status: "idle", list: [], error: "" });
      var files = filesSlot[0];
      var setFiles = filesSlot[1];
      var previewSlot = React.useState({});
      var previews = previewSlot[0];
      var setPreviews = previewSlot[1];
      var canScan = Boolean(props.writer && typeof props.writer.listManuscripts === "function" && props.workspaceId);
      var scanRef = React.useRef(0);
      function scan() {
        if (!canScan) return;
        var request = ++scanRef.current;
        setFiles(function (current) { return { status: "loading", list: current.list, error: "" }; });
        props.writer.listManuscripts(props.workspaceId).then(function (value) {
          if (request === scanRef.current) setFiles({ status: "ready", list: (value && value.files) || [], error: "" });
        }).catch(function (error) {
          if (request === scanRef.current) setFiles(function (current) { return { status: "error", list: current.list, error: failureText(error) }; });
        });
      }
      React.useEffect(function () { scan(); setPreviews({}); }, [props.workspaceId]);
      var byName = {};
      files.list.forEach(function (file) { byName[file.filename] = file; });
      var owners = {};
      volumes.forEach(function (volume) { volume.chapters.forEach(function (chapter) { if (chapter.manuscriptFile) owners[chapter.manuscriptFile] = chapter.id; }); });
      function togglePreview(filename) {
        var current = previews[filename];
        if (current && current.open) { setPreviews(function (all) { var next = Object.assign({}, all); next[filename] = Object.assign({}, current, { open: false }); return next; }); return; }
        setPreviews(function (all) { var next = Object.assign({}, all); next[filename] = { open: true, status: "loading" }; return next; });
        props.writer.readManuscript(props.workspaceId, filename).then(function (data) {
          setPreviews(function (all) { var next = Object.assign({}, all); next[filename] = { open: true, status: "ready", data: data }; return next; });
        }).catch(function (error) {
          setPreviews(function (all) { var next = Object.assign({}, all); next[filename] = { open: true, status: "error", error: failureText(error) }; return next; });
        });
      }
      function chapterMeta(chapter) {
        var target = parseWordTarget(chapter.targetWords);
        var file = chapter.manuscriptFile ? byName[chapter.manuscriptFile] : null;
        var words = file ? formatWords(file.words, t) + (target ? "/" + formatWords(target, t) : "") + " " + t("wordsUnit")
          : chapter.manuscriptFile && files.status === "ready" ? t("fileMissingShort")
          : target ? formatWords(target, t) + " " + t("wordsUnit") : "";
        return [words, chapter.scenes.length ? chapter.scenes.length + " " + t("scenesUnit") : "", chapter.summary].filter(Boolean).join(" · ");
      }
      function chapterBadge(chapter) {
        if (!chapter.manuscriptFile) return null;
        var missing = files.status === "ready" && !byName[chapter.manuscriptFile];
        return React.createElement("span", { className: "dshwnw-file-badge", "data-missing": missing ? "true" : undefined, title: chapter.manuscriptFile },
          React.createElement(NwIcon, { name: "file", size: 13 }));
      }
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-section-title" }, props.t("outlineTitle")),
        React.createElement("div", { className: "dshwnw-section-hint" }, props.t("outlineHint")),
        volumes.some(function (volume) { return volume.chapters.length > 0; })
          ? React.createElement(BookProgress, { project: props.project, files: files, byName: byName, t: t, onRefresh: scan, onLink: props.onLinkManuscripts })
          : null,
        volumes.length === 0
          ? React.createElement("div", { className: "dshwnw-empty" }, props.t("outlineEmpty"),
            React.createElement("button", { type: "button", className: "dshwnw-primary", onClick: props.onAddVolume }, React.createElement(NwIcon, { name: "plus", size: 14 }), props.t("addVolume")))
          : null,
        volumes.map(function (volume, volumeIndex) {
          var sceneTotal = volume.chapters.reduce(function (sum, chapter) { return sum + chapter.scenes.length; }, 0);
          var volumeWords = volume.chapters.reduce(function (sum, chapter) { var file = chapter.manuscriptFile && byName[chapter.manuscriptFile]; return sum + (file ? Math.max(0, file.words) : 0); }, 0);
          var volumeWritten = volume.chapters.filter(function (chapter) { var file = chapter.manuscriptFile && byName[chapter.manuscriptFile]; return file && file.words > 0; }).length;
          return React.createElement("div", { className: "dshwnw-card dshwnw-outline-card", key: volume.id },
            React.createElement("div", { className: "dshwnw-card-head" },
              React.createElement("span", { className: "dshwnw-node-num" }, volumeIndex + 1),
              React.createElement("div", { className: "dshwnw-card-title" }, volume.title || props.t("unnamedVolume")),
              React.createElement(StatusPill, { status: volume.status }),
              React.createElement(IconButton, { icon: "trash", danger: true, label: props.t("delete"), onClick: function () { props.onDeleteVolume(volume.id); } })
            ),
            React.createElement("div", { className: "dshwnw-card-subtitle", style: { marginTop: -6 } },
              t("volumeStats").replace("{chapters}", volume.chapters.length).replace("{written}", volumeWritten).replace("{words}", formatWords(volumeWords, t)).replace("{scenes}", sceneTotal)),
            React.createElement(FieldGroup, { title: props.t("volumeSettings"), collapsed: Boolean(volume.title) },
              React.createElement("div", { className: "dshwnw-grid" },
                React.createElement(InputField, { label: props.t("volumeTitle"), value: volume.title, onChange: function (v) { props.onPatchVolume(volume.id, "title", v); } }),
                React.createElement(InputField, { label: props.t("outlineStatus"), value: volume.status, onChange: function (v) { props.onPatchVolume(volume.id, "status", v); } })
              ),
              React.createElement(TextField, { label: props.t("volumeSummary"), value: volume.summary, onChange: function (v) { props.onPatchVolume(volume.id, "summary", v); } }),
              React.createElement(CustomFieldsEditor, { t: props.t, value: volume.customFields, onChange: function (value) { props.onPatchVolume(volume.id, "customFields", value); } })
            ),
            React.createElement("div", { className: "dshwnw-outline-list" },
              volume.chapters.map(function (chapter, chapterIndex) {
                var meta = chapterMeta(chapter);
                return React.createElement(OutlineNode, {
                  key: chapter.id, open: isOpen(chapter.id, false), onToggle: function (value) { setOpen(chapter.id, value); },
                  number: chapter.number, title: chapter.title, untitled: props.t("unnamedChapter"), meta: meta, status: chapter.status, badge: chapterBadge(chapter),
                  actions: [
                    React.createElement(IconButton, { key: "up", icon: "up", label: props.t("moveUp"), disabled: chapterIndex === 0, onClick: function () { props.onMoveChapter(volume.id, chapter.id, -1); } }),
                    React.createElement(IconButton, { key: "down", icon: "down", label: props.t("moveDown"), disabled: chapterIndex === volume.chapters.length - 1, onClick: function () { props.onMoveChapter(volume.id, chapter.id, 1); } }),
                    React.createElement(IconButton, { key: "delete", icon: "trash", danger: true, label: props.t("delete"), onClick: function () { props.onDeleteChapter(volume.id, chapter.id); } }),
                  ],
                },
                  React.createElement(ManuscriptSection, {
                    chapter: chapter, files: files, byName: byName, owners: owners, t: t,
                    preview: chapter.manuscriptFile ? previews[chapter.manuscriptFile] : null,
                    onTogglePreview: function () { togglePreview(chapter.manuscriptFile); },
                    onLink: function (filename) { props.onLinkManuscripts([{ volumeId: volume.id, chapterId: chapter.id, filename: filename }]); },
                  }),
                  React.createElement("div", { className: "dshwnw-chapter-meta" },
                    React.createElement(InputField, { label: props.t("chapterNumber"), value: chapter.number, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "number", v); } }),
                    React.createElement(InputField, { label: props.t("chapterTitle"), value: chapter.title, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "title", v); } }),
                    React.createElement(InputField, { label: props.t("chapterWords"), value: chapter.targetWords, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "targetWords", v); } })
                  ),
                  React.createElement("div", { className: "dshwnw-grid" },
                    React.createElement(InputField, { label: props.t("outlineStatus"), value: chapter.status, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "status", v); } }),
                    React.createElement(InputField, { label: props.t("chapterLocations"), value: chapter.locations, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "locations", v); } })
                  ),
                  React.createElement(TextField, { label: props.t("chapterSummary"), value: chapter.summary, rows: 4, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "summary", v); } }),
                  // Keep blank lines while typing (the host drops them on save);
                  // filtering here would swallow every Enter at the end of a line.
                  React.createElement(TextField, { label: props.t("chapterEvents"), value: (chapter.events || []).join("\n"), rows: 5, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "events", v.split(/\r?\n/)); } }),
                  React.createElement(TextField, { label: props.t("dialogueNotes"), value: chapter.dialogueNotes, rows: 3, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "dialogueNotes", v); } }),
                  React.createElement(TextField, { label: props.t("endingHook"), value: chapter.endingHook, rows: 2, onChange: function (v) { props.onPatchChapter(volume.id, chapter.id, "endingHook", v); } }),
                  React.createElement(CustomFieldsEditor, { t: props.t, value: chapter.customFields, onChange: function (value) { props.onPatchChapter(volume.id, chapter.id, "customFields", value); } }),
                  React.createElement("div", { className: "dshwnw-divider" }, props.t("chapterScenes") + " · " + chapter.scenes.length),
                  chapter.scenes.length > 0
                    ? React.createElement("div", { className: "dshwnw-outline-list" }, chapter.scenes.map(function (scene) {
                      return React.createElement(OutlineSceneEditor, {
                        key: scene.id, scene: scene, characters: props.project.characters, t: props.t,
                        open: isOpen(scene.id, false), onToggle: function (value) { setOpen(scene.id, value); },
                        onPatch: function (key, value) { props.onPatchScene(volume.id, chapter.id, scene.id, key, value); },
                        onDelete: function () { props.onDeleteScene(volume.id, chapter.id, scene.id); },
                      });
                    }))
                    : null,
                  React.createElement(AddButton, { onClick: function () { var id = props.onAddScene(volume.id, chapter.id); if (id) setOpen(id, true); } }, props.t("addScene"))
                );
              })
            ),
            React.createElement(AddButton, { onClick: function () { var id = props.onAddChapter(volume.id); if (id) setOpen(id, true); } }, props.t("addChapter"))
          );
        }),
        volumes.length > 0 ? React.createElement(AddButton, { onClick: props.onAddVolume }, props.t("addVolume")) : null
      );
    }

    // ── thread ledger: mirrors analyzeThreads() in noval-write-core.js so the
    // panel can judge the unsaved draft live.
    var UNSTARTED_CHAPTER_STATUS = /^(|planned|plan|todo|outline|计划|计划中|待写|未写|未开始|大纲)$/iu;
    var THREAD_DUE_SOON_CHAPTERS = 3;
    var THREAD_STALE_CHAPTERS = 10;
    var THREAD_STATE_ORDER = ["overdue", "due", "soon", "unplanned", "open", "resolved", "dropped"];
    var THREAD_IMPORTANCE_ORDER = { core: 0, major: 1, minor: 2 };
    var THREAD_KINDS = ["foreshadowing", "mystery", "promise", "chekhov", "subplot", "other"];
    var THREAD_IMPORTANCE = ["core", "major", "minor"];
    var THREAD_STATUSES = ["open", "partial", "resolved", "dropped"];

    function chapterSequenceOf(project) {
      var chapters = [];
      (project.volumes || []).forEach(function (volume) {
        (volume.chapters || []).forEach(function (chapter) {
          chapters.push({ id: chapter.id, index: chapters.length, volumeId: volume.id, volumeTitle: volume.title, number: chapter.number, title: chapter.title, status: chapter.status });
        });
      });
      return chapters;
    }

    function chapterShort(chapter) {
      if (!chapter) return "";
      return chapter.number ? "#" + chapter.number : (chapter.title || chapter.id);
    }

    function chapterLong(chapter) {
      if (!chapter) return "";
      return [chapter.number ? "#" + chapter.number : "", chapter.title || (chapter.number ? "" : chapter.id)].filter(Boolean).join(" ");
    }

    function analyzeThreads(project) {
      var chapters = chapterSequenceOf(project);
      var position = new Map(chapters.map(function (chapter) { return [chapter.id, chapter.index]; }));
      var current = -1;
      chapters.forEach(function (chapter, index) { if (!UNSTARTED_CHAPTER_STATUS.test(String(chapter.status || "").trim())) current = index; });
      function at(chapterId) { return chapterId && position.has(chapterId) ? position.get(chapterId) : -1; }
      var counts = { total: 0, active: 0, overdue: 0, due: 0, soon: 0, unplanned: 0, open: 0, stale: 0, partial: 0, resolved: 0, dropped: 0 };
      var byId = {};
      (project.threads || []).forEach(function (thread) {
        var plantedIndex = at(thread.plantedChapterId);
        var payoffIndex = at(thread.plannedPayoffChapterId);
        var resolvedIndex = at(thread.resolvedChapterId);
        var beatIndexes = (thread.beats || []).map(function (beat) { return at(beat.chapterId); }).filter(function (index) { return index >= 0; });
        var touches = [plantedIndex].concat(beatIndexes).filter(function (index) { return index >= 0 && (current < 0 || index <= current); });
        var lastTouchIndex = touches.length > 0 ? Math.max.apply(null, touches) : -1;
        var active = thread.status === "open" || thread.status === "partial";
        var state;
        if (!active) state = thread.status === "dropped" ? "dropped" : "resolved";
        else if (payoffIndex < 0) state = "unplanned";
        else if (current < 0) state = "open";
        else if (payoffIndex < current) state = "overdue";
        else if (payoffIndex === current) state = "due";
        else if (payoffIndex - current <= THREAD_DUE_SOON_CHAPTERS) state = "soon";
        else state = "open";
        var idleChapters = active && current >= 0 && lastTouchIndex >= 0 ? current - lastTouchIndex : -1;
        var stale = idleChapters >= THREAD_STALE_CHAPTERS;
        var referenced = [thread.plantedChapterId, thread.plannedPayoffChapterId, thread.resolvedChapterId].concat((thread.beats || []).map(function (beat) { return beat.chapterId; }));
        var warnings = [];
        if (referenced.some(function (chapterId) { return chapterId && !position.has(chapterId); })) warnings.push("missing-chapter");
        if (plantedIndex >= 0 && payoffIndex >= 0 && payoffIndex < plantedIndex) warnings.push("payoff-before-plant");
        if (thread.status === "resolved" && !thread.resolvedChapterId) warnings.push("resolved-without-chapter");
        counts.total += 1;
        if (active) counts.active += 1;
        if (thread.status === "partial") counts.partial += 1;
        counts[state] += 1;
        if (stale) counts.stale += 1;
        byId[thread.id] = { id: thread.id, state: state, active: active, plantedIndex: plantedIndex, payoffIndex: payoffIndex, resolvedIndex: resolvedIndex, beatIndexes: beatIndexes, lastTouchIndex: lastTouchIndex, idleChapters: idleChapters, stale: stale, warnings: warnings };
      });
      return { chapters: chapters, currentIndex: current, currentChapter: current >= 0 ? chapters[current] : null, counts: counts, byId: byId };
    }

    function compareThreads(left, right, insight, sort) {
      var a = insight.byId[left.id];
      var b = insight.byId[right.id];
      if (sort === "planted") {
        var planted = (a.plantedIndex < 0 ? Infinity : a.plantedIndex) - (b.plantedIndex < 0 ? Infinity : b.plantedIndex);
        if (planted !== 0 && !isNaN(planted)) return planted;
      }
      var state = THREAD_STATE_ORDER.indexOf(a.state) - THREAD_STATE_ORDER.indexOf(b.state);
      if (state !== 0) return state;
      var importance = (THREAD_IMPORTANCE_ORDER[left.importance] || 1) - (THREAD_IMPORTANCE_ORDER[right.importance] || 1);
      if (importance !== 0) return importance;
      var payoff = (a.payoffIndex < 0 ? Infinity : a.payoffIndex) - (b.payoffIndex < 0 ? Infinity : b.payoffIndex);
      if (payoff !== 0 && !isNaN(payoff)) return payoff;
      return a.plantedIndex - b.plantedIndex;
    }

    var STATE_TONE = { overdue: "danger", due: "active", soon: "hold", unplanned: "plain", open: "plain", resolved: "done", dropped: "plain" };

    function ChapterSelect(props) {
      var chapters = props.chapters;
      var known = !props.value || chapters.some(function (chapter) { return chapter.id === props.value; });
      var groups = [];
      chapters.forEach(function (chapter) {
        var group = groups.length > 0 && groups[groups.length - 1].volumeId === chapter.volumeId ? groups[groups.length - 1] : null;
        if (!group) { group = { volumeId: chapter.volumeId, label: chapter.volumeTitle || props.t("unnamedVolume"), items: [] }; groups.push(group); }
        group.items.push(chapter);
      });
      return React.createElement("label", { className: "dshwnw-field" },
        React.createElement("span", { className: "dshwnw-label" }, props.label),
        React.createElement("select", {
          className: "dshwnw-select", value: props.value || "", disabled: chapters.length === 0 && !props.value,
          onChange: function (event) { props.onChange(event.target.value); },
        },
          React.createElement("option", { value: "" }, chapters.length === 0 ? props.t("noOutlineChapters") : props.t("noChapter")),
          known ? null : React.createElement("option", { value: props.value }, props.t("missingChapter")),
          groups.map(function (group) {
            return React.createElement("optgroup", { key: group.volumeId, label: group.label }, group.items.map(function (chapter) {
              return React.createElement("option", { key: chapter.id, value: chapter.id }, chapterLong(chapter) + (chapter.index === props.currentIndex ? " · " + props.t("currentMarker") : ""));
            }));
          })
        )
      );
    }

    function PeoplePicker(props) {
      var selected = props.value || [];
      return React.createElement("div", { className: "dshwnw-field" },
        React.createElement("span", { className: "dshwnw-label" }, props.label),
        props.characters.length === 0
          ? React.createElement("span", { className: "dshwnw-card-subtitle" }, props.t("noCharactersYet"))
          : React.createElement("div", { className: "dshwnw-people" }, props.characters.map(function (character) {
            var on = selected.indexOf(character.id) !== -1;
            return React.createElement("button", {
              key: character.id, type: "button", className: "dshwnw-person", "aria-pressed": on,
              onClick: function () { props.onChange(on ? selected.filter(function (item) { return item !== character.id; }) : selected.concat([character.id])); },
            }, React.createElement(Avatar, { seed: character.id, name: character.name }), character.name || props.t("unnamedCharacter"));
          }))
      );
    }

    function ThreadTrack(props) {
      var info = props.info;
      var chapters = props.chapters;
      var fill = 0;
      if (info.state === "resolved" || info.state === "overdue") fill = 1;
      else if (info.plantedIndex >= 0 && info.payoffIndex > info.plantedIndex && props.currentIndex >= 0) {
        fill = Math.max(0, Math.min(1, (props.currentIndex - info.plantedIndex) / (info.payoffIndex - info.plantedIndex)));
      }
      var resolvedLabel = info.resolvedIndex >= 0 ? chapterShort(chapters[info.resolvedIndex]) : "";
      var endLabel = info.state === "resolved" && resolvedLabel ? resolvedLabel : info.payoffIndex >= 0 ? chapterShort(chapters[info.payoffIndex]) : props.t("noChapterShort");
      return React.createElement("span", { className: "dshwnw-track", "data-state": info.state },
        React.createElement("span", null, props.t("trackPlanted") + " " + (info.plantedIndex >= 0 ? chapterShort(chapters[info.plantedIndex]) : "?")),
        React.createElement("span", { className: "dshwnw-track-bar" }, React.createElement("i", { style: { width: Math.round(fill * 100) + "%" } })),
        React.createElement("span", null, props.t(info.state === "resolved" ? "trackResolved" : "trackPayoff") + " " + endLabel),
        info.stale ? React.createElement("span", { className: "dshwnw-flag", title: props.t("idleFor").replace("{n}", info.idleChapters) }, props.t("idleFor").replace("{n}", info.idleChapters)) : null
      );
    }

    function ThreadCard(props) {
      var thread = props.thread;
      var info = props.info;
      var t = props.t;
      var chapters = props.insight.chapters;
      var currentChapter = props.insight.currentChapter;
      function set(key, value) { props.onUpdate(function (item) { item[key] = value; }); }
      var settled = thread.status === "resolved" || thread.status === "partial";
      var actions = [
        info.active
          ? React.createElement(IconButton, { key: "resolve", icon: "check", label: t("markResolved"), onClick: function () {
            props.onUpdate(function (item) {
              item.status = "resolved";
              if (!item.resolvedChapterId && currentChapter) item.resolvedChapterId = currentChapter.id;
            });
          } })
          : React.createElement(IconButton, { key: "reopen", icon: "undo", label: t("reopen"), onClick: function () { props.onUpdate(function (item) { item.status = "open"; }); } }),
        React.createElement(IconButton, { key: "delete", icon: "trash", danger: true, label: t("delete"), onClick: props.onDelete }),
      ];
      return React.createElement("details", {
        className: "dshwnw-node dshwnw-thread", "data-state": info.state, open: props.open,
        onToggle: function (event) { if (event.currentTarget.open !== props.open) props.onToggle(event.currentTarget.open); },
      },
        React.createElement("summary", null,
          React.createElement(NwIcon, { name: "chevron", size: 14, className: "dshwnw-chevron" }),
          React.createElement("span", { className: "dshwnw-node-copy" },
            React.createElement("span", { className: "dshwnw-thread-top" },
              React.createElement("span", { className: "dshwnw-kind" }, t("kind_" + thread.kind)),
              React.createElement("span", { className: "dshwnw-node-title", "data-empty": thread.title ? undefined : "true" }, thread.title || t("unnamedThread")),
              thread.importance === "core" ? React.createElement("span", { className: "dshwnw-core" }, t("importance_core")) : null
            ),
            React.createElement(ThreadTrack, { info: info, chapters: chapters, currentIndex: props.insight.currentIndex, t: t })
          ),
          React.createElement("span", { className: "dshwnw-pill", "data-tone": STATE_TONE[info.state] }, thread.status === "partial" && info.state === "open" ? t("status_partial") : t("state_" + info.state)),
          actions
        ),
        props.open ? React.createElement("div", { className: "dshwnw-node-body" },
          info.warnings.length > 0 ? React.createElement("div", { className: "dshwnw-warning" }, info.warnings.map(function (code) { return t("warn_" + code); }).join(" ")) : null,
          React.createElement(InputField, { label: t("threadTitle"), value: thread.title, onChange: function (v) { set("title", v); } }),
          React.createElement("div", { className: "dshwnw-grid dshwnw-grid-3" },
            React.createElement(SelectField, { label: t("threadKind"), value: thread.kind, empty: null, options: THREAD_KINDS.map(function (key) { return { value: key, label: t("kind_" + key) }; }), onChange: function (v) { set("kind", v); } }),
            React.createElement(SelectField, { label: t("threadImportance"), value: thread.importance, empty: null, options: THREAD_IMPORTANCE.map(function (key) { return { value: key, label: t("importance_" + key) }; }), onChange: function (v) { set("importance", v); } }),
            React.createElement(SelectField, { label: t("threadStatus"), value: thread.status, empty: null, options: THREAD_STATUSES.map(function (key) { return { value: key, label: t("status_" + key) }; }), onChange: function (v) { set("status", v); } })
          ),
          React.createElement("div", { className: "dshwnw-grid" },
            React.createElement(ChapterSelect, { label: t("plantedChapter"), value: thread.plantedChapterId, chapters: chapters, currentIndex: props.insight.currentIndex, t: t, onChange: function (v) { set("plantedChapterId", v); } }),
            React.createElement(ChapterSelect, { label: t("payoffChapter"), value: thread.plannedPayoffChapterId, chapters: chapters, currentIndex: props.insight.currentIndex, t: t, onChange: function (v) { set("plannedPayoffChapterId", v); } }),
            settled ? React.createElement(ChapterSelect, { label: t("resolvedChapter"), value: thread.resolvedChapterId, chapters: chapters, currentIndex: props.insight.currentIndex, t: t, onChange: function (v) { set("resolvedChapterId", v); } }) : null
          ),
          React.createElement(TextField, { label: t("threadSetup"), value: thread.setup, rows: 3, onChange: function (v) { set("setup", v); } }),
          React.createElement("div", { className: "dshwnw-secret" }, React.createElement(TextField, { label: t("threadTruth"), value: thread.truth, rows: 3, onChange: function (v) { set("truth", v); } })),
          React.createElement(TextField, { label: t("threadPayoffPlan"), value: thread.payoffPlan, rows: 3, onChange: function (v) { set("payoffPlan", v); } }),
          settled ? React.createElement(TextField, { label: t("threadResolution"), value: thread.resolution, rows: 3, onChange: function (v) { set("resolution", v); } }) : null,
          React.createElement(PeoplePicker, { label: t("threadCharacters"), value: thread.characterIds, characters: props.characters, t: t, onChange: function (v) { set("characterIds", v); } }),
          React.createElement(PeoplePicker, { label: t("threadKnownBy"), value: thread.knownByIds, characters: props.characters, t: t, onChange: function (v) { set("knownByIds", v); } }),
          React.createElement("div", { className: "dshwnw-divider" }, t("threadBeats") + " · " + thread.beats.length),
          React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: -4 } }, t("threadBeatsHint")),
          thread.beats.length > 0 ? React.createElement("div", { className: "dshwnw-custom-list" }, thread.beats.map(function (beat, beatIndex) {
            function patchBeat(key, value) { props.onUpdate(function (item) { item.beats[beatIndex][key] = value; }); }
            return React.createElement("div", { className: "dshwnw-beat", key: beat.id },
              React.createElement("select", { className: "dshwnw-select", value: beat.chapterId || "", "aria-label": t("beatChapter"), onChange: function (event) { patchBeat("chapterId", event.target.value); } },
                React.createElement("option", { value: "" }, t("noChapter")),
                beat.chapterId && !chapters.some(function (chapter) { return chapter.id === beat.chapterId; }) ? React.createElement("option", { value: beat.chapterId }, t("missingChapter")) : null,
                chapters.map(function (chapter) { return React.createElement("option", { key: chapter.id, value: chapter.id }, chapterLong(chapter)); })
              ),
              React.createElement("textarea", { className: "dshwnw-textarea", rows: 1, value: beat.note, placeholder: t("beatNote"), "aria-label": t("beatNote"), onChange: function (event) { patchBeat("note", event.target.value); } }),
              React.createElement(IconButton, { icon: "trash", danger: true, label: t("delete"), onClick: function () { props.onUpdate(function (item) { item.beats.splice(beatIndex, 1); }); } })
            );
          })) : null,
          React.createElement(AddButton, { onClick: function () {
            props.onUpdate(function (item) { item.beats.push({ id: makeId("beat"), chapterId: currentChapter ? currentChapter.id : "", note: "" }); });
          } }, t("addBeat")),
          React.createElement(TextField, { label: t("threadNotes"), value: thread.notes, rows: 2, onChange: function (v) { set("notes", v); } }),
          React.createElement(CustomFieldsEditor, { t: t, value: thread.customFields, onChange: function (value) { set("customFields", value); } })
        ) : null
      );
    }

    var TIMELINE_ROW = 30;
    var TIMELINE_HEAD = 24;

    function ThreadTimeline(props) {
      var insight = props.insight;
      var chapters = insight.chapters;
      var t = props.t;
      var col = chapters.length > 60 ? 12 : chapters.length > 30 ? 16 : 24;
      var scrollRef = React.useRef(null);
      // Keep the chapter being written in view; late books are wider than the sidebar.
      React.useEffect(function () {
        var element = scrollRef.current;
        if (!element || insight.currentIndex < 0) return;
        element.scrollLeft = Math.max(0, 6 + insight.currentIndex * col - element.clientWidth * 0.65);
      }, [insight.currentIndex, col]);
      if (chapters.length === 0) return React.createElement("div", { className: "dshwnw-empty" }, t("timelineEmpty"));
      var width = chapters.length * col + 12;
      var height = TIMELINE_HEAD + props.threads.length * TIMELINE_ROW + 6;
      var labelEvery = col >= 24 ? 1 : col >= 16 ? 2 : 5;
      function x(index) { return 6 + index * col + col / 2; }
      var head = chapters.map(function (chapter) {
        return chapter.index % labelEvery === 0 || chapter.index === insight.currentIndex
          ? React.createElement("text", { key: "h" + chapter.id, x: x(chapter.index), y: 15, textAnchor: "middle", className: chapter.index === insight.currentIndex ? "tl-head-current" : undefined }, chapter.number || chapter.index + 1)
          : null;
      });
      var volumeBreaks = chapters.filter(function (chapter, index) { return index > 0 && chapters[index - 1].volumeId !== chapter.volumeId; }).map(function (chapter) {
        return React.createElement("line", { key: "v" + chapter.id, className: "tl-volume", x1: 6 + chapter.index * col, x2: 6 + chapter.index * col, y1: 0, y2: height });
      });
      var rows = props.threads.map(function (thread, rowIndex) {
        var info = insight.byId[thread.id];
        var y = TIMELINE_HEAD + rowIndex * TIMELINE_ROW + TIMELINE_ROW / 2;
        var end = info.state === "resolved" && info.resolvedIndex >= 0 ? info.resolvedIndex
          : info.state === "overdue" ? insight.currentIndex
          : info.payoffIndex >= 0 ? info.payoffIndex
          : insight.currentIndex >= 0 ? insight.currentIndex : info.plantedIndex;
        var start = info.plantedIndex;
        var marks = [];
        if (start >= 0 && end >= 0 && end !== start) marks.push(React.createElement("line", { key: "span", className: "tl-span", x1: x(Math.min(start, end)), x2: x(Math.max(start, end)), y1: y, y2: y }));
        if (info.state === "overdue" && info.payoffIndex >= 0) marks.push(React.createElement("line", { key: "late", className: "tl-late", x1: x(info.payoffIndex), x2: x(insight.currentIndex), y1: y, y2: y }));
        info.beatIndexes.forEach(function (index, beatIndex) { marks.push(React.createElement("circle", { key: "b" + beatIndex, className: "tl-beat", cx: x(index), cy: y, r: 3 })); });
        if (info.payoffIndex >= 0 && info.state !== "resolved") marks.push(React.createElement("circle", { key: "payoff", className: "tl-payoff", cx: x(info.payoffIndex), cy: y, r: 5.5 }));
        if (start >= 0) marks.push(React.createElement("circle", { key: "plant", className: "tl-plant", cx: x(start), cy: y, r: 4.5 }));
        if (info.state === "resolved" && info.resolvedIndex >= 0) marks.push(React.createElement("circle", { key: "done", className: "tl-resolved", cx: x(info.resolvedIndex), cy: y, r: 5.5 }));
        return React.createElement("g", { key: thread.id, className: "tl-row", "data-state": info.state, onClick: function () { props.onOpen(thread.id); } },
          React.createElement("title", null, (thread.title || t("unnamedThread")) + " · " + t("state_" + info.state)),
          React.createElement("rect", { className: "tl-hit", x: 0, y: y - TIMELINE_ROW / 2, width: width, height: TIMELINE_ROW }),
          marks
        );
      });
      return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "dshwnw-timeline" },
          React.createElement("div", { className: "dshwnw-timeline-labels" },
            React.createElement("div", { className: "dshwnw-timeline-corner" }, t("chapterAxis")),
            props.threads.map(function (thread) {
              var info = insight.byId[thread.id];
              return React.createElement("button", { key: thread.id, type: "button", className: "dshwnw-timeline-label", "data-state": info.state, title: thread.title, onClick: function () { props.onOpen(thread.id); } },
                React.createElement("i", { "aria-hidden": true }), thread.title || t("unnamedThread"));
            })
          ),
          React.createElement("div", { className: "dshwnw-timeline-scroll", ref: scrollRef },
            React.createElement("svg", { width: width, height: height, role: "img", "aria-label": t("viewTimeline") },
              insight.currentIndex >= 0 ? React.createElement("rect", { className: "tl-current", x: 6 + insight.currentIndex * col, y: 0, width: col, height: height }) : null,
              volumeBreaks,
              head,
              rows
            )
          )
        ),
        React.createElement("div", { className: "dshwnw-legend" }, t("timelineLegend"))
      );
    }

    function ThreadsTab(props) {
      var t = props.t;
      var project = props.project;
      var threads = project.threads || [];
      var insight = analyzeThreads(project);
      var filterSlot = React.useState("active");
      var filter = filterSlot[0];
      var setFilter = filterSlot[1];
      var viewSlot = React.useState("list");
      var view = viewSlot[0];
      var setView = viewSlot[1];
      var sortSlot = React.useState("urgency");
      var sort = sortSlot[0];
      var setSort = sortSlot[1];
      var querySlot = React.useState("");
      var query = querySlot[0];
      var setQuery = querySlot[1];
      var openSlot = React.useState({});
      var openIds = openSlot[0];
      var setOpenIds = openSlot[1];
      function setOpen(id, value) { setOpenIds(function (current) { var next = Object.assign({}, current); next[id] = value; return next; }); }
      var counts = insight.counts;
      var needle = query.trim().toLowerCase();
      var visible = threads.filter(function (thread) {
        var info = insight.byId[thread.id];
        var pass = filter === "all" ? true
          : filter === "active" ? info.active
          : filter === "stale" ? info.stale
          : filter === "resolved" || filter === "dropped" ? thread.status === filter
          : info.state === filter;
        if (!pass) return false;
        if (!needle) return true;
        return [thread.title, thread.setup, thread.truth, thread.payoffPlan, thread.notes].some(function (value) { return String(value || "").toLowerCase().indexOf(needle) !== -1; });
      }).sort(function (a, b) { return compareThreads(a, b, insight, sort); });
      var current = insight.currentChapter;
      var cursor = insight.chapters.length === 0
        ? React.createElement("div", { className: "dshwnw-cursor", "data-kind": "warn" }, t("noOutlineForThreads"))
        : current
          ? React.createElement("div", { className: "dshwnw-cursor" }, t("currentChapterLabel") + " ", React.createElement("b", null, chapterLong(current)), current.volumeTitle ? " · " + current.volumeTitle : "", " · " + t("currentChapterInferred"))
          : React.createElement("div", { className: "dshwnw-cursor", "data-kind": "warn" }, t("noCurrentChapter"));
      function stat(key, tone) {
        return React.createElement("button", {
          type: "button", className: "dshwnw-stat", "data-tone": tone, "data-active": filter === key ? "true" : undefined, "data-zero": counts[key] === 0 ? "true" : undefined,
          onClick: function () { setFilter(filter === key ? "active" : key); },
        }, React.createElement("b", null, counts[key]), t("stat_" + key));
      }
      function chip(key, count) {
        return React.createElement("button", { type: "button", className: "dshwnw-chip", "data-active": filter === key ? "true" : undefined, onClick: function () { setFilter(key); } },
          t("filter_" + key), React.createElement("span", { className: "dshwnw-chip-count" }, count));
      }
      function add() {
        var id = props.onAdd({ plantedChapterId: current ? current.id : "" });
        if (id) { setOpen(id, true); setView("list"); if (filter !== "active" && filter !== "all") setFilter("active"); }
      }
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-card-head" },
          React.createElement("div", { className: "dshwnw-section-title" }, t("threadsTitle")),
          React.createElement("div", { className: "dshwnw-segment", role: "radiogroup", "aria-label": t("threadsView") },
            ["list", "timeline"].map(function (key) {
              return React.createElement("button", { key: key, type: "button", role: "radio", "aria-checked": view === key, "data-active": view === key ? "true" : undefined, onClick: function () { setView(key); } }, t(key === "list" ? "viewList" : "viewTimeline"));
            })
          )
        ),
        React.createElement("div", { className: "dshwnw-section-hint" }, t("threadsHint")),
        cursor,
        threads.length === 0
          ? React.createElement("div", { className: "dshwnw-empty" }, t("threadsEmpty"),
            React.createElement("button", { type: "button", className: "dshwnw-primary", onClick: add }, React.createElement(NwIcon, { name: "plus", size: 14 }), t("addThread")))
          : React.createElement(React.Fragment, null,
            React.createElement("div", { className: "dshwnw-stats" }, stat("overdue", "overdue"), stat("due", "due"), stat("soon", "soon"), stat("stale", "stale")),
            React.createElement("div", { className: "dshwnw-filters" },
              chip("active", counts.active), chip("unplanned", counts.unplanned), chip("resolved", counts.resolved), chip("dropped", counts.dropped), chip("all", counts.total)
            ),
            React.createElement("div", { className: "dshwnw-toolrow" },
              React.createElement("input", { className: "dshwnw-input", type: "search", value: query, placeholder: t("searchThreads"), "aria-label": t("searchThreads"), onChange: function (event) { setQuery(event.target.value); } }),
              React.createElement("select", { className: "dshwnw-select", value: sort, "aria-label": t("sortLabel"), onChange: function (event) { setSort(event.target.value); } },
                React.createElement("option", { value: "urgency" }, t("sortUrgency")),
                React.createElement("option", { value: "planted" }, t("sortPlanted"))
              )
            ),
            visible.length === 0
              ? React.createElement("div", { className: "dshwnw-empty" }, t("threadsFilteredEmpty"))
              : view === "timeline"
                ? React.createElement(ThreadTimeline, { insight: insight, threads: visible, t: t, onOpen: function (id) { setOpen(id, true); setView("list"); } })
                : React.createElement("div", { className: "dshwnw-outline-list" }, visible.map(function (thread) {
                  return React.createElement(ThreadCard, {
                    key: thread.id, thread: thread, info: insight.byId[thread.id], insight: insight, characters: project.characters, t: t,
                    open: Boolean(openIds[thread.id]), onToggle: function (value) { setOpen(thread.id, value); },
                    onUpdate: function (mutate) { props.onUpdate(thread.id, mutate); },
                    onDelete: function () { props.onDelete(thread.id); },
                  });
                })),
            React.createElement(AddButton, { onClick: add }, t("addThread"))
          )
      );
    }

    function SettingIcon(props) {
      var content = props.kind === "export"
        ? [
            React.createElement("path", { key: "tray", d: "M4 13.5v1.2A1.3 1.3 0 0 0 5.3 16h9.4a1.3 1.3 0 0 0 1.3-1.3v-1.2" }),
            React.createElement("path", { key: "arrow", d: "M10 3v9m0 0 3-3m-3 3-3-3" }),
          ]
        : props.kind === "import"
          ? [
              React.createElement("path", { key: "tray", d: "M4 13.5v1.2A1.3 1.3 0 0 0 5.3 16h9.4a1.3 1.3 0 0 0 1.3-1.3v-1.2" }),
              React.createElement("path", { key: "arrow", d: "M10 12V3m0 0 3 3m-3-3L7 6" }),
            ]
          : [
              React.createElement("path", { key: "lid", d: "M4 6h12M8 3.5h4M6 6l.7 10h6.6L14 6" }),
              React.createElement("path", { key: "lines", d: "M8.2 9v4m3.6-4v4" }),
            ];
      return React.createElement("svg", { viewBox: "0 0 20 20", "aria-hidden": true }, content);
    }

    function SettingsTab(props) {
      var armedSlot = React.useState(false);
      var armed = armedSlot[0];
      var setArmed = armedSlot[1];
      var fileRef = React.useRef(null);
      React.useEffect(function () { setArmed(false); }, [props.workspaceId]);
      var locked = props.busy || props.dirty;
      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-section-title" }, props.t("settingsTitle")),
        React.createElement("div", { className: "dshwnw-section-hint" }, props.t("settingsHint")),
        props.dirty ? React.createElement("div", { className: "dshwnw-warning" }, props.t("settingsDirty")) : null,
        React.createElement("div", { className: "dshwnw-settings" },
          React.createElement("div", { className: "dshwnw-setting-card" },
            React.createElement("div", { className: "dshwnw-setting-icon", "aria-hidden": true }, React.createElement(SettingIcon, { kind: "export" })),
            React.createElement("div", { className: "dshwnw-setting-main" },
              React.createElement("div", { className: "dshwnw-setting-title" }, props.t("exportTitle")),
              React.createElement("div", { className: "dshwnw-setting-copy" }, props.t("exportHint")),
              React.createElement("div", { className: "dshwnw-setting-actions" },
                React.createElement("button", { type: "button", className: "dshwnw-button", disabled: locked, onClick: props.onExport }, props.busy ? props.t("working") : props.t("exportAction"))
              )
            )
          ),
          React.createElement("div", { className: "dshwnw-setting-card" },
            React.createElement("div", { className: "dshwnw-setting-icon", "aria-hidden": true }, React.createElement(SettingIcon, { kind: "import" })),
            React.createElement("div", { className: "dshwnw-setting-main" },
              React.createElement("div", { className: "dshwnw-setting-title" }, props.t("importTitle")),
              React.createElement("div", { className: "dshwnw-setting-copy" }, props.t("importHint")),
              React.createElement("input", {
                ref: fileRef, type: "file", className: "dshwnw-file-input", accept: ".json,application/json",
                onChange: function (event) {
                  var file = event.target.files && event.target.files[0];
                  event.target.value = "";
                  if (file) props.onImport(file);
                },
              }),
              React.createElement("div", { className: "dshwnw-setting-actions" },
                React.createElement("button", { type: "button", className: "dshwnw-button", disabled: locked, onClick: function () { if (fileRef.current) fileRef.current.click(); } }, props.busy ? props.t("working") : props.t("importAction"))
              )
            )
          ),
          React.createElement("div", { className: "dshwnw-setting-card", "data-danger": "true" },
            React.createElement("div", { className: "dshwnw-setting-icon", "aria-hidden": true }, React.createElement(SettingIcon, { kind: "clear" })),
            React.createElement("div", { className: "dshwnw-setting-main" },
              React.createElement("div", { className: "dshwnw-setting-title" }, props.t("clearTitle")),
              React.createElement("div", { className: "dshwnw-setting-copy" }, props.t("clearHint")),
              armed
                ? React.createElement("div", { className: "dshwnw-confirm" },
                    React.createElement("span", null, props.t("clearConfirm")),
                    React.createElement("div", { className: "dshwnw-setting-actions" },
                      React.createElement("button", { type: "button", className: "dshwnw-button", disabled: props.busy, onClick: function () { setArmed(false); } }, props.t("cancel")),
                      React.createElement("button", { type: "button", className: "dshwnw-danger", disabled: props.busy, onClick: function () { setArmed(false); props.onClear(); } }, props.t("clearConfirmAction"))
                    )
                  )
                : React.createElement("div", { className: "dshwnw-setting-actions" },
                    React.createElement("button", { type: "button", className: "dshwnw-danger", disabled: locked, onClick: function () { setArmed(true); } }, props.t("clearAction"))
                  )
            )
          )
        )
      );
    }

    function filledCount(record) {
      return Object.keys(record || {}).filter(function (key) { return String(record[key] || "").trim() !== ""; }).length;
    }

    // One-line summary under each launcher tile.
    function sectionMeta(name, project, insight, t) {
      function fill(template, values) {
        return Object.keys(values).reduce(function (text, key) { return text.split("{" + key + "}").join(String(values[key])); }, template);
      }
      if (name === "project") return project.title ? project.genre || t("metaProjectSet") : t("metaProjectEmpty");
      if (name === "characters") return fill(t("metaCharacters"), { n: project.characters.length });
      if (name === "relationships") return fill(t("metaRelationships"), { n: project.relationships.length });
      if (name === "world") return fill(t("metaFilled"), { n: filledCount(project.world), total: Object.keys(project.world || {}).length });
      if (name === "plot") return fill(t("metaFilled"), { n: filledCount(project.plot), total: Object.keys(project.plot || {}).length });
      if (name === "outline") return fill(t("metaOutline"), { v: (project.volumes || []).length, c: insight.chapters.length });
      if (name === "scene") return project.scene && project.scene.chapter ? project.scene.chapter : t("metaSceneEmpty");
      if (name === "threads") return insight.counts.total === 0 ? t("metaThreadsEmpty") : fill(t("metaThreads"), { n: insight.counts.active });
      return t("metaSettings");
    }

    // The section switcher: one button that unfolds a 3×3 grid of every page.
    function SectionNav(props) {
      var t = props.t;
      var openSlot = React.useState(false);
      var open = openSlot[0];
      var setOpen = openSlot[1];
      var gridRef = React.useRef(null);
      var triggerRef = React.useRef(null);
      var insight = analyzeThreads(props.project);
      var alerts = insight.counts.overdue + insight.counts.due;

      React.useEffect(function () {
        if (!open || !gridRef.current) return;
        var active = gridRef.current.querySelector("[data-active=true]") || gridRef.current.querySelector("button");
        if (active) active.focus({ preventScroll: true });
      }, [open]);

      function close(refocus) {
        setOpen(false);
        if (refocus && triggerRef.current) triggerRef.current.focus();
      }
      function choose(name) {
        props.onSelect(name);
        close(true);
      }
      function onKeyDown(event) {
        var buttons = Array.prototype.slice.call(gridRef.current ? gridRef.current.querySelectorAll("button") : []);
        var index = buttons.indexOf(document.activeElement);
        var step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 }[event.key];
        if (event.key === "Escape") { event.preventDefault(); close(true); }
        else if (event.key === "Tab") close(false);
        else if (step && index >= 0) {
          event.preventDefault();
          buttons[(index + step + buttons.length) % buttons.length].focus();
        }
      }

      return React.createElement(React.Fragment, null,
        React.createElement("button", {
          ref: triggerRef, type: "button", className: "dshwnw-nav-trigger", "aria-haspopup": "menu", "aria-expanded": open,
          title: t("navLabel"), onClick: function () { setOpen(!open); },
        },
          React.createElement("span", { className: "dshwnw-nav-dot" }, React.createElement(NwIcon, { name: "section_" + props.tab, size: 13 })),
          t("tab_" + props.tab),
          alerts > 0 && !open ? React.createElement("span", { className: "dshwnw-nav-alert", title: t("navAlert").replace("{n}", alerts) }) : null,
          React.createElement(NwIcon, { name: "chevron", size: 13, className: "dshwnw-chevron" })
        ),
        open ? React.createElement("div", { className: "dshwnw-nav-scrim", onClick: function () { close(false); } }) : null,
        open ? React.createElement("div", { ref: gridRef, className: "dshwnw-nav-grid", role: "menu", "aria-label": t("navLabel"), onKeyDown: onKeyDown },
          props.tabs.map(function (name, index) {
            var badge = name === "threads" && alerts > 0 ? alerts : 0;
            return React.createElement("button", {
              key: name, type: "button", role: "menuitem", className: "dshwnw-nav-tile",
              "data-active": props.tab === name ? "true" : undefined, style: { animationDelay: index * 18 + "ms" },
              onClick: function () { choose(name); },
            },
              React.createElement(NwIcon, { name: "section_" + name, size: 20 }),
              React.createElement("span", { className: "dshwnw-nav-tile-label" }, t("tab_" + name)),
              React.createElement("span", { className: "dshwnw-nav-tile-meta" }, sectionMeta(name, props.project, insight, t)),
              badge ? React.createElement("span", { className: "dshwnw-nav-badge", title: t("navAlert").replace("{n}", badge) }, badge) : null
            );
          })
        ) : null
      );
    }

    function NovelWriterPanel(props) {
      var t = typeof props.t === "function" ? props.t : function (key) { return key; };
      var writer = props.writer;
      var useSessions = typeof props.useSessions === "function" ? props.useSessions : function (selector) { return selector({ current: null }); };
      var useWorkspaces = typeof props.useWorkspaces === "function" ? props.useWorkspaces : function (selector) { return selector({ items: [], recentWorkspaceId: null }); };
      var sessionId = useSessions(function (value) { return value.current == null ? null : String(value.current); });
      var workspace = useWorkspaces(function (value) {
        var items = Array.isArray(value.items) ? value.items : [];
        var current = sessionId ? items.find(function (item) {
          return Array.isArray(item.sessionIds) && item.sessionIds.some(function (id) { return String(id) === sessionId; });
        }) : null;
        if (current) return current;
        return value.recentWorkspaceId == null ? null : items.find(function (item) { return String(item.workspaceId) === String(value.recentWorkspaceId); }) || null;
      });
      var workspaceId = workspace && workspace.workspaceId != null ? String(workspace.workspaceId) : null;
      var workspaceTitle = workspace ? (workspace.title || workspace.path || workspaceId) : "";
      var stateSlot = React.useState(null);
      var state = stateSlot[0];
      var setState = stateSlot[1];
      var draftSlot = React.useState(null);
      var draft = draftSlot[0];
      var setDraft = draftSlot[1];
      var tabSlot = React.useState("project");
      var tab = tabSlot[0];
      var setTab = tabSlot[1];
      var selectedSlot = React.useState("");
      var selectedId = selectedSlot[0];
      var setSelectedId = selectedSlot[1];
      var busySlot = React.useState(false);
      var busy = busySlot[0];
      var setBusy = busySlot[1];
      var dirtySlot = React.useState(false);
      var dirty = dirtySlot[0];
      var setDirty = dirtySlot[1];
      var noticeSlot = React.useState(null);
      var notice = noticeSlot[0];
      var setNotice = noticeSlot[1];
      var requestRef = React.useRef(0);
      var dirtyRef = React.useRef(false);
      var draftCacheRef = React.useRef(new Map());

      var load = React.useCallback(function (forceRemote) {
        if (forceRemote && dirtyRef.current && typeof window.confirm === "function" && !window.confirm(t("discardConfirm"))) return;
        var requestId = ++requestRef.current;
        if (!workspaceId) {
          setState(null);
          setDraft(null);
          setBusy(false);
          setNotice(null);
          return;
        }
        var cached = !forceRemote ? draftCacheRef.current.get(workspaceId) : null;
        if (cached) {
          setState(cached.state);
          setDraft(clone(cached.draft));
          setDirty(true);
          dirtyRef.current = true;
          setBusy(false);
          setNotice({ kind: "ok", text: t("draftRestored") });
          return;
        }
        setNotice(null);
        setBusy(true);
        writer.getState(workspaceId).then(function (next) {
          if (requestId !== requestRef.current) return;
          setState(next);
          setDraft(clone(next.project));
          setDirty(false);
          dirtyRef.current = false;
          draftCacheRef.current.delete(workspaceId);
          setNotice(null);
        }).catch(function (error) {
          if (requestId === requestRef.current) setNotice({ kind: "error", text: t("loadFailed") + ": " + failureText(error) });
        }).finally(function () { if (requestId === requestRef.current) setBusy(false); });
      }, [writer, t, workspaceId]);

      React.useEffect(function () {
        load(false);
        return function () { requestRef.current += 1; };
      }, [load]);

      function updateProject(mutator) {
        if (!workspaceId || !state || String(state.workspace && state.workspace.id) !== workspaceId || busy) return;
        setDraft(function (current) {
          var next = clone(current);
          mutator(next);
          if (workspaceId && state) draftCacheRef.current.set(workspaceId, { state: state, draft: clone(next) });
          return next;
        });
        setDirty(true);
        dirtyRef.current = true;
        setNotice(null);
      }

      function save() {
        if (!workspaceId || !state || String(state.workspace && state.workspace.id) !== workspaceId || !draft || busy) return;
        var requestId = ++requestRef.current;
        setBusy(true);
        writer.saveProject(workspaceId, draft, state.revision).then(function (next) {
          if (requestId !== requestRef.current) return;
          setState(next);
          setDraft(clone(next.project));
          setDirty(false);
          dirtyRef.current = false;
          draftCacheRef.current.delete(workspaceId);
          setNotice({ kind: "ok", text: t("saved") });
        }).catch(function (error) {
          if (requestId === requestRef.current) setNotice({ kind: "error", text: t("saveFailed") + ": " + failureText(error) });
        }).finally(function () { if (requestId === requestRef.current) setBusy(false); });
      }

      function replaceWith(next, message) {
        setState(next);
        setDraft(clone(next.project));
        setDirty(false);
        dirtyRef.current = false;
        if (workspaceId) draftCacheRef.current.delete(workspaceId);
        setSelectedId("");
        setNotice({ kind: "ok", text: message });
      }

      function exportProject() {
        if (!workspaceId || busy || dirty) return;
        var requestId = ++requestRef.current;
        setBusy(true);
        writer.exportProject(workspaceId).then(function (documentValue) {
          if (requestId !== requestRef.current) return;
          var rawName = (documentValue.project && documentValue.project.title) || workspaceTitle || "novel-framework";
          var filename = String(rawName).replace(/[\\/:*?\"<>|\x00-\x1f]+/g, "-").replace(/^\s+|\s+$/g, "").slice(0, 80) || "novel-framework";
          var blob = new Blob([JSON.stringify(documentValue, null, 2) + "\n"], { type: "application/json;charset=utf-8" });
          var url = URL.createObjectURL(blob);
          var anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = filename + "-novel-framework.json";
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 0);
          setNotice({ kind: "ok", text: t("exported") });
        }).catch(function (error) {
          if (requestId === requestRef.current) setNotice({ kind: "error", text: t("exportFailed") + ": " + failureText(error) });
        }).finally(function () { if (requestId === requestRef.current) setBusy(false); });
      }

      function importProject(file) {
        if (!workspaceId || !state || busy || dirty || !file) return;
        if (file.size > 5 * 1024 * 1024) {
          setNotice({ kind: "error", text: t("importTooLarge") });
          return;
        }
        var requestId = ++requestRef.current;
        setBusy(true);
        file.text().then(function (source) {
          var parsed;
          try { parsed = JSON.parse(source); } catch (_) { throw new Error(t("importInvalidJson")); }
          return writer.importProject(workspaceId, parsed, state.revision);
        }).then(function (next) {
          if (requestId === requestRef.current) replaceWith(next, t("imported"));
        }).catch(function (error) {
          if (requestId === requestRef.current) setNotice({ kind: "error", text: t("importFailed") + ": " + failureText(error) });
        }).finally(function () { if (requestId === requestRef.current) setBusy(false); });
      }

      function resetProject() {
        if (!workspaceId || !state || busy || dirty) return;
        var requestId = ++requestRef.current;
        setBusy(true);
        writer.resetProject(workspaceId, state.revision).then(function (next) {
          if (requestId === requestRef.current) replaceWith(next, t("cleared"));
        }).catch(function (error) {
          if (requestId === requestRef.current) setNotice({ kind: "error", text: t("clearFailed") + ": " + failureText(error) });
        }).finally(function () { if (requestId === requestRef.current) setBusy(false); });
      }

      if (!workspaceId) {
        return React.createElement("div", { className: "dshwnw-root" },
          React.createElement("div", { className: "dshwnw-empty", style: { margin: 12 } }, t("noWorkspace"))
        );
      }

      if (!state || !draft || String(state.workspace && state.workspace.id) !== workspaceId) {
        return React.createElement("div", { className: "dshwnw-root" },
          React.createElement("div", { className: "dshwnw-empty", style: { margin: 12 } },
            notice ? notice.text : t("loading"),
            notice && notice.kind === "error" ? React.createElement("button", { type: "button", className: "dshwnw-button", onClick: function () { load(false); } }, t("retry")) : null)
        );
      }

      var tabs = ["project", "characters", "relationships", "world", "plot", "outline", "scene", "threads", "settings"];
      var content;
      if (tab === "project") {
        content = React.createElement(ProjectTab, {
          project: draft, t: t,
          set: function (key, value) { updateProject(function (next) { next[key] = value; }); },
          setGenre: function (key, value) { updateProject(function (next) { next.genreProfile[key] = value; }); },
          setGenreFields: function (value) { updateProject(function (next) { next.genreProfile.customFields = value; }); },
        });
      } else if (tab === "characters") {
        content = React.createElement(CharacterTab, {
          project: draft, t: t, selectedId: selectedId, onSelect: setSelectedId,
          onAdd: function () {
            var newId = makeId("character");
            updateProject(function (next) {
              next.characters.push({
                id: newId, name: "", aliases: "", age: "", identity: "", role: "", status: "", appearance: "", traits: "", background: "",
                goal: "", motivation: "", stakes: "", conflict: "", abilities: "", weaknesses: "", secret: "", knowledge: "",
                possessions: "", voice: "", habits: "", arc: "", customFields: {},
              });
            });
            setSelectedId(newId);
          },
          onPatch: function (id, key, value) { updateProject(function (next) { var item = next.characters.find(function (entry) { return entry.id === id; }); if (item) item[key] = value; }); },
          onDelete: function (id) { updateProject(function (next) { next.characters = next.characters.filter(function (item) { return item.id !== id; }); next.relationships = next.relationships.filter(function (item) { return item.fromId !== id && item.toId !== id; }); if (next.scene.povCharacterId === id) next.scene.povCharacterId = ""; (next.threads || []).forEach(function (thread) { thread.characterIds = thread.characterIds.filter(function (item) { return item !== id; }); thread.knownByIds = thread.knownByIds.filter(function (item) { return item !== id; }); }); next.volumes.forEach(function (volume) { volume.chapters.forEach(function (chapter) { chapter.scenes.forEach(function (scene) { if (scene.povCharacterId === id) scene.povCharacterId = ""; }); }); }); }); setSelectedId(""); },
        });
      } else if (tab === "relationships") {
        content = React.createElement(RelationshipsTab, {
          project: draft, t: t,
          onAdd: function () { updateProject(function (next) { next.relationships.push({
            id: makeId("relationship"), fromId: next.characters[0].id, toId: next.characters[1].id, label: "", status: "", history: "",
            dynamic: "", powerBalance: "", publicFace: "", privateTruth: "", sharedSecret: "", tension: "", turningPoints: "", futureDirection: "", customFields: {},
          }); }); },
          onPatch: function (id, key, value) { updateProject(function (next) { var item = next.relationships.find(function (entry) { return entry.id === id; }); if (item) item[key] = value; }); },
          onDelete: function (id) { updateProject(function (next) { next.relationships = next.relationships.filter(function (item) { return item.id !== id; }); }); },
        });
      } else if (tab === "world") {
        content = React.createElement(SectionFields, {
          title: t("worldTitle"), hint: t("worldHint"), value: draft.world,
          groups: [
            { title: t("groupWorldFrame"), fields: [
              { key: "era", label: t("era") }, { key: "chronology", label: t("chronology") },
              { key: "geography", label: t("geography") }, { key: "environment", label: t("environment") },
              { key: "locations", label: t("locations") },
            ] },
            { title: t("groupWorldSystems"), fields: [
              { key: "rules", label: t("rules") }, { key: "factions", label: t("factions") },
              { key: "politics", label: t("politics") }, { key: "society", label: t("society") },
              { key: "economy", label: t("economy") }, { key: "conflicts", label: t("worldConflicts") },
            ] },
            { title: t("groupWorldCulture"), fields: [
              { key: "culture", label: t("culture") }, { key: "beliefs", label: t("beliefs") },
              { key: "technology", label: t("technology") }, { key: "lore", label: t("lore"), rows: 6 },
            ] },
          ],
          onPatch: function (key, value) { updateProject(function (next) { next.world[key] = value; }); },
        });
      } else if (tab === "plot") {
        content = React.createElement(SectionFields, {
          title: t("plotTitle"), hint: t("plotHint"), value: draft.plot,
          groups: [
            { title: t("groupPlotCore"), fields: [
              { key: "themes", label: t("themes") }, { key: "storyQuestion", label: t("storyQuestion") },
              { key: "protagonistGoal", label: t("protagonistGoal") }, { key: "stakes", label: t("plotStakes") },
              { key: "coreConflict", label: t("coreConflict") }, { key: "antagonisticForce", label: t("antagonisticForce") },
            ] },
            { title: t("groupPlotStructure"), fields: [
              { key: "opening", label: t("opening") }, { key: "midpoint", label: t("midpoint") },
              { key: "climax", label: t("climax") }, { key: "ending", label: t("ending") },
            ] },
            { title: t("groupPlotWeaving"), fields: [
              { key: "subplots", label: t("subplots") }, { key: "foreshadowing", label: t("foreshadowing") },
              { key: "reveals", label: t("reveals") }, { key: "pacing", label: t("pacing") },
              { key: "chapterPlan", label: t("chapterPlan"), rows: 7 }, { key: "outline", label: t("outline"), rows: 8 },
            ] },
          ],
          onPatch: function (key, value) { updateProject(function (next) { next.plot[key] = value; }); },
        });
      } else if (tab === "outline") {
        content = React.createElement(OutlineTab, {
          project: draft, t: t, writer: writer, workspaceId: workspaceId,
          // Mirrors linkChapterManuscript(): one file per chapter, and an
          // unstarted chapter becomes a draft once prose is attached.
          onLinkManuscripts: function (links) {
            updateProject(function (next) {
              links.forEach(function (link) {
                next.volumes.forEach(function (volume) {
                  volume.chapters.forEach(function (chapter) {
                    var target = volume.id === link.volumeId && chapter.id === link.chapterId;
                    if (target) {
                      chapter.manuscriptFile = link.filename;
                      if (link.filename && UNSTARTED_CHAPTER_STATUS.test(String(chapter.status || "").trim())) chapter.status = t("draftedStatus");
                    } else if (link.filename && chapter.manuscriptFile === link.filename) chapter.manuscriptFile = "";
                  });
                });
              });
            });
          },
          onAddVolume: function () { updateProject(function (next) { next.volumes.push({ id: makeId("volume"), title: "", summary: "", status: "planned", chapters: [], customFields: {} }); }); },
          onPatchVolume: function (volumeId, key, value) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); if (volume) volume[key] = value; }); },
          onDeleteVolume: function (volumeId) { updateProject(function (next) { next.volumes = next.volumes.filter(function (item) { return item.id !== volumeId; }); }); },
          onAddChapter: function (volumeId) { var newId = makeId("chapter"); updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); if (volume) volume.chapters.push({ id: newId, number: String(volume.chapters.length + 1), title: "", targetWords: "", status: "planned", summary: "", locations: "", events: [], dialogueNotes: "", endingHook: "", manuscriptFile: "", scenes: [], customFields: {} }); }); return newId; },
          onPatchChapter: function (volumeId, chapterId, key, value) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); var chapter = volume && volume.chapters.find(function (item) { return item.id === chapterId; }); if (chapter) chapter[key] = value; }); },
          onDeleteChapter: function (volumeId, chapterId) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); if (volume) volume.chapters = volume.chapters.filter(function (item) { return item.id !== chapterId; }); }); },
          onMoveChapter: function (volumeId, chapterId, delta) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); if (!volume) return; var index = volume.chapters.findIndex(function (item) { return item.id === chapterId; }); var target = index + delta; if (index < 0 || target < 0 || target >= volume.chapters.length) return; var moved = volume.chapters.splice(index, 1)[0]; volume.chapters.splice(target, 0, moved); }); },
          onAddScene: function (volumeId, chapterId) { var newId = makeId("scene"); updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); var chapter = volume && volume.chapters.find(function (item) { return item.id === chapterId; }); if (chapter) chapter.scenes.push({ id: newId, title: "", time: "", location: "", povCharacterId: "", participants: "", goal: "", conflict: "", beats: "", emotionalTurn: "", sensoryAnchor: "", outcome: "", knowledgeChanges: "", propChanges: "", continuity: "", nextHook: "", customFields: {} }); }); return newId; },
          onPatchScene: function (volumeId, chapterId, sceneId, key, value) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); var chapter = volume && volume.chapters.find(function (item) { return item.id === chapterId; }); var scene = chapter && chapter.scenes.find(function (item) { return item.id === sceneId; }); if (scene) scene[key] = value; }); },
          onDeleteScene: function (volumeId, chapterId, sceneId) { updateProject(function (next) { var volume = next.volumes.find(function (item) { return item.id === volumeId; }); var chapter = volume && volume.chapters.find(function (item) { return item.id === chapterId; }); if (chapter) chapter.scenes = chapter.scenes.filter(function (item) { return item.id !== sceneId; }); }); },
        });
      } else if (tab === "threads") {
        content = React.createElement(ThreadsTab, {
          project: draft, t: t,
          onAdd: function (seed) {
            var newId = makeId("thread");
            updateProject(function (next) {
              next.threads = next.threads || [];
              next.threads.push(Object.assign({
                id: newId, title: "", kind: "foreshadowing", importance: "major", status: "open",
                plantedChapterId: "", plannedPayoffChapterId: "", resolvedChapterId: "",
                setup: "", truth: "", payoffPlan: "", resolution: "", notes: "",
                characterIds: [], knownByIds: [], beats: [], customFields: {},
              }, seed || {}));
            });
            return newId;
          },
          onUpdate: function (id, mutate) { updateProject(function (next) { var item = (next.threads || []).find(function (entry) { return entry.id === id; }); if (item) mutate(item); }); },
          onDelete: function (id) { updateProject(function (next) { next.threads = (next.threads || []).filter(function (item) { return item.id !== id; }); }); },
        });
      } else if (tab === "scene") {
        content = React.createElement(SceneTab, {
          project: draft, t: t,
          onPatch: function (key, value) { updateProject(function (next) { next.scene[key] = value; }); },
        });
      } else {
        content = React.createElement(SettingsTab, {
          workspaceId: workspaceId, t: t, busy: busy, dirty: dirty,
          onExport: exportProject, onImport: importProject, onClear: resetProject,
        });
      }

      return React.createElement("div", { className: "dshwnw-root" },
        React.createElement("div", { className: "dshwnw-toolbar" },
          React.createElement("div", { className: "dshwnw-headline" },
            React.createElement("div", { className: "dshwnw-book", "data-empty": draft.title ? undefined : "true" }, draft.title || t("untitledBook")),
            React.createElement("div", { className: "dshwnw-workspace", title: t("workspaceLabel") + " · " + workspaceTitle }, workspaceTitle)
          ),
          React.createElement(SectionNav, { t: t, tab: tab, tabs: tabs, project: draft, onSelect: setTab })
        ),
        React.createElement("div", { className: "dshwnw-body", key: tab, role: "tabpanel" }, content),
        React.createElement("div", { className: "dshwnw-footer" },
          React.createElement("span", { className: "dshwnw-notice", role: "status", "data-kind": notice ? notice.kind : undefined, "data-dirty": dirty ? "true" : undefined, title: notice ? notice.text : undefined }, React.createElement("span", { className: "dshwnw-notice-text" }, notice ? notice.text : dirty ? t("unsaved") : t("synced"))),
          React.createElement("button", { type: "button", className: "dshwnw-button", disabled: busy || !dirty, onClick: function () { load(true); } }, t("reload")),
          React.createElement("button", { type: "button", className: "dshwnw-primary", disabled: busy || !dirty, onClick: save }, busy ? t("saving") : t("save"))
        )
      );
    }

    function SidebarRail(props) {
      var t = typeof props.t === "function" ? props.t : function (key) { return key; };
      return React.createElement("button", {
        type: "button", className: "dshwnw-rail", title: t("rail"), "aria-label": t("rail"),
        "data-active": props.activeId === "noval-write" ? "true" : undefined,
        onClick: function () { props.onSelect("noval-write", t("title")); },
      }, React.createElement(IconQuill, null));
    }

    function SidebarCard(props) {
      var t = typeof props.t === "function" ? props.t : function (key) { return key; };
      return React.createElement("button", { type: "button", className: "dshwrs-tool-card", onClick: function () { props.onOpen("noval-write", t("title")); } },
        React.createElement("span", { className: "dshwrs-tool-card-icon" }, React.createElement(IconQuill, null)),
        React.createElement("span", { className: "dshwrs-tool-card-copy" },
          React.createElement("span", { className: "dshwrs-tool-card-title" }, t("title")),
          React.createElement("span", { className: "dshwrs-tool-card-description" }, t("cardDescription"))
        )
      );
    }

    function SidebarPage(props) {
      return React.createElement(NovelWriterPanel, {
        writer: props.writer,
        t: props.t,
        useSessions: props.useSessions,
        useWorkspaces: props.useWorkspaces,
      });
    }

    var NS = "dshWNovalWrite";
    var inject = ["slots", "locale", "remote", "uiConversation"];
    var zh = {
      title: "小说写作", rail: "打开小说写作工作台", cardDescription: "工作区共享的角色、世界观、情节与连续性数据",
      writeActive: "小说写作", writeEdit: "编辑", writeClear: "解除", writeSave: "保存", writeCancel: "取消", writeObjectiveAria: "小说写作任务", writeCommandInput: "写作命令输入",
      loading: "正在载入小说项目…", loadFailed: "载入失败", retry: "重试", saveFailed: "保存失败", noWorkspace: "当前没有可用工作区。请先打开或创建一个工作区。", workspaceLabel: "共享工作区",
      saved: "项目设定已保存。", saving: "保存中…", save: "保存", reload: "撤销", unsaved: "有未保存修改", synced: "已与模型上下文同步", draftRestored: "已恢复这个工作区未保存的草稿。",
      tab_project: "项目", tab_characters: "角色", tab_relationships: "关系", tab_world: "世界", tab_plot: "情节", tab_outline: "大纲", tab_scene: "场景", tab_settings: "设置",
      settingsTitle: "小说框架设置", settingsHint: "导入、导出或重置当前共享工作区的完整小说框架。操作对象不是单个对话。", settingsDirty: "请先保存或撤销当前修改，再执行导入、导出或清除。", working: "处理中…", cancel: "取消",
      exportTitle: "导出当前小说框架", exportHint: "下载一份可移植的 JSON，包含项目、角色、关系、世界观、情节、大纲、线索账本、场景和推进记录。", exportAction: "导出 JSON", exported: "小说框架已导出。", exportFailed: "导出失败",
      importTitle: "导入小说框架", importHint: "导入本插件导出的 JSON 或完整项目 JSON；通过结构校验后原子替换当前框架。", importAction: "选择 JSON 文件", imported: "小说框架已导入。", importFailed: "导入失败", importInvalidJson: "文件不是有效 JSON", importTooLarge: "导入文件超过 5 MB 限制。",
      clearTitle: "清除当前小说框架", clearHint: "恢复为空白框架。该操作会清除当前工作区共享的全部角色、关系、世界观、情节、大纲、线索、场景与推进记录。", clearAction: "清除框架", clearConfirm: "此操作不可撤销。建议先导出备份；确认后只清空当前工作区的小说框架。", clearConfirmAction: "确认清除", cleared: "当前工作区的小说框架已清空。", clearFailed: "清除失败",
      projectTitle: "项目总览", projectHint: "先定义作品契约，再让角色、世界与情节围绕它保持一致。", groupBasics: "作品定位", groupWritingContract: "写作契约", bookTitle: "书名", genre: "题材 / 类型", tone: "基调与文风", pov: "叙事视角", targetWords: "目标字数", audience: "目标读者", contentRating: "内容分级与边界", premise: "一句话梗概 / 核心命题", styleGuide: "文风指南（句式、节奏、叙述距离、禁用表达）", constraints: "创作约束（必须遵守 / 必须避免）", notes: "总备注",
      genreProfileTitle: "题材扩展配置", genreProfileType: "配置类型", genreProfilePlaceholder: "例如 romance、mystery、xianxia", customFields: "自定义字段", customFieldsHint: "自由定义本题材需要的数据；模型会按原键名读取和维护。", customFieldsEmpty: "还没有自定义字段。", customFieldDefault: "字段", customFieldName: "字段名", customFieldValue: "字段值", addCustomField: "新增自定义字段",
      charactersTitle: "角色卡", add: "新增", delete: "删除", charactersEmpty: "还没有角色。先建立主角和主要对手。", unnamedCharacter: "未命名角色", rolePlaceholder: "尚未填写角色定位",
      groupIdentity: "身份与现状", groupPortrait: "人物画像", groupDrive: "欲望与压力", groupResources: "能力、弱点与信息", groupPerformance: "表现方式与弧光", name: "姓名", aliases: "别名 / 称呼", age: "年龄 / 年龄段", identity: "身份、职业与社会位置", role: "故事功能", characterStatus: "当前状态（位置、健康、阵营）", appearance: "外貌、体态与辨识特征", traits: "性格、价值观与行为模式", background: "成长经历与关键往事", goal: "外在目标", motivation: "深层动机与缺失", stakes: "失败代价", conflict: "内外冲突", abilities: "能力、资源与优势", weaknesses: "弱点、恐惧与盲区", secret: "秘密与信息差", knowledge: "已知 / 未知 / 错误认知", possessions: "关键物品与资源", voice: "语言习惯 / 角色声音", habits: "习惯、动作与压力反应", arc: "人物弧光（起点—转折—终点）",
      relationshipsTitle: "角色关系", relationshipsNeedCharacters: "至少建立两名角色后才能添加关系。", relationshipsEmpty: "还没有关系线。", relationship: "关系线", relationshipInvalid: "关系端点无效或指向同一角色，请重新选择角色 A 与角色 B。", chooseCharacter: "请选择角色", groupRelationIdentity: "关系身份", groupRelationHistory: "历史与运作方式", groupRelationLayers: "公开层与真实层", groupRelationArc: "张力与关系弧", from: "角色 A（主动视角）", to: "角色 B（关系对象）", relationLabel: "关系标签", relationStatus: "当前关系状态", relationHistory: "共同历史与关键事件", dynamic: "日常互动模式", powerBalance: "权力、依赖与交换", publicFace: "他人眼中的关系", privateTruth: "私下真实关系", sharedSecret: "共同秘密与信息差", tension: "当前张力、误解与冲突", turningPoints: "已发生 / 计划中的关系转折", futureDirection: "下一阶段变化方向",
      worldTitle: "世界观设定", worldHint: "从时间空间、社会系统和文化认知三层写清会影响因果与选择的规则。", groupWorldFrame: "时间与空间", groupWorldSystems: "制度与资源", groupWorldCulture: "文化与公共认知", era: "时代、纪年与技术阶段", chronology: "历史时间线与关键年代", geography: "地理格局、距离与交通", environment: "自然环境、气候与生存条件", locations: "关键地点及其叙事功能", rules: "世界硬规则、代价与例外", factions: "势力、目标、资源与关系", politics: "权力结构、法律与治理", society: "阶层、家庭、组织与社会规范", economy: "生产、货币、稀缺资源与交易", worldConflicts: "系统性矛盾与当前危机", culture: "习俗、礼仪、禁忌与日常", beliefs: "宗教、价值观与公共信念", technology: "科技 / 魔法体系及限制", lore: "历史、传说、误传与公共认知",
      plotTitle: "情节骨架", plotHint: "先写清欲望—阻力—代价—选择，再组织转折、伏笔和章节节奏。", groupPlotCore: "戏剧核心", groupPlotStructure: "主线结构", groupPlotWeaving: "支线、伏笔与节奏", themes: "主题与母题", storyQuestion: "核心戏剧问题", protagonistGoal: "主角总体目标", plotStakes: "总体风险与失败代价", coreConflict: "核心冲突", antagonisticForce: "对抗力量及其逻辑", opening: "开局、常态与诱发事件", midpoint: "中点转折与认知改变", climax: "高潮、终极选择与代价", ending: "结局状态与主题回应", subplots: "支线及其与主线的交汇", foreshadowing: "伏笔清单、埋设与回收", reveals: "秘密、揭示顺序与知情范围", pacing: "节奏曲线与张弛安排", chapterPlan: "章节计划（目标、冲突、转折、钩子）", outline: "详细节拍 / 场景大纲",
      outlineTitle: "结构化卷章大纲", outlineHint: "每卷、每章、每场戏独立保存；模型可以按 ID 精确读取和修改，不必重发整份长大纲。类型专用路线写入自定义字段。", outlineEmpty: "还没有结构化大纲。先新增一卷。", addVolume: "新增卷", unnamedVolume: "未命名卷", volumeTitle: "卷名", volumeSummary: "本卷概要", outlineStatus: "状态", chaptersTitle: "章节", addChapter: "新增章", unnamedChapter: "未命名章节", chapterNumber: "章号", chapterTitle: "章名", chapterWords: "目标字数", chapterLocations: "主要场景", chapterSummary: "章节概要", chapterEvents: "事件列表（每行一项）", dialogueNotes: "对话示例与语言备注", endingHook: "收束与下一章钩子", chapterScenes: "场景拆分", addScene: "新增场景", unnamedScene: "未命名场景", sceneName: "场景名",
      discardConfirm: "当前工作区有未保存修改。确定丢弃这些修改并切换或重新加载吗？",
      sceneTitle: "当前场景", sceneHint: "把一场戏写成可执行单元：谁在何时何地，为何行动，发生哪些节拍，结束后什么永久改变。", groupSceneFrame: "场景坐标", groupSceneDramatic: "戏剧执行", groupSceneContinuity: "连续性与状态变化", chapter: "章节 / 场次", sceneTime: "具体时间 / 与上场间隔", location: "地点与空间条件", scenePov: "本场 POV 角色", participants: "出场角色与入退场", sceneGoal: "本场可验证目标", sceneConflict: "阻力、升级与两难", beats: "节拍序列（行动—反应—升级—转折）", emotionalTurn: "情绪起点、转折与终点", sensoryAnchor: "关键感官、意象与环境细节", sceneOutcome: "实际 / 预期结果与代价", knowledgeChanges: "谁获得、误解或隐瞒了什么", propChanges: "道具、伤势、位置与资源变化", continuity: "连续性账本（进入场景前必须成立的事实）", nextHook: "离场钩子与下一场承诺",
      untitledBook: "未命名作品", addCharacter: "新增角色", addRelationship: "新增关系", volumeSettings: "本卷设定", wordsUnit: "字", scenesUnit: "场", moveUp: "上移", moveDown: "下移",
      tab_threads: "线索", navLabel: "切换页面", navAlert: "{n} 条线索需要处理",
      metaProjectSet: "作品设定", metaProjectEmpty: "尚未命名", metaCharacters: "{n} 个角色", metaRelationships: "{n} 条关系", metaFilled: "已填 {n}/{total}", metaOutline: "{v} 卷 · {c} 章", metaSceneEmpty: "未设置", metaThreads: "进行中 {n}", metaThreadsEmpty: "伏笔与回收", metaSettings: "导入 · 导出",
      threadsTitle: "线索账本", threadsHint: "伏笔、悬念与承诺：在哪一章埋下、计划哪一章回收、真相是什么、谁已经知道。", threadsView: "显示方式", viewList: "列表", viewTimeline: "时间线",
      currentChapterLabel: "当前写到", currentChapterInferred: "按大纲章节状态推断", noCurrentChapter: "大纲里还没有开始写的章节（章节状态不是 planned / 计划 即视为已开始），暂不判断逾期。", noOutlineForThreads: "大纲还没有章节。先在「大纲」里建章，线索才能关联到具体章节并判断是否逾期。",
      stat_overdue: "逾期", stat_due: "本章回收", stat_soon: "即将回收", stat_stale: "久未呼应",
      filter_active: "进行中", filter_unplanned: "未规划回收", filter_resolved: "已回收", filter_dropped: "已放弃", filter_all: "全部",
      filter_overdue: "逾期", filter_due: "本章回收", filter_soon: "即将回收", filter_stale: "久未呼应",
      searchThreads: "搜索线索、埋设或真相…", sortLabel: "排序", sortUrgency: "按紧急程度", sortPlanted: "按埋设顺序",
      threadsEmpty: "还没有线索。每埋下一个伏笔、抛出一个悬念或许下一个承诺，就在这里记一笔：模型写新章节前会先查看它们。", threadsFilteredEmpty: "没有符合条件的线索。",
      addThread: "新增线索", unnamedThread: "未命名线索",
      kind_foreshadowing: "伏笔", kind_mystery: "悬念", kind_promise: "承诺", kind_chekhov: "道具 / 能力", kind_subplot: "支线", kind_other: "其他",
      importance_core: "主线", importance_major: "重要", importance_minor: "次要",
      status_open: "待回收", status_partial: "部分揭示", status_resolved: "已回收", status_dropped: "已放弃",
      state_overdue: "逾期", state_due: "本章回收", state_soon: "即将回收", state_unplanned: "未规划", state_open: "待回收", state_resolved: "已回收", state_dropped: "已放弃",
      threadTitle: "线索名称", threadKind: "类型", threadImportance: "重要程度", threadStatus: "状态",
      plantedChapter: "埋设章节", payoffChapter: "计划回收章节", resolvedChapter: "实际回收章节", noChapter: "未指定", noChapterShort: "未定", noOutlineChapters: "大纲暂无章节", missingChapter: "（章节已删除）", currentMarker: "当前",
      threadSetup: "埋设内容（读者看到了什么）", threadTruth: "真相 / 答案（只给作者和模型看，回收前不可泄露）", threadPayoffPlan: "回收方案", threadResolution: "实际回收方式", threadNotes: "备注",
      threadCharacters: "关联角色", threadKnownBy: "知情角色（已经知道真相的人）", noCharactersYet: "还没有角色。",
      threadBeats: "中途呼应", threadBeatsHint: "每次在正文里重新提起这条线索就记一笔；超过 10 章没有呼应会被标为「久未呼应」。", addBeat: "新增呼应", beatNote: "这一章如何呼应", beatChapter: "呼应章节",
      trackPlanted: "埋", trackPayoff: "收", trackResolved: "已收", idleFor: "{n} 章未呼应", markResolved: "标记为已回收（记到当前章节）", reopen: "重新打开",
      "warn_missing-chapter": "引用的章节已被删除，请重新选择。", "warn_payoff-before-plant": "计划回收章节排在埋设章节之前。", "warn_resolved-without-chapter": "已回收，但没有填写实际回收章节。",
      chapterAxis: "章节", timelineEmpty: "大纲还没有章节，无法绘制时间线。", timelineLegend: "实心点：埋设 · 小圆圈：中途呼应 · 空心圆：计划回收 · 绿点：已回收 · 红色虚线：逾期 · 高亮列：当前章节。点击一行可展开编辑。",
      numberStyle: "cjk", tenThousand: "万", draftedStatus: "初稿",
      bookProgress: "全书进度", scanning: "正在统计…", scanFailed: "统计失败", rescanManuscripts: "重新统计正文字数",
      chaptersWritten: "已写 {n} / {total} 章", filesMissing: "{n} 个正文文件缺失", filesUnlinked: "{n} 个正文文件未关联章节", autoLink: "按文件名自动关联 {n} 章",
      volumeStats: "{chapters} 章 · 已写 {written} · {words} 字 · {scenes} 场",
      manuscriptFile: "正文文件", manuscriptNone: "未关联", linkedElsewhere: "已关联其他章节", fileMissingShort: "文件缺失",
      fileMissing: "找不到正文文件 {file}，可能被移动或改名；请重新选择。", manuscriptHint: "关联工作区里的 .md / .txt 正文后会统计字数；AI 保存章节时带上 chapter_id 会自动关联。",
      noManuscriptFiles: "工作区根目录还没有 .md / .txt 正文文件。让 AI 用 novel_save_chapter 保存章节时带上 chapter_id，就会自动出现在这里。",
      updatedAt: "更新于", showPreview: "预览正文", hidePreview: "收起预览", loadingPreview: "正在读取…", previewTruncated: "…… 仅显示开头（全文 {n} 字符）",
      progressTitle: "写作进展", progressEmpty: "还没有推进记录。AI 可在写作后自动写入。", progressEntry: "进展", canonChanges: "设定变更", openThreads: "待续线索",
    };
    var en = {
      title: "Novel Writing", rail: "Open Novel Writing", cardDescription: "Workspace-shared characters, world, plot, and continuity data",
      writeActive: "Novel Writing", writeEdit: "Edit", writeClear: "Unlink", writeSave: "Save", writeCancel: "Cancel", writeObjectiveAria: "Novel writing objective", writeCommandInput: "Writing command input",
      loading: "Loading novel project…", loadFailed: "Load failed", retry: "Retry", saveFailed: "Save failed", noWorkspace: "No workspace is available. Open or create a workspace first.", workspaceLabel: "Shared workspace",
      saved: "Project canon saved.", saving: "Saving…", save: "Save", reload: "Revert", unsaved: "Unsaved changes", synced: "Synced to model context", draftRestored: "Restored this workspace's unsaved draft.",
      tab_project: "Project", tab_characters: "Characters", tab_relationships: "Relations", tab_world: "World", tab_plot: "Plot", tab_outline: "Outline", tab_scene: "Scene", tab_settings: "Settings",
      settingsTitle: "Novel framework settings", settingsHint: "Import, export, or reset the complete framework shared by this workspace, not one conversation.", settingsDirty: "Save or revert current edits before importing, exporting, or clearing.", working: "Working…", cancel: "Cancel",
      exportTitle: "Export current framework", exportHint: "Download portable JSON with the project, characters, relationships, world, plot, outline, thread ledger, scene, and progress.", exportAction: "Export JSON", exported: "Novel framework exported.", exportFailed: "Export failed",
      importTitle: "Import a framework", importHint: "Import an exported document or complete project JSON. It is validated before atomically replacing the current framework.", importAction: "Choose JSON file", imported: "Novel framework imported.", importFailed: "Import failed", importInvalidJson: "The file is not valid JSON", importTooLarge: "The import exceeds the 5 MB limit.",
      clearTitle: "Clear current framework", clearHint: "Restore an empty framework, removing all workspace-shared characters, relationships, world, plot, outline, threads, scene, and progress.", clearAction: "Clear framework", clearConfirm: "This cannot be undone. Export a backup first if needed; confirmation only clears the current workspace framework.", clearConfirmAction: "Confirm clear", cleared: "The current workspace framework was cleared.", clearFailed: "Clear failed",
      projectTitle: "Project overview", projectHint: "Define the book contract first, then keep characters, world, and plot aligned with it.", groupBasics: "Book positioning", groupWritingContract: "Writing contract", bookTitle: "Title", genre: "Genre", tone: "Tone and style", pov: "Point of view", targetWords: "Target length", audience: "Target audience", contentRating: "Content rating and boundaries", premise: "Premise", styleGuide: "Style guide", constraints: "Creative constraints", notes: "Notes",
      genreProfileTitle: "Genre extension profile", genreProfileType: "Profile type", genreProfilePlaceholder: "For example romance, mystery, xianxia", customFields: "Custom fields", customFieldsHint: "Define genre-specific data while preserving stable keys for the model.", customFieldsEmpty: "No custom fields yet.", customFieldDefault: "Field", customFieldName: "Field name", customFieldValue: "Field value", addCustomField: "Add custom field",
      charactersTitle: "Character cards", add: "Add", delete: "Delete", charactersEmpty: "No characters yet. Start with the protagonist and primary opposition.", unnamedCharacter: "Unnamed character", rolePlaceholder: "No role yet",
      groupIdentity: "Identity and status", groupPortrait: "Portrait", groupDrive: "Drive and pressure", groupResources: "Abilities and information", groupPerformance: "Performance and arc", name: "Name", aliases: "Aliases", age: "Age", identity: "Identity, occupation, social position", role: "Story function", characterStatus: "Current status", appearance: "Appearance and visual markers", traits: "Traits, values, behavior", background: "Background and formative events", goal: "External goal", motivation: "Deep motivation", stakes: "Personal stakes", conflict: "Internal / external conflict", abilities: "Abilities and resources", weaknesses: "Weaknesses and blind spots", secret: "Secrets and information gaps", knowledge: "Known, unknown, mistaken beliefs", possessions: "Key objects and resources", voice: "Voice and speech patterns", habits: "Habits and stress responses", arc: "Character arc",
      relationshipsTitle: "Relationships", relationshipsNeedCharacters: "Create at least two characters first.", relationshipsEmpty: "No relationship lines yet.", relationship: "Relationship", relationshipInvalid: "Invalid or self-referencing endpoints. Choose two distinct characters.", chooseCharacter: "Choose a character", groupRelationIdentity: "Relationship identity", groupRelationHistory: "History and operation", groupRelationLayers: "Public and private layers", groupRelationArc: "Tension and arc", from: "Character A", to: "Character B", relationLabel: "Label", relationStatus: "Current status", relationHistory: "Shared history", dynamic: "Interaction pattern", powerBalance: "Power, dependence, exchange", publicFace: "Public appearance", privateTruth: "Private truth", sharedSecret: "Shared secret", tension: "Current tension", turningPoints: "Turning points", futureDirection: "Direction of change",
      worldTitle: "Worldbuilding", worldHint: "Define time and space, social systems, and cultural beliefs that shape causality and choice.", groupWorldFrame: "Time and space", groupWorldSystems: "Systems and resources", groupWorldCulture: "Culture and belief", era: "Era and technology stage", chronology: "Historical chronology", geography: "Geography and travel", environment: "Environment and survival", locations: "Key locations", rules: "Hard rules, costs, exceptions", factions: "Factions and interests", politics: "Power, law, governance", society: "Class, family, institutions", economy: "Economy and scarce resources", worldConflicts: "Systemic conflicts", culture: "Culture and daily life", beliefs: "Beliefs and religion", technology: "Technology / magic", lore: "History, lore, public beliefs",
      plotTitle: "Plot spine", plotHint: "Define desire, resistance, cost, and choice before arranging turns, setups, and pacing.", groupPlotCore: "Dramatic core", groupPlotStructure: "Main structure", groupPlotWeaving: "Subplots and pacing", themes: "Themes", storyQuestion: "Dramatic question", protagonistGoal: "Protagonist goal", plotStakes: "Global stakes", coreConflict: "Core conflict", antagonisticForce: "Antagonistic force", opening: "Opening and inciting incident", midpoint: "Midpoint reversal", climax: "Climax and final choice", ending: "Ending state", subplots: "Subplots", foreshadowing: "Foreshadowing and payoff", reveals: "Reveals and knowledge order", pacing: "Pacing curve", chapterPlan: "Chapter plan", outline: "Detailed beat outline",
      outlineTitle: "Structured volume and chapter outline", outlineHint: "Store each volume, chapter, and scene independently so the model can read and patch by stable ID.", outlineEmpty: "No structured outline yet. Add a volume first.", addVolume: "Add volume", unnamedVolume: "Untitled volume", volumeTitle: "Volume title", volumeSummary: "Volume summary", outlineStatus: "Status", chaptersTitle: "Chapters", addChapter: "Add chapter", unnamedChapter: "Untitled chapter", chapterNumber: "Number", chapterTitle: "Chapter title", chapterWords: "Target words", chapterLocations: "Primary locations", chapterSummary: "Chapter summary", chapterEvents: "Events, one per line", dialogueNotes: "Dialogue examples and notes", endingHook: "Ending and next hook", chapterScenes: "Scene breakdown", addScene: "Add scene", unnamedScene: "Untitled scene", sceneName: "Scene name",
      discardConfirm: "This workspace has unsaved changes. Discard them and switch or reload?",
      sceneTitle: "Current scene", sceneHint: "Make the scene executable: who acts where and why, the beat sequence, and what permanently changes.", groupSceneFrame: "Scene coordinates", groupSceneDramatic: "Dramatic execution", groupSceneContinuity: "Continuity and state", chapter: "Chapter / scene", sceneTime: "Time / gap from prior scene", location: "Place and conditions", scenePov: "POV character", participants: "Participants and entrances", sceneGoal: "Verifiable scene goal", sceneConflict: "Obstacle, escalation, dilemma", beats: "Beat sequence", emotionalTurn: "Emotional turn", sensoryAnchor: "Sensory anchors", sceneOutcome: "Outcome and cost", knowledgeChanges: "Knowledge changes", propChanges: "Object and state changes", continuity: "Continuity ledger", nextHook: "Exit hook",
      untitledBook: "Untitled book", addCharacter: "Add character", addRelationship: "Add relationship", volumeSettings: "Volume settings", wordsUnit: "words", scenesUnit: "scenes", moveUp: "Move up", moveDown: "Move down",
      tab_threads: "Threads", navLabel: "Switch section", navAlert: "{n} threads need attention",
      metaProjectSet: "Book setup", metaProjectEmpty: "Untitled", metaCharacters: "{n} characters", metaRelationships: "{n} relations", metaFilled: "{n}/{total} filled", metaOutline: "{v} vol · {c} ch", metaSceneEmpty: "Not set", metaThreads: "{n} open", metaThreadsEmpty: "Setups & payoffs", metaSettings: "Import · export",
      threadsTitle: "Thread ledger", threadsHint: "Foreshadowing, mysteries, and promises: where each is planted, where it pays off, the hidden truth, and who knows it.", threadsView: "View", viewList: "List", viewTimeline: "Timeline",
      currentChapterLabel: "Writing", currentChapterInferred: "inferred from outline chapter status", noCurrentChapter: "No outline chapter has started yet (any status other than planned counts as started), so nothing is overdue.", noOutlineForThreads: "The outline has no chapters yet. Add chapters under Outline so threads can point at them.",
      stat_overdue: "Overdue", stat_due: "Due now", stat_soon: "Due soon", stat_stale: "Idle",
      filter_active: "Open", filter_unplanned: "No payoff set", filter_resolved: "Resolved", filter_dropped: "Dropped", filter_all: "All",
      filter_overdue: "Overdue", filter_due: "Due now", filter_soon: "Due soon", filter_stale: "Idle",
      searchThreads: "Search threads, setups, truths…", sortLabel: "Sort", sortUrgency: "By urgency", sortPlanted: "By setup order",
      threadsEmpty: "No threads yet. Log every setup, mystery, or promise here; the model checks them before drafting a chapter.", threadsFilteredEmpty: "No threads match.",
      addThread: "Add thread", unnamedThread: "Untitled thread",
      kind_foreshadowing: "Setup", kind_mystery: "Mystery", kind_promise: "Promise", kind_chekhov: "Chekhov", kind_subplot: "Subplot", kind_other: "Other",
      importance_core: "Main", importance_major: "Major", importance_minor: "Minor",
      status_open: "Open", status_partial: "Partly revealed", status_resolved: "Resolved", status_dropped: "Dropped",
      state_overdue: "Overdue", state_due: "Due now", state_soon: "Due soon", state_unplanned: "No payoff", state_open: "Open", state_resolved: "Resolved", state_dropped: "Dropped",
      threadTitle: "Thread name", threadKind: "Type", threadImportance: "Importance", threadStatus: "Status",
      plantedChapter: "Planted in", payoffChapter: "Planned payoff", resolvedChapter: "Paid off in", noChapter: "Not set", noChapterShort: "tbd", noOutlineChapters: "No outline chapters", missingChapter: "(deleted chapter)", currentMarker: "current",
      threadSetup: "Setup (what the reader sees)", threadTruth: "Truth (author and model only; never reveal early)", threadPayoffPlan: "Payoff plan", threadResolution: "Actual payoff", threadNotes: "Notes",
      threadCharacters: "Characters involved", threadKnownBy: "Who knows the truth", noCharactersYet: "No characters yet.",
      threadBeats: "Echoes", threadBeatsHint: "Log each time the prose brings the thread back; 10+ chapters without one marks it idle.", addBeat: "Add echo", beatNote: "How this chapter echoes it", beatChapter: "Echo chapter",
      trackPlanted: "in", trackPayoff: "out", trackResolved: "paid", idleFor: "idle {n} ch", markResolved: "Mark resolved (at the current chapter)", reopen: "Reopen",
      "warn_missing-chapter": "A referenced chapter was deleted; pick another.", "warn_payoff-before-plant": "The planned payoff comes before the setup.", "warn_resolved-without-chapter": "Resolved without a payoff chapter.",
      chapterAxis: "Chapter", timelineEmpty: "The outline has no chapters to draw.", timelineLegend: "Filled dot: setup · small ring: echo · hollow ring: planned payoff · green: paid off · red dashes: overdue · shaded column: current chapter. Click a row to edit.",
      numberStyle: "latin", tenThousand: "", draftedStatus: "drafted",
      bookProgress: "Book progress", scanning: "Counting…", scanFailed: "Count failed", rescanManuscripts: "Recount manuscript words",
      chaptersWritten: "{n} / {total} chapters written", filesMissing: "{n} manuscript files missing", filesUnlinked: "{n} manuscript files not linked", autoLink: "Link {n} chapters by filename",
      volumeStats: "{chapters} ch · {written} written · {words} words · {scenes} scenes",
      manuscriptFile: "Manuscript file", manuscriptNone: "Not linked", linkedElsewhere: "linked elsewhere", fileMissingShort: "file missing",
      fileMissing: "Manuscript {file} was not found; it may have been moved or renamed. Pick it again.", manuscriptHint: "Link a .md / .txt file from the workspace to count its words; the AI links files automatically when it saves with chapter_id.",
      noManuscriptFiles: "The workspace root has no .md / .txt manuscripts yet. Files the AI saves with chapter_id appear here automatically.",
      updatedAt: "updated", showPreview: "Preview", hidePreview: "Hide preview", loadingPreview: "Reading…", previewTruncated: "… showing the opening only ({n} characters in total)",
      progressTitle: "Writing progress", progressEmpty: "No progress entries yet. AI can record them after writing.", progressEntry: "Progress", canonChanges: "Canon changes", openThreads: "Open threads",
    };

    async function apply(ctx) {
      var style = installStyle();
      ctx.effect(function () { return function () { if (style.owned && style.node) style.node.remove(); }; }, "dsh-w-noval-write: styles");
      ctx.effect(function () { return ctx.locale.register(NS, { zh: zh, en: en }); });
      var t = ctx.locale.bind(NS);
      var unmount = await ctx.remote.$mount(TYPERT_REMOTE);
      ctx.effect(function () { return unmount; }, "dsh-w-noval-write: remote");
      var service = ctx.get("remote.novalWriter");
      if (!service) throw new Error("dsh-w-noval-write: remote.novalWriter did not mount");
      function unwrap(method, args) {
        return service[method].apply(service, args).then(function (result) {
          if (!result.ok) throw new Error(method + " failed: " + JSON.stringify(result.error));
          return result.value;
        });
      }
      function injected() {
        return { writer: {
          getState: function (workspaceId) { return unwrap("getState", [workspaceId]); },
          saveProject: function (workspaceId, input, revision) { return unwrap("saveProject", [workspaceId, input, revision]); },
          exportProject: function (workspaceId) { return unwrap("exportProject", [workspaceId]); },
          importProject: function (workspaceId, input, revision) { return unwrap("importProject", [workspaceId, input, revision]); },
          resetProject: function (workspaceId, revision) { return unwrap("resetProject", [workspaceId, revision]); },
          getLink: function (sessionId) { return unwrap("getLink", [sessionId]); },
          editLink: function (sessionId, objective, revision) { return unwrap("editLink", [sessionId, objective, revision]); },
          clearLink: function (sessionId, revision) { return unwrap("clearLink", [sessionId, revision]); },
          listManuscripts: function (workspaceId) { return unwrap("listManuscripts", [workspaceId]); },
          readManuscript: function (workspaceId, filename) { return unwrap("readManuscript", [workspaceId, filename]); },
        } };
      }
      ctx.uiConversation.events.register(writeCommandInputDefinition);
      ctx.slots.inject("conversation.chat.node", function () {
        return ctx.slots.register({ name: "conversation.chat.node", key: "noval-write-command-input", locale: NS }, WriteCommandInputView);
      });
      ctx.slots.inject("conversation.input.dock", function () {
        return ctx.slots.register({
          name: "conversation.input.dock", id: "noval-write", order: 15, locale: NS,
          inject: function (sessionId) {
            return {
              loadLink: function () { return unwrap("getLink", [sessionId]); },
              onEdit: function (objective, revision) { return unwrap("editLink", [sessionId, objective, revision]); },
              onClear: function (revision) { return unwrap("clearLink", [sessionId, revision]); },
            };
          },
        }, function (props) { return React.createElement(WriteDock, { loadLink: props.loadLink, onEdit: props.onEdit, onClear: props.onClear, t: t }); });
      });
      ctx.slots.inject("right-sidebar.rail", function () {
        return ctx.slots.register({ name: "right-sidebar.rail", id: "noval-write", order: 110, label: function () { return t("title"); }, locale: NS }, SidebarRail);
      });
      ctx.slots.inject("right-sidebar.card", function () {
        return ctx.slots.register({ name: "right-sidebar.card", id: "noval-write", order: 110, label: function () { return t("title"); }, locale: NS }, SidebarCard);
      });
      ctx.slots.inject("right-sidebar.page", function () {
        return ctx.slots.register({
          name: "right-sidebar.page", priority: 110,
          select: function (owner) { return owner && owner.activeId === "noval-write" ? {} : null; },
          locale: NS, inject: injected,
        }, SidebarPage);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-w-noval-write";
    return module.exports;
  },
});
