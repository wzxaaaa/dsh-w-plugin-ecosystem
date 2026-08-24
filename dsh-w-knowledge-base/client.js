window.__ModuleLoader__.load({
  id: "dsh-w-knowledge-base",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    // ── styles ───────────────────────────────────────────────────────────
    var CSS = [
      ".dshwkb-panel{--dshwkb-accent:var(--dsw-alias-state-business-primary,#3978e8);container:knowledge-panel / inline-size;display:flex;flex-direction:column;gap:12px;min-height:0;height:100%;box-sizing:border-box;padding:5px 3px;color:var(--dsw-alias-label-primary,#1f2329);font-family:var(--dsw-font-ui,ui-sans-serif,system-ui,sans-serif)}",
      ".dshwkb-panel[data-surface=sidebar]{padding:13px 12px;background:var(--dsw-specific-sidebar-fill,#f8fafc)}",
      ".dshwkb-head{display:flex;flex-direction:column;gap:9px;min-width:0;padding-bottom:1px}",
      ".dshwkb-head-top,.dshwkb-head-actions{display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0}",
      ".dshwkb-head-actions{flex-wrap:wrap}",
      ".dshwkb-headings{flex:1;min-width:0;display:flex;align-items:center;gap:8px}",
      ".dshwkb-title{font-size:16px;font-weight:600;line-height:22px}",
      ".dshwkb-meta{display:inline-flex;align-items:center;flex:none;height:26px;box-sizing:border-box;padding:0 10px;border:1px solid rgba(57,120,232,.15);border-radius:999px;background:rgba(57,120,232,.07);color:var(--dshwkb-accent);font-size:12px;font-weight:600;line-height:1;white-space:nowrap}",
      ".dshwkb-primary{flex:none;height:34px;padding:0 14px;border:0;border-radius:9px;background:var(--dshwkb-accent);color:#fff;font-size:13px;font-weight:650;box-shadow:0 2px 6px rgba(57,120,232,.22);cursor:pointer;transition:transform .15s,filter .15s,box-shadow .15s}",
      ".dshwkb-primary:hover{filter:brightness(1.04);box-shadow:0 4px 10px rgba(57,120,232,.27);transform:translateY(-1px)}",
      ".dshwkb-primary:disabled{opacity:.6;cursor:default}",
      ".dshwkb-ghost{flex:none;height:34px;padding:0 12px;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:9px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#1f2329);font-size:13px;font-weight:500;cursor:pointer}",
      ".dshwkb-ghost:hover{border-color:var(--dsw-alias-state-business-primary,#3978e8);color:var(--dsw-alias-state-business-primary,#3978e8)}",
      ".dshwkb-ghost[data-danger=true]:hover{border-color:#e04a4a;color:#e04a4a}",
      ".dshwkb-searchrow{display:flex;gap:6px;align-items:center;padding:3px 4px;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:12px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 3px 10px rgba(31,35,41,.045)}",
      ".dshwkb-searchrow .dshwkb-ghost{border:0;background:transparent}",
      ".dshwkb-input{flex:1;min-width:0;height:36px;padding:0 10px;box-sizing:border-box;border:0;border-radius:9px;background:transparent;color:inherit;font-size:13px;font-family:inherit}",
      ".dshwkb-input:focus{outline:none;background:var(--dsw-specific-sidebar-fill,#f7f8fa)}",
      ".dshwkb-textarea{width:100%;min-height:220px;flex:1;padding:10px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:8px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;font-size:13px;line-height:20px;font-family:var(--dsw-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);resize:vertical}",
      ".dshwkb-tags{display:flex;flex-wrap:nowrap;gap:7px;min-height:28px;overflow-x:auto;overflow-y:hidden;padding:1px 1px 4px;scrollbar-width:thin;scroll-snap-type:x proximity}",
      ".dshwkb-chip{height:27px;flex:none;padding:0 10px;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:999px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-secondary,#68717e);font-size:12px;white-space:nowrap;scroll-snap-align:start;cursor:pointer}",
      ".dshwkb-chip[data-active=true]{border-color:var(--dsw-alias-state-business-primary,#3978e8);background:var(--dsw-alias-interactive-bg-selected,#dce8ff);color:var(--dsw-alias-state-business-primary,#3978e8)}",
      ".dshwkb-list{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:9px;padding:1px 2px 5px 1px;scrollbar-gutter:stable}",
      ".dshwkb-row{width:100%;display:flex;flex-direction:column;gap:6px;padding:12px 13px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:12px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 2px 7px rgba(31,35,41,.035);text-align:left;cursor:pointer;transition:border-color .15s,background .15s,box-shadow .15s}",
      ".dshwkb-row:hover{border-color:rgba(57,120,232,.42);background:var(--dsw-alias-interactive-bg-hover,#f5f8ff);box-shadow:0 5px 14px rgba(31,35,41,.065)}",
      ".dshwkb-row-title{font-size:14px;font-weight:650;line-height:21px;overflow-wrap:anywhere}",
      ".dshwkb-row-preview{font-size:12.5px;line-height:19px;color:var(--dsw-alias-label-secondary,#68717e);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",
      ".dshwkb-row-foot{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:11px;color:var(--dsw-alias-label-tertiary,#87909d)}",
      ".dshwkb-row-tag{padding:0 6px;border-radius:9px;background:var(--dsw-specific-sidebar-fill,#f2f4f7);color:var(--dsw-alias-label-secondary,#68717e)}",
      ".dshwkb-detail{flex:1;min-height:0;display:flex;flex-direction:column;gap:10px}",
      ".dshwkb-detail-head{display:flex;flex-wrap:wrap;gap:8px;align-items:center}",
      ".dshwkb-detail-title{flex:1;min-width:0;font-size:15px;font-weight:600;line-height:22px;overflow-wrap:anywhere}",
      ".dshwkb-detail-meta{display:flex;flex-wrap:wrap;gap:10px;font-size:11px;color:var(--dsw-alias-label-tertiary,#87909d);overflow-wrap:anywhere}",
      ".dshwkb-body{flex:1;min-height:0;margin:0;overflow:auto;padding:12px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:10px;background:var(--dsw-specific-sidebar-fill,#fafbfc);font-family:var(--dsw-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);font-size:12px;line-height:19px;white-space:pre-wrap;overflow-wrap:anywhere}",
      ".dshwkb-field{display:flex;flex-direction:column;gap:4px}",
      ".dshwkb-label{font-size:12px;color:var(--dsw-alias-label-secondary,#68717e)}",
      ".dshwkb-status{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary,#68717e);overflow-wrap:anywhere}",
      ".dshwkb-panel>.dshwkb-status:not([data-kind]){padding:9px 11px;border:1px solid rgba(57,120,232,.13);border-left:3px solid var(--dshwkb-accent);border-radius:9px;background:rgba(57,120,232,.045);line-height:19px}",
      ".dshwkb-status[data-kind=error]{color:#e04a4a}",
      ".dshwkb-status[data-kind=ok]{color:#2aa06a}",
      ".dshwkb-empty{padding:22px 4px;color:var(--dsw-alias-label-tertiary,#87909d);font-size:13px;line-height:20px}",
      ".dshwkb-rail-button{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:10px;background:transparent;color:var(--dsw-alias-label-secondary,#68717e);cursor:pointer}",
      ".dshwkb-rail-button:hover{background:var(--dsw-alias-interactive-bg-hover,#e9edf3);color:var(--dsw-alias-label-primary,#1f2329)}",
      ".dshwkb-rail-button[data-active=true]{background:var(--dsw-alias-interactive-bg-selected,#dce8ff);color:var(--dsw-alias-state-business-primary,#3978e8)}",
  ".dshwkb-modebar{display:flex;flex:none;gap:3px;max-width:100%;padding:3px;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:11px;background:rgba(31,35,41,.035);width:max-content}",
  ".dshwkb-mode{height:29px;padding:0 11px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary,#68717e);font-size:12px;font-weight:500;white-space:nowrap;cursor:pointer}",
  ".dshwkb-mode[data-active=true]{background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#1f2329);box-shadow:0 1px 3px rgba(31,35,41,.12)}",
  ".dshwkb-head-actions>.dshwkb-primary{margin-left:auto}",
  "@container knowledge-panel (max-width:380px){.dshwkb-head-top{align-items:center}.dshwkb-head-top .dshwkb-modebar{min-width:0}.dshwkb-head-actions{display:grid;grid-template-columns:minmax(0,1fr) auto}.dshwkb-head-actions .dshwkb-modebar{min-width:0;width:auto}.dshwkb-head-actions .dshwkb-mode{flex:1;padding:0 8px}.dshwkb-head-actions>.dshwkb-primary{margin-left:0;padding:0 12px}.dshwkb-row{padding:11px 12px}}",
  ".dshwkb-dropzone{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:170px;padding:22px 18px;box-sizing:border-box;border:1.5px dashed rgba(57,120,232,.35);border-radius:14px;background:rgba(57,120,232,.035);text-align:center;transition:border-color .15s,background .15s}",
  ".dshwkb-dropzone[data-over=true]{border-color:var(--dsw-alias-state-business-primary,#3978e8);background:var(--dsw-alias-interactive-bg-hover,#f5f8ff)}",
  ".dshwkb-drop-title{font-size:14px;font-weight:600;line-height:20px}",
  ".dshwkb-drop-hint{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary,#68717e);max-width:420px}",
  ".dshwkb-drop-note{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#87909d);max-width:440px}",
  ".dshwkb-imports{display:flex;flex-direction:column;gap:8px;overflow:auto;flex:1;min-height:0}",
  ".dshwkb-import-card{display:flex;flex-direction:column;gap:7px;padding:12px 13px;border:1px solid var(--dsw-alias-border-l1,#e6e9ee);border-radius:12px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 2px 7px rgba(31,35,41,.035)}",
  ".dshwkb-import-card[data-kind=error]{border-color:#f2b8b8;background:#fff7f7}",
  ".dshwkb-import-head{display:flex;flex-wrap:wrap;gap:6px;align-items:center}",
  ".dshwkb-import-name{flex:1;min-width:0;font-size:13px;font-weight:600;line-height:20px;overflow-wrap:anywhere}",
  ".dshwkb-import-summary{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary,#68717e)}",
  ".dshwkb-import-notes{display:flex;flex-direction:column;gap:2px;max-height:120px;overflow:auto;font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#87909d)}",
  ".dshwkb-import-stale{color:#c96a2b}",
  ".dshwkb-import-actions{display:flex;gap:8px}",
  ".dshwkb-browse-hint{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#87909d);cursor:pointer}",
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

    // ── note list ────────────────────────────────────────────────────────
    function NoteRow(props) {
      var note = props.note;
      var t = props.t;
      var foot = [
        React.createElement("span", { key: "updated" }, t("updatedLabel") + " " + shortDate(note.updated)),
        React.createElement("span", { key: "chars" }, note.chars + " " + t("charsLabel")),
      ];
      if (note.score > 0) foot.push(React.createElement("span", { key: "score" }, t("scoreLabel") + " " + note.score));
      var tags = (note.tags || []).map(function (tag) {
        return React.createElement("span", { className: "dshwkb-row-tag", key: "tag-" + tag }, tag);
      });
      return React.createElement("button", {
        type: "button",
        className: "dshwkb-row",
        onClick: function () { props.onOpen(note.id); },
      },
        React.createElement("span", { className: "dshwkb-row-title" }, note.title),
        note.preview ? React.createElement("span", { className: "dshwkb-row-preview" }, note.preview) : null,
        React.createElement("span", { className: "dshwkb-row-foot" }, tags.concat(foot))
      );
    }

    // ── one note, viewed or edited ────────────────────────────────────────
    function NoteDetail(props) {
      var t = props.t;
      var note = props.note;
      var editing = props.editing;
      var draft = props.draft;
      var meta = editing && note.id === ""
        ? [React.createElement("span", { key: "new" }, t("newNote"))]
        : [
          React.createElement("span", { key: "id" }, t("idLabel") + " " + note.id),
          React.createElement("span", { key: "created" }, t("createdLabel") + " " + shortDate(note.created)),
          React.createElement("span", { key: "updated" }, t("updatedLabel") + " " + shortDate(note.updated)),
          note.path ? React.createElement("span", { key: "path" }, t("pathLabel") + " " + note.path) : null,
          note.source ? React.createElement("span", { key: "source" }, t("sourceLabel") + " " + note.source) : null,
          note.workspace ? React.createElement("span", { key: "workspace" }, t("workspaceLabel") + " " + note.workspace) : null,
        ];
      var actions = editing
        ? [
          React.createElement("button", { key: "save", type: "button", className: "dshwkb-primary", disabled: props.busy, onClick: props.onSave }, props.busy ? t("saving") : t("save")),
          React.createElement("button", { key: "cancel", type: "button", className: "dshwkb-ghost", disabled: props.busy, onClick: props.onCancel }, t("cancel")),
        ]
        : [
          React.createElement("button", { key: "edit", type: "button", className: "dshwkb-ghost", onClick: props.onEdit }, t("edit")),
          React.createElement("button", {
            key: "delete",
            type: "button",
            className: "dshwkb-ghost",
            "data-danger": "true",
            disabled: props.busy,
            onClick: props.onDelete,
          }, props.busy ? t("removing") : props.confirming ? t("confirmRemove") : t("remove")),
        ];
      return React.createElement("div", { className: "dshwkb-detail" },
        React.createElement("div", { className: "dshwkb-detail-head" },
          React.createElement("button", { type: "button", className: "dshwkb-ghost", onClick: props.onBack }, t("back")),
          React.createElement("span", { className: "dshwkb-detail-title" }, editing ? (draft.title || t("newNote")) : note.title),
          actions
        ),
        React.createElement("div", { className: "dshwkb-detail-meta" }, meta),
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
          }, entry.tag + " (" + entry.count + ")");
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
        body = React.createElement("div", { className: "dshwkb-empty" }, t("loading"));
      } else if (view.notes.length === 0) {
        body = React.createElement("div", { className: "dshwkb-empty" }, query === "" && activeTag === "" ? t("empty") : t("emptyQuery"));
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
            React.createElement("div", { className: "dshwkb-import-actions" },
              React.createElement("button", { type: "button", className: "dshwkb-ghost", onClick: function () { viewNotes(value.docSlug || ""); } }, t("viewNotes"))
            )
          );
        }
        return React.createElement("div", { className: "dshwkb-import-card", "data-kind": entry.ok ? "ok" : "error", key: "import-" + index + "-" + entry.name },
          React.createElement("div", { className: "dshwkb-import-head" },
            React.createElement("span", { className: "dshwkb-import-name" }, entry.name),
            React.createElement("span", { className: "dshwkb-row-tag" }, t(entry.ok ? "dropped" : "importFailed"))
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
            onDragLeave: function () {
              setDropOver(false);
            },
            onDrop: function (event) {
              event.preventDefault();
              setDropOver(false);
              feedFiles(event.dataTransfer && event.dataTransfer.files);
            },
          },
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
            ? React.createElement("div", { className: "dshwkb-empty" }, t("dropHint"))
            : React.createElement("div", { className: "dshwkb-imports" },
              imports.map(renderImportResult),
              React.createElement("div", { className: "dshwkb-import-actions" },
                React.createElement("button", { type: "button", className: "dshwkb-ghost", onClick: function () { setImports([]); } }, t("refresh"))
              )
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
        return React.createElement("div", { className: "dshwkb-detail" },
          React.createElement("div", { className: "dshwkb-label" }, t("bannedHint")),
          banned.isDefault ? React.createElement("div", { className: "dshwkb-status" }, t("bannedDefault")) : null,
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
          React.createElement("div", { className: "dshwkb-import-actions" },
            React.createElement("button", {
              type: "button",
              className: "dshwkb-primary",
              disabled: bannedSaving || banned.status === "loading",
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
              React.createElement("div", { className: "dshwkb-meta", title: view.root || undefined }, view.total + " " + t("countLabel"))
            ),
            React.createElement("div", { className: "dshwkb-modebar", "data-role": "working" },
            React.createElement("button", {
              type: "button",
              className: "dshwkb-mode",
              disabled: switching,
              "data-active": workMode === "assistant" || undefined,
              onClick: function () { switchWorkingMode("assistant"); },
            }, t("workAssistant")),
            React.createElement("button", {
              type: "button",
              className: "dshwkb-mode",
              disabled: switching,
              "data-active": workMode === "writing" || undefined,
              onClick: function () { switchWorkingMode("writing"); },
            }, t("workWriting"))
            )
          ),
          React.createElement("div", { className: "dshwkb-head-actions" },
            React.createElement("div", { className: "dshwkb-modebar" },
              React.createElement("button", {
              type: "button",
              className: "dshwkb-mode",
              "data-active": mode === "browse" || undefined,
              onClick: function () { setMode("browse"); setSelected(null); setEditing(false); setNotice(null); },
              }, t("modeNotes")),
              React.createElement("button", {
              type: "button",
              className: "dshwkb-mode",
              "data-active": mode === "feed" || undefined,
              onClick: function () { setMode("feed"); setSelected(null); setEditing(false); setNotice(null); },
              }, t("modeFeed")),
              workMode === "writing"
                ? React.createElement("button", {
                  type: "button",
                  className: "dshwkb-mode",
                  "data-active": mode === "banned" || undefined,
                  onClick: openBanned,
                  }, t("modeBanned"))
                : null
            ),
            mode !== "banned"
              ? React.createElement("button", { type: "button", className: "dshwkb-primary", onClick: startCreate }, t("create"))
              : null
          )
        ),
        workMode === "writing" && mode !== "banned"
          ? React.createElement("div", { className: "dshwkb-status" }, t("workHintWriting"))
          : null,
        mode === "banned"
          ? renderBanned()
          : mode === "feed"
          ? renderFeed()
          : React.createElement(React.Fragment, null,
            selected === null
              ? React.createElement("div", { className: "dshwkb-searchrow" },
                React.createElement("input", {
                  className: "dshwkb-input",
                  value: query,
                  placeholder: t("searchPlaceholder"),
                  onChange: function (event) { setQuery(event.target.value); },
                }),
                React.createElement("button", { type: "button", className: "dshwkb-ghost", onClick: function () { load(query, activeTag); } }, t("refresh"))
              )
              : null,
            selected === null && view.total === 0
              ? React.createElement("span", { className: "dshwkb-browse-hint", onClick: function () { setMode("feed"); } }, t("browseHint"))
              : null,
            selected === null ? chips : null,
            view.warnings.length > 0 && selected === null
              ? React.createElement("div", { className: "dshwkb-status" }, t("warnings") + ": " + view.warnings.join("; "))
              : null,
            body
          ),
        notice !== null ? React.createElement("div", { className: "dshwkb-status", "data-kind": notice.kind }, notice.text) : null
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
          if (!result.ok) throw new Error(method + " failed: " + JSON.stringify(result.error));
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
