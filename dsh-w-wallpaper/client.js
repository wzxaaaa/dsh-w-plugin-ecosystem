window.__ModuleLoader__.load({
  id: "dsh-w-wallpaper",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    var PLUGIN_ID = "dsh-w-wallpaper";
    var DB_NAME = "dsh-w-wallpaper";
    var DB_VERSION = 1;
    var STORE_NAME = "wallpaper";
    var RECORD_KEY = "active";
    var MIN_SPEED = 0.25;
    var MAX_SPEED = 4;
    var DEFAULT_SPEED = 1;
    var MIN_BLUR = 0;
    var MAX_BLUR = 40;
    var DEFAULT_BLUR = 18;
    var IMAGE_EXTENSIONS = ["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"];
    var VIDEO_EXTENSIONS = ["m4v", "mov", "mp4", "ogv", "webm"];

    var CSS = [
      "#dsh-w-wallpaper-layer{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;background:#000;--dsh-w-wallpaper-blur:18px;--dsh-w-wallpaper-bleed:36px;--dsh-w-wallpaper-offset:-36px}",
      "#dsh-w-wallpaper-layer[hidden]{display:none}",
      "#dsh-w-wallpaper-layer>img,#dsh-w-wallpaper-layer>video{position:absolute;top:var(--dsh-w-wallpaper-offset);left:var(--dsh-w-wallpaper-offset);display:block;width:calc(100% + var(--dsh-w-wallpaper-bleed) + var(--dsh-w-wallpaper-bleed));height:calc(100% + var(--dsh-w-wallpaper-bleed) + var(--dsh-w-wallpaper-bleed));object-fit:cover;object-position:center;filter:blur(var(--dsh-w-wallpaper-blur))}",
      "html[data-dsh-w-wallpaper-active]{background:#000}",
      "html[data-dsh-w-wallpaper-active] body{background:transparent!important}",
      "html[data-dsh-w-wallpaper-active] #root{position:relative;z-index:1;background:transparent!important}",
      "html[data-dsh-w-wallpaper-active] #root>div{background:transparent!important}",
      "body[data-dsh-w-wallpaper-active]{--dsw-alias-bg-base:transparent!important;--dsw-alias-bg-layer-1:rgb(255 255 255 / 76%)!important;--dsw-alias-bg-layer-2:rgb(255 255 255 / 66%)!important;--dsw-alias-bg-layer-3:rgb(255 255 255 / 88%)!important;--dsw-specific-sidebar-fill:transparent!important;--dsw-specific-input-major:rgb(255 255 255 / 78%)!important;--dsw-specific-selector:rgb(245 246 247 / 72%)!important;--dsw-specific-tip:rgb(245 246 247 / 76%)!important}",
      "body[data-ds-dark-theme][data-dsh-w-wallpaper-active]{--dsw-alias-bg-layer-1:rgb(35 35 36 / 78%)!important;--dsw-alias-bg-layer-2:rgb(44 44 46 / 70%)!important;--dsw-alias-bg-layer-3:rgb(53 54 56 / 90%)!important;--dsw-specific-sidebar-fill:transparent!important;--dsw-specific-input-major:rgb(35 35 36 / 82%)!important;--dsw-specific-selector:rgb(44 44 46 / 76%)!important;--dsw-specific-tip:rgb(44 44 46 / 80%)!important}",
      "body[data-dsh-w-wallpaper-active] :is([data-pane=sidebar],[class*=sidebarCol]){background:transparent!important}",
      "body[data-dsh-w-wallpaper-active] :is([data-pane=sidebar],[class*=sidebarCol])>div{background:transparent!important}",
      ".dshww-root{display:flex;flex-direction:column;gap:10px}",
      ".dshww-field{display:flex;flex-direction:column;gap:5px}",
      ".dshww-label{font-size:12px;font-weight:600;line-height:18px}",
      ".dshww-file{box-sizing:border-box;width:100%;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}",
      ".dshww-file::file-selector-button{margin-right:8px;padding:5px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer}",
      ".dshww-meta{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere}",
      ".dshww-slider-row{display:grid;grid-template-columns:minmax(0,1fr) 54px;align-items:center;gap:10px}",
      ".dshww-range{width:100%;accent-color:var(--dsw-alias-state-business-primary)}",
      ".dshww-number{box-sizing:border-box;width:54px;padding:5px 6px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;text-align:center;outline:none}",
      ".dshww-number:focus-visible{border-color:var(--dsw-alias-state-business-primary)}",
      ".dshww-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px}",
      ".dshww-button{border:1px solid transparent;border-radius:7px;padding:5px 13px;font:inherit;font-size:12px;line-height:18px;cursor:pointer}",
      ".dshww-button:disabled{cursor:default;opacity:.55}",
      ".dshww-apply{background:var(--dsw-alias-state-business-primary);color:#fff}",
      ".dshww-remove{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}",
      ".dshww-hint{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}",
      ".dshww-hint[data-kind=error]{color:var(--dsw-alias-state-danger-primary,#c33)}",
      ".dshww-hint[data-kind=success]{color:var(--dsw-alias-state-success-primary)}",
    ].join("\n");

    function installStyle() {
      var tagId = PLUGIN_ID + "/styles";
      var existing = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]");
      if (existing !== null) return { node: existing, owned: false };
      var style = document.createElement("style");
      style.dataset.plugin = PLUGIN_ID;
      style.dataset.pluginCss = tagId;
      style.textContent = CSS;
      document.head.appendChild(style);
      return { node: style, owned: true };
    }

    function extensionOf(name) {
      var match = typeof name === "string" ? name.toLowerCase().match(/\.([a-z0-9]+)$/) : null;
      return match === null ? "" : match[1];
    }

    function normalizeSpeed(value) {
      var parsed = Number(value);
      if (!Number.isFinite(parsed)) return DEFAULT_SPEED;
      return Math.min(MAX_SPEED, Math.max(MIN_SPEED, parsed));
    }

    function normalizeBlur(value) {
      var parsed = Number(value);
      if (!Number.isFinite(parsed)) return DEFAULT_BLUR;
      return Math.min(MAX_BLUR, Math.max(MIN_BLUR, parsed));
    }

    function detectKind(file) {
      if (!file || Number(file.size) <= 0) throw new Error("Wallpaper file is empty");
      var type = typeof file.type === "string" ? file.type.toLowerCase() : "";
      var extension = extensionOf(file.name);
      if (type.indexOf("image/") === 0 || IMAGE_EXTENSIONS.indexOf(extension) >= 0) return "image";
      if (type.indexOf("video/") === 0 || VIDEO_EXTENSIONS.indexOf(extension) >= 0) return "video";
      throw new Error("Wallpaper must be an image or video file");
    }

    function openDatabase() {
      return new Promise(function (resolve, reject) {
        if (typeof indexedDB === "undefined") {
          reject(new Error("IndexedDB is unavailable in this browser"));
          return;
        }
        var request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = function () {
          if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME);
        };
        request.onsuccess = function () { resolve(request.result); };
        request.onerror = function () { reject(request.error || new Error("Failed to open wallpaper storage")); };
      });
    }

    function databaseRequest(db, mode, operation) {
      return new Promise(function (resolve, reject) {
        var transaction = db.transaction(STORE_NAME, mode);
        var store = transaction.objectStore(STORE_NAME);
        var request = operation(store);
        request.onsuccess = function () { resolve(request.result); };
        request.onerror = function () { reject(request.error || new Error("Wallpaper storage request failed")); };
        transaction.onabort = function () { reject(transaction.error || new Error("Wallpaper storage transaction aborted")); };
      });
    }

    function createLayer() {
      var existing = document.getElementById("dsh-w-wallpaper-layer");
      if (existing !== null) return { node: existing, owned: false };
      var layer = document.createElement("div");
      layer.id = "dsh-w-wallpaper-layer";
      layer.hidden = true;
      layer.setAttribute("aria-hidden", "true");
      document.body.prepend(layer);
      return { node: layer, owned: true };
    }

    function WallpaperController() {
      this.db = null;
      this.layer = null;
      this.record = null;
      this.objectUrl = null;
      this.listeners = new Set();
      this.state = { status: "loading", record: null, error: null };
      this.visibilityHandler = null;
    }

    WallpaperController.prototype.snapshot = function () {
      return this.state;
    };

    WallpaperController.prototype.subscribe = function (listener) {
      this.listeners.add(listener);
      var self = this;
      return function () { self.listeners.delete(listener); };
    };

    WallpaperController.prototype.publish = function (state) {
      this.state = state;
      this.listeners.forEach(function (listener) { listener(state); });
    };

    WallpaperController.prototype.activateAttributes = function (active) {
      document.documentElement.toggleAttribute("data-dsh-w-wallpaper-active", active);
      document.body.toggleAttribute("data-dsh-w-wallpaper-active", active);
    };

    WallpaperController.prototype.applyRecord = function (record) {
      if (this.objectUrl !== null) URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
      this.record = record;
      var blur = record === null ? DEFAULT_BLUR : normalizeBlur(record.blur);
      this.layer.style.setProperty("--dsh-w-wallpaper-blur", blur + "px");
      this.layer.style.setProperty("--dsh-w-wallpaper-bleed", (blur * 2) + "px");
      this.layer.style.setProperty("--dsh-w-wallpaper-offset", (-blur * 2) + "px");
      this.layer.replaceChildren();
      if (record === null) {
        this.layer.hidden = true;
        this.activateAttributes(false);
        return;
      }
      var url = URL.createObjectURL(record.blob);
      this.objectUrl = url;
      var media;
      if (record.kind === "video") {
        media = document.createElement("video");
        media.autoplay = true;
        media.loop = true;
        media.muted = true;
        media.defaultMuted = true;
        media.playsInline = true;
        media.preload = "auto";
        media.defaultPlaybackRate = normalizeSpeed(record.speed);
        media.playbackRate = normalizeSpeed(record.speed);
        media.addEventListener("loadedmetadata", function () {
          media.defaultPlaybackRate = normalizeSpeed(record.speed);
          media.playbackRate = normalizeSpeed(record.speed);
          media.play().catch(function () {});
        });
      } else {
        media = document.createElement("img");
        media.alt = "";
        media.decoding = "async";
      }
      media.src = url;
      this.layer.appendChild(media);
      this.layer.hidden = false;
      this.activateAttributes(true);
      if (record.kind === "video") media.play().catch(function () {});
    };

    WallpaperController.prototype.initialize = async function (layer) {
      this.layer = layer;
      try {
        this.db = await openDatabase();
        var record = await databaseRequest(this.db, "readonly", function (store) { return store.get(RECORD_KEY); });
        if (record && record.blob instanceof Blob && (record.kind === "image" || record.kind === "video")) {
          record.speed = normalizeSpeed(record.speed);
          record.blur = normalizeBlur(record.blur);
          this.applyRecord(record);
          this.publish({ status: "ready", record: record, error: null });
        } else {
          this.applyRecord(null);
          this.publish({ status: "ready", record: null, error: null });
        }
        var self = this;
        this.visibilityHandler = function () {
          if (document.visibilityState !== "visible" || self.layer === null) return;
          var video = self.layer.querySelector("video");
          if (video !== null) video.play().catch(function () {});
        };
        document.addEventListener("visibilitychange", this.visibilityHandler);
      } catch (error) {
        this.publish({ status: "error", record: null, error: error });
      }
    };

    WallpaperController.prototype.save = async function (file, speed, blur) {
      if (this.db === null) throw new Error("Wallpaper storage is not ready");
      var normalized = normalizeSpeed(speed);
      var normalizedBlur = normalizeBlur(blur);
      var current = this.record;
      var kind = file ? detectKind(file) : current && current.kind;
      if (!file && current === null) throw new Error("Choose an image or video first");
      var record = {
        blob: file || current.blob,
        name: file ? (file.name || "wallpaper") : current.name,
        type: file ? (file.type || "") : current.type,
        size: file ? file.size : current.size,
        kind: kind,
        speed: normalized,
        blur: normalizedBlur,
        updatedAt: Date.now(),
      };
      await databaseRequest(this.db, "readwrite", function (store) { return store.put(record, RECORD_KEY); });
      this.applyRecord(record);
      this.publish({ status: "ready", record: record, error: null });
      return record;
    };

    WallpaperController.prototype.clear = async function () {
      if (this.db === null) throw new Error("Wallpaper storage is not ready");
      await databaseRequest(this.db, "readwrite", function (store) { return store.delete(RECORD_KEY); });
      this.applyRecord(null);
      this.publish({ status: "ready", record: null, error: null });
    };

    WallpaperController.prototype.dispose = function () {
      if (this.visibilityHandler !== null) document.removeEventListener("visibilitychange", this.visibilityHandler);
      if (this.layer !== null) {
        var video = this.layer.querySelector("video");
        if (video !== null) video.pause();
        this.layer.replaceChildren();
      }
      if (this.objectUrl !== null) URL.revokeObjectURL(this.objectUrl);
      if (this.db !== null) this.db.close();
      this.activateAttributes(false);
      this.listeners.clear();
    };

    function formatBytes(value) {
      var size = Number(value) || 0;
      if (size < 1024) return size + " B";
      if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
      if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + " MB";
      return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }

    function WallpaperSettings(props) {
      var controller = props.controller;
      var t = props.t;
      var stateSlot = React.useState(controller.snapshot());
      var state = stateSlot[0];
      var setState = stateSlot[1];
      var fileSlot = React.useState(null);
      var pendingFile = fileSlot[0];
      var setPendingFile = fileSlot[1];
      var speedSlot = React.useState(DEFAULT_SPEED);
      var speed = speedSlot[0];
      var setSpeed = speedSlot[1];
      var blurSlot = React.useState(DEFAULT_BLUR);
      var blur = blurSlot[0];
      var setBlur = blurSlot[1];
      var savingSlot = React.useState(false);
      var saving = savingSlot[0];
      var setSaving = savingSlot[1];
      var hintSlot = React.useState(null);
      var hint = hintSlot[0];
      var setHint = hintSlot[1];

      React.useEffect(function () {
        setState(controller.snapshot());
        return controller.subscribe(setState);
      }, [controller]);

      React.useEffect(function () {
        if (pendingFile === null && state.record !== null) {
          setSpeed(normalizeSpeed(state.record.speed));
          setBlur(normalizeBlur(state.record.blur));
        }
      }, [pendingFile, state.record]);

      var pendingKind = null;
      if (pendingFile !== null) {
        try { pendingKind = detectKind(pendingFile); } catch (_error) { pendingKind = "invalid"; }
      }
      var effectiveKind = pendingKind === null ? state.record && state.record.kind : pendingKind;
      var effectiveFile = pendingFile || state.record;

      function onApply() {
        setSaving(true);
        setHint(null);
        controller.save(pendingFile, speed, blur).then(
          function () {
            setSaving(false);
            setPendingFile(null);
            setHint({ kind: "success", text: t("applied") });
          },
          function (error) {
            setSaving(false);
            setHint({ kind: "error", text: error && error.message ? error.message : t("failed") });
          },
        );
      }

      function onClear() {
        setSaving(true);
        setHint(null);
        controller.clear().then(
          function () {
            setSaving(false);
            setPendingFile(null);
            setSpeed(DEFAULT_SPEED);
            setBlur(DEFAULT_BLUR);
            setHint({ kind: "success", text: t("removed") });
          },
          function (error) {
            setSaving(false);
            setHint({ kind: "error", text: error && error.message ? error.message : t("failed") });
          },
        );
      }

      if (state.status === "loading") return React.createElement("p", { className: "dshww-hint" }, t("loading"));
      if (state.status === "error") return React.createElement("p", { className: "dshww-hint", "data-kind": "error" }, state.error && state.error.message ? state.error.message : t("failed"));

      return React.createElement(
        "div",
        { className: "dshww-root" },
        React.createElement(
          "div",
          { className: "dshww-field" },
          React.createElement("label", { className: "dshww-label" }, t("mediaLabel")),
          React.createElement("input", {
            className: "dshww-file",
            type: "file",
            accept: "image/*,video/*,.m4v,.mov,.ogv",
            disabled: saving,
            onChange: function (event) {
              var file = event.currentTarget.files && event.currentTarget.files[0];
              setPendingFile(file || null);
              setHint(null);
            },
          }),
          effectiveFile !== null
            ? React.createElement("p", { className: "dshww-meta" }, (effectiveFile.name || t("unnamed")) + " · " + formatBytes(effectiveFile.size))
            : React.createElement("p", { className: "dshww-meta" }, t("mediaHint")),
        ),
        React.createElement(
          "div",
          { className: "dshww-field" },
          React.createElement("label", { className: "dshww-label" }, t("blurLabel")),
          React.createElement(
            "div",
            { className: "dshww-slider-row" },
            React.createElement("input", {
              className: "dshww-range",
              type: "range",
              min: MIN_BLUR,
              max: MAX_BLUR,
              step: 1,
              value: blur,
              disabled: saving,
              onChange: function (event) { setBlur(normalizeBlur(event.currentTarget.value)); },
            }),
            React.createElement("input", {
              className: "dshww-number",
              type: "number",
              min: MIN_BLUR,
              max: MAX_BLUR,
              step: 1,
              value: blur,
              disabled: saving,
              onChange: function (event) { setBlur(normalizeBlur(event.currentTarget.value)); },
            }),
          ),
          React.createElement("p", { className: "dshww-meta" }, blur.toFixed(0) + " px · " + t("blurHint")),
        ),
        effectiveKind === "video"
          ? React.createElement(
              "div",
              { className: "dshww-field" },
              React.createElement("label", { className: "dshww-label" }, t("speedLabel")),
              React.createElement(
                "div",
                { className: "dshww-slider-row" },
                React.createElement("input", {
                  className: "dshww-range",
                  type: "range",
                  min: MIN_SPEED,
                  max: MAX_SPEED,
                  step: 0.05,
                  value: speed,
                  disabled: saving,
                  onChange: function (event) { setSpeed(normalizeSpeed(event.currentTarget.value)); },
                }),
                React.createElement("input", {
                  className: "dshww-number",
                  type: "number",
                  min: MIN_SPEED,
                  max: MAX_SPEED,
                  step: 0.05,
                  value: speed,
                  disabled: saving,
                  onChange: function (event) { setSpeed(normalizeSpeed(event.currentTarget.value)); },
                }),
              ),
              React.createElement("p", { className: "dshww-meta" }, speed.toFixed(2) + "x"),
            )
          : null,
        pendingKind === "invalid"
          ? React.createElement("p", { className: "dshww-hint", "data-kind": "error" }, t("unsupported"))
          : null,
        React.createElement(
          "div",
          { className: "dshww-actions" },
          React.createElement(
            "button",
            {
              type: "button",
              className: "dshww-button dshww-apply",
              disabled: saving || effectiveFile === null || pendingKind === "invalid",
              onClick: onApply,
            },
            saving ? t("saving") : t("apply"),
          ),
          state.record !== null
            ? React.createElement(
                "button",
                { type: "button", className: "dshww-button dshww-remove", disabled: saving, onClick: onClear },
                t("remove"),
              )
            : null,
          hint !== null ? React.createElement("p", { className: "dshww-hint", "data-kind": hint.kind }, hint.text) : null,
        ),
      );
    }

    var NS = "dshWWallpaper";
    var inject = ["slots", "locale"];
    var dicts = {
      zh: {
        mediaLabel: "背景壁纸",
        mediaHint: "选择本地图片或视频，任意尺寸都会铺满界面。",
        blurLabel: "壁纸模糊程度",
        blurHint: "0 为完全清晰",
        speedLabel: "视频播放速度",
        apply: "应用",
        saving: "保存中...",
        remove: "移除壁纸",
        applied: "壁纸已应用",
        removed: "壁纸已移除",
        loading: "正在读取壁纸...",
        failed: "操作失败。",
        unsupported: "仅支持图片或视频文件。",
        unnamed: "未命名壁纸",
      },
      en: {
        mediaLabel: "Background wallpaper",
        mediaHint: "Choose a local image or video. Any dimensions will fill the window.",
        blurLabel: "Wallpaper blur",
        blurHint: "0 keeps the wallpaper sharp",
        speedLabel: "Video playback speed",
        apply: "Apply",
        saving: "Saving...",
        remove: "Remove wallpaper",
        applied: "Wallpaper applied",
        removed: "Wallpaper removed",
        loading: "Loading wallpaper...",
        failed: "Operation failed.",
        unsupported: "Choose an image or video file.",
        unnamed: "Unnamed wallpaper",
      },
    };

    function apply(ctx) {
      var style = installStyle();
      var layer = createLayer();
      var controller = new WallpaperController();
      void controller.initialize(layer.node);

      ctx.effect(function () { return ctx.locale.register(NS, dicts); });
      ctx.effect(function () {
        return function () {
          controller.dispose();
          if (layer.owned) layer.node.remove();
          if (style.owned) style.node.remove();
        };
      }, "dsh-w-wallpaper: global media layer");

      ctx.slots.inject("custom-plugin.settings", function () {
        return ctx.slots.register({
          name: "custom-plugin.settings",
          key: PLUGIN_ID,
          locale: NS,
          inject: function () { return { controller: controller }; },
        }, WallpaperSettings);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.name = PLUGIN_ID;
    return module.exports;
  },
});
