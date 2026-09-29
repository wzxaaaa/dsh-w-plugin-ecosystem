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
      ".dshwnw-cstate{gap:6px}",
      ".dshwnw-standings{display:flex;flex-wrap:wrap;gap:6px}",
      ".dshwnw-template{gap:6px}",
      ".dshwnw-toggle{display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer}",
      ".dshwnw-toggle input{width:16px;height:16px;margin:0;accent-color:var(--nw-accent)}",
      ".dshwnw-cstate-line{font-size:12px;line-height:18px;color:var(--nw-fg2)}",
      ".dshwnw-cstate-line b{margin-right:6px;color:var(--nw-fg);font-weight:600}",
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
      ".dshwnw-corpus{display:flex;flex-direction:column;gap:8px}",
      ".dshwnw-corpus .dshwnw-toolrow .dshwnw-select{flex:1;width:auto;height:34px}",
      ".dshwnw-corpus-card{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--nw-border);border-left:3px solid hsl(var(--nw-hue,220) 60% 52%);border-radius:10px;background:var(--nw-fill)}",
      ".dshwnw-corpus-card[data-none=true]{border-left-color:var(--nw-fg3)}",
      ".dshwnw-corpus-dot{width:10px;height:10px;flex:none;border-radius:50%;background:hsl(var(--nw-hue,220) 60% 52%);box-shadow:0 0 0 3px hsl(var(--nw-hue,220) 60% 52% / .16)}",
      ".dshwnw-corpus-title{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:650}",
      ".dshwnw-adult{height:17px;padding:0 5px;border-radius:5px;background:color-mix(in srgb,var(--nw-danger) 14%,transparent);color:var(--nw-danger);font-size:10.5px;font-weight:700;line-height:17px}",
      ".dshwnw-external{flex:none;display:flex;flex-direction:column;gap:8px;padding:10px 12px;border-bottom:1px solid color-mix(in srgb,var(--nw-warn) 35%,var(--nw-border));background:color-mix(in srgb,var(--nw-warn) 11%,var(--nw-surface));font-size:12.5px;line-height:18px;color:var(--nw-fg);z-index:2}",
      ".dshwnw-history{display:flex;flex-direction:column;gap:6px}",
      ".dshwnw-history-item{border:1px solid var(--nw-border);border-radius:10px;background:var(--nw-surface)}",
      ".dshwnw-history-item[data-current=true]{border-color:color-mix(in srgb,var(--nw-accent) 40%,var(--nw-border))}",
      ".dshwnw-history-row{display:flex;align-items:center;gap:9px;width:100%;padding:8px 10px;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}",
      ".dshwnw-history-row .dshwnw-chevron{flex:none;margin-left:auto}",
      ".dshwnw-history-row[aria-expanded=true] .dshwnw-chevron{transform:rotate(90deg)}",
      ".dshwnw-history-rev{flex:none;min-width:34px;height:20px;padding:0 5px;border-radius:6px;background:var(--nw-fill);color:var(--nw-fg2);font:600 11px/20px ui-monospace,SFMono-Regular,Menlo,monospace;text-align:center}",
      ".dshwnw-history-title{display:flex;align-items:center;gap:6px;min-width:0}",
      ".dshwnw-history-op{min-width:0;font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-history-body{display:flex;flex-direction:column;gap:8px;padding:4px 10px 10px;border-top:1px solid var(--nw-border)}",
      ".dshwnw-actor{flex:none;height:18px;padding:0 6px;border-radius:5px;font-size:10.5px;font-weight:700;line-height:18px}",
      ".dshwnw-actor[data-actor=ai]{background:color-mix(in srgb,#8a5cf6 15%,transparent);color:#7c4ddc}",
      ".dshwnw-actor[data-actor=user]{background:var(--nw-accent-soft);color:var(--nw-accent)}",
      ".dshwnw-actor[data-actor=baseline]{background:var(--nw-fill);color:var(--nw-fg2)}",
      ".dshwnw-diff{display:flex;flex-direction:column;gap:8px;max-height:280px;overflow:auto}",
      ".dshwnw-diff-section{display:flex;flex-direction:column;gap:3px}",
      ".dshwnw-diff-title{font-size:12px;font-weight:650;color:var(--nw-fg)}",
      ".dshwnw-diff-line{font-size:12px;line-height:18px;color:var(--nw-fg2);overflow-wrap:anywhere}",
      ".dshwnw-diff-line[data-kind=added]{color:var(--nw-ok)}",
      ".dshwnw-diff-line[data-kind=removed]{color:var(--nw-danger)}",
      ".dshwnw-diff-value{display:grid;grid-template-columns:minmax(0,1fr);gap:1px;padding:6px 8px;border-radius:7px;background:var(--nw-fill);font-size:12px;line-height:17px}",
      ".dshwnw-diff-value b{font-weight:600;color:var(--nw-fg)}",
      ".dshwnw-diff-before{color:var(--nw-danger);text-decoration:line-through;text-decoration-color:color-mix(in srgb,var(--nw-danger) 45%,transparent);overflow-wrap:anywhere}",
      ".dshwnw-diff-arrow{display:none}",
      ".dshwnw-diff-after{color:var(--nw-ok);overflow-wrap:anywhere}",
      ".dshwnw-library{display:flex;flex-direction:column;gap:10px}",
      ".dshwnw-library-hero{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px 6px;text-align:center}",
      ".dshwnw-library-icon{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:var(--nw-accent-soft);color:var(--nw-accent)}",
      ".dshwnw-library-list{display:flex;flex-direction:column;gap:6px}",
      ".dshwnw-novel{display:flex;align-items:center;gap:10px;padding:10px;border:1px solid var(--nw-border);border-radius:12px;background:var(--nw-surface)}",
      ".dshwnw-novel[data-current=true]{border-color:color-mix(in srgb,var(--nw-accent) 45%,var(--nw-border));box-shadow:0 0 0 3px var(--nw-accent-soft)}",
      ".dshwnw-novel .dshwnw-list-copy{flex:1;gap:1px}",
      ".dshwnw-novel-cover{width:36px;height:46px;flex:none;display:flex;align-items:center;justify-content:center;border-radius:4px 8px 8px 4px;background:linear-gradient(135deg,hsl(var(--nw-hue,220) 55% 48%),hsl(calc(var(--nw-hue,220) + 30) 55% 38%));box-shadow:inset 3px 0 0 rgba(0,0,0,.18);color:#fff;font-size:16px;font-weight:700}",
      ".dshwnw-novel-title{font-size:13.5px;font-weight:650;line-height:19px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-novel-folder{display:flex;align-items:center;gap:4px;font-size:11.5px;color:var(--nw-fg2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshwnw-novel-folder svg{flex:none;color:var(--nw-warn)}",
      ".dshwnw-library-new{display:flex;flex-direction:column;gap:8px;padding:12px;border:1px dashed color-mix(in srgb,var(--nw-accent) 40%,var(--nw-border));border-radius:12px;background:color-mix(in srgb,var(--nw-accent) 3%,var(--nw-surface))}",
      ".dshwnw-library-preview{display:flex;align-items:flex-start;gap:6px;font-size:11.5px;line-height:17px;color:var(--nw-fg2);overflow-wrap:anywhere}",
      ".dshwnw-library-preview svg{flex:none;margin-top:2px;color:var(--nw-warn)}",
      "button.dshwnw-workspace{border:0;font:inherit;font-size:11.5px;cursor:pointer}",
      "button.dshwnw-workspace:hover{color:var(--nw-accent)}",
      "button.dshwnw-workspace:before{background:var(--nw-warn)}",
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
        descriptor("listStyleCorpora", []),
        descriptor("listNovels", [parameter("workspaceId")]),
        descriptor("getBinding", [parameter("sessionId"), parameter("workspaceId")]),
        descriptor("bindNovel", [parameter("sessionId"), parameter("workspaceId"), parameter("novelId")]),
        descriptor("unbindNovel", [parameter("sessionId")]),
        descriptor("createNovel", [parameter("sessionId"), parameter("workspaceId"), parameter("input")]),
        descriptor("getRevision", [parameter("workspaceId")]),
        descriptor("listHistory", [parameter("workspaceId")]),
        descriptor("compareSnapshot", [parameter("workspaceId"), parameter("revision")]),
        descriptor("restoreSnapshot", [parameter("workspaceId"), parameter("revision"), parameter("expectedRevision")]),
        descriptor("getProgressionTemplates"),
        descriptor("saveProgressionTemplate", [parameter("input")]),
        descriptor("deleteProgressionTemplate", [parameter("templateId")]),
        descriptor("restoreProgressionTemplates"),
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
      section_progression: ["M3 16.5l4.8-8.3 3 5 2.2-3.4 4 6.7z", "M13.5 6.2a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4z"],
      folder: ["M3 6.5V15a1 1 0 001 1h12a1 1 0 001-1V7.5a1 1 0 00-1-1h-6.5L8 4.5H4a1 1 0 00-1 1z"],
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

    // Which knowledge-base style corpus this book writes with.
    function StyleCorpusField(props) {
      var t = props.t;
      var slot = React.useState({ status: "loading", available: false, corpora: [], active: "" });
      var listing = slot[0];
      var setListing = slot[1];
      var canList = Boolean(props.writer && typeof props.writer.listStyleCorpora === "function");
      function refresh() {
        if (!canList) { setListing({ status: "ready", available: false, corpora: [], active: "" }); return; }
        setListing(function (current) { return Object.assign({}, current, { status: "loading" }); });
        props.writer.listStyleCorpora().then(function (value) {
          setListing({ status: "ready", available: Boolean(value && value.available), corpora: (value && value.corpora) || [], active: (value && value.active) || "" });
        }).catch(function (error) {
          setListing(function (current) { return Object.assign({}, current, { status: "error", error: failureText(error) }); });
        });
      }
      React.useEffect(refresh, []);
      var value = props.value || "";
      var bound = value && value !== "none" ? listing.corpora.find(function (item) { return item.id === value; }) : null;
      var fallback = listing.corpora.find(function (item) { return item.id === listing.active; }) || null;
      var effective = value === "none" ? null : bound || fallback;
      var missing = listing.status === "ready" && value && value !== "none" && !bound;
      if (listing.status === "ready" && !listing.available) {
        return React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, t("corpusUnavailable"));
      }
      return React.createElement("div", { className: "dshwnw-corpus" },
        React.createElement("div", { className: "dshwnw-toolrow" },
          React.createElement("select", {
            className: "dshwnw-select", value: value, "aria-label": t("corpusField"),
            onChange: function (event) { props.onChange(event.target.value); },
          },
            React.createElement("option", { value: "" }, t("corpusFollow") + (fallback ? "（" + fallback.name + "）" : "")),
            React.createElement("option", { value: "none" }, t("corpusNone")),
            missing ? React.createElement("option", { value: value }, t("corpusMissingOption")) : null,
            listing.corpora.map(function (item) {
              return React.createElement("option", { key: item.id, value: item.id }, item.name + (item.adult ? " · 18+" : "") + " · " + item.notes + " " + t("corpusPassages"));
            })
          ),
          React.createElement(IconButton, { icon: "refresh", label: t("corpusRefresh"), disabled: listing.status === "loading", onClick: refresh })
        ),
        missing ? React.createElement("div", { className: "dshwnw-warning" }, t("corpusMissing")) : null,
        listing.status === "error" ? React.createElement("div", { className: "dshwnw-warning" }, listing.error) : null,
        effective
          ? React.createElement("div", { className: "dshwnw-corpus-card", style: { "--nw-hue": effective.adult ? 348 : 140 + (hueOf(effective.id) % 160) } },
            React.createElement("span", { className: "dshwnw-corpus-dot", "aria-hidden": true }),
            React.createElement("span", { className: "dshwnw-list-copy" },
              React.createElement("span", { className: "dshwnw-corpus-title" }, effective.name,
                effective.adult ? React.createElement("span", { className: "dshwnw-adult" }, "18+") : null,
                bound ? null : React.createElement("span", { className: "dshwnw-pill" }, t("corpusFollowing"))),
              React.createElement("span", { className: "dshwnw-list-meta" }, effective.notes + " " + t("corpusPassages") + (effective.description ? " · " + effective.description : ""))
            )
          )
          : value === "none"
            ? React.createElement("div", { className: "dshwnw-corpus-card", "data-none": "true" }, React.createElement("span", { className: "dshwnw-list-meta" }, t("corpusNoneHint")))
            : null,
        React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, t("corpusHint"))
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
        React.createElement(FieldGroup, { title: props.t("corpusField") },
          React.createElement(StyleCorpusField, { t: props.t, writer: props.writer, value: p.styleCorpusId, onChange: function (v) { set("styleCorpusId", v); } })
        ),
        React.createElement(FieldGroup, { title: props.t("groupWritingContract") },
          React.createElement(TextField, { label: props.t("styleGuide"), value: p.styleGuide, rows: 6, onChange: function (v) { set("styleGuide", v); } }),
          React.createElement(TextField, { label: props.t("constraints"), value: p.constraints, rows: 5, onChange: function (v) { set("constraints", v); } }),
          React.createElement(TextField, { label: props.t("notes"), value: p.notes, onChange: function (v) { set("notes", v); } })
        ),
        React.createElement(FieldGroup, { title: props.t("genreProfileTitle") },
          React.createElement(InputField, { label: props.t("genreProfileType"), value: p.genreProfile.type, placeholder: props.t("genreProfilePlaceholder"), onChange: function (v) { props.setGenre("type", v); } })
        ),
        React.createElement(CustomFieldsEditor, { t: props.t, value: p.genreProfile.customFields, onChange: props.setGenreFields }),
        React.createElement(FieldGroup, { title: props.t("progressionGroup") },
          React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, props.t("progressionGroupHint")),
          React.createElement("label", { className: "dshwnw-toggle" },
            React.createElement("input", {
              type: "checkbox",
              checked: progressionOn(p),
              disabled: ((p.progression && p.progression.systems) || []).length > 0,
              onChange: function (event) { props.setProgressionEnabled(event.target.checked); },
            }),
            React.createElement("span", null, ((p.progression && p.progression.systems) || []).length > 0 ? props.t("progressionOnBySystems") : props.t("progressionToggle"))
          )
        )
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
      // A saved chapter changes the revision; recount without closing previews.
      React.useEffect(function () { if (files.status === "ready") scan(); }, [props.revision]);
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

    // ── progression systems ────────────────────────────────────────────
    // Mirrors analyzeProgression() in noval-write-core.js: any number of
    // systems per book, each an ordered tier ladder, plus a per-chapter
    // ledger folded in outline order. Templates are shared by every book.
    function progressionOn(project) {
      var progression = project.progression || {};
      return progression.enabled === true || (progression.systems || []).length > 0;
    }

    function emptyTier(name) {
      return { id: makeId("tier"), name: name || "", stages: "", advance: "", cost: "", gap: "", notes: "" };
    }

    function emptyRecord() {
      return { id: "", characterId: "", chapterId: "", systemId: "", tierId: "", stage: "", condition: "", holdings: "", revealed: "", gained: "", lost: "", note: "" };
    }

    function systemFromTemplateClient(template, systems) {
      var used = {};
      systems.forEach(function (system) { used[system.id] = true; });
      var base = String(template.name || "").trim() || makeId("system");
      var id = base;
      var counter = 2;
      while (used[id]) { id = base + "-" + counter; counter += 1; }
      return {
        id: id, name: template.name || "", notes: template.description || "",
        tiers: (template.tiers || []).map(function (tier) { return Object.assign(emptyTier(), tier); }),
      };
    }

    function analyzeProgressionView(project, asOfChapterId) {
      var chapters = chapterSequenceOf(project);
      var position = new Map(chapters.map(function (chapter) { return [chapter.id, chapter.index]; }));
      var current = -1;
      chapters.forEach(function (chapter, index) { if (!UNSTARTED_CHAPTER_STATUS.test(String(chapter.status || "").trim())) current = index; });
      var asOfIndex = asOfChapterId && position.has(asOfChapterId) ? position.get(asOfChapterId) : current;
      var limit = asOfIndex >= 0 ? asOfIndex : Infinity;
      var progression = project.progression || { systems: [], records: [] };
      var systems = progression.systems || [];
      var systemById = new Map(systems.map(function (system) { return [system.id, system]; }));
      var rankIn = new Map(systems.map(function (system) { return [system.id, new Map((system.tiers || []).map(function (tier, index) { return [tier.id, index]; }))]; }));
      function rankOf(record) { var ranks = rankIn.get(record.systemId); return ranks ? ranks.get(record.tierId) : undefined; }
      var characters = new Map((project.characters || []).map(function (character) { return [character.id, character]; }));
      var warnings = [];
      var entries = (progression.records || []).map(function (record, order) {
        return { record: record, order: order, index: position.has(record.chapterId) ? position.get(record.chapterId) : -1 };
      });
      entries.forEach(function (entry) {
        var record = entry.record;
        if (entry.index < 0) warnings.push({ code: "missing-chapter", recordId: record.id });
        if (!characters.has(record.characterId)) warnings.push({ code: "missing-character", recordId: record.id });
        if (record.systemId && !systemById.has(record.systemId)) warnings.push({ code: "missing-system", recordId: record.id });
        else if (record.tierId && rankOf(record) === undefined) warnings.push({ code: "missing-tier", recordId: record.id });
        if (!record.systemId && (record.tierId || record.stage)) warnings.push({ code: "tier-without-system", recordId: record.id });
      });
      var timeline = entries.filter(function (entry) { return entry.index >= 0; }).sort(function (a, b) { return a.index - b.index || a.order - b.order; });
      var lastRank = new Map();
      timeline.forEach(function (entry) {
        var record = entry.record;
        var rank = rankOf(record);
        if (rank === undefined) return;
        var key = record.characterId + "\u0000" + record.systemId;
        var previous = lastRank.get(key);
        lastRank.set(key, rank);
        if (previous === undefined || String(record.note || "").trim()) return;
        if (rank < previous) warnings.push({ code: "tier-regression", recordId: record.id });
        else if (rank > previous + 1) warnings.push({ code: "tier-skip", recordId: record.id });
      });
      var states = new Map();
      timeline.forEach(function (entry) {
        if (entry.index > limit) return;
        var record = entry.record;
        var state = states.get(record.characterId);
        if (!state) { state = { characterId: record.characterId, standings: new Map(), condition: "", holdings: "", revealed: [], lastIndex: -1, records: 0 }; states.set(record.characterId, state); }
        if (record.systemId && record.tierId) state.standings.set(record.systemId, { tierId: record.tierId, stage: record.stage });
        else if (record.systemId && record.stage) state.standings.set(record.systemId, Object.assign({ tierId: "" }, state.standings.get(record.systemId) || {}, { stage: record.stage }));
        if (record.condition) state.condition = record.condition;
        if (record.holdings) state.holdings = record.holdings;
        if (record.revealed) state.revealed.push({ chapter: chapters[entry.index], text: record.revealed });
        state.lastIndex = entry.index;
        state.records += 1;
      });
      var list = Array.from(states.values()).sort(function (a, b) { return b.lastIndex - a.lastIndex; }).map(function (state) {
        var standings = [];
        systems.forEach(function (system) {
          var standing = state.standings.get(system.id);
          if (!standing) return;
          var rank = rankIn.get(system.id).get(standing.tierId);
          standings.push({ systemId: system.id, system: system.name, tier: rank !== undefined ? system.tiers[rank].name : standing.tierId, stage: standing.stage, rank: rank !== undefined ? rank : -1 });
        });
        return Object.assign({}, state, {
          name: characters.has(state.characterId) ? characters.get(state.characterId).name : state.characterId,
          standings: standings,
        });
      });
      var warnedRecords = {};
      warnings.forEach(function (warning) { (warnedRecords[warning.recordId] = warnedRecords[warning.recordId] || []).push(warning.code); });
      return { chapters: chapters, currentIndex: current, asOfIndex: asOfIndex, position: position, systemById: systemById, states: list, warnings: warnings, warnedRecords: warnedRecords };
    }

    function TierRow(props) {
      var tier = props.tier;
      var t = props.t;
      function set(key, value) { props.onUpdate(function (item) { item[key] = value; }); }
      return React.createElement("details", { className: "dshwnw-node" },
        React.createElement("summary", null,
          React.createElement(NwIcon, { name: "chevron", size: 14, className: "dshwnw-chevron" }),
          React.createElement("span", { className: "dshwnw-node-copy" },
            React.createElement("span", { className: "dshwnw-node-title", "data-empty": tier.name ? undefined : "true" }, (props.index + 1) + ". " + (tier.name || t("unnamedTier"))),
            tier.stages ? React.createElement("span", { className: "dshwnw-card-subtitle" }, tier.stages) : null
          ),
          React.createElement(IconButton, { icon: "up", label: t("moveUp"), disabled: props.index === 0, onClick: function () { props.onMove(-1); } }),
          React.createElement(IconButton, { icon: "down", label: t("moveDown"), disabled: props.last, onClick: function () { props.onMove(1); } }),
          React.createElement(IconButton, { icon: "trash", danger: true, label: t("delete"), onClick: props.onDelete })
        ),
        React.createElement("div", { className: "dshwnw-node-body" },
          React.createElement("div", { className: "dshwnw-grid" },
            React.createElement(InputField, { label: t("tierName"), value: tier.name, onChange: function (v) { set("name", v); } }),
            React.createElement(InputField, { label: t("tierStages"), value: tier.stages, placeholder: t("tierStagesPlaceholder"), onChange: function (v) { set("stages", v); } })
          ),
          React.createElement(TextField, { label: t("tierAdvance"), value: tier.advance, rows: 2, onChange: function (v) { set("advance", v); } }),
          React.createElement(TextField, { label: t("tierCost"), value: tier.cost, rows: 2, onChange: function (v) { set("cost", v); } }),
          React.createElement(TextField, { label: t("tierGap"), value: tier.gap, rows: 2, onChange: function (v) { set("gap", v); } }),
          React.createElement(TextField, { label: t("tierNotes"), value: tier.notes, rows: 2, onChange: function (v) { set("notes", v); } })
        )
      );
    }

    // Edits one ordered tier ladder; `onChange` receives a mutator of the array.
    function TierListEditor(props) {
      var t = props.t;
      var tiers = props.tiers || [];
      return React.createElement(React.Fragment, null,
        tiers.length === 0 ? React.createElement("div", { className: "dshwnw-empty" }, t("tiersEmpty")) : React.createElement("div", { className: "dshwnw-outline-list" }, tiers.map(function (tier, index) {
          return React.createElement(TierRow, {
            key: tier.id, tier: tier, index: index, last: index === tiers.length - 1, t: t,
            onUpdate: function (mutate) { props.onChange(function (list) { var item = list.find(function (entry) { return entry.id === tier.id; }); if (item) mutate(item); }); },
            onMove: function (delta) { props.onChange(function (list) { var from = list.findIndex(function (entry) { return entry.id === tier.id; }); var to = from + delta; if (from < 0 || to < 0 || to >= list.length) return; var moved = list.splice(from, 1)[0]; list.splice(to, 0, moved); }); },
            onDelete: function () { props.onChange(function (list) { var at = list.findIndex(function (entry) { return entry.id === tier.id; }); if (at >= 0) list.splice(at, 1); }); },
          });
        })),
        React.createElement(AddButton, { onClick: function () { props.onChange(function (list) { list.push(emptyTier()); }); } }, t("addTier"))
      );
    }

    function SystemCard(props) {
      var system = props.system;
      var t = props.t;
      function set(key, value) { props.onUpdate(function (item) { item[key] = value; }); }
      return React.createElement("details", { className: "dshwnw-node", open: props.open, onToggle: function (event) { if (event.currentTarget.open !== props.open) props.onToggle(event.currentTarget.open); } },
        React.createElement("summary", null,
          React.createElement(NwIcon, { name: "chevron", size: 14, className: "dshwnw-chevron" }),
          React.createElement("span", { className: "dshwnw-node-copy" },
            React.createElement("span", { className: "dshwnw-node-title", "data-empty": system.name ? undefined : "true" }, system.name || t("unnamedSystem")),
            React.createElement("span", { className: "dshwnw-card-subtitle" }, (system.tiers || []).length === 0 ? t("tiersEmpty") : (system.tiers || []).map(function (tier) { return tier.name || "?"; }).join(" → "))
          ),
          React.createElement(IconButton, { icon: "file", label: t("saveAsTemplate"), disabled: !props.canSaveTemplate || !system.name, onClick: props.onSaveTemplate }),
          React.createElement(IconButton, { icon: "up", label: t("moveUp"), disabled: props.index === 0, onClick: function () { props.onMove(-1); } }),
          React.createElement(IconButton, { icon: "down", label: t("moveDown"), disabled: props.last, onClick: function () { props.onMove(1); } }),
          React.createElement(IconButton, { icon: "trash", danger: true, label: t("delete"), onClick: props.onDelete })
        ),
        props.open ? React.createElement("div", { className: "dshwnw-node-body" },
          props.recordCount > 0 ? React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, t("systemInUse").replace("{n}", props.recordCount)) : null,
          React.createElement(InputField, { label: t("systemName"), value: system.name, placeholder: t("systemNamePlaceholder"), onChange: function (v) { set("name", v); } }),
          React.createElement(TextField, { label: t("systemNotes"), value: system.notes, rows: 2, onChange: function (v) { set("notes", v); } }),
          React.createElement("div", { className: "dshwnw-divider" }, t("tiersTitle")),
          React.createElement(TierListEditor, { tiers: system.tiers, t: t, onChange: function (mutate) { props.onUpdate(function (item) { item.tiers = item.tiers || []; mutate(item.tiers); }); } })
        ) : null
      );
    }

    // The shared template library. Edits go straight to the plugin's own
    // template store (not to this book's draft), so they apply to every book.
    function TemplateLibrary(props) {
      var t = props.t;
      var library = props.library;
      var editSlot = React.useState(null);
      var editing = editSlot[0];
      var setEditing = editSlot[1];
      var armedSlot = React.useState("");
      var armed = armedSlot[0];
      var setArmed = armedSlot[1];
      if (library.status === "loading") return React.createElement("div", { className: "dshwnw-empty" }, t("loading"));
      if (library.status === "error") return React.createElement("div", { className: "dshwnw-warning" }, t("templatesFailed") + ": " + library.error);
      function startEdit(template) { setArmed(""); setEditing(clone(template)); }
      function saveEdit() {
        props.onSave(editing).then(function (ok) { if (ok) setEditing(null); });
      }
      var editor = editing ? React.createElement("div", { className: "dshwnw-card" },
        React.createElement("div", { className: "dshwnw-section-title" }, editing.id ? t("editTemplate") : t("newTemplate")),
        React.createElement(InputField, { label: t("templateName"), value: editing.name, onChange: function (v) { setEditing(Object.assign({}, editing, { name: v })); } }),
        React.createElement(TextField, { label: t("templateDescription"), value: editing.description, rows: 2, onChange: function (v) { setEditing(Object.assign({}, editing, { description: v })); } }),
        React.createElement("div", { className: "dshwnw-divider" }, t("tiersTitle")),
        React.createElement(TierListEditor, { tiers: editing.tiers, t: t, onChange: function (mutate) { var next = clone(editing); next.tiers = next.tiers || []; mutate(next.tiers); setEditing(next); } }),
        React.createElement("div", { className: "dshwnw-actions" },
          React.createElement("button", { type: "button", className: "dshwnw-primary", disabled: props.busy || !String(editing.name || "").trim(), onClick: saveEdit }, t("saveTemplate")),
          React.createElement("button", { type: "button", className: "dshwnw-button", disabled: props.busy, onClick: function () { setEditing(null); } }, t("cancel"))
        )
      ) : null;
      return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, t("templatesHint")),
        editor,
        React.createElement("div", { className: "dshwnw-outline-list" }, library.templates.map(function (template) {
          var isArmed = armed === template.id;
          return React.createElement("div", { key: template.id, className: "dshwnw-card dshwnw-template" },
            React.createElement("div", { className: "dshwnw-card-head" },
              React.createElement("span", { className: "dshwnw-node-title" }, template.name || t("unnamedSystem")),
              template.builtIn ? React.createElement("span", { className: "dshwnw-pill", "data-tone": "plain" }, t("builtIn")) : null
            ),
            template.description ? React.createElement("div", { className: "dshwnw-card-subtitle" }, template.description) : null,
            React.createElement("div", { className: "dshwnw-cstate-line" }, (template.tiers || []).map(function (tier) { return tier.name; }).join(" → ") || t("tiersEmpty")),
            isArmed ? React.createElement("div", { className: "dshwnw-warning" }, t("deleteTemplateConfirm").replace("{name}", template.name)) : null,
            React.createElement("div", { className: "dshwnw-actions" },
              props.onApply ? React.createElement("button", { type: "button", className: "dshwnw-primary", disabled: props.busy, onClick: function () { props.onApply(template); } }, t("useTemplate")) : null,
              React.createElement("button", { type: "button", className: "dshwnw-button", disabled: props.busy, onClick: function () { startEdit(template); } }, t("editTemplate")),
              React.createElement("button", { type: "button", className: "dshwnw-danger", disabled: props.busy, onClick: function () {
                if (!isArmed) { setArmed(template.id); return; }
                setArmed("");
                props.onDelete(template.id);
              } }, isArmed ? t("confirmDelete") : t("delete")),
              isArmed ? React.createElement("button", { type: "button", className: "dshwnw-button", onClick: function () { setArmed(""); } }, t("cancel")) : null
            )
          );
        })),
        armed === "__restore__" ? React.createElement("div", { className: "dshwnw-warning" }, t("restoreTemplatesConfirm")) : null,
        React.createElement("div", { className: "dshwnw-actions" },
          React.createElement("button", { type: "button", className: "dshwnw-button", disabled: props.busy, onClick: function () { startEdit({ id: "", name: "", description: "", tiers: [] }); } }, t("newTemplate")),
          React.createElement("button", { type: "button", className: "dshwnw-button", disabled: props.busy, onClick: function () {
            if (armed !== "__restore__") { setArmed("__restore__"); return; }
            setArmed("");
            props.onRestore();
          } }, armed === "__restore__" ? t("confirmRestore") : t("restoreTemplates")),
          armed === "__restore__" ? React.createElement("button", { type: "button", className: "dshwnw-button", onClick: function () { setArmed(""); } }, t("cancel")) : null
        )
      );
    }

    function RecordRow(props) {
      var record = props.record;
      var t = props.t;
      var view = props.view;
      var systems = props.systems;
      function set(key, value) { props.onUpdate(function (item) { item[key] = value; }); }
      var character = props.characters.find(function (item) { return item.id === record.characterId; });
      var index = view.position.has(record.chapterId) ? view.position.get(record.chapterId) : -1;
      var system = view.systemById.get(record.systemId);
      var tier = system && record.tierId ? (system.tiers || []).find(function (item) { return item.id === record.tierId; }) : null;
      var codes = view.warnedRecords[record.id] || [];
      var summary = [
        record.systemId && (record.tierId || record.stage) ? (system ? system.name : record.systemId) + " " + [tier ? tier.name : record.tierId, record.stage].filter(Boolean).join(" ") : "",
        record.condition, record.revealed ? t("revealedShort") + record.revealed : "",
      ].filter(Boolean).join(" · ");
      return React.createElement("details", { className: "dshwnw-node", open: props.open, onToggle: function (event) { if (event.currentTarget.open !== props.open) props.onToggle(event.currentTarget.open); } },
        React.createElement("summary", null,
          React.createElement(NwIcon, { name: "chevron", size: 14, className: "dshwnw-chevron" }),
          React.createElement("span", { className: "dshwnw-node-copy" },
            React.createElement("span", { className: "dshwnw-node-title" }, (index >= 0 ? chapterShort(view.chapters[index]) : t("missingChapter")) + " · " + (character ? character.name || t("unnamedCharacter") : t("missingCharacter"))),
            summary ? React.createElement("span", { className: "dshwnw-card-subtitle" }, summary) : null
          ),
          codes.length ? React.createElement("span", { className: "dshwnw-pill", "data-tone": "danger" }, t("pwarnBadge")) : null,
          React.createElement(IconButton, { icon: "trash", danger: true, label: t("delete"), onClick: props.onDelete })
        ),
        props.open ? React.createElement("div", { className: "dshwnw-node-body" },
          codes.length ? React.createElement("div", { className: "dshwnw-warning" }, codes.map(function (code) { return t("pwarn_" + code); }).join(" ")) : null,
          React.createElement("div", { className: "dshwnw-grid" },
            React.createElement(SelectField, { label: t("recordCharacter"), value: record.characterId, empty: t("chooseCharacter"), options: props.characters.map(function (item) { return { value: item.id, label: item.name || t("unnamedCharacter") }; }), onChange: function (v) { set("characterId", v); } }),
            React.createElement(ChapterSelect, { label: t("recordChapter"), value: record.chapterId, chapters: view.chapters, currentIndex: view.currentIndex, t: t, onChange: function (v) { set("chapterId", v); } })
          ),
          React.createElement("div", { className: "dshwnw-grid dshwnw-grid-3" },
            React.createElement(SelectField, { label: t("recordSystem"), value: record.systemId, empty: t("noSystemChange"), options: systems.map(function (item) { return { value: item.id, label: item.name || t("unnamedSystem") }; }), onChange: function (v) { props.onUpdate(function (item) { item.systemId = v; item.tierId = ""; item.stage = ""; }); } }),
            React.createElement(SelectField, { label: t("recordTier"), value: record.tierId, empty: t("tierUnchanged"), options: (system ? system.tiers || [] : []).map(function (item) { return { value: item.id, label: item.name || t("unnamedTier") }; }), onChange: function (v) { set("tierId", v); } }),
            React.createElement(InputField, { label: t("recordStage"), value: record.stage, onChange: function (v) { set("stage", v); } })
          ),
          React.createElement(TextField, { label: t("recordCondition"), value: record.condition, rows: 2, onChange: function (v) { set("condition", v); } }),
          React.createElement(TextField, { label: t("recordHoldings"), value: record.holdings, rows: 2, onChange: function (v) { set("holdings", v); } }),
          React.createElement(TextField, { label: t("recordRevealed"), value: record.revealed, rows: 2, onChange: function (v) { set("revealed", v); } }),
          React.createElement("div", { className: "dshwnw-grid" },
            React.createElement(TextField, { label: t("recordGained"), value: record.gained, rows: 2, onChange: function (v) { set("gained", v); } }),
            React.createElement(TextField, { label: t("recordLost"), value: record.lost, rows: 2, onChange: function (v) { set("lost", v); } })
          ),
          React.createElement(TextField, { label: t("recordNote"), value: record.note, rows: 2, onChange: function (v) { set("note", v); } })
        ) : null
      );
    }

    function ProgressionTab(props) {
      var t = props.t;
      var project = props.project;
      var writer = props.writer;
      var progression = project.progression || { systems: [], records: [] };
      var systems = progression.systems || [];
      var records = progression.records || [];
      var asOfSlot = React.useState("");
      var asOf = asOfSlot[0];
      var setAsOf = asOfSlot[1];
      var filterSlot = React.useState("");
      var filterCharacter = filterSlot[0];
      var setFilterCharacter = filterSlot[1];
      var openSlot = React.useState({});
      var openIds = openSlot[0];
      var setOpenIds = openSlot[1];
      var librarySlot = React.useState({ status: "loading", templates: [], error: "" });
      var library = librarySlot[0];
      var setLibrary = librarySlot[1];
      var busySlot = React.useState(false);
      var libraryBusy = busySlot[0];
      var setLibraryBusy = busySlot[1];
      var hintSlot = React.useState(null);
      var hint = hintSlot[0];
      var setHint = hintSlot[1];
      var aliveRef = React.useRef(true);
      function setOpen(id, value) { setOpenIds(function (current) { var next = Object.assign({}, current); next[id] = value; return next; }); }
      var canTemplates = Boolean(writer && typeof writer.getProgressionTemplates === "function");

      React.useEffect(function () {
        aliveRef.current = true;
        if (!canTemplates) { setLibrary({ status: "error", templates: [], error: "unavailable" }); return function () { aliveRef.current = false; }; }
        writer.getProgressionTemplates().then(
          function (value) { if (aliveRef.current) setLibrary({ status: "ready", templates: value.templates || [], error: "" }); },
          function (error) { if (aliveRef.current) setLibrary({ status: "error", templates: [], error: failureText(error) }); }
        );
        return function () { aliveRef.current = false; };
      }, [writer]);

      function libraryCall(run, successText) {
        setLibraryBusy(true);
        setHint(null);
        return run().then(
          function (value) {
            if (!aliveRef.current) return false;
            setLibraryBusy(false);
            setLibrary({ status: "ready", templates: value.templates || [], error: "" });
            setHint({ kind: "success", text: successText });
            return true;
          },
          function (error) {
            if (!aliveRef.current) return false;
            setLibraryBusy(false);
            setHint({ kind: "error", text: failureText(error) });
            return false;
          }
        );
      }

      var view = analyzeProgressionView(project, asOf);
      var asOfChapter = view.asOfIndex >= 0 ? view.chapters[view.asOfIndex] : null;
      var characters = project.characters || [];
      var recordCounts = {};
      records.forEach(function (record) { recordCounts[record.systemId] = (recordCounts[record.systemId] || 0) + 1; });
      var visibleRecords = records
        .map(function (record, order) { return { record: record, order: order, index: view.position.has(record.chapterId) ? view.position.get(record.chapterId) : Infinity }; })
        .filter(function (entry) { return !filterCharacter || entry.record.characterId === filterCharacter; })
        .sort(function (a, b) { return a.index - b.index || a.order - b.order; });

      function addSystem(system) {
        props.onUpdate(function (next) { next.systems.push(system); });
        setOpen(system.id, true);
      }
      function addRecord() {
        var id = makeId("record");
        var current = view.currentIndex >= 0 ? view.chapters[view.currentIndex] : view.chapters[0];
        props.onUpdate(function (next) {
          next.records.push(Object.assign(emptyRecord(), { id: id, characterId: filterCharacter || (characters[0] ? characters[0].id : ""), chapterId: current ? current.id : "" }));
        });
        setOpen(id, true);
      }

      return React.createElement("div", { className: "dshwnw-section" },
        React.createElement("div", { className: "dshwnw-section-title" }, t("progressionTitle")),
        React.createElement("div", { className: "dshwnw-section-hint" }, t("progressionHint")),
        view.warnings.length > 0 ? React.createElement("div", { className: "dshwnw-warning" }, t("pwarnSummary").replace("{n}", view.warnings.length)) : null,
        hint ? React.createElement("div", { className: hint.kind === "error" ? "dshwnw-warning" : "dshwnw-cursor" }, hint.text) : null,

        React.createElement(FieldGroup, { title: t("systemsTitle"), count: systems.length || undefined },
          systems.length === 0 ? React.createElement("div", { className: "dshwnw-empty" }, t("systemsEmpty")) : React.createElement("div", { className: "dshwnw-outline-list" }, systems.map(function (system, index) {
            return React.createElement(SystemCard, {
              key: system.id, system: system, index: index, last: index === systems.length - 1, t: t,
              recordCount: recordCounts[system.id] || 0, canSaveTemplate: canTemplates && !libraryBusy,
              open: Boolean(openIds[system.id]), onToggle: function (value) { setOpen(system.id, value); },
              onUpdate: function (mutate) { props.onUpdate(function (next) { var item = next.systems.find(function (entry) { return entry.id === system.id; }); if (item) mutate(item); }); },
              onMove: function (delta) { props.onUpdate(function (next) { var from = next.systems.findIndex(function (entry) { return entry.id === system.id; }); var to = from + delta; if (from < 0 || to < 0 || to >= next.systems.length) return; var moved = next.systems.splice(from, 1)[0]; next.systems.splice(to, 0, moved); }); },
              onDelete: function () { props.onUpdate(function (next) { next.systems = next.systems.filter(function (entry) { return entry.id !== system.id; }); }); },
              onSaveTemplate: function () {
                libraryCall(function () { return writer.saveProgressionTemplate({ name: system.name, description: system.notes, tiers: system.tiers || [] }); }, t("templateSaved").replace("{name}", system.name));
              },
            });
          })),
          React.createElement(AddButton, { onClick: function () { addSystem(systemFromTemplateClient({ name: "", tiers: [] }, systems)); } }, t("addSystem"))
        ),

        React.createElement(FieldGroup, { title: t("templatesTitle"), count: library.templates.length || undefined, collapsed: systems.length > 0 },
          React.createElement(TemplateLibrary, {
            t: t, library: library, busy: libraryBusy,
            onApply: function (template) { addSystem(systemFromTemplateClient(template, systems)); setHint({ kind: "success", text: t("templateApplied").replace("{name}", template.name) }); },
            onSave: function (template) { return libraryCall(function () { return writer.saveProgressionTemplate(template); }, t("templateSaved").replace("{name}", template.name)); },
            onDelete: function (id) { libraryCall(function () { return writer.deleteProgressionTemplate(id); }, t("templateDeleted")); },
            onRestore: function () { libraryCall(function () { return writer.restoreProgressionTemplates(); }, t("templatesRestored")); },
          })
        ),

        React.createElement(FieldGroup, { title: t("statesTitle"), count: view.states.length || undefined },
          React.createElement(ChapterSelect, { label: t("statesAsOf"), value: asOf, chapters: view.chapters, currentIndex: view.currentIndex, t: t, onChange: setAsOf }),
          React.createElement("div", { className: "dshwnw-cursor" }, asOfChapter ? t("statesAsOfLabel").replace("{chapter}", chapterLong(asOfChapter)) : t("statesAsOfAll")),
          view.states.length === 0
            ? React.createElement("div", { className: "dshwnw-empty" }, t("statesEmpty"))
            : React.createElement("div", { className: "dshwnw-outline-list" }, view.states.map(function (state) {
              return React.createElement("div", { key: state.characterId, className: "dshwnw-card dshwnw-cstate" },
                React.createElement("div", { className: "dshwnw-card-head" },
                  React.createElement("span", { className: "dshwnw-node-title" }, state.name || t("unnamedCharacter"))
                ),
                state.standings.length ? React.createElement("div", { className: "dshwnw-standings" }, state.standings.map(function (standing) {
                  return React.createElement("span", { key: standing.systemId, className: "dshwnw-pill", "data-tone": standing.rank >= 0 ? "active" : "plain" }, standing.system + " · " + ([standing.tier, standing.stage].filter(Boolean).join(" ") || "?"));
                })) : null,
                state.condition ? React.createElement("div", { className: "dshwnw-cstate-line" }, React.createElement("b", null, t("recordCondition")), state.condition) : null,
                state.holdings ? React.createElement("div", { className: "dshwnw-cstate-line" }, React.createElement("b", null, t("recordHoldings")), state.holdings) : null,
                state.revealed.length ? React.createElement("div", { className: "dshwnw-cstate-line" }, React.createElement("b", null, t("recordRevealed")),
                  state.revealed.map(function (item, index) { return (index ? "；" : "") + item.text + (item.chapter ? "（" + chapterShort(item.chapter) + "）" : ""); }).join("")) : null,
                React.createElement("div", { className: "dshwnw-card-subtitle" }, t("statesLastChange").replace("{chapter}", state.lastIndex >= 0 ? chapterLong(view.chapters[state.lastIndex]) : "—").replace("{n}", state.records))
              );
            }))
        ),

        React.createElement(FieldGroup, { title: t("recordsTitle"), count: records.length || undefined },
          React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, t("recordsHint")),
          characters.length === 0 || view.chapters.length === 0
            ? React.createElement("div", { className: "dshwnw-empty" }, t("recordsNeedSetup"))
            : React.createElement(React.Fragment, null,
              records.length > 0 ? React.createElement(SelectField, { label: t("recordsFilter"), value: filterCharacter, empty: t("recordsAll"), options: characters.map(function (item) { return { value: item.id, label: item.name || t("unnamedCharacter") }; }), onChange: setFilterCharacter }) : null,
              visibleRecords.length === 0
                ? React.createElement("div", { className: "dshwnw-empty" }, t("recordsEmpty"))
                : React.createElement("div", { className: "dshwnw-outline-list" }, visibleRecords.map(function (entry) {
                  var record = entry.record;
                  return React.createElement(RecordRow, {
                    key: record.id, record: record, view: view, systems: systems, characters: characters, t: t,
                    open: Boolean(openIds[record.id]), onToggle: function (value) { setOpen(record.id, value); },
                    onUpdate: function (mutate) { props.onUpdate(function (next) { var item = next.records.find(function (candidate) { return candidate.id === record.id; }); if (item) mutate(item); }); },
                    onDelete: function () { props.onUpdate(function (next) { next.records = next.records.filter(function (candidate) { return candidate.id !== record.id; }); }); },
                  });
                })),
              React.createElement(AddButton, { onClick: addRecord }, t("addRecord")))
        )
      );
    }

    // ── version history ─────────────────────────────────────────────────
    var SECTION_ORDER = ["project", "genreProfile", "characters", "relationships", "world", "plot", "volumes", "chapters", "threads", "progressionSystems", "progressionRecords", "scene", "progress"];
    var FIELD_LABEL_KEYS = {
      project: { title: "bookTitle", styleCorpusId: "corpusField" },
      scene: { time: "sceneTime", goal: "sceneGoal", conflict: "sceneConflict", outcome: "sceneOutcome", povCharacterId: "scenePov" },
      plot: { stakes: "plotStakes", conflicts: "worldConflicts" },
      world: { conflicts: "worldConflicts" },
    };

    function fieldLabel(section, field, t) {
      var key = (FIELD_LABEL_KEYS[section] || {})[field] || field;
      var label = t(key);
      return label === key ? field : label;
    }

    // "角色 +1 −1 ~2 · 世界 3 项"
    function describeChanges(changes, t) {
      if (!Array.isArray(changes) || changes.length === 0) return "";
      return changes.slice().sort(function (a, b) { return SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section); }).map(function (change) {
        var name = t("section_" + change.section);
        if (change.fields && change.added === undefined) return name + " " + t("fieldsChanged").replace("{n}", change.changed);
        var parts = [];
        if (change.added) parts.push("+" + change.added);
        if (change.removed) parts.push("−" + change.removed);
        if (change.changed) parts.push("~" + change.changed);
        if (change.reordered) parts.push(t("reordered"));
        return name + " " + parts.join(" ");
      }).join(" · ");
    }

    function operationLabel(entry, t) {
      if (!entry) return "";
      if (entry.operation === "restore") return t("op_restore").replace("{n}", entry.restoredFrom);
      var key = "op_" + entry.operation;
      var label = t(key);
      return label === key ? entry.operation : label;
    }

    function relativeTime(iso, t) {
      var time = Date.parse(iso);
      if (!time) return "";
      var seconds = Math.round((Date.now() - time) / 1000);
      if (seconds < 45) return t("justNow");
      if (seconds < 3600) return t("minutesAgo").replace("{n}", Math.round(seconds / 60));
      if (seconds < 86400) return t("hoursAgo").replace("{n}", Math.round(seconds / 3600));
      var date = new Date(time);
      function pad(value) { return String(value).padStart(2, "0"); }
      return (date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
    }

    function ActorPill(props) {
      var actor = props.actor === "ai" ? "ai" : props.actor === "baseline" ? "baseline" : "user";
      return React.createElement("span", { className: "dshwnw-actor", "data-actor": actor }, props.t("actor_" + actor));
    }

    function SnapshotDiff(props) {
      var t = props.t;
      if (props.sections.length === 0) return React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, t("snapshotSame"));
      return React.createElement("div", { className: "dshwnw-diff" }, props.sections.map(function (change) {
        var rows = [];
        (change.values || []).forEach(function (value) {
          rows.push(React.createElement("div", { className: "dshwnw-diff-value", key: "v" + value.field },
            React.createElement("b", null, fieldLabel(change.section, value.field, t)),
            React.createElement("span", { className: "dshwnw-diff-before" }, value.before || t("emptyValue")),
            React.createElement("span", { className: "dshwnw-diff-arrow", "aria-hidden": true }, "→"),
            React.createElement("span", { className: "dshwnw-diff-after" }, value.after || t("emptyValue"))
          ));
        });
        if (change.fields && !change.values) rows.push(React.createElement("div", { className: "dshwnw-diff-line", key: "f" }, change.fields.map(function (field) { return fieldLabel(change.section, field, t); }).join("、")));
        (change.addedItems || []).forEach(function (label, index) { rows.push(React.createElement("div", { className: "dshwnw-diff-line", "data-kind": "added", key: "a" + index }, "+ " + label)); });
        (change.removedItems || []).forEach(function (label, index) { rows.push(React.createElement("div", { className: "dshwnw-diff-line", "data-kind": "removed", key: "r" + index }, "− " + label)); });
        (change.changedItems || []).forEach(function (item, index) {
          rows.push(React.createElement("div", { className: "dshwnw-diff-line", "data-kind": "changed", key: "c" + index }, "~ " + item.label + "：" + item.fields.map(function (field) { return fieldLabel(change.section, field, t); }).join("、")));
        });
        if (change.reordered) rows.push(React.createElement("div", { className: "dshwnw-diff-line", key: "o" }, t("reorderedLong")));
        return React.createElement("div", { className: "dshwnw-diff-section", key: change.section },
          React.createElement("div", { className: "dshwnw-diff-title" }, t("section_" + change.section)),
          rows
        );
      }));
    }

    function HistoryPanel(props) {
      var t = props.t;
      var writer = props.writer;
      var listSlot = React.useState({ status: "loading", entries: [], limit: 0 });
      var list = listSlot[0];
      var setList = listSlot[1];
      var openSlot = React.useState(null);
      var open = openSlot[0];
      var setOpen = openSlot[1];
      var compareSlot = React.useState({});
      var compares = compareSlot[0];
      var setCompares = compareSlot[1];
      var armedSlot = React.useState(null);
      var armed = armedSlot[0];
      var setArmed = armedSlot[1];
      var restoringSlot = React.useState(false);
      var restoring = restoringSlot[0];
      var setRestoring = restoringSlot[1];
      var available = Boolean(writer && typeof writer.listHistory === "function");
      React.useEffect(function () {
        if (!available) return;
        var stopped = false;
        writer.listHistory(props.workspaceId).then(function (value) {
          if (!stopped) { setList({ status: "ready", entries: value.entries || [], limit: value.limit || 0 }); setCompares({}); }
        }).catch(function (error) {
          if (!stopped) setList({ status: "error", entries: [], limit: 0, error: failureText(error) });
        });
        return function () { stopped = true; };
      }, [props.workspaceId, props.revision]);
      function toggle(revision) {
        setArmed(null);
        if (open === revision) { setOpen(null); return; }
        setOpen(revision);
        if (revision === props.revision || compares[revision]) return;
        setCompares(function (all) { var next = Object.assign({}, all); next[revision] = { status: "loading" }; return next; });
        writer.compareSnapshot(props.workspaceId, revision).then(function (value) {
          setCompares(function (all) { var next = Object.assign({}, all); next[revision] = { status: "ready", sections: value.sections || [] }; return next; });
        }).catch(function (error) {
          setCompares(function (all) { var next = Object.assign({}, all); next[revision] = { status: "error", error: failureText(error) }; return next; });
        });
      }
      function restore(revision) {
        setRestoring(true);
        writer.restoreSnapshot(props.workspaceId, revision, props.revision).then(function (next) {
          setRestoring(false);
          setArmed(null);
          setOpen(null);
          props.onRestored(next, revision);
        }).catch(function (error) {
          setRestoring(false);
          props.onError(t("restoreFailed") + ": " + failureText(error));
        });
      }
      if (!available) return null;
      return React.createElement("div", { className: "dshwnw-history" },
        list.status === "loading" ? React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, t("loading")) : null,
        list.status === "error" ? React.createElement("div", { className: "dshwnw-warning" }, list.error) : null,
        list.status === "ready" && list.entries.length === 0 ? React.createElement("div", { className: "dshwnw-empty" }, t("historyEmpty")) : null,
        list.entries.map(function (entry) {
          var current = entry.revision === props.revision;
          var expanded = open === entry.revision;
          var compare = compares[entry.revision];
          return React.createElement("div", { className: "dshwnw-history-item", key: entry.revision, "data-open": expanded ? "true" : undefined, "data-current": current ? "true" : undefined },
            React.createElement("button", { type: "button", className: "dshwnw-history-row", "aria-expanded": expanded, onClick: function () { toggle(entry.revision); } },
              React.createElement("span", { className: "dshwnw-history-rev" }, "r" + entry.revision),
              React.createElement("span", { className: "dshwnw-list-copy" },
                React.createElement("span", { className: "dshwnw-history-title" },
                  React.createElement(ActorPill, { actor: entry.actor, t: t }),
                  React.createElement("span", { className: "dshwnw-history-op" }, operationLabel(entry, t)),
                  current ? React.createElement("span", { className: "dshwnw-pill", "data-tone": "active" }, t("historyCurrent")) : null
                ),
                React.createElement("span", { className: "dshwnw-list-meta" }, [relativeTime(entry.at, t), describeChanges(entry.changes, t)].filter(Boolean).join(" · "))
              ),
              React.createElement(NwIcon, { name: "chevron", size: 14, className: "dshwnw-chevron" })
            ),
            expanded ? React.createElement("div", { className: "dshwnw-history-body" },
              current
                ? React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, t("historyIsCurrent"))
                : React.createElement(React.Fragment, null,
                  React.createElement("div", { className: "dshwnw-subtitle" }, t("restoreWould").replace("{n}", entry.revision)),
                  !compare || compare.status === "loading" ? React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, t("loading"))
                    : compare.status === "error" ? React.createElement("div", { className: "dshwnw-warning" }, compare.error)
                    : React.createElement(SnapshotDiff, { sections: compare.sections, t: t }),
                  props.locked ? React.createElement("div", { className: "dshwnw-warning" }, t("settingsDirty")) : null,
                  armed === entry.revision
                    ? React.createElement("div", { className: "dshwnw-confirm" },
                      React.createElement("span", null, t("restoreConfirm")),
                      React.createElement("div", { className: "dshwnw-setting-actions" },
                        React.createElement("button", { type: "button", className: "dshwnw-button", disabled: restoring, onClick: function () { setArmed(null); } }, t("cancel")),
                        React.createElement("button", { type: "button", className: "dshwnw-primary", disabled: restoring || props.locked, onClick: function () { restore(entry.revision); } }, restoring ? t("working") : t("restoreAction").replace("{n}", entry.revision))
                      ))
                    : React.createElement("div", { className: "dshwnw-setting-actions" },
                      React.createElement("button", { type: "button", className: "dshwnw-button", disabled: props.locked || !compare || compare.status !== "ready" || compare.sections.length === 0, onClick: function () { setArmed(entry.revision); } },
                        React.createElement(NwIcon, { name: "undo", size: 14 }), t("restoreAction").replace("{n}", entry.revision)))
                )
            ) : null
          );
        }),
        list.limit ? React.createElement("div", { className: "dshwnw-legend" }, t("historyLimitHint").replace("{n}", list.limit)) : null
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

    function BindingSettings(props) {
      var t = props.t;
      var library = props.library;
      var switchingSlot = React.useState(false);
      var switching = switchingSlot[0];
      var setSwitching = switchingSlot[1];
      var armedSlot = React.useState(false);
      var armed = armedSlot[0];
      var setArmed = armedSlot[1];
      var binding = library.binding;
      var current = library.novels.find(function (novel) { return binding && novel.handle === binding.handle; }) || (binding ? { id: binding.novelId, handle: binding.handle, title: binding.title, folder: binding.folder } : null);
      return React.createElement("div", { className: "dshwnw-library" },
        React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, t("libBindingHint")),
        current ? React.createElement(NovelCard, { novel: current, t: t, current: true }) : null,
        React.createElement("div", { className: "dshwnw-actions" },
          React.createElement("button", { type: "button", className: "dshwnw-button", onClick: function () { setSwitching(!switching); setArmed(false); } }, switching ? t("cancel") : t("libSwitch")),
          armed
            ? React.createElement("button", { type: "button", className: "dshwnw-danger", disabled: library.busy, onClick: function () { setArmed(false); library.onUnbind(); } }, t("libUnbindConfirm"))
            : React.createElement("button", { type: "button", className: "dshwnw-button", disabled: library.busy, onClick: function () { setArmed(true); } }, t("libUnbind"))
        ),
        armed ? React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, t("libUnbindHint")) : null,
        switching ? React.createElement(NovelLibrary, Object.assign({ t: t, mode: "settings", currentHandle: binding ? binding.handle : "" }, library)) : null
      );
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
        props.library ? React.createElement(FieldGroup, { title: props.t("libThisConversation") },
          React.createElement(BindingSettings, { t: props.t, library: props.library })
        ) : null,
        React.createElement(FieldGroup, { title: props.t("historyTitle") },
          React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, props.t("historyHint")),
          React.createElement(HistoryPanel, {
            t: props.t, writer: props.writer, workspaceId: props.workspaceId, revision: props.revision, locked: locked,
            onRestored: props.onRestored, onError: props.onError,
          })
        ),
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
      if (name === "progression") {
        var progression = project.progression || { systems: [], records: [] };
        return (progression.systems || []).length === 0 ? t("metaProgressionEmpty") : fill(t("metaProgression"), { r: progression.systems.length, n: (progression.records || []).length });
      }
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

    // ── novel library: which book this conversation writes ─────────────────
    function folderPreview(title) {
      var name = String(title || "").replace(/[\\/:*?"<>|\u0000-\u001f]+/g, " ").replace(/\s+/g, " ").trim().replace(/^[.\s]+|[.\s]+$/g, "").slice(0, 60).trim();
      return name || "未命名小说";
    }

    function NovelCard(props) {
      var t = props.t;
      var novel = props.novel;
      var meta = [
        novel.chapters ? t("libChapters").replace("{n}", novel.chapters) : "",
        novel.threads ? t("libThreads").replace("{n}", novel.threads) : "",
        novel.sessions ? t("libSessions").replace("{n}", novel.sessions) : "",
        novel.updatedAt ? relativeTime(novel.updatedAt, t) : "",
      ].filter(Boolean).join(" · ");
      return React.createElement("div", { className: "dshwnw-novel", "data-current": props.current ? "true" : undefined },
        React.createElement("span", { className: "dshwnw-novel-cover", style: { "--nw-hue": hueOf(novel.id) }, "aria-hidden": true }, (novel.title || "?").slice(0, 1)),
        React.createElement("span", { className: "dshwnw-list-copy" },
          React.createElement("span", { className: "dshwnw-novel-title" }, novel.title || novel.folder),
          React.createElement("span", { className: "dshwnw-novel-folder" }, React.createElement(NwIcon, { name: "folder", size: 12 }), novel.folder + "/"),
          meta ? React.createElement("span", { className: "dshwnw-list-meta" }, meta) : null
        ),
        props.current
          ? React.createElement("span", { className: "dshwnw-pill", "data-tone": "active" }, t("libCurrent"))
          : React.createElement("button", { type: "button", className: "dshwnw-button", disabled: props.disabled, onClick: props.onBind }, t("libBind"))
      );
    }

    function NovelLibrary(props) {
      var t = props.t;
      var titleSlot = React.useState("");
      var title = titleSlot[0];
      var setTitle = titleSlot[1];
      var creatingSlot = React.useState(props.novels.length === 0);
      var creating = creatingSlot[0];
      var setCreating = creatingSlot[1];
      var canAct = Boolean(props.sessionId) && !props.busy;
      var others = props.novels.filter(function (novel) { return novel.handle !== props.currentHandle; });
      return React.createElement("div", { className: "dshwnw-library" },
        props.mode === "picker" ? React.createElement(React.Fragment, null,
          React.createElement("div", { className: "dshwnw-library-hero" },
            React.createElement("span", { className: "dshwnw-library-icon", "aria-hidden": true }, React.createElement(IconQuill, null)),
            React.createElement("div", { className: "dshwnw-section-title" }, t("libPickTitle")),
            React.createElement("div", { className: "dshwnw-section-hint", style: { marginTop: 0 } }, t("libPickHint").replace("{workspace}", props.workspaceTitle))
          )
        ) : null,
        props.missing ? React.createElement("div", { className: "dshwnw-warning" }, t("libMissing").replace("{folder}", props.missing.folder || props.missing.novelId)) : null,
        !props.sessionId ? React.createElement("div", { className: "dshwnw-warning" }, t("libNoSession")) : null,
        others.length > 0
          ? React.createElement("div", { className: "dshwnw-library-list" },
            React.createElement("div", { className: "dshwnw-divider" }, props.mode === "picker" ? t("libExisting").replace("{n}", others.length) : t("libSwitchTo")),
            others.map(function (novel) {
              return React.createElement(NovelCard, { key: novel.handle, novel: novel, t: t, disabled: !canAct, onBind: function () { props.onBind(novel.id); } });
            }))
          : props.mode === "picker" ? React.createElement("div", { className: "dshwnw-empty" }, t("libEmpty")) : null,
        creating
          ? React.createElement("form", {
            className: "dshwnw-library-new",
            onSubmit: function (event) { event.preventDefault(); if (title.trim() && canAct) props.onCreate({ title: title.trim() }); },
          },
            React.createElement("div", { className: "dshwnw-subtitle" }, t("libNewTitle")),
            React.createElement("input", { className: "dshwnw-input", value: title, maxLength: 120, autoFocus: props.novels.length > 0, placeholder: t("libNewPlaceholder"), "aria-label": t("bookTitle"), onChange: function (event) { setTitle(event.target.value); } }),
            React.createElement("div", { className: "dshwnw-library-preview" },
              React.createElement(NwIcon, { name: "folder", size: 13 }),
              React.createElement("span", null, t("libFolderPreview").replace("{workspace}", props.workspaceTitle).replace("{folder}", folderPreview(title) + "/"))
            ),
            React.createElement("div", { className: "dshwnw-actions" },
              props.novels.length > 0 ? React.createElement("button", { type: "button", className: "dshwnw-button", onClick: function () { setCreating(false); setTitle(""); } }, t("cancel")) : null,
              React.createElement("button", { type: "submit", className: "dshwnw-primary", disabled: !canAct || !title.trim() }, props.busy ? t("working") : t("libCreate"))
            )
          )
          : React.createElement(AddButton, { onClick: function () { setCreating(true); } }, t("libNew"))
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
      var hostWorkspaceId = workspace && workspace.workspaceId != null ? String(workspace.workspaceId) : null;
      var workspaceTitle = workspace ? (workspace.title || workspace.path || hostWorkspaceId) : "";
      // Each conversation is bound to one novel folder in the workspace. Hosts
      // older than 0.13 have no bindings; there the workspace is the novel.
      var canBind = typeof writer.getBinding === "function";
      var bindingKey = (sessionId || "") + "|" + (hostWorkspaceId || "");
      var bindingSlot = React.useState({ status: "idle", key: "", binding: null, novels: [], missing: null });
      var bindingInfo = bindingSlot[0];
      var setBindingInfo = bindingSlot[1];
      var libraryBusySlot = React.useState(false);
      var libraryBusy = libraryBusySlot[0];
      var setLibraryBusy = libraryBusySlot[1];
      var refreshBinding = React.useCallback(function () {
        if (!canBind || !hostWorkspaceId) return Promise.resolve();
        var key = bindingKey;
        return writer.getBinding(sessionId, hostWorkspaceId).then(function (value) {
          setBindingInfo({ status: "ready", key: key, binding: value.binding || null, novels: value.novels || [], missing: value.missing || null });
        }).catch(function (error) {
          setBindingInfo({ status: "error", key: key, binding: null, novels: [], missing: null, error: failureText(error) });
        });
      }, [writer, sessionId, hostWorkspaceId]);
      React.useEffect(function () { if (canBind) refreshBinding(); }, [refreshBinding]);
      var bindingReady = bindingInfo.key === bindingKey && bindingInfo.status !== "idle";
      var workspaceId = !canBind ? hostWorkspaceId : bindingReady && bindingInfo.binding ? bindingInfo.binding.handle : null;
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
      var externalSlot = React.useState(null);
      var external = externalSlot[0];
      var setExternal = externalSlot[1];
      var revisionRef = React.useRef(-1);
      var busyRef = React.useRef(false);
      var ignoredRevisionRef = React.useRef(-1);
      // A message to show once the newly bound novel has loaded.
      var pendingNoticeRef = React.useRef(null);
      // Discarding unsaved edits is confirmed inside the panel: a native
      // window.confirm() leaves the Electron window without keyboard focus on
      // Windows, freezing the panel and the chat input until it is refocused.
      var discardSlot = React.useState(null);
      var pendingDiscard = discardSlot[0];
      var setPendingDiscard = discardSlot[1];
      function askDiscard(run) {
        if (!dirtyRef.current) { run(); return; }
        setPendingDiscard({ run: run });
      }
      revisionRef.current = state && String(state.workspace && state.workspace.id) === workspaceId ? state.revision : -1;
      busyRef.current = busy;

      var load = React.useCallback(function (forceRemote) {
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
          setNotice(pendingNoticeRef.current ? { kind: "ok", text: pendingNoticeRef.current } : null);
          pendingNoticeRef.current = null;
        }).catch(function (error) {
          if (requestId === requestRef.current) setNotice({ kind: "error", text: t("loadFailed") + ": " + failureText(error) });
        }).finally(function () { if (requestId === requestRef.current) setBusy(false); });
      }, [writer, t, workspaceId]);

      React.useEffect(function () {
        load(false);
        return function () { requestRef.current += 1; };
      }, [load]);

      // "AI · 更新线索：线索 +1", or "" when the change is not in the history.
      function externalSummary(info) {
        var last = info && info.last;
        if (!last) return "";
        var who = last.actor === "ai" ? t("actor_ai") : t("actor_user");
        return who + " · " + operationLabel(last, t) + "：" + (describeChanges(last.changes, t) || t("externalSomething"));
      }
      function externalMessage(info) {
        var summary = externalSummary(info);
        return summary ? t("externalApplied").replace("{what}", summary) : t("externalAppliedPlain");
      }

      // Take the stored project when something outside this panel (the AI,
      // another tab) saved a newer revision.
      function pullRemote(info) {
        var requestId = ++requestRef.current;
        writer.getState(workspaceId).then(function (next) {
          if (requestId !== requestRef.current) return;
          setState(next);
          setDraft(clone(next.project));
          setDirty(false);
          dirtyRef.current = false;
          draftCacheRef.current.delete(workspaceId);
          setExternal(null);
          setNotice({ kind: "ok", text: externalMessage(info) });
        }).catch(function (error) {
          if (requestId === requestRef.current) setNotice({ kind: "error", text: t("loadFailed") + ": " + failureText(error) });
        });
      }

      React.useEffect(function () {
        if (!workspaceId || typeof writer.getRevision !== "function") return undefined;
        var stopped = false;
        function check() {
          if (busyRef.current || revisionRef.current < 0) return;
          if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
          writer.getRevision(workspaceId).then(function (info) {
            if (stopped || !info || info.revision <= revisionRef.current) return;
            if (!dirtyRef.current) { pullRemote(info); return; }
            if (info.revision > ignoredRevisionRef.current) setExternal(info);
          }).catch(function () {});
        }
        // Poll while visible, and check at once when the user comes back.
        var timer = window.setInterval(check, 3000);
        document.addEventListener("visibilitychange", check);
        window.addEventListener("focus", check);
        return function () {
          stopped = true;
          window.clearInterval(timer);
          document.removeEventListener("visibilitychange", check);
          window.removeEventListener("focus", check);
        };
      }, [workspaceId, writer]);

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

      function applyBinding(value, message) {
        setBindingInfo({ status: "ready", key: bindingKey, binding: value.binding || null, novels: value.novels || [], missing: value.missing || null });
        if (message) {
          setNotice({ kind: "ok", text: message });
          pendingNoticeRef.current = value.binding ? message : null;
        }
      }
      function libraryAction(run, message) {
        askDiscard(function () { runLibraryAction(run, message); });
      }
      function runLibraryAction(run, message) {
        setLibraryBusy(true);
        run().then(function (value) {
          setLibraryBusy(false);
          if (workspaceId) draftCacheRef.current.delete(workspaceId);
          setDirty(false);
          dirtyRef.current = false;
          applyBinding(value, typeof message === "function" ? message(value) : message);
        }).catch(function (error) {
          setLibraryBusy(false);
          setNotice({ kind: "error", text: failureText(error) });
        });
      }
      var libraryHandlers = {
        onBind: function (novelId) {
          libraryAction(function () { return writer.bindNovel(sessionId, hostWorkspaceId, novelId); }, function (value) { return t("libBound").replace("{title}", value.binding ? value.binding.title : ""); });
        },
        onCreate: function (input) {
          libraryAction(function () { return writer.createNovel(sessionId, hostWorkspaceId, input); }, function (value) { return t("libCreated").replace("{title}", value.created.title).replace("{folder}", value.created.folder); });
        },
        onUnbind: function () {
          libraryAction(function () { return writer.unbindNovel(sessionId); }, t("libUnbound"));
        },
      };

      if (!hostWorkspaceId) {
        return React.createElement("div", { className: "dshwnw-root" },
          React.createElement("div", { className: "dshwnw-empty", style: { margin: 12 } }, t("noWorkspace"))
        );
      }
      if (canBind && !bindingReady) {
        return React.createElement("div", { className: "dshwnw-root" },
          React.createElement("div", { className: "dshwnw-empty", style: { margin: 12 } }, t("loading"))
        );
      }
      if (canBind && !bindingInfo.binding) {
        return React.createElement("div", { className: "dshwnw-root" },
          React.createElement("div", { className: "dshwnw-body" },
            bindingInfo.status === "error" ? React.createElement("div", { className: "dshwnw-warning" }, bindingInfo.error) : null,
            React.createElement(NovelLibrary, Object.assign({
              t: t, mode: "picker", novels: bindingInfo.novels, missing: bindingInfo.missing, sessionId: sessionId,
              workspaceTitle: workspaceTitle, busy: libraryBusy, currentHandle: "",
            }, libraryHandlers))
          ),
          notice ? React.createElement("div", { className: "dshwnw-footer" }, React.createElement("span", { className: "dshwnw-notice", "data-kind": notice.kind }, React.createElement("span", { className: "dshwnw-notice-text" }, notice.text))) : null
        );
      }

      if (!state || !draft || String(state.workspace && state.workspace.id) !== workspaceId) {
        return React.createElement("div", { className: "dshwnw-root" },
          React.createElement("div", { className: "dshwnw-empty", style: { margin: 12 } },
            notice ? notice.text : t("loading"),
            notice && notice.kind === "error" ? React.createElement("button", { type: "button", className: "dshwnw-button", onClick: function () { load(false); } }, t("retry")) : null)
        );
      }

      // The progression page appears only for progression books (genre or an existing tier ladder).
      var tabs = ["project", "characters", "relationships", "world", "plot", "outline", "scene", "threads"].concat(progressionOn(draft) ? ["progression"] : [], ["settings"]);
      var content;
      if (tab === "project") {
        content = React.createElement(ProjectTab, {
          project: draft, t: t, writer: writer,
          set: function (key, value) { updateProject(function (next) { next[key] = value; }); },
          setGenre: function (key, value) { updateProject(function (next) { next.genreProfile[key] = value; }); },
          setGenreFields: function (value) { updateProject(function (next) { next.genreProfile.customFields = value; }); },
          setProgressionEnabled: function (value) { updateProject(function (next) { next.progression = next.progression || { enabled: false, systems: [], records: [] }; next.progression.enabled = value; }); if (value) setTab("progression"); },
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
          onDelete: function (id) { updateProject(function (next) { next.characters = next.characters.filter(function (item) { return item.id !== id; }); next.relationships = next.relationships.filter(function (item) { return item.fromId !== id && item.toId !== id; }); if (next.scene.povCharacterId === id) next.scene.povCharacterId = ""; if (next.progression && next.progression.records) next.progression.records = next.progression.records.filter(function (record) { return record.characterId !== id; }); (next.threads || []).forEach(function (thread) { thread.characterIds = thread.characterIds.filter(function (item) { return item !== id; }); thread.knownByIds = thread.knownByIds.filter(function (item) { return item !== id; }); }); next.volumes.forEach(function (volume) { volume.chapters.forEach(function (chapter) { chapter.scenes.forEach(function (scene) { if (scene.povCharacterId === id) scene.povCharacterId = ""; }); }); }); }); setSelectedId(""); },
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
          project: draft, t: t, writer: writer, workspaceId: workspaceId, revision: state.revision,
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
      } else if (tab === "progression" && progressionOn(draft)) {
        content = React.createElement(ProgressionTab, {
          project: draft, t: t, writer: writer,
          onUpdate: function (mutate) { updateProject(function (next) { next.progression = next.progression || { enabled: false, systems: [], records: [] }; next.progression.systems = next.progression.systems || []; next.progression.records = next.progression.records || []; mutate(next.progression); }); },
        });
      } else if (tab === "scene") {
        content = React.createElement(SceneTab, {
          project: draft, t: t,
          onPatch: function (key, value) { updateProject(function (next) { next.scene[key] = value; }); },
        });
      } else {
        content = React.createElement(SettingsTab, {
          workspaceId: workspaceId, t: t, busy: busy, dirty: dirty, writer: writer, revision: state.revision,
          library: canBind ? Object.assign({
            novels: bindingInfo.novels, binding: bindingInfo.binding, sessionId: sessionId, workspaceTitle: workspaceTitle, busy: libraryBusy,
          }, libraryHandlers) : null,
          onRestored: function (next, revision) { replaceWith(next, t("restored").replace("{n}", revision)); },
          onError: function (text) { setNotice({ kind: "error", text: text }); },
          onExport: exportProject, onImport: importProject, onClear: resetProject,
        });
      }

      return React.createElement("div", { className: "dshwnw-root" },
        React.createElement("div", { className: "dshwnw-toolbar" },
          React.createElement("div", { className: "dshwnw-headline" },
            React.createElement("div", { className: "dshwnw-book", "data-empty": draft.title ? undefined : "true" }, draft.title || t("untitledBook")),
            canBind && state.workspace && state.workspace.folder
              ? React.createElement("button", { type: "button", className: "dshwnw-workspace", title: t("libChipTitle").replace("{workspace}", workspaceTitle).replace("{folder}", state.workspace.folder), onClick: function () { setTab("settings"); } }, state.workspace.folder + "/")
              : React.createElement("div", { className: "dshwnw-workspace", title: t("workspaceLabel") + " · " + workspaceTitle }, workspaceTitle)
          ),
          React.createElement(SectionNav, { t: t, tab: tab, tabs: tabs, project: draft, onSelect: setTab })
        ),
        pendingDiscard && dirty
          ? React.createElement("div", { className: "dshwnw-external", role: "alert" },
            React.createElement("span", null, t("discardConfirm")),
            React.createElement("div", { className: "dshwnw-actions" },
              React.createElement("button", { type: "button", className: "dshwnw-danger", onClick: function () { var run = pendingDiscard.run; setPendingDiscard(null); run(); } }, t("discardAction")),
              React.createElement("button", { type: "button", className: "dshwnw-button", onClick: function () { setPendingDiscard(null); } }, t("cancel"))
            ))
          : null,
        external && dirty
          ? React.createElement("div", { className: "dshwnw-external", role: "alert" },
            React.createElement("span", null, t("externalChanged").replace("{what}", externalSummary(external) || t("externalSomething"))),
            React.createElement("div", { className: "dshwnw-actions" },
              React.createElement("button", { type: "button", className: "dshwnw-primary", onClick: function () { pullRemote(external); } }, t("externalLoad")),
              React.createElement("button", { type: "button", className: "dshwnw-button", onClick: function () { ignoredRevisionRef.current = external.revision; setExternal(null); } }, t("externalKeep"))
            ))
          : null,
        React.createElement("div", { className: "dshwnw-body", key: tab, role: "tabpanel" }, content),
        React.createElement("div", { className: "dshwnw-footer" },
          React.createElement("span", { className: "dshwnw-notice", role: "status", "data-kind": notice ? notice.kind : undefined, "data-dirty": dirty ? "true" : undefined, title: notice ? notice.text : undefined }, React.createElement("span", { className: "dshwnw-notice-text" }, notice ? notice.text : dirty ? t("unsaved") : t("synced"))),
          React.createElement("button", { type: "button", className: "dshwnw-button", disabled: busy || !dirty, onClick: function () { askDiscard(function () { load(true); }); } }, t("reload")),
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
      tab_progression: "体系", metaProgression: "{r} 套体系 · {n} 条记录", metaProgressionEmpty: "等级与成长",
      section_progressionSystems: "成长体系", section_progressionRecords: "成长记录",
      progressionGroup: "成长体系", progressionGroupHint: "追踪角色在各套等级体系里的位置和状态变化，例如修为境界、武学层次、魔法位阶、位分、军衔、段位。开启后工作台多出「体系」页。",
      progressionToggle: "启用成长体系追踪", progressionOnBySystems: "已启用（这本书已有体系；删掉所有体系后才能关闭）",
      progressionTitle: "成长体系与角色状态", progressionHint: "一本书可以有多套体系（比如修为境界 + 炼丹品级 + 宗门职位），每套从低到高排列。每一章谁升降、受伤、暴露底牌、得失东西，都记成一条记录；角色在任意一章的状态按大纲顺序自动算出来。AI 写章前会读取，写完会补记录。",
      systemsTitle: "这本书的体系", systemsEmpty: "还没有体系。从下面的模板库挑一套，或新建一套空白体系。", addSystem: "新建空白体系",
      unnamedSystem: "未命名体系", systemName: "体系名称", systemNamePlaceholder: "例如：修为境界、炼丹品级、宗门职位", systemNotes: "体系说明",
      systemInUse: "有 {n} 条记录引用这套体系；删除体系后这些记录会被标为需复核。", saveAsTemplate: "另存为模板",
      tiersTitle: "等级（从低到高，顺序即高低）", tiersEmpty: "还没有等级。", addTier: "新增等级", unnamedTier: "未命名等级",
      tierName: "等级名称", tierStages: "小阶段", tierStagesPlaceholder: "例如：初期、中期、后期、圆满", tierAdvance: "晋升条件",
      tierCost: "代价与瓶颈", tierGap: "与上一级的差距（越级需要什么）", tierNotes: "备注（寿元、特权、义务等）",
      templatesTitle: "体系模板库（所有书共用）", templatesHint: "模板对所有小说通用。可以把模板用到这本书、修改内置模板、新建自己的模板；「恢复内置模板」会把六套内置模板还原，自建模板不受影响。",
      templatesFailed: "读取模板库失败", builtIn: "内置", useTemplate: "用到这本书", editTemplate: "编辑模板", newTemplate: "新建模板",
      templateName: "模板名称", templateDescription: "模板说明", saveTemplate: "保存模板", confirmDelete: "确认删除",
      deleteTemplateConfirm: "确定删除模板「{name}」？已经用到书里的体系不受影响。再点一次红色按钮确认。",
      restoreTemplates: "恢复内置模板", confirmRestore: "确认恢复", restoreTemplatesConfirm: "六套内置模板会还原成默认内容（你对它们的修改会丢失），自建模板保留。再点一次确认。",
      templateSaved: "模板「{name}」已保存。", templateDeleted: "模板已删除。", templatesRestored: "内置模板已恢复。", templateApplied: "已把「{name}」加到这本书，记得保存。",
      statesTitle: "角色当前状态", statesAsOf: "按哪一章结束时计算", statesAsOfLabel: "显示 {chapter} 结束时的状态。", statesAsOfAll: "还没有开始写的章节，显示全部记录汇总后的状态。",
      statesEmpty: "还没有成长记录。", statesLastChange: "最后变化：{chapter} · 共 {n} 条记录",
      recordsTitle: "成长记录", recordsHint: "一条记录 = 某个角色在某一章的变化。升降级时选体系和等级；伤势、持有物、底牌、得失是角色本身的，不分体系。持有物填本章结束后的完整清单。",
      recordsNeedSetup: "先在「角色」里添加角色、在「大纲」里建好章节，才能记录。", recordsEmpty: "没有记录。", recordsFilter: "只看角色", recordsAll: "全部角色",
      addRecord: "新增记录", recordCharacter: "角色", chooseCharacter: "选择角色", recordChapter: "章节",
      recordSystem: "体系", noSystemChange: "不涉及等级", recordTier: "等级", tierUnchanged: "本章未变", recordStage: "小阶段",
      recordCondition: "伤势 / 状态", recordHoldings: "持有物（完整快照）", recordRevealed: "暴露的底牌", recordGained: "获得", recordLost: "消耗 / 失去",
      recordNote: "原因 / 备注（跌级、跳级必须写）", revealedShort: "暴露：", missingCharacter: "角色已删除",
      pwarnBadge: "需复核", pwarnSummary: "成长账本有 {n} 处需要复核（跌级或跳级没写原因，或引用的章节、角色、体系、等级不存在）。",
      "pwarn_tier-regression": "等级比这套体系的上一条记录低，却没写原因。", "pwarn_tier-skip": "一次跨过了不止一级，却没写原因。",
      "pwarn_missing-chapter": "引用的章节不在大纲里。", "pwarn_missing-character": "引用的角色不存在。", "pwarn_missing-system": "引用的体系已不存在。",
      "pwarn_missing-tier": "引用的等级不在这套体系里。", "pwarn_tier-without-system": "填了等级或小阶段，却没选体系。",
      title: "小说写作", rail: "打开小说写作工作台", cardDescription: "每本小说独立的角色、世界观、情节与连续性数据",
      writeActive: "小说写作", writeEdit: "编辑", writeClear: "解除", writeSave: "保存", writeCancel: "取消", writeObjectiveAria: "小说写作任务", writeCommandInput: "写作命令输入",
      loading: "正在载入小说项目…", loadFailed: "载入失败", retry: "重试", saveFailed: "保存失败", noWorkspace: "当前没有可用工作区。请先打开或创建一个工作区。", workspaceLabel: "共享工作区",
      saved: "项目设定已保存。", saving: "保存中…", save: "保存", reload: "撤销", unsaved: "有未保存修改", synced: "已与模型上下文同步", draftRestored: "已恢复这个工作区未保存的草稿。",
      tab_project: "项目", tab_characters: "角色", tab_relationships: "关系", tab_world: "世界", tab_plot: "情节", tab_outline: "大纲", tab_scene: "场景", tab_settings: "设置",
      settingsTitle: "小说框架设置", settingsHint: "管理这个对话写的是哪本书，以及这本书的版本、导入、导出与重置。所有绑定这本书的对话都会看到变化。", settingsDirty: "请先保存或撤销当前修改，再执行导入、导出或清除。", working: "处理中…", cancel: "取消",
      exportTitle: "导出当前小说框架", exportHint: "下载一份可移植的 JSON，包含项目、角色、关系、世界观、情节、大纲、线索账本、场景和推进记录。", exportAction: "导出 JSON", exported: "小说框架已导出。", exportFailed: "导出失败",
      importTitle: "导入小说框架", importHint: "导入本插件导出的 JSON 或完整项目 JSON；通过结构校验后原子替换当前框架。", importAction: "选择 JSON 文件", imported: "小说框架已导入。", importFailed: "导入失败", importInvalidJson: "文件不是有效 JSON", importTooLarge: "导入文件超过 5 MB 限制。",
      clearTitle: "清除当前小说框架", clearHint: "恢复为空白框架。该操作会清除这本小说的全部角色、关系、世界观、情节、大纲、线索、场景与推进记录（正文文件不动）。", clearAction: "清除框架", clearConfirm: "清空后仍可在「版本历史」里恢复。确认后只清空这本小说的框架。", clearConfirmAction: "确认清除", cleared: "当前工作区的小说框架已清空。", clearFailed: "清除失败",
      projectTitle: "项目总览", projectHint: "先定义作品契约，再让角色、世界与情节围绕它保持一致。", groupBasics: "作品定位", groupWritingContract: "写作契约", bookTitle: "书名", genre: "题材 / 类型", tone: "基调与文风", pov: "叙事视角", targetWords: "目标字数", audience: "目标读者", contentRating: "内容分级与边界", premise: "一句话梗概 / 核心命题", styleGuide: "文风指南（句式、节奏、叙述距离、禁用表达）", constraints: "创作约束（必须遵守 / 必须避免）", notes: "总备注",
      genreProfileTitle: "题材扩展配置", genreProfileType: "配置类型", genreProfilePlaceholder: "例如 romance、mystery、xianxia", customFields: "自定义字段", customFieldsHint: "自由定义本题材需要的数据；模型会按原键名读取和维护。", customFieldsEmpty: "还没有自定义字段。", customFieldDefault: "字段", customFieldName: "字段名", customFieldValue: "字段值", addCustomField: "新增自定义字段",
      charactersTitle: "角色卡", add: "新增", delete: "删除", charactersEmpty: "还没有角色。先建立主角和主要对手。", unnamedCharacter: "未命名角色", rolePlaceholder: "尚未填写角色定位",
      groupIdentity: "身份与现状", groupPortrait: "人物画像", groupDrive: "欲望与压力", groupResources: "能力、弱点与信息", groupPerformance: "表现方式与弧光", name: "姓名", aliases: "别名 / 称呼", age: "年龄 / 年龄段", identity: "身份、职业与社会位置", role: "故事功能", characterStatus: "当前状态（位置、健康、阵营）", appearance: "外貌、体态与辨识特征", traits: "性格、价值观与行为模式", background: "成长经历与关键往事", goal: "外在目标", motivation: "深层动机与缺失", stakes: "失败代价", conflict: "内外冲突", abilities: "能力、资源与优势", weaknesses: "弱点、恐惧与盲区", secret: "秘密与信息差", knowledge: "已知 / 未知 / 错误认知", possessions: "关键物品与资源", voice: "语言习惯 / 角色声音", habits: "习惯、动作与压力反应", arc: "人物弧光（起点—转折—终点）",
      relationshipsTitle: "角色关系", relationshipsNeedCharacters: "至少建立两名角色后才能添加关系。", relationshipsEmpty: "还没有关系线。", relationship: "关系线", relationshipInvalid: "关系端点无效或指向同一角色，请重新选择角色 A 与角色 B。", chooseCharacter: "请选择角色", groupRelationIdentity: "关系身份", groupRelationHistory: "历史与运作方式", groupRelationLayers: "公开层与真实层", groupRelationArc: "张力与关系弧", from: "角色 A（主动视角）", to: "角色 B（关系对象）", relationLabel: "关系标签", relationStatus: "当前关系状态", relationHistory: "共同历史与关键事件", dynamic: "日常互动模式", powerBalance: "权力、依赖与交换", publicFace: "他人眼中的关系", privateTruth: "私下真实关系", sharedSecret: "共同秘密与信息差", tension: "当前张力、误解与冲突", turningPoints: "已发生 / 计划中的关系转折", futureDirection: "下一阶段变化方向",
      worldTitle: "世界观设定", worldHint: "从时间空间、社会系统和文化认知三层写清会影响因果与选择的规则。", groupWorldFrame: "时间与空间", groupWorldSystems: "制度与资源", groupWorldCulture: "文化与公共认知", era: "时代、纪年与技术阶段", chronology: "历史时间线与关键年代", geography: "地理格局、距离与交通", environment: "自然环境、气候与生存条件", locations: "关键地点及其叙事功能", rules: "世界硬规则、代价与例外", factions: "势力、目标、资源与关系", politics: "权力结构、法律与治理", society: "阶层、家庭、组织与社会规范", economy: "生产、货币、稀缺资源与交易", worldConflicts: "系统性矛盾与当前危机", culture: "习俗、礼仪、禁忌与日常", beliefs: "宗教、价值观与公共信念", technology: "科技 / 魔法体系及限制", lore: "历史、传说、误传与公共认知",
      plotTitle: "情节骨架", plotHint: "先写清欲望—阻力—代价—选择，再组织转折、伏笔和章节节奏。", groupPlotCore: "戏剧核心", groupPlotStructure: "主线结构", groupPlotWeaving: "支线、伏笔与节奏", themes: "主题与母题", storyQuestion: "核心戏剧问题", protagonistGoal: "主角总体目标", plotStakes: "总体风险与失败代价", coreConflict: "核心冲突", antagonisticForce: "对抗力量及其逻辑", opening: "开局、常态与诱发事件", midpoint: "中点转折与认知改变", climax: "高潮、终极选择与代价", ending: "结局状态与主题回应", subplots: "支线及其与主线的交汇", foreshadowing: "伏笔清单、埋设与回收", reveals: "秘密、揭示顺序与知情范围", pacing: "节奏曲线与张弛安排", chapterPlan: "章节计划（目标、冲突、转折、钩子）", outline: "详细节拍 / 场景大纲",
      outlineTitle: "结构化卷章大纲", outlineHint: "每卷、每章、每场戏独立保存；模型可以按 ID 精确读取和修改，不必重发整份长大纲。类型专用路线写入自定义字段。", outlineEmpty: "还没有结构化大纲。先新增一卷。", addVolume: "新增卷", unnamedVolume: "未命名卷", volumeTitle: "卷名", volumeSummary: "本卷概要", outlineStatus: "状态", chaptersTitle: "章节", addChapter: "新增章", unnamedChapter: "未命名章节", chapterNumber: "章号", chapterTitle: "章名", chapterWords: "目标字数", chapterLocations: "主要场景", chapterSummary: "章节概要", chapterEvents: "事件列表（每行一项）", dialogueNotes: "对话示例与语言备注", endingHook: "收束与下一章钩子", chapterScenes: "场景拆分", addScene: "新增场景", unnamedScene: "未命名场景", sceneName: "场景名",
      discardConfirm: "你有未保存的修改，继续会丢弃它们。", discardAction: "丢弃并继续",
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
      corpusField: "文风素材库", corpusFollow: "跟随知识库当前素材库", corpusNone: "不使用素材库", corpusFollowing: "跟随当前", corpusPassages: "段", corpusRefresh: "刷新素材库列表",
      corpusMissingOption: "（已删除的素材库）", corpusMissing: "绑定的素材库已被删除，写作时会改用知识库当前素材库。请重新选择。",
      corpusNoneHint: "这本书写作时不检索任何素材库，也不注入禁用套路表。",
      corpusHint: "只影响用 /write 联动这本书的对话：模型只会看到这个素材库，别的库的内容不会混进来。其他对话仍使用知识库面板里的当前素材库。",
      corpusUnavailable: "没有检测到知识库插件（dsh-w-knowledge-base 0.5+），无法选择文风素材库。",
      historyTitle: "版本历史", historyHint: "每次保存设定（包括 AI 用工具修改）都会自动存一个版本。可以查看改了什么，也可以恢复到任意版本；恢复本身也会存成新版本，随时能撤回。",
      historyEmpty: "还没有版本记录。下一次修改设定时会开始记录。", historyCurrent: "当前", historyIsCurrent: "这就是当前版本。", historyLimitHint: "保留最近 {n} 个版本，更早的会自动清理。",
      restoreWould: "恢复到 r{n} 会带来这些变化：", restoreAction: "恢复到 r{n}", restoreConfirm: "当前设定会被这个版本替换（之后仍可在历史里恢复回来）。确认恢复吗？", restoreFailed: "恢复失败", restored: "已恢复到 r{n}。", snapshotSame: "这个版本和当前设定完全相同。",
      actor_ai: "AI", actor_user: "你", actor_baseline: "初始",
      op_baseline: "修改前的原始版本", "op_panel-save": "在面板里保存", op_import: "导入框架", op_reset: "清空框架", op_restore: "恢复到 r{n}", op_unknown: "修改",
      op_novel_patch: "修改设定", op_novel_write: "整体重写设定", op_novel_advance: "推进剧情", op_novel_character_patch: "修改角色", op_novel_relationship_patch: "修改关系", op_novel_volume_upsert: "保存卷", op_novel_chapter_upsert: "保存章节大纲", op_novel_chapter_remove: "删除章节", op_novel_chapter_reorder: "调整章节顺序", op_novel_thread_upsert: "更新线索", op_novel_thread_remove: "删除线索", op_novel_save_chapter: "保存正文并关联章节",
      section_project: "项目", section_genreProfile: "题材扩展", section_world: "世界", section_plot: "情节", section_scene: "场景", section_characters: "角色", section_relationships: "关系", section_volumes: "卷", section_chapters: "章节", section_threads: "线索", section_progress: "进展",
      fieldsChanged: "{n} 项", reordered: "顺序变化", reorderedLong: "顺序有调整", emptyValue: "（空）",
      justNow: "刚刚", minutesAgo: "{n} 分钟前", hoursAgo: "{n} 小时前",
      externalApplied: "已同步 {what}", externalAppliedPlain: "已同步其他地方保存的设定。", externalSomething: "设定有更新",
      externalChanged: "设定在别处被修改了（{what}）。你还有未保存的修改：保留的话，保存时会因版本冲突失败。", externalLoad: "载入最新（放弃我的修改）", externalKeep: "先保留我的",
      libPickTitle: "这个对话要写哪本小说？", libPickHint: "工作区「{workspace}」里可以有多本小说，每本是一个文件夹。一个对话绑定一本；同一本书可以被多个对话绑定，它们共享设定、大纲和线索。",
      libExisting: "工作区里的小说 · {n}", libSwitchTo: "换成其他小说", libEmpty: "这个工作区还没有小说。新建一本开始吧。",
      libChapters: "{n} 章", libThreads: "{n} 条线索进行中", libSessions: "{n} 个对话在写", libCurrent: "当前", libBind: "绑定",
      libNew: "新建一本小说", libNewTitle: "新建小说", libNewPlaceholder: "书名", libCreate: "新建并绑定到这个对话",
      libFolderPreview: "会在工作区「{workspace}」里新建文件夹 {folder}，正文和设定都放在里面（重名时自动加序号）。",
      libMissing: "之前绑定的小说（{folder}）找不到了，可能被删除或移出了工作区。请重新选择。", libNoSession: "先在这个对话里发一条消息，才能给它绑定小说。",
      libBound: "这个对话已绑定《{title}》。", libCreated: "已新建《{title}》，文件夹 {folder}/。", libUnbound: "已解除绑定。小说本身没有删除。",
      libThisConversation: "本对话的小说", libBindingHint: "这个对话读写的是下面这本书。切换后，AI 工具、/write 和面板都会改用新的书。",
      libSwitch: "换一本", libUnbind: "解除绑定", libUnbindConfirm: "确认解除绑定", libUnbindHint: "只解除这个对话和小说的关系，小说文件夹和其中的内容都不会删除。",
      libChipTitle: "小说文件夹：{workspace}/{folder} · 点击管理绑定",
      progressTitle: "写作进展", progressEmpty: "还没有推进记录。AI 可在写作后自动写入。", progressEntry: "进展", canonChanges: "设定变更", openThreads: "待续线索",
    };
    var en = {
      tab_progression: "Systems", metaProgression: "{r} systems · {n} records", metaProgressionEmpty: "Ranks & growth",
      section_progressionSystems: "Progression systems", section_progressionRecords: "Progression records",
      progressionGroup: "Progression systems", progressionGroupHint: "Track where characters stand in each ranking system and how their state changes: cultivation realms, martial tiers, magic ranks, court ranks, military ranks, game tiers. Turning it on adds a Systems page.",
      progressionToggle: "Track progression", progressionOnBySystems: "On (this book has systems; delete them all to turn it off)",
      progressionTitle: "Progression systems and character state", progressionHint: "A book can have several systems (e.g. cultivation + alchemy grade + sect rank), each ordered lowest first. Every rise or fall, injury, revealed card or gain and loss is one record per chapter; a character's state at any chapter is folded in outline order. The AI reads it before a chapter and records changes after.",
      systemsTitle: "This book's systems", systemsEmpty: "No systems yet. Pick a template below or add a blank system.", addSystem: "Add blank system",
      unnamedSystem: "Unnamed system", systemName: "System name", systemNamePlaceholder: "e.g. Cultivation, Alchemy grade, Sect rank", systemNotes: "How it works",
      systemInUse: "{n} records use this system; deleting it flags them for review.", saveAsTemplate: "Save as template",
      tiersTitle: "Tiers (lowest first; order is rank)", tiersEmpty: "No tiers yet.", addTier: "Add tier", unnamedTier: "Unnamed tier",
      tierName: "Tier", tierStages: "Sub-stages", tierStagesPlaceholder: "e.g. early, middle, late, peak", tierAdvance: "How to rise into it",
      tierCost: "Cost and bottleneck", tierGap: "Gap from the previous tier", tierNotes: "Notes (lifespan, privileges, duties…)",
      templatesTitle: "Template library (shared by every book)", templatesHint: "Templates work for every novel. Use one in this book, edit the built-ins, or create your own. Restore puts the six built-ins back to default and keeps your own templates.",
      templatesFailed: "Could not load templates", builtIn: "Built-in", useTemplate: "Use in this book", editTemplate: "Edit", newTemplate: "New template",
      templateName: "Template name", templateDescription: "Description", saveTemplate: "Save template", confirmDelete: "Confirm delete",
      deleteTemplateConfirm: "Delete template \"{name}\"? Systems already copied into books are not affected. Click the red button again to confirm.",
      restoreTemplates: "Restore built-ins", confirmRestore: "Confirm restore", restoreTemplatesConfirm: "The six built-in templates go back to default (your edits to them are lost); your own templates stay. Click again to confirm.",
      templateSaved: "Template \"{name}\" saved.", templateDeleted: "Template deleted.", templatesRestored: "Built-in templates restored.", templateApplied: "Added \"{name}\" to this book. Remember to save.",
      statesTitle: "Character state", statesAsOf: "As of the end of", statesAsOfLabel: "Showing state at the end of {chapter}.", statesAsOfAll: "No chapter has started; showing every record.",
      statesEmpty: "No progression records yet.", statesLastChange: "Last change: {chapter} · {n} records",
      recordsTitle: "Records", recordsHint: "One record = one character's change in one chapter. Pick a system and tier for a rise or fall; condition, holdings, revealed cards and gains belong to the character. Holdings is the full list after the chapter.",
      recordsNeedSetup: "Add characters and outline chapters first.", recordsEmpty: "No records.", recordsFilter: "Character", recordsAll: "All characters",
      addRecord: "Add record", recordCharacter: "Character", chooseCharacter: "Choose a character", recordChapter: "Chapter",
      recordSystem: "System", noSystemChange: "No tier change", recordTier: "Tier", tierUnchanged: "Unchanged", recordStage: "Sub-stage",
      recordCondition: "Injury / condition", recordHoldings: "Holdings (full snapshot)", recordRevealed: "Cards revealed", recordGained: "Gained", recordLost: "Spent / lost",
      recordNote: "Why (required for a drop or a skip)", revealedShort: "Revealed: ", missingCharacter: "Deleted character",
      pwarnBadge: "Review", pwarnSummary: "{n} progression records need review (a drop or skip without a note, or a missing chapter, character, system or tier).",
      "pwarn_tier-regression": "Lower than the previous record in this system, with no note.", "pwarn_tier-skip": "Skips more than one tier, with no note.",
      "pwarn_missing-chapter": "The chapter is not in the outline.", "pwarn_missing-character": "The character no longer exists.", "pwarn_missing-system": "The system no longer exists.",
      "pwarn_missing-tier": "The tier is not in this system.", "pwarn_tier-without-system": "A tier or sub-stage is set without a system.",
      title: "Novel Writing", rail: "Open Novel Writing", cardDescription: "Characters, world, plot, and continuity for each novel",
      writeActive: "Novel Writing", writeEdit: "Edit", writeClear: "Unlink", writeSave: "Save", writeCancel: "Cancel", writeObjectiveAria: "Novel writing objective", writeCommandInput: "Writing command input",
      loading: "Loading novel project…", loadFailed: "Load failed", retry: "Retry", saveFailed: "Save failed", noWorkspace: "No workspace is available. Open or create a workspace first.", workspaceLabel: "Shared workspace",
      saved: "Project canon saved.", saving: "Saving…", save: "Save", reload: "Revert", unsaved: "Unsaved changes", synced: "Synced to model context", draftRestored: "Restored this workspace's unsaved draft.",
      tab_project: "Project", tab_characters: "Characters", tab_relationships: "Relations", tab_world: "World", tab_plot: "Plot", tab_outline: "Outline", tab_scene: "Scene", tab_settings: "Settings",
      settingsTitle: "Novel framework settings", settingsHint: "Choose which book this conversation writes, and manage that book's versions, import, export, and reset. Every conversation bound to the book sees the changes.", settingsDirty: "Save or revert current edits before importing, exporting, or clearing.", working: "Working…", cancel: "Cancel",
      exportTitle: "Export current framework", exportHint: "Download portable JSON with the project, characters, relationships, world, plot, outline, thread ledger, scene, and progress.", exportAction: "Export JSON", exported: "Novel framework exported.", exportFailed: "Export failed",
      importTitle: "Import a framework", importHint: "Import an exported document or complete project JSON. It is validated before atomically replacing the current framework.", importAction: "Choose JSON file", imported: "Novel framework imported.", importFailed: "Import failed", importInvalidJson: "The file is not valid JSON", importTooLarge: "The import exceeds the 5 MB limit.",
      clearTitle: "Clear current framework", clearHint: "Restore an empty framework, removing all characters, relationships, world, plot, outline, threads, scene, and progress of this novel (manuscript files stay).", clearAction: "Clear framework", clearConfirm: "You can still restore it from Version history. Only this novel's framework is cleared.", clearConfirmAction: "Confirm clear", cleared: "The current workspace framework was cleared.", clearFailed: "Clear failed",
      projectTitle: "Project overview", projectHint: "Define the book contract first, then keep characters, world, and plot aligned with it.", groupBasics: "Book positioning", groupWritingContract: "Writing contract", bookTitle: "Title", genre: "Genre", tone: "Tone and style", pov: "Point of view", targetWords: "Target length", audience: "Target audience", contentRating: "Content rating and boundaries", premise: "Premise", styleGuide: "Style guide", constraints: "Creative constraints", notes: "Notes",
      genreProfileTitle: "Genre extension profile", genreProfileType: "Profile type", genreProfilePlaceholder: "For example romance, mystery, xianxia", customFields: "Custom fields", customFieldsHint: "Define genre-specific data while preserving stable keys for the model.", customFieldsEmpty: "No custom fields yet.", customFieldDefault: "Field", customFieldName: "Field name", customFieldValue: "Field value", addCustomField: "Add custom field",
      charactersTitle: "Character cards", add: "Add", delete: "Delete", charactersEmpty: "No characters yet. Start with the protagonist and primary opposition.", unnamedCharacter: "Unnamed character", rolePlaceholder: "No role yet",
      groupIdentity: "Identity and status", groupPortrait: "Portrait", groupDrive: "Drive and pressure", groupResources: "Abilities and information", groupPerformance: "Performance and arc", name: "Name", aliases: "Aliases", age: "Age", identity: "Identity, occupation, social position", role: "Story function", characterStatus: "Current status", appearance: "Appearance and visual markers", traits: "Traits, values, behavior", background: "Background and formative events", goal: "External goal", motivation: "Deep motivation", stakes: "Personal stakes", conflict: "Internal / external conflict", abilities: "Abilities and resources", weaknesses: "Weaknesses and blind spots", secret: "Secrets and information gaps", knowledge: "Known, unknown, mistaken beliefs", possessions: "Key objects and resources", voice: "Voice and speech patterns", habits: "Habits and stress responses", arc: "Character arc",
      relationshipsTitle: "Relationships", relationshipsNeedCharacters: "Create at least two characters first.", relationshipsEmpty: "No relationship lines yet.", relationship: "Relationship", relationshipInvalid: "Invalid or self-referencing endpoints. Choose two distinct characters.", chooseCharacter: "Choose a character", groupRelationIdentity: "Relationship identity", groupRelationHistory: "History and operation", groupRelationLayers: "Public and private layers", groupRelationArc: "Tension and arc", from: "Character A", to: "Character B", relationLabel: "Label", relationStatus: "Current status", relationHistory: "Shared history", dynamic: "Interaction pattern", powerBalance: "Power, dependence, exchange", publicFace: "Public appearance", privateTruth: "Private truth", sharedSecret: "Shared secret", tension: "Current tension", turningPoints: "Turning points", futureDirection: "Direction of change",
      worldTitle: "Worldbuilding", worldHint: "Define time and space, social systems, and cultural beliefs that shape causality and choice.", groupWorldFrame: "Time and space", groupWorldSystems: "Systems and resources", groupWorldCulture: "Culture and belief", era: "Era and technology stage", chronology: "Historical chronology", geography: "Geography and travel", environment: "Environment and survival", locations: "Key locations", rules: "Hard rules, costs, exceptions", factions: "Factions and interests", politics: "Power, law, governance", society: "Class, family, institutions", economy: "Economy and scarce resources", worldConflicts: "Systemic conflicts", culture: "Culture and daily life", beliefs: "Beliefs and religion", technology: "Technology / magic", lore: "History, lore, public beliefs",
      plotTitle: "Plot spine", plotHint: "Define desire, resistance, cost, and choice before arranging turns, setups, and pacing.", groupPlotCore: "Dramatic core", groupPlotStructure: "Main structure", groupPlotWeaving: "Subplots and pacing", themes: "Themes", storyQuestion: "Dramatic question", protagonistGoal: "Protagonist goal", plotStakes: "Global stakes", coreConflict: "Core conflict", antagonisticForce: "Antagonistic force", opening: "Opening and inciting incident", midpoint: "Midpoint reversal", climax: "Climax and final choice", ending: "Ending state", subplots: "Subplots", foreshadowing: "Foreshadowing and payoff", reveals: "Reveals and knowledge order", pacing: "Pacing curve", chapterPlan: "Chapter plan", outline: "Detailed beat outline",
      outlineTitle: "Structured volume and chapter outline", outlineHint: "Store each volume, chapter, and scene independently so the model can read and patch by stable ID.", outlineEmpty: "No structured outline yet. Add a volume first.", addVolume: "Add volume", unnamedVolume: "Untitled volume", volumeTitle: "Volume title", volumeSummary: "Volume summary", outlineStatus: "Status", chaptersTitle: "Chapters", addChapter: "Add chapter", unnamedChapter: "Untitled chapter", chapterNumber: "Number", chapterTitle: "Chapter title", chapterWords: "Target words", chapterLocations: "Primary locations", chapterSummary: "Chapter summary", chapterEvents: "Events, one per line", dialogueNotes: "Dialogue examples and notes", endingHook: "Ending and next hook", chapterScenes: "Scene breakdown", addScene: "Add scene", unnamedScene: "Untitled scene", sceneName: "Scene name",
      discardConfirm: "You have unsaved changes; continuing discards them.", discardAction: "Discard and continue",
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
      corpusField: "Style library", corpusFollow: "Follow the knowledge base's current library", corpusNone: "No style library", corpusFollowing: "following current", corpusPassages: "passages", corpusRefresh: "Refresh libraries",
      corpusMissingOption: "(deleted library)", corpusMissing: "The bound library was deleted; writing falls back to the knowledge base's current library. Pick another one.",
      corpusNoneHint: "This book searches no style library and injects no banned list.",
      corpusHint: "Only conversations linked to this book with /write are affected: the model sees just this library, nothing from the others. Other conversations keep the knowledge base's current library.",
      corpusUnavailable: "The knowledge base plugin (dsh-w-knowledge-base 0.5+) was not found, so no style library can be chosen.",
      historyTitle: "Version history", historyHint: "Every saved change, including AI tool edits, is kept as a version. Inspect what changed or restore any version; a restore is itself a new version, so it can be undone.",
      historyEmpty: "No versions yet. Recording starts with the next change.", historyCurrent: "current", historyIsCurrent: "This is the current version.", historyLimitHint: "The latest {n} versions are kept; older ones are pruned automatically.",
      restoreWould: "Restoring r{n} would change:", restoreAction: "Restore r{n}", restoreConfirm: "The current project will be replaced by this version (you can restore back from history). Restore?", restoreFailed: "Restore failed", restored: "Restored r{n}.", snapshotSame: "This version is identical to the current project.",
      actor_ai: "AI", actor_user: "You", actor_baseline: "Initial",
      op_baseline: "Original before the first change", "op_panel-save": "Saved in the panel", op_import: "Imported framework", op_reset: "Cleared framework", op_restore: "Restored r{n}", op_unknown: "Change",
      op_novel_patch: "Edited canon", op_novel_write: "Rewrote the project", op_novel_advance: "Advanced the story", op_novel_character_patch: "Edited a character", op_novel_relationship_patch: "Edited a relationship", op_novel_volume_upsert: "Saved a volume", op_novel_chapter_upsert: "Saved a chapter outline", op_novel_chapter_remove: "Deleted a chapter", op_novel_chapter_reorder: "Reordered chapters", op_novel_thread_upsert: "Updated a thread", op_novel_thread_remove: "Deleted a thread", op_novel_save_chapter: "Saved and linked prose",
      section_project: "Project", section_genreProfile: "Genre profile", section_world: "World", section_plot: "Plot", section_scene: "Scene", section_characters: "Characters", section_relationships: "Relations", section_volumes: "Volumes", section_chapters: "Chapters", section_threads: "Threads", section_progress: "Progress",
      fieldsChanged: "{n} fields", reordered: "reordered", reorderedLong: "Order changed", emptyValue: "(empty)",
      justNow: "just now", minutesAgo: "{n} min ago", hoursAgo: "{n} h ago",
      externalApplied: "Synced {what}", externalAppliedPlain: "Synced changes saved elsewhere.", externalSomething: "canon updated",
      externalChanged: "The project was changed elsewhere ({what}). You have unsaved edits: keeping them means saving will fail with a revision conflict.", externalLoad: "Load latest (discard mine)", externalKeep: "Keep mine for now",
      libPickTitle: "Which novel does this conversation write?", libPickHint: "Workspace \"{workspace}\" can hold several novels, one folder each. A conversation is bound to one; several conversations can share a book, including its canon, outline, and threads.",
      libExisting: "Novels in this workspace · {n}", libSwitchTo: "Switch to another novel", libEmpty: "This workspace has no novel yet. Create one to start.",
      libChapters: "{n} chapters", libThreads: "{n} open threads", libSessions: "{n} conversations", libCurrent: "current", libBind: "Bind",
      libNew: "New novel", libNewTitle: "New novel", libNewPlaceholder: "Title", libCreate: "Create and bind to this conversation",
      libFolderPreview: "Creates folder {folder} in workspace \"{workspace}\"; prose and canon live inside it (a number is added if the name is taken).",
      libMissing: "The novel bound before ({folder}) was not found; it may have been deleted or moved out of the workspace. Choose again.", libNoSession: "Send a message in this conversation first; then a novel can be bound to it.",
      libBound: "This conversation now writes \"{title}\".", libCreated: "Created \"{title}\" in folder {folder}/.", libUnbound: "Unbound. The novel itself was not deleted.",
      libThisConversation: "This conversation's novel", libBindingHint: "This conversation reads and writes the book below. After switching, AI tools, /write, and the panel all use the new book.",
      libSwitch: "Switch", libUnbind: "Unbind", libUnbindConfirm: "Confirm unbind", libUnbindHint: "Only the link between this conversation and the novel is removed; the folder and its contents stay.",
      libChipTitle: "Novel folder: {workspace}/{folder} · click to manage the binding",
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
          listStyleCorpora: function () { return unwrap("listStyleCorpora", []); },
          listNovels: function (workspaceId) { return unwrap("listNovels", [workspaceId]); },
          getBinding: function (sessionId, workspaceId) { return unwrap("getBinding", [sessionId, workspaceId]); },
          bindNovel: function (sessionId, workspaceId, novelId) { return unwrap("bindNovel", [sessionId, workspaceId, novelId]); },
          unbindNovel: function (sessionId) { return unwrap("unbindNovel", [sessionId]); },
          createNovel: function (sessionId, workspaceId, input) { return unwrap("createNovel", [sessionId, workspaceId, input]); },
          getRevision: function (workspaceId) { return unwrap("getRevision", [workspaceId]); },
          listHistory: function (workspaceId) { return unwrap("listHistory", [workspaceId]); },
          compareSnapshot: function (workspaceId, revision) { return unwrap("compareSnapshot", [workspaceId, revision]); },
          restoreSnapshot: function (workspaceId, revision, expectedRevision) { return unwrap("restoreSnapshot", [workspaceId, revision, expectedRevision]); },
          getProgressionTemplates: function () { return unwrap("getProgressionTemplates", []); },
          saveProgressionTemplate: function (input) { return unwrap("saveProgressionTemplate", [input]); },
          deleteProgressionTemplate: function (templateId) { return unwrap("deleteProgressionTemplate", [templateId]); },
          restoreProgressionTemplates: function () { return unwrap("restoreProgressionTemplates", []); },
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
