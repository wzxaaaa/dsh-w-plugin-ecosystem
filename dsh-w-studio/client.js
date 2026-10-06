window.__ModuleLoader__.load({id:"dsh-w-studio",factory:(require)=>{var module={exports:{}};var exports=module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// ../../../deepseek-harness/vendor/cosmokit/src/misc.ts
function isNullable(value) {
  return value === null || value === void 0;
}
function isPlainObject(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}
function filterKeys(object, filter) {
  return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
}
function mapValues(object, transform) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
}
function pick(source, keys, forced) {
  if (!keys) return { ...source };
  const result = {};
  for (const key of keys) {
    if (forced || source[key] !== void 0) result[key] = source[key];
  }
  return result;
}

// ../../../deepseek-harness/vendor/cosmokit/src/types.ts
function is(type, value) {
  if (arguments.length === 1) return (value2) => is(type, value2);
  return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
function isArrayBufferLike(value) {
  return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
}
function isArrayBufferSource(value) {
  return isArrayBufferLike(value) || ArrayBuffer.isView(value);
}
var Binary;
((Binary2) => {
  Binary2.is = isArrayBufferLike;
  Binary2.isSource = isArrayBufferSource;
  function fromSource(source) {
    if (ArrayBuffer.isView(source)) {
      return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
    } else {
      return source;
    }
  }
  Binary2.fromSource = fromSource;
  function toBase64(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") {
      return Buffer.from(source).toString("base64");
    }
    let binary = "";
    const bytes = new Uint8Array(source);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  Binary2.toBase64 = toBase64;
  function fromBase64(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
    return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
  }
  Binary2.fromBase64 = fromBase64;
  function toHex(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
    return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  Binary2.toHex = toHex;
  function fromHex(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
    const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
    const buffer = [];
    for (let i = 0; i < hex.length; i += 2) {
      buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
    }
    return Uint8Array.from(buffer).buffer;
  }
  Binary2.fromHex = fromHex;
})(Binary || (Binary = {}));
var base64ToArrayBuffer = Binary.fromBase64;
var arrayBufferToBase64 = Binary.toBase64;
var hexToArrayBuffer = Binary.fromHex;
var arrayBufferToHex = Binary.toHex;
function clone(source, refs = /* @__PURE__ */ new Map()) {
  if (!source || typeof source !== "object") return source;
  if (is("Date", source)) return new Date(source.valueOf());
  if (is("RegExp", source)) return new RegExp(source.source, source.flags);
  if (isArrayBufferLike(source)) return source.slice(0);
  if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  const cached = refs.get(source);
  if (cached) return cached;
  if (Array.isArray(source)) {
    const result2 = [];
    refs.set(source, result2);
    source.forEach((value, index) => {
      result2[index] = Reflect.apply(clone, null, [value, refs]);
    });
    return result2;
  }
  const result = Object.create(Object.getPrototypeOf(source));
  refs.set(source, result);
  for (const key of Reflect.ownKeys(source)) {
    const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
    if ("value" in descriptor) {
      descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
    }
    Reflect.defineProperty(result, key, descriptor);
  }
  return result;
}
function deepEqual(a, b, strict) {
  if (a === b) return true;
  if (!strict && isNullable(a) && isNullable(b)) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (!a || !b) return false;
  function check(test, then) {
    return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
  }
  return check(Array.isArray, (a2, b2) => a2.length === b2.length && a2.every((item, index) => deepEqual(item, b2[index]))) ?? check(is("Date"), (a2, b2) => a2.valueOf() === b2.valueOf()) ?? check(is("RegExp"), (a2, b2) => a2.source === b2.source && a2.flags === b2.flags) ?? check(isArrayBufferLike, (a2, b2) => {
    if (a2.byteLength !== b2.byteLength) return false;
    const viewA = new Uint8Array(a2);
    const viewB = new Uint8Array(b2);
    for (let i = 0; i < viewA.length; i++) {
      if (viewA[i] !== viewB[i]) return false;
    }
    return true;
  }) ?? Object.keys({ ...a, ...b }).every((key) => deepEqual(a[key], b[key], strict));
}

// ../../../deepseek-harness/vendor/cosmokit/src/time.ts
var Time;
((Time2) => {
  Time2.millisecond = 1;
  Time2.second = 1e3;
  Time2.minute = Time2.second * 60;
  Time2.hour = Time2.minute * 60;
  Time2.day = Time2.hour * 24;
  Time2.week = Time2.day * 7;
  let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
  function setTimezoneOffset(offset) {
    timezoneOffset = offset;
  }
  Time2.setTimezoneOffset = setTimezoneOffset;
  function getTimezoneOffset() {
    return timezoneOffset;
  }
  Time2.getTimezoneOffset = getTimezoneOffset;
  function getDateNumber(date2 = /* @__PURE__ */ new Date(), offset) {
    if (typeof date2 === "number") date2 = new Date(date2);
    if (offset === void 0) offset = timezoneOffset;
    return Math.floor((date2.valueOf() / Time2.minute - offset) / 1440);
  }
  Time2.getDateNumber = getDateNumber;
  function fromDateNumber(value, offset) {
    const date2 = new Date(value * Time2.day);
    if (offset === void 0) offset = timezoneOffset;
    return new Date(+date2 + offset * Time2.minute);
  }
  Time2.fromDateNumber = fromDateNumber;
  const numeric = /\d+(?:\.\d+)?/.source;
  const timeRegExp = new RegExp(`^${[
    "w(?:eek(?:s)?)?",
    "d(?:ay(?:s)?)?",
    "h(?:our(?:s)?)?",
    "m(?:in(?:ute)?(?:s)?)?",
    "s(?:ec(?:ond)?(?:s)?)?"
  ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
  function parseTime(source) {
    const capture = timeRegExp.exec(source);
    if (!capture) return 0;
    return (parseFloat(capture[1]) * Time2.week || 0) + (parseFloat(capture[2]) * Time2.day || 0) + (parseFloat(capture[3]) * Time2.hour || 0) + (parseFloat(capture[4]) * Time2.minute || 0) + (parseFloat(capture[5]) * Time2.second || 0);
  }
  Time2.parseTime = parseTime;
  function parseDate(date2) {
    const parsed = parseTime(date2);
    if (parsed) {
      date2 = Date.now() + parsed;
    } else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date2)) {
      date2 = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date2}`;
    } else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date2)) {
      date2 = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date2}`;
    }
    return date2 ? new Date(date2) : /* @__PURE__ */ new Date();
  }
  Time2.parseDate = parseDate;
  function format(ms) {
    const abs = Math.abs(ms);
    if (abs >= Time2.day - Time2.hour / 2) {
      return Math.round(ms / Time2.day) + "d";
    } else if (abs >= Time2.hour - Time2.minute / 2) {
      return Math.round(ms / Time2.hour) + "h";
    } else if (abs >= Time2.minute - Time2.second / 2) {
      return Math.round(ms / Time2.minute) + "m";
    } else if (abs >= Time2.second) {
      return Math.round(ms / Time2.second) + "s";
    }
    return ms + "ms";
  }
  Time2.format = format;
  function toDigits(source, length = 2) {
    return source.toString().padStart(length, "0");
  }
  Time2.toDigits = toDigits;
  function template(template2, time = /* @__PURE__ */ new Date()) {
    return template2.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
  }
  Time2.template = template;
})(Time || (Time = {}));

// ../../../deepseek-harness/vendor/schemastery/lib/index.mjs
var kSchema = /* @__PURE__ */ Symbol.for("schemastery");
var kValidationError = /* @__PURE__ */ Symbol.for("ValidationError");
globalThis.__schemastery_index__ ??= 0;
globalThis.__schemastery_refs__ = void 0;
var ValidationError = class extends TypeError {
  options;
  name = "ValidationError";
  constructor(message, options) {
    let prefix = "$";
    for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
    else if (typeof segment === "number") prefix += "[" + segment + "]";
    else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
    if (prefix.startsWith(".")) prefix = prefix.slice(1);
    super((prefix === "$" ? "" : `${prefix} `) + message);
    this.options = options;
  }
  static is(error) {
    return !!error?.[kValidationError];
  }
};
Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
var Schema = function(options) {
  const schema = function(data, options2 = {}) {
    return Schema.resolve(data, schema, options2)[0];
  };
  if (options.refs) {
    const refs = mapValues(options.refs, (options2) => new Schema(options2));
    const getRef = (uid) => refs[uid];
    for (const key in refs) {
      const options2 = refs[key];
      options2.sKey = getRef(options2.sKey);
      options2.inner = getRef(options2.inner);
      options2.list = options2.list && options2.list.map(getRef);
      options2.dict = options2.dict && mapValues(options2.dict, getRef);
    }
    return refs[options.uid];
  }
  Object.assign(schema, options);
  if (typeof schema.callback === "string") try {
    schema.callback = new Function("return " + schema.callback)();
  } catch {
  }
  Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
  Object.setPrototypeOf(schema, Schema.prototype);
  schema.meta ||= {};
  schema.toString = schema.toString.bind(schema);
  return schema;
};
Schema.prototype = Object.create(Function.prototype);
Schema.prototype[kSchema] = true;
Object.defineProperty(Schema.prototype, "~standard", { get() {
  return {
    version: 1,
    vendor: "schemastery",
    validate: (value) => {
      try {
        return { value: Schema.resolve(value, this, {})[0] };
      } catch (error) {
        if (ValidationError.is(error)) return { issues: [{
          message: error.message,
          path: error.options.path
        }] };
        throw error;
      }
    }
  };
} });
Schema.ValidationError = ValidationError;
Schema.prototype.toJSON = function toJSON() {
  if (globalThis.__schemastery_refs__) {
    globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
    return this.uid;
  }
  globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
  globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
  const result = {
    uid: this.uid,
    refs: globalThis.__schemastery_refs__
  };
  globalThis.__schemastery_refs__ = void 0;
  return result;
};
Schema.prototype.set = function set(key, value) {
  this.dict[key] = value;
  return this;
};
Schema.prototype.push = function push(value) {
  this.list.push(value);
  return this;
};
function mergeDesc(original, messages) {
  const result = typeof original === "string" ? { "": original } : { ...original };
  for (const locale in messages) {
    const value = messages[locale];
    if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
    else if (typeof value === "string") result[locale] = value;
  }
  return result;
}
function getInner(value) {
  return value?.$value ?? value?.$inner;
}
function extractKeys(data) {
  return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
}
Schema.prototype.i18n = function i18n(messages) {
  const schema = Schema(this);
  const desc = mergeDesc(schema.meta.description, messages);
  if (Object.keys(desc).length) schema.meta.description = desc;
  if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
    return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
  });
  if (schema.list) schema.list = schema.list.map((inner, index) => {
    return inner.i18n(mapValues(messages, (data = {}) => {
      if (Array.isArray(getInner(data))) return getInner(data)[index];
      if (Array.isArray(data)) return data[index];
      return extractKeys(data);
    }));
  });
  if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
    if (getInner(data)) return getInner(data);
    return extractKeys(data);
  }));
  if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
  return schema;
};
Schema.prototype.extra = function extra(key, value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
};
for (const key of [
  "required",
  "disabled",
  "collapse",
  "hidden",
  "loose"
]) Object.assign(Schema.prototype, { [key](value = true) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
Schema.prototype.deprecated = function deprecated() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "deprecated",
    type: "danger"
  });
  return schema;
};
Schema.prototype.experimental = function experimental() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "experimental",
    type: "warning"
  });
  return schema;
};
Schema.prototype.pattern = function pattern(regexp) {
  const schema = Schema(this);
  const pattern2 = pick(regexp, ["source", "flags"]);
  schema.meta = {
    ...schema.meta,
    pattern: pattern2
  };
  return schema;
};
Schema.prototype.simplify = function simplify(value) {
  if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
  if (isNullable(value)) return value;
  if (this.type === "object" || this.type === "dict") {
    const result = {};
    for (const key in value) {
      const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
      if (this.type === "dict" || !isNullable(item)) result[key] = item;
    }
    if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
    return result;
  } else if (this.type === "array" || this.type === "tuple") {
    const result = [];
    value.forEach((value2, index) => {
      const schema = this.type === "array" ? this.inner : this.list[index];
      const item = schema ? schema.simplify(value2) : value2;
      result.push(item);
    });
    return result;
  } else if (this.type === "intersect") {
    const result = {};
    for (const item of this.list) Object.assign(result, item.simplify(value));
    return result;
  } else if (this.type === "union") for (const schema of this.list) try {
    Schema.resolve(value, schema, {});
    return schema.simplify(value);
  } catch {
  }
  return value;
};
Schema.prototype.toString = function toString(inline) {
  return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
};
Schema.prototype.role = function role(role, extra2) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    role,
    extra: extra2
  };
  return schema;
};
for (const key of [
  "default",
  "link",
  "comment",
  "description",
  "max",
  "min",
  "step"
]) Object.assign(Schema.prototype, { [key](value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
var resolvers = {};
Schema.extend = function extend(type, resolve2) {
  resolvers[type] = resolve2;
};
Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
  if (!schema) return [data];
  if (options.ignore?.(data, schema)) return [data];
  if (isNullable(data) && schema.type !== "lazy") {
    if (schema.meta.required) throw new ValidationError(`missing required value`, options);
    let current = schema;
    let fallback = schema.meta.default;
    while (current?.type === "intersect" && isNullable(fallback)) {
      current = current.list[0];
      fallback = current?.meta.default;
    }
    if (isNullable(fallback)) return [data];
    data = clone(fallback);
  }
  const callback = resolvers[schema.type];
  if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
  try {
    return callback(data, schema, options, strict);
  } catch (error) {
    if (!schema.meta.loose) throw error;
    return [schema.meta.default];
  }
};
Schema.from = function from(source) {
  if (isNullable(source)) return Schema.any();
  else if ([
    "string",
    "number",
    "boolean"
  ].includes(typeof source)) return Schema.const(source).required();
  else if (source[kSchema]) return source;
  else if (typeof source === "function") switch (source) {
    case String:
      return Schema.string().required();
    case Number:
      return Schema.number().required();
    case Boolean:
      return Schema.boolean().required();
    case Function:
      return Schema.function().required();
    default:
      return Schema.is(source).required();
  }
  else throw new TypeError(`cannot infer schema from ${source}`);
};
Schema.lazy = function lazy(builder) {
  const toJSON2 = () => {
    if (!schema.inner[kSchema]) {
      schema.inner = schema.builder();
      schema.inner.meta = {
        ...schema.meta,
        ...schema.inner.meta
      };
    }
    return schema.inner.toJSON();
  };
  const schema = new Schema({
    type: "lazy",
    builder,
    inner: { toJSON: toJSON2 }
  });
  return schema;
};
Schema.natural = function natural() {
  return Schema.number().step(1).min(0);
};
Schema.percent = function percent() {
  return Schema.number().step(0.01).min(0).max(1).role("slider");
};
Schema.date = function date() {
  return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
    const date2 = new Date(value);
    if (isNaN(+date2)) throw new ValidationError(`invalid date "${value}"`, options);
    return date2;
  }, true)]);
};
Schema.regExp = function regExp(flag = "") {
  return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
    try {
      return new RegExp(value, flag);
    } catch (e) {
      throw new ValidationError(e.message, options);
    }
  }, true)]);
};
Schema.arrayBuffer = function arrayBuffer(encoding) {
  return Schema.union([
    Schema.is(ArrayBuffer),
    Schema.is(SharedArrayBuffer),
    Schema.transform(Schema.any(), (value, options) => {
      if (Binary.isSource(value)) return Binary.fromSource(value);
      throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
    }, true),
    ...encoding ? [Schema.transform(Schema.string(), (value, options) => {
      try {
        return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
      } catch (e) {
        throw new ValidationError(e.message, options);
      }
    }, true)] : []
  ]);
};
Schema.extend("lazy", (data, schema, options, strict) => {
  if (!schema.inner[kSchema]) {
    schema.inner = schema.builder();
    schema.inner.meta = {
      ...schema.meta,
      ...schema.inner.meta
    };
  }
  return Schema.resolve(data, schema.inner, options, strict);
});
Schema.extend("any", (data) => {
  return [data];
});
Schema.extend("never", (data, _, options) => {
  throw new ValidationError(`expected nullable but got ${data}`, options);
});
Schema.extend("const", (data, { value }, options) => {
  if (deepEqual(data, value)) return [value];
  throw new ValidationError(`expected ${value} but got ${data}`, options);
});
function checkWithinRange(data, meta, description, options, skipMin = false) {
  const { max = Infinity, min = -Infinity } = meta;
  if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
  if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
}
Schema.extend("string", (data, { meta }, options) => {
  if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
  if (meta.pattern) {
    const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
    if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
  }
  checkWithinRange(data.length, meta, "string length", options);
  return [data];
});
function decimalShift(data, digits) {
  const str = data.toString();
  if (str.includes("e")) return data * Math.pow(10, digits);
  const index = str.indexOf(".");
  if (index === -1) return data * Math.pow(10, digits);
  const frac = str.slice(index + 1);
  const integer = str.slice(0, index);
  if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
  return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
}
function isMultipleOf(data, min, step) {
  step = Math.abs(step);
  if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
  const index = step.toString().indexOf(".");
  const digits = step.toString().slice(index + 1).length;
  return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
}
Schema.extend("number", (data, { meta }, options) => {
  if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
  checkWithinRange(data, meta, "number", options);
  const { step } = meta;
  if (step && !isMultipleOf(data, meta.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
  return [data];
});
Schema.extend("boolean", (data, _, options) => {
  if (typeof data === "boolean") return [data];
  throw new ValidationError(`expected boolean but got ${data}`, options);
});
Schema.extend("bitset", (data, { bits, meta }, options) => {
  let value = 0, keys = [];
  if (typeof data === "number") {
    value = data;
    for (const key in bits) if (data & bits[key]) keys.push(key);
  } else if (Array.isArray(data)) {
    keys = data;
    for (const key of keys) {
      if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
      if (key in bits) value |= bits[key];
    }
  } else throw new ValidationError(`expected number or array but got ${data}`, options);
  if (value === meta.default) return [value];
  return [value, keys];
});
Schema.extend("function", (data, _, options) => {
  if (typeof data === "function") return [data];
  throw new ValidationError(`expected function but got ${data}`, options);
});
Schema.extend("is", (data, { constructor }, options) => {
  if (typeof constructor === "function") {
    if (data instanceof constructor) return [data];
    throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
  } else {
    if (isNullable(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
    let prototype = Object.getPrototypeOf(data);
    while (prototype) {
      if (prototype.constructor?.name === constructor) return [data];
      prototype = Object.getPrototypeOf(prototype);
    }
    throw new ValidationError(`expected ${constructor} but got ${data}`, options);
  }
});
function property(data, key, schema, options) {
  try {
    const [value, adapted] = Schema.resolve(data[key], schema, {
      ...options,
      path: [...options.path || [], key]
    });
    if (adapted !== void 0) data[key] = adapted;
    return value;
  } catch (e) {
    if (!options?.autofix) throw e;
    delete data[key];
    return schema.meta.default;
  }
}
Schema.extend("array", (data, { inner, meta }, options) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
  return [data.map((_, index) => property(data, index, inner, options))];
});
Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in data) {
    let rKey;
    try {
      rKey = Schema.resolve(key, sKey, options)[0];
    } catch (error) {
      if (strict) continue;
      throw error;
    }
    result[rKey] = property(data, key, inner, options);
    data[rKey] = data[key];
    if (key !== rKey) delete data[key];
  }
  return [result];
});
Schema.extend("tuple", (data, { list }, options, strict) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  const result = list.map((inner, index) => property(data, index, inner, options));
  if (strict) return [result];
  result.push(...data.slice(list.length));
  return [result];
});
function merge(result, data) {
  for (const key in data) {
    if (key in result) continue;
    result[key] = data[key];
  }
}
Schema.extend("object", (data, { dict }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in dict) {
    const value = property(data, key, dict[key], options);
    if (!isNullable(value) || key in data) result[key] = value;
  }
  if (!strict) merge(result, data);
  return [result];
});
Schema.extend("union", (data, { list, toString: toString2 }, options, strict) => {
  const messages = [];
  for (const inner of list) try {
    return Schema.resolve(data, inner, options, strict);
  } catch (error) {
    messages.push(error);
  }
  throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
});
Schema.extend("intersect", (data, { list, toString: toString2 }, options, strict) => {
  if (!list.length) return [data];
  let result;
  for (const inner of list) {
    const value = Schema.resolve(data, inner, options, true)[0];
    if (isNullable(value)) continue;
    if (isNullable(result)) result = value;
    else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
    else if (typeof value === "object") merge(result ??= {}, value);
    else if (result !== value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
  }
  if (!strict && isPlainObject(data)) merge(result, data);
  return [result];
});
Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
  const [result, adapted = data] = Schema.resolve(data, inner, options, true);
  if (preserve) return [callback(result)];
  else return [callback(result), callback(adapted)];
});
var formatters = {};
function defineMethod(name, keys, format) {
  formatters[name] = format;
  Object.assign(Schema, { [name](...args) {
    const schema = new Schema({ type: name });
    keys.forEach((key, index) => {
      switch (key) {
        case "sKey":
          schema.sKey = args[index] ?? Schema.string();
          break;
        case "inner":
          schema.inner = Schema.from(args[index]);
          break;
        case "list":
          schema.list = args[index].map(Schema.from);
          break;
        case "dict":
          schema.dict = mapValues(args[index], Schema.from);
          break;
        case "bits":
          schema.bits = {};
          for (const key2 in args[index]) {
            if (typeof args[index][key2] !== "number") continue;
            schema.bits[key2] = args[index][key2];
          }
          break;
        case "callback": {
          const callback = schema.callback = args[index];
          callback["toJSON"] ||= () => callback.toString();
          break;
        }
        case "constructor": {
          const constructor = schema.constructor = args[index];
          if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
          break;
        }
        default:
          schema[key] = args[index];
      }
    });
    if (name === "object" || name === "dict") schema.meta.default = {};
    else if (name === "array" || name === "tuple") schema.meta.default = [];
    else if (name === "bitset") schema.meta.default = 0;
    return schema;
  } });
}
defineMethod("is", ["constructor"], ({ constructor }) => {
  if (typeof constructor === "function") return constructor.name;
  else return constructor;
});
defineMethod("any", [], () => "any");
defineMethod("never", [], () => "never");
defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
defineMethod("string", [], () => "string");
defineMethod("number", [], () => "number");
defineMethod("boolean", [], () => "boolean");
defineMethod("bitset", ["bits"], () => "bitset");
defineMethod("function", [], () => "function");
defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
defineMethod("object", ["dict"], ({ dict }) => {
  if (Object.keys(dict).length === 0) return "{}";
  return `{ ${Object.entries(dict).map(([key, inner]) => {
    return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
  }).join(", ")} }`;
});
defineMethod("union", ["list"], ({ list }, inline) => {
  const result = list.map(({ toString: format }) => format()).join(" | ");
  return inline ? `(${result})` : result;
});
defineMethod("intersect", ["list"], ({ list }) => {
  return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
});
defineMethod("transform", [
  "inner",
  "callback",
  "preserve"
], ({ inner }, isInner) => inner.toString(isInner));

// src/schema.ts
function knownFields(input, schema) {
  if (schema.type === "object" && typeof input === "object" && input !== null && !Array.isArray(input)) {
    for (const key of Object.keys(schema.dict ?? {})) {
      if (!Object.hasOwn(input, key)) throw new Error(`Missing Studio field: ${key}`);
    }
    for (const [key, value] of Object.entries(input)) {
      if (!schema.dict || !Object.hasOwn(schema.dict, key)) throw new Error(`Unexpected Studio field: ${key}`);
      const member = schema.dict[key];
      if (member === void 0) throw new Error(`Missing Studio field validator: ${key}`);
      knownFields(value, member);
    }
  } else if (schema.type === "array" && Array.isArray(input) && schema.inner) {
    for (const value of input) knownFields(value, schema.inner);
  }
}
function parseFields(schema, input) {
  knownFields(input, schema);
  return Schema.resolve(input, schema, {})[0];
}
var id = Schema.string().pattern(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/).required();
var text = Schema.string().max(1e5).required();
var short = Schema.string().max(500).required();
var engine = Schema.union(["codex", "claude", "harness", "compatible"]).required();
var permission = Schema.union(["read-only", "workspace-write", "full-access"]).required();
var memberFields = {
  name: short,
  role: short,
  responsibilities: text,
  engine,
  model: short,
  effort: short,
  permission,
  baseURL: short,
  apiKeyEnv: short,
  thinkingFormat: Schema.union(["none", "deepseek", "zai"]).required(),
  contextWindow: Schema.number().step(1).min(1024).max(1e7).required(),
  maxTokens: Schema.number().step(1).min(1).max(1e6).required()
};
var employeeSchema = Schema.object({ ...memberFields, id, cwd: short, enabled: Schema.boolean().required() });
var memberSchema = Schema.object(memberFields);
var projectFields = {
  id,
  name: short,
  objective: text,
  cwd: short,
  status: Schema.union(["paused", "running", "completed"]).required(),
  createdAt: short
};
var taskFields = {
  id,
  projectId: id,
  employeeId: id,
  title: short,
  instruction: text,
  dependsOn: Schema.array(id).required(),
  outputFiles: Schema.array(short).required(),
  status: Schema.union(["pending", "running", "completed", "failed", "cancelled", "interrupted"]).required(),
  attempt: Schema.natural().required(),
  result: text,
  error: text,
  startedAt: short,
  finishedAt: short,
  assignment: text
};
var stateV1Fields = {
  version: Schema.const(1).required(),
  revision: Schema.natural().required(),
  employees: Schema.array(employeeSchema).required(),
  projects: Schema.array(Schema.object(projectFields)).required(),
  tasks: Schema.array(Schema.object(taskFields)).required(),
  messages: Schema.array(Schema.object({
    id,
    projectId: id,
    taskId: Schema.union([id, Schema.const(null)]),
    from: id,
    to: id,
    message: text,
    createdAt: short
  })).required(),
  artifacts: Schema.array(Schema.object({
    id,
    projectId: id,
    taskId: id,
    name: short,
    size: Schema.natural().required(),
    sha256: short
  })).required()
};
var stateV1Schema = Schema.object(stateV1Fields);
var nativeSessionSchema = Schema.object({
  id,
  engine,
  cwd: short,
  attempt: Schema.natural().min(1).required(),
  continued: Schema.boolean().required()
});
var nativeSession = nativeSessionSchema;
var taskV2Fields = {
  ...taskFields,
  nativeSessions: Schema.array(nativeSession).required(),
  reviewStatus: Schema.union(["pending", "accepted", "superseded"]).required()
};
var stateV2Fields = {
  ...stateV1Fields,
  version: Schema.const(2).required(),
  workspaces: Schema.array(Schema.object({ id, name: short, path: short, createdAt: short })).required(),
  activeWorkspaceId: Schema.union([id, Schema.const(null)]),
  projects: Schema.array(Schema.object({
    ...projectFields,
    workspaceId: id,
    acceptanceCriteria: text,
    sessionMode: Schema.union(["employee-project", "new-task"]).required(),
    status: Schema.union(["paused", "running", "review", "completed"]).required()
  })).required(),
  tasks: Schema.array(Schema.object(taskV2Fields)).required()
};
var stateV2Schema = Schema.object(stateV2Fields);
var minutesSchema = Schema.object({
  summary: text,
  decisions: Schema.array(text).required(),
  projectName: short,
  objective: text,
  acceptanceCriteria: text,
  tasks: Schema.array(Schema.object({ employeeId: id, title: short, instruction: text })).required()
});
var meeting = Schema.object({
  id,
  workspaceId: id,
  title: short,
  agenda: text,
  hostId: id,
  attendeeIds: Schema.array(id).required(),
  status: Schema.union(["open", "drafting", "review", "closed"]).required(),
  queue: Schema.array(id).required(),
  speaking: Schema.union([id, Schema.const(null)]),
  error: text,
  messages: Schema.array(Schema.object({
    id,
    from: id,
    message: text,
    mentions: Schema.array(id).required(),
    createdAt: short,
    nativeSession: Schema.union([nativeSession, Schema.const(null)])
  })).required(),
  minutes: Schema.union([minutesSchema, Schema.const(null)]),
  projectId: Schema.union([id, Schema.const(null)]),
  createdAt: short
});
var stateV3Fields = { ...stateV2Fields, version: Schema.const(3).required(), meetings: Schema.array(meeting).required() };
var stateV3Schema = Schema.object(stateV3Fields);
var templateSchema = Schema.object({ id, name: short, description: text, members: Schema.array(memberSchema).required(), createdAt: short });
var stateV4Fields = { ...stateV3Fields, version: Schema.const(4).required(), templates: Schema.array(templateSchema).required() };
var stateV4Schema = Schema.object(stateV4Fields);
var stateSchema = Schema.object({
  ...stateV4Fields,
  version: Schema.const(5).required(),
  tasks: Schema.array(Schema.object({
    ...taskV2Fields,
    status: Schema.union(["pending", "running", "waiting", "completed", "failed", "cancelled", "interrupted"]).required(),
    question: text,
    reply: text
  })).required()
});

// src/client/controller.ts
var engineHealth = Schema.object({ available: Schema.boolean().required(), version: Schema.string().required() });
var healthSchema = Schema.object({ codex: engineHealth.required(), claude: engineHealth.required(), harness: engineHealth.required() });
var model = Schema.object({
  id: Schema.string().required(),
  name: Schema.string().required(),
  efforts: Schema.array(Schema.string()).required(),
  imageInput: Schema.union([Schema.boolean(), Schema.const(null)])
});
var progressSchema = Schema.dict(Schema.object({ text: Schema.string().required(), at: Schema.string().required() }));
var catalogSchema = Schema.object({
  codex: Schema.array(model).required(),
  claude: Schema.array(model).required(),
  claudeError: Schema.string().required(),
  harness: Schema.array(model).required()
});
var StudioController = class {
  view = { state: null, progress: {}, health: null, catalog: null, error: "", busy: false };
  listeners = /* @__PURE__ */ new Set();
  controller = new AbortController();
  timer;
  interval = 1500;
  refreshPromise;
  /** Read the current stable observable snapshot.
   * @returns The current public company view.
   */
  getSnapshot = () => this.view;
  /** Subscribe through the renderer's injected hook.
   * @param listener - Snapshot notification.
   * @returns Subscription disposer.
   */
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  publish(patch) {
    if (this.controller.signal.aborted) return;
    this.view = { ...this.view, ...patch };
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (error) {
        console.error("Studio snapshot subscriber failed", error);
      }
    }
  }
  async request(path, input) {
    const response = await fetch(`/api/studio/${path}`, {
      signal: this.controller.signal,
      credentials: "same-origin",
      ...input === void 0 ? {} : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }
    });
    const value = await response.json();
    if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("Invalid Studio response");
    const reply = value;
    if (!response.ok) throw new Error(typeof reply.error === "string" ? reply.error : `Studio HTTP ${response.status}`);
    return reply;
  }
  adopt(value) {
    const state = parseFields(stateSchema, value);
    if (this.view.state === null || state.revision >= this.view.state.revision) this.publish({ state, error: "" });
  }
  /** Reload current state, sharing one pending poll.
   * @returns Poll completion.
   */
  refresh = () => {
    this.refreshPromise ??= (async () => {
      try {
        const reply = await this.request("state");
        this.adopt(reply.state);
        this.publish({ progress: parseFields(progressSchema, reply.progress ?? {}) });
        if (typeof reply.pollIntervalMs === "number") this.interval = reply.pollIntervalMs;
      } catch (error) {
        this.publish({ error: error instanceof Error ? error.message : "Studio connection failed" });
      } finally {
        this.refreshPromise = void 0;
      }
    })();
    return this.refreshPromise;
  };
  /** Start one cancellable polling generation.
   * @returns Lifecycle disposer.
   */
  start() {
    const poll = async () => {
      await this.refresh();
      if (!this.controller.signal.aborted) this.timer = setTimeout(() => {
        void poll();
      }, this.interval);
    };
    void poll();
    void this.request("catalog").then((catalog) => {
      this.publish({ catalog: parseFields(catalogSchema, catalog) });
    }).catch((error) => {
      this.publish({ error: error instanceof Error ? error.message : "Model catalog unavailable" });
    });
    return () => {
      this.listeners.clear();
      this.controller.abort();
      if (this.timer !== void 0) clearTimeout(this.timer);
    };
  }
  /** Submit one command against the observed revision.
   * @param action - Command name.
   * @param input - Action-specific JSON.
   * @returns Success after the committed response, or false with an inline diagnostic.
   */
  command = async (action, input) => {
    if (this.view.busy || !this.view.state) return false;
    this.publish({ busy: true, error: "" });
    try {
      const reply = await this.request("command", { action, input, expectedRevision: this.view.state.revision });
      this.adopt(reply.state);
      return true;
    } catch (error) {
      await this.refresh();
      this.publish({ error: error instanceof Error ? error.message : "Studio command failed" });
      return false;
    } finally {
      this.publish({ busy: false });
    }
  };
  /** Probe native executables without creating model work.
   * @returns Probe completion.
   */
  checkHealth = async () => {
    try {
      this.publish({ health: parseFields(healthSchema, await this.request("health")) });
    } catch (error) {
      this.publish({ error: error instanceof Error ? error.message : "Connection probe failed" });
    }
  };
};

// src/client/StudioPanel.tsx
var import_react12 = require("react");

// src/client/HandoffTimeline.tsx
var import_react2 = require("react");

// src/client/ui.ts
var import_react = require("react");
function waitingOn(task, tasks) {
  return task.dependsOn.map((id2) => tasks.find((value) => value.id === id2)).filter((value) => !!value && value.status !== "completed");
}
function taskPhase(task, tasks) {
  return task.status === "pending" && waitingOn(task, tasks).length ? "blocked" : task.status;
}
function revisionOf(task, tasks) {
  return task.dependsOn.map((id2) => tasks.find((value) => value.id === id2)).find((value) => value?.reviewStatus === "superseded" && value.employeeId === task.employeeId && value.title === task.title);
}
function revisionsFor(task, tasks) {
  return task.reviewStatus === "superseded" ? tasks.filter((value) => revisionOf(value, tasks)?.id === task.id) : [];
}
function changeRequest(revision, messages) {
  return messages.find((message) => message.taskId === revision.id && message.from === "user");
}
function projectStats(tasks) {
  const phases = tasks.map((task) => taskPhase(task, tasks));
  const count = (...values) => phases.filter((phase) => values.includes(phase)).length;
  const active = tasks.filter((task) => task.status !== "cancelled").length;
  return {
    total: tasks.length,
    active,
    completed: count("completed"),
    running: count("running"),
    ready: count("pending"),
    blocked: count("blocked"),
    needsYou: count("waiting"),
    attention: count("failed", "interrupted", "cancelled"),
    review: tasks.filter((task) => task.status === "completed" && task.reviewStatus === "pending").length
  };
}
function tone(id2) {
  let hash = 0;
  for (const char of id2) hash = hash * 31 + char.charCodeAt(0) >>> 0;
  return hash % 6;
}
function initial(name) {
  return [...name?.trim() || "?"][0]?.toUpperCase() ?? "?";
}
function employeeOf(employees, id2) {
  return employees.find((value) => value.id === id2);
}
var kinds = {
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  bmp: "image",
  md: "document",
  markdown: "document",
  txt: "document",
  rst: "document",
  pdf: "document",
  docx: "document",
  html: "web",
  htm: "web",
  css: "web",
  json: "data",
  csv: "data",
  yml: "data",
  yaml: "data",
  toml: "data",
  xml: "data",
  ts: "code",
  tsx: "code",
  js: "code",
  jsx: "code",
  mjs: "code",
  cjs: "code",
  py: "code",
  go: "code",
  rs: "code",
  java: "code",
  kt: "code",
  swift: "code",
  c: "code",
  h: "code",
  cpp: "code",
  cs: "code",
  rb: "code",
  php: "code",
  sh: "code",
  ps1: "code",
  sql: "code",
  vue: "code"
};
function fileKind(name) {
  return kinds[name.split(".").at(-1)?.toLowerCase() ?? ""] ?? "other";
}
var imageTypes = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml", bmp: "image/bmp" };
function imageType(name) {
  return imageTypes[name.split(".").at(-1)?.toLowerCase() ?? ""] ?? "";
}
function previewableText(artifact) {
  const kind = fileKind(artifact.name);
  return artifact.size <= 512 * 1024 && (kind === "code" || kind === "data" || kind === "web" || kind === "document" && !/\.(pdf|docx)$/i.test(artifact.name));
}
function artifactUrl(artifact) {
  return `/api/studio/artifact?id=${encodeURIComponent(artifact.id)}`;
}
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
function formatTime(iso) {
  if (!iso) return "";
  const date2 = new Date(iso);
  return Number.isNaN(date2.getTime()) ? iso : date2.toLocaleString(void 0, { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function resumeCommand(session) {
  return session.engine === "claude" ? `claude --resume ${session.id}` : session.engine === "codex" ? `codex resume ${session.id}` : session.id;
}
function usePending() {
  const [pending, setPending] = (0, import_react.useState)(null);
  const run = async (key, action) => {
    setPending(key);
    try {
      return await action();
    } finally {
      setPending(null);
    }
  };
  return { pending, run };
}

// src/client/Studio.module.css
var tagId = "dsh-w-studio/styles";
if (typeof document !== "undefined") {
  let tag = document.querySelector('style[data-plugin-css="' + tagId + '"]');
  if (!tag) {
    tag = document.createElement("style");
    tag.dataset.plugin = "dsh-w-studio";
    tag.dataset.pluginCss = tagId;
    document.head.appendChild(tag);
  }
  tag.textContent = '.r2poiG_studio{--s-bg:var(--dsw-alias-bg-base,#fff);--s-raised:var(--dsw-alias-bg-layer-1,#fff);--s-sunken:var(--dsw-alias-interactive-bg-hover,#2631480d);--s-hover:var(--dsw-alias-interactive-bg-hover,#2631480f);--s-active:var(--dsw-alias-interactive-bg-active,#2631481a);--s-ink:var(--dsw-alias-label-primary,#141b2b);--s-ink-2:var(--dsw-alias-label-secondary,#3d475c);--s-muted:var(--dsw-alias-label-tertiary,#5e6a80);--s-faint:var(--dsw-alias-label-caption,#8e98aa);--s-line:var(--dsw-alias-border-l2,#0000001a);--s-line-soft:var(--dsw-alias-border-l1,#0000000d);--s-line-strong:var(--dsw-alias-border-l3,#00000024);--s-accent:var(--dsw-alias-state-business-primary,#3a6ff7);--s-accent-soft:var(--dsw-alias-state-business-tertiary,#e8efff);--s-primary:var(--dsw-alias-button-primary-fill,#141b2b);--s-primary-hover:var(--dsw-alias-button-primary-hover,#2d3548);--s-on-primary:var(--dsw-alias-label-primary-inverted,#fff);--s-ok:var(--dsw-alias-state-success-primary,#1f9d55);--s-ok-soft:var(--dsw-alias-state-success-tertiary,#e3f6ea);--s-warn:var(--dsw-alias-state-warn-label,#b46a00);--s-warn-soft:var(--dsw-alias-state-warn-tertiary,#fff3dc);--s-bad:var(--dsw-alias-state-error-primary,#d42a2a);--s-bad-soft:var(--dsw-alias-interactive-bg-hover-danger,#ec131314);--s-radius:10px;--s-radius-sm:7px;--s-shadow:var(--dsw-elevation-prominent,0 8px 28px #141b2b24);--s-mono:var(--ds-font-family-code,"SF Mono", "JetBrains Mono", Consolas, monospace);--s-gutter:28px;background:var(--s-bg);height:100%;color:var(--s-ink);font-family:var(--dsw-font-family,-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif);font-size:14px;line-height:1.6;overflow:hidden auto}body[data-ds-dark-theme] .r2poiG_studio{--s-sunken:#ffffff0a}.r2poiG_studio *,.r2poiG_studio :before,.r2poiG_studio :after{box-sizing:border-box}.r2poiG_studio h1,.r2poiG_studio h2,.r2poiG_studio h3,.r2poiG_studio h4,.r2poiG_studio p,.r2poiG_studio ul,.r2poiG_studio ol,.r2poiG_studio dl,.r2poiG_studio dd,.r2poiG_studio blockquote,.r2poiG_studio fieldset{margin:0}.r2poiG_studio h2{font-size:17px;font-weight:650;line-height:1.4}.r2poiG_studio h3{color:var(--studio-h3,var(--s-ink-2));font-size:13px;font-weight:600;line-height:1.4}.r2poiG_studio h4{color:var(--s-muted);margin:14px 0 6px;font-size:12px;font-weight:600}.r2poiG_studio ul,.r2poiG_studio ol{padding:0;list-style:none}.r2poiG_studio fieldset{border:0;min-width:0;padding:0}.r2poiG_studio legend{padding:0}.r2poiG_studio small{font-size:12px}.r2poiG_studio code{font-family:var(--s-mono);font-size:12px}.r2poiG_studio button,.r2poiG_studio input,.r2poiG_studio textarea,.r2poiG_studio select{font:inherit;color:inherit}.r2poiG_studio button,.r2poiG_linkButton{border:1px solid var(--s-line-strong);border-radius:var(--s-radius-sm);background:var(--s-raised);min-height:34px;color:var(--s-ink);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;padding:6px 14px;font-size:13px;font-weight:500;line-height:1.4;text-decoration:none;transition:background .12s,border-color .12s,color .12s;display:inline-flex}.r2poiG_studio button:hover:not(:disabled),.r2poiG_linkButton:hover{background:var(--s-hover)}.r2poiG_studio button:disabled{opacity:.45;cursor:not-allowed}.r2poiG_studio :focus-visible{outline:2px solid var(--s-accent);outline-offset:2px}.r2poiG_studio .r2poiG_primary{background:var(--s-primary);border-color:var(--s-primary);color:var(--s-on-primary)}.r2poiG_studio .r2poiG_primary:hover:not(:disabled){background:var(--s-primary-hover);border-color:var(--s-primary-hover)}.r2poiG_studio .r2poiG_ghost{color:var(--s-ink-2);background:0 0;border-color:#0000}.r2poiG_studio .r2poiG_ghost:hover:not(:disabled){background:var(--s-hover);color:var(--s-ink)}.r2poiG_studio .r2poiG_ghostDanger{color:var(--s-bad);background:0 0;border-color:#0000}.r2poiG_studio .r2poiG_ghostDanger:hover:not(:disabled){background:var(--s-bad-soft)}.r2poiG_studio .r2poiG_dangerSolid{background:var(--s-bad);border-color:var(--s-bad);color:#fff}.r2poiG_studio .r2poiG_iconButton{width:32px;min-height:32px;color:var(--s-muted);background:0 0;border-color:#0000;padding:0;font-size:20px}.r2poiG_studio input,.r2poiG_studio textarea,.r2poiG_studio select{border:1px solid var(--s-line-strong);border-radius:var(--s-radius-sm);background:var(--s-raised);width:100%;min-width:0;min-height:36px;color:var(--s-ink);padding:7px 11px;font-size:13px;line-height:1.5}.r2poiG_studio textarea{resize:vertical}.r2poiG_studio input:hover,.r2poiG_studio textarea:hover,.r2poiG_studio select:hover{border-color:var(--s-faint)}.r2poiG_studio input:focus,.r2poiG_studio textarea:focus,.r2poiG_studio select:focus{border-color:var(--s-accent);box-shadow:0 0 0 3px var(--s-accent-soft);outline:none}.r2poiG_studio input::placeholder,.r2poiG_studio textarea::placeholder{color:var(--s-faint)}.r2poiG_studio input[type=checkbox],.r2poiG_studio input[type=radio]{width:16px;height:16px;min-height:0;accent-color:var(--s-accent);box-shadow:none;flex:none;margin:0;padding:0}.r2poiG_spinner{vertical-align:-1px;border:2px solid;border-right-color:#0000;border-radius:50%;width:12px;height:12px;animation:.7s linear infinite r2poiG_spin;display:inline-block}@keyframes r2poiG_spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){.r2poiG_spinner{animation-duration:2s}}.r2poiG_mono{overflow-wrap:anywhere;font-size:12px;font-family:var(--s-mono)!important}.r2poiG_muted{color:var(--s-muted);font-size:12px}.r2poiG_hint{color:var(--s-muted);font-size:12px;line-height:1.6}.r2poiG_footnote{color:var(--s-faint);font-size:12px;margin-top:20px!important}.r2poiG_srOnly{clip:rect(0 0 0 0);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.r2poiG_actions{flex-wrap:wrap;align-items:center;gap:8px;display:flex}.r2poiG_report{white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font:inherit;color:var(--s-ink);margin:0;font-size:13px;line-height:1.75}.r2poiG_topbar{padding:22px var(--s-gutter) 16px;justify-content:space-between;align-items:center;gap:24px;display:flex}.r2poiG_brand{min-width:0}.r2poiG_brand h1{letter-spacing:-.3px;font-size:24px;font-weight:700;line-height:1.3}.r2poiG_brand p{color:var(--s-muted);font-size:13px}.r2poiG_workspace{align-items:flex-end;gap:8px;min-width:0;display:flex}.r2poiG_workspacePicker{gap:2px;width:340px;min-width:0;max-width:100%;display:grid}.r2poiG_workspacePicker>span{color:var(--s-faint);letter-spacing:.2px;font-size:11px;font-weight:500}.r2poiG_workspacePicker select{font-weight:600}.r2poiG_workspacePicker small{color:var(--s-faint);white-space:nowrap;text-overflow:ellipsis;font-size:11px;overflow:hidden}.r2poiG_workspaceForm{margin:0 var(--s-gutter) 16px;border:1px solid var(--s-line);border-radius:var(--s-radius);background:var(--s-sunken);gap:14px;padding:18px 20px;display:grid}.r2poiG_workspaceForm form{gap:12px;display:grid}.r2poiG_inputWithButton{gap:8px;display:flex}.r2poiG_tabs{z-index:3;padding:0 var(--s-gutter);border-bottom:1px solid var(--s-line);background:var(--s-bg);justify-content:space-between;align-items:center;gap:12px;display:flex;position:sticky;top:0}.r2poiG_tabList{scrollbar-width:none;gap:4px;min-width:0;display:flex;overflow-x:auto}.r2poiG_studio .r2poiG_tab{min-height:44px;color:var(--s-muted);background:0 0;border:0;border-radius:0;padding:10px 12px;font-size:14px;position:relative}.r2poiG_studio .r2poiG_tab:hover:not(:disabled){color:var(--s-ink);background:0 0}.r2poiG_studio .r2poiG_tab[aria-current=page]{color:var(--s-ink);font-weight:600}.r2poiG_studio .r2poiG_tab[aria-current=page]:after{content:"";background:var(--s-ink);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:10px;right:10px}.r2poiG_count{background:var(--s-sunken);min-width:20px;color:var(--s-muted);text-align:center;border-radius:10px;padding:0 6px;font-size:11px;font-weight:500;line-height:18px}.r2poiG_banner{margin:14px var(--s-gutter) 0;border-radius:var(--s-radius-sm);background:var(--s-bad-soft);color:var(--s-bad);overflow-wrap:anywhere;justify-content:space-between;align-items:center;gap:12px;padding:10px 14px;font-size:13px;display:flex}.r2poiG_emptyState{margin:28px var(--s-gutter);border:1px dashed var(--s-line-strong);border-radius:var(--s-radius);text-align:center;color:var(--s-muted);justify-items:center;gap:8px;padding:40px 20px;display:grid}.r2poiG_emptyState strong{color:var(--s-ink);font-size:15px}.r2poiG_detailPane .r2poiG_emptyState,.r2poiG_listPane .r2poiG_emptyState{margin:12px 0}.r2poiG_emptyInline{color:var(--s-faint);padding:4px 0;font-size:13px}.r2poiG_inlineError{color:var(--s-bad);overflow-wrap:anywhere;font-size:12px}.r2poiG_badge{background:var(--s-sunken);height:22px;color:var(--s-muted);white-space:nowrap;border-radius:11px;align-items:center;gap:5px;padding:0 8px;font-size:11.5px;font-weight:500;display:inline-flex}.r2poiG_badge i{background:currentColor;border-radius:50%;width:6px;height:6px}.r2poiG_badge[data-status=running],.r2poiG_badge[data-project=running]{background:var(--s-accent-soft);color:var(--s-accent)}.r2poiG_badge[data-status=running] i,.r2poiG_badge[data-project=running] i{animation:1.4s ease-in-out infinite r2poiG_pulse}.r2poiG_badge[data-status=completed],.r2poiG_badge[data-project=completed]{background:var(--s-ok-soft);color:var(--s-ok)}.r2poiG_badge[data-status=blocked]{color:var(--s-faint)}.r2poiG_badge[data-status=failed],.r2poiG_badge[data-status=interrupted]{background:var(--s-bad-soft);color:var(--s-bad)}.r2poiG_badge[data-status=waiting]{background:var(--s-warn-soft);color:var(--s-warn)}.r2poiG_badge[data-status=cancelled]{color:var(--s-faint);text-decoration:line-through}.r2poiG_badge[data-project=review],.r2poiG_badge[data-review=pending]{background:var(--s-warn-soft);color:var(--s-warn)}.r2poiG_badge[data-review=accepted]{color:var(--s-ok);border:1px solid var(--s-ok-soft);background:0 0}.r2poiG_badge[data-review=superseded]{color:var(--s-muted);border:1px dashed var(--s-line-strong);background:0 0}@keyframes r2poiG_pulse{50%{opacity:.35}}.r2poiG_engineTag{white-space:nowrap;background:var(--s-sunken);color:var(--s-ink-2);border-radius:5px;padding:0 7px;font-size:11px;font-weight:600;line-height:19px;display:inline-block}.r2poiG_engineTag[data-engine=codex]{color:#0d8a6b;background:#10a37f1f}.r2poiG_engineTag[data-engine=claude]{color:#b85a3b;background:#d9775724}.r2poiG_engineTag[data-engine=harness]{color:#4060e0;background:#4d6bfe21}.r2poiG_engineTag[data-engine=compatible]{color:#7a4fd0;background:#8c5ce621}body[data-ds-dark-theme] .r2poiG_engineTag[data-engine=codex]{color:#4cd3ad}body[data-ds-dark-theme] .r2poiG_engineTag[data-engine=claude]{color:#f0a084}body[data-ds-dark-theme] .r2poiG_engineTag[data-engine=harness]{color:#93a8ff}body[data-ds-dark-theme] .r2poiG_engineTag[data-engine=compatible]{color:#c3a5ff}.r2poiG_avatar{--h:220;background:hsl(var(--h) 80% 55% / .14);width:34px;height:34px;color:hsl(var(--h) 55% 38%);border-radius:50%;flex:none;place-items:center;font-size:14px;font-weight:600;display:inline-grid}.r2poiG_avatar[data-size=sm]{width:22px;height:22px;font-size:11px}.r2poiG_avatar[data-size=lg]{width:46px;height:46px;font-size:19px}.r2poiG_avatar[data-tone="1"]{--h:265}.r2poiG_avatar[data-tone="2"]{--h:150}.r2poiG_avatar[data-tone="3"]{--h:30}.r2poiG_avatar[data-tone="4"]{--h:330}.r2poiG_avatar[data-tone="5"]{--h:190}.r2poiG_avatar[data-tone=user]{background:var(--s-primary);color:var(--s-on-primary)}body[data-ds-dark-theme] .r2poiG_avatar{color:hsl(var(--h) 80% 76%);background:hsl(var(--h) 60% 55% / .22)}.r2poiG_workArea{grid-template-columns:minmax(300px,400px) minmax(0,1fr);align-items:start;gap:0;display:grid}.r2poiG_listPane{padding:20px var(--s-gutter) 32px;border-right:1px solid var(--s-line);align-self:stretch;min-width:0}.r2poiG_detailPane{padding:20px var(--s-gutter) 40px;min-width:0;scroll-margin-top:52px}.r2poiG_paneHead{justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px;display:flex}.r2poiG_toolRow{gap:8px;margin-bottom:10px;display:flex}.r2poiG_toolRow input{flex:1}.r2poiG_menu{position:relative}.r2poiG_menu>summary{border:1px solid var(--s-line-strong);border-radius:var(--s-radius-sm);cursor:pointer;white-space:nowrap;align-items:center;gap:6px;min-height:36px;padding:6px 12px;font-size:13px;font-weight:500;list-style:none;display:inline-flex}.r2poiG_menu>summary::-webkit-details-marker{display:none}.r2poiG_menu>summary:after{content:"\u25BE";color:var(--s-muted);font-size:10px}.r2poiG_menu[open]>summary{background:var(--s-hover)}.r2poiG_menuBody{z-index:5;border:1px solid var(--s-line);border-radius:var(--s-radius);background:var(--dsw-specific-menu,var(--s-raised));width:280px;box-shadow:var(--s-shadow);gap:2px;padding:6px;display:grid;position:absolute;top:calc(100% + 6px);right:0}.r2poiG_studio .r2poiG_menuBody button{text-align:left;white-space:normal;background:0 0;border:0;justify-items:start;gap:0;width:100%;padding:8px 10px;display:grid}.r2poiG_menuBody button small{color:var(--s-muted);font-weight:400}.r2poiG_menuBody p{border-top:1px solid var(--s-line-soft);padding:6px 10px 4px;margin-top:4px!important}.r2poiG_healthRow{flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:8px;display:flex}.r2poiG_studio .r2poiG_healthRow>button{min-height:28px;padding:3px 8px;font-size:12px}.r2poiG_healthChip{color:var(--s-muted);align-items:center;gap:5px;font-size:11.5px;display:inline-flex}.r2poiG_healthChip i{background:var(--s-faint);border-radius:50%;width:7px;height:7px}.r2poiG_healthChip[data-available=true] i{background:var(--s-ok)}.r2poiG_healthChip[data-available=false]{color:var(--s-bad)}.r2poiG_healthChip[data-available=false] i{background:var(--s-bad)}.r2poiG_roster{gap:2px;display:grid}.r2poiG_studio .r2poiG_rosterItem{border-radius:var(--s-radius);text-align:left;white-space:normal;background:0 0;border:1px solid #0000;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;width:100%;min-height:60px;padding:10px;font-weight:400;display:grid}.r2poiG_studio .r2poiG_rosterItem[aria-current=true]{background:var(--s-active);border-color:var(--s-line)}.r2poiG_rosterItem[data-disabled=true]>:not(.r2poiG_rosterMeta){opacity:.55}.r2poiG_rosterText{min-width:0;display:grid}.r2poiG_rosterText strong{overflow-wrap:anywhere;flex-wrap:wrap;align-items:center;gap:6px;font-size:13.5px;font-weight:600;display:flex}.r2poiG_rosterText small{color:var(--s-muted);overflow-wrap:anywhere}.r2poiG_rosterMeta{justify-items:end;gap:2px;min-width:0;max-width:150px;display:grid}.r2poiG_rosterMeta small{color:var(--s-faint);white-space:nowrap;text-overflow:ellipsis;max-width:100%;font-size:11px;overflow:hidden}.r2poiG_offTag{color:var(--s-muted);border:1px solid var(--s-line-strong);border-radius:4px;padding:0 6px;font-size:10.5px;font-style:normal;font-weight:500;line-height:16px}.r2poiG_editorCard,.r2poiG_detailCard{gap:18px;max-width:860px;display:grid}.r2poiG_editorHead{align-items:center;gap:14px;padding-bottom:4px;display:flex}.r2poiG_editorHead h2{overflow-wrap:anywhere;font-size:19px}.r2poiG_editorHead p{color:var(--s-muted);font-size:13px}.r2poiG_formGroup{border:1px solid var(--s-line);border-radius:var(--s-radius);gap:14px;padding:18px;display:grid}.r2poiG_formGroup>legend{float:left;width:100%;color:var(--s-muted);letter-spacing:.3px;margin-bottom:2px;font-size:12px;font-weight:600}.r2poiG_formGroup>legend+*{clear:both}.r2poiG_field{gap:6px;min-width:0;display:grid}.r2poiG_field>span:first-child{color:var(--s-ink-2);font-size:12.5px;font-weight:500}.r2poiG_field>span:first-child small{color:var(--s-faint);font-weight:400}.r2poiG_fieldPair{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;display:grid}.r2poiG_switch{cursor:pointer;align-items:center;gap:8px;width:fit-content;font-size:13px;display:inline-flex}.r2poiG_segmented{border-radius:var(--s-radius);background:var(--s-sunken);grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;padding:4px;display:grid}.r2poiG_segmented label{cursor:pointer;display:block;position:relative}.r2poiG_segmented input{opacity:0;pointer-events:none;position:absolute}.r2poiG_segmented span{border-radius:var(--s-radius-sm);text-align:center;color:var(--s-muted);overflow-wrap:anywhere;padding:7px 6px;font-size:12.5px;font-weight:500;line-height:1.35;display:block}.r2poiG_segmented input:checked+span{background:var(--s-raised);color:var(--s-ink);box-shadow:0 1px 3px #0000001f}.r2poiG_segmented input:focus-visible+span{outline:2px solid var(--s-accent)}.r2poiG_chips{flex-wrap:wrap;gap:6px;display:flex}.r2poiG_chip{cursor:pointer;position:relative}.r2poiG_chip input{opacity:0;pointer-events:none;position:absolute}.r2poiG_chip span{border:1px solid var(--s-line-strong);color:var(--s-ink-2);border-radius:15px;padding:4px 11px;font-size:12.5px;display:inline-block}.r2poiG_chip input:checked+span{background:var(--s-primary);border-color:var(--s-primary);color:var(--s-on-primary)}.r2poiG_chip input:focus-visible+span{outline:2px solid var(--s-accent);outline-offset:2px}.r2poiG_modelPicker{gap:8px;display:grid}.r2poiG_modelPicker>legend{float:left;width:100%;color:var(--s-ink-2);font-size:12.5px;font-weight:500}.r2poiG_modelPicker>legend small{color:var(--s-faint);font-weight:400}.r2poiG_modelPicker>legend+*{clear:both}.r2poiG_modelList{border:1px solid var(--s-line);border-radius:var(--s-radius-sm);max-height:288px;display:grid;overflow-y:auto}.r2poiG_modelOption{cursor:pointer;border-bottom:1px solid var(--s-line-soft);align-items:flex-start;gap:10px;padding:9px 12px;display:flex}.r2poiG_modelOption:last-child{border-bottom:0}.r2poiG_modelOption:hover{background:var(--s-hover)}.r2poiG_modelOption:has(input:checked){background:var(--s-accent-soft)}.r2poiG_modelOption input{margin-top:3px!important}.r2poiG_modelOption>span{min-width:0;display:grid}.r2poiG_modelOption strong{overflow-wrap:anywhere;font-size:13px;font-weight:600}.r2poiG_modelOption small{color:var(--s-muted);overflow-wrap:anywhere}.r2poiG_modelList>p{padding:9px 12px}.r2poiG_modelTags{flex-wrap:wrap;gap:4px;margin-top:2px;display:flex}.r2poiG_modelTags em{background:var(--s-sunken);color:var(--s-muted);border-radius:4px;padding:0 6px;font-size:10.5px;font-style:normal;line-height:17px}.r2poiG_formFooter{z-index:1;background:linear-gradient(to bottom, transparent, var(--s-bg) 30%);flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;padding:12px 0;display:flex;position:sticky;bottom:0}.r2poiG_formStatus{color:var(--s-muted);overflow-wrap:anywhere;font-size:12.5px}.r2poiG_formStatus[data-state=ok]{color:var(--s-ok)}.r2poiG_formStatus[data-state=error]{color:var(--s-bad)}.r2poiG_checkList{border:1px solid var(--s-line);border-radius:var(--s-radius-sm);gap:2px;max-height:220px;padding:8px 10px;display:grid;overflow-y:auto}.r2poiG_checkList>legend{color:var(--s-ink-2);padding:0 4px;font-size:12.5px;font-weight:500}.r2poiG_checkList label{cursor:pointer;overflow-wrap:anywhere;align-items:flex-start;gap:8px;padding:5px 4px;font-size:13px;display:flex}.r2poiG_checkList b{color:var(--s-muted);font-weight:500}.r2poiG_checkList input{margin-top:3px!important}.r2poiG_projectBar{padding:18px var(--s-gutter) 18px;border-bottom:1px solid var(--s-line);gap:14px;display:grid}.r2poiG_projectTop{flex-wrap:wrap;align-items:center;gap:10px 12px;display:flex}.r2poiG_projectPicker{flex:0 380px;min-width:0}.r2poiG_projectPicker select{background-color:#0000;border-color:#0000;min-height:40px;margin-left:-8px;padding-left:8px;font-size:16px;font-weight:650}.r2poiG_projectPicker select:hover{border-color:var(--s-line-strong)}.r2poiG_projectActions{margin-left:auto}.r2poiG_summaryGrid{grid-template-columns:minmax(0,1.5fr) minmax(260px,1fr);gap:16px;display:grid}.r2poiG_summaryMain,.r2poiG_summarySide{align-content:start;gap:6px;min-width:0;display:grid}.r2poiG_summaryMain h3{color:var(--s-faint);letter-spacing:.3px;font-size:11.5px;font-weight:600}.r2poiG_summaryMain h3:not(:first-child){margin-top:8px}.r2poiG_objective{white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px;line-height:1.7}.r2poiG_criteria{color:var(--s-ink-2);white-space:pre-wrap;overflow-wrap:anywhere;border-left:2px solid var(--s-line-strong);padding-left:12px;font-size:13px}.r2poiG_summarySide{border-radius:var(--s-radius);background:var(--s-sunken);gap:12px;padding:14px 16px}.r2poiG_progressHead{color:var(--s-muted);justify-content:space-between;gap:8px;font-size:12px;display:flex}.r2poiG_progressHead strong{color:var(--s-ink);font-weight:600}.r2poiG_bar{background:var(--s-line);border-radius:3px;height:6px;margin:6px 0 10px;overflow:hidden}.r2poiG_bar span{background:var(--s-ok);border-radius:3px;height:100%;transition:width .3s;display:block}.r2poiG_statList{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;display:grid}.r2poiG_statList div{gap:0;display:grid}.r2poiG_statList dt{color:var(--s-muted);white-space:nowrap;text-overflow:ellipsis;font-size:11px;overflow:hidden}.r2poiG_statList dd{font-size:17px;font-weight:650;line-height:1.3}.r2poiG_statList [data-tone=running] dd{color:var(--s-accent)}.r2poiG_statList [data-tone=review] dd{color:var(--s-warn)}.r2poiG_statList [data-tone=attention] dd{color:var(--s-bad)}.r2poiG_teamStrip{gap:6px;display:grid}.r2poiG_teamStrip ul{flex-wrap:wrap;gap:6px;display:flex}.r2poiG_teamStrip li{background:var(--s-raised);border:1px solid var(--s-line-soft);border-radius:14px;align-items:center;gap:5px;max-width:100%;padding:2px 8px 2px 2px;font-size:12px;display:inline-flex}.r2poiG_teamStrip li span:last-child{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.r2poiG_metaLine{color:var(--s-muted);white-space:nowrap;text-overflow:ellipsis;font-size:12px;overflow:hidden}.r2poiG_success,.r2poiG_notice,.r2poiG_alert{border-radius:var(--s-radius-sm);overflow-wrap:anywhere;gap:4px;padding:10px 14px;font-size:13px;display:grid}.r2poiG_success{background:var(--s-ok-soft);color:var(--s-ok);grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px}.r2poiG_success code{color:var(--s-ink);overflow-wrap:anywhere}.r2poiG_notice{background:var(--s-sunken);color:var(--s-ink-2)}.r2poiG_notice[data-tone=review]{background:var(--s-warn-soft);color:var(--s-warn)}.r2poiG_notice[data-tone=running]{background:var(--s-accent-soft);color:var(--s-accent)}.r2poiG_notice[data-tone=needsYou]{background:var(--s-warn-soft);color:var(--s-warn);gap:8px}.r2poiG_notice[data-tone=needsYou] .r2poiG_report{color:var(--s-ink)}.r2poiG_progressLine{white-space:pre-wrap;gap:2px;display:grid}.r2poiG_progressLine small{color:var(--s-muted)}.r2poiG_notice p{color:var(--s-ink-2);font-size:12.5px}.r2poiG_alert{background:var(--s-bad-soft);color:var(--s-bad)}.r2poiG_alert p{white-space:pre-wrap;color:var(--s-ink);font-size:12.5px}.r2poiG_filterRow{flex-wrap:wrap;gap:6px;margin-bottom:12px;display:flex}.r2poiG_studio .r2poiG_filter{border-color:var(--s-line);min-height:28px;color:var(--s-muted);border-radius:14px;gap:5px;padding:2px 10px;font-size:12px}.r2poiG_filter span{color:var(--s-faint);font-weight:600}.r2poiG_studio .r2poiG_filter[aria-pressed=true]{background:var(--s-ink);border-color:var(--s-ink);color:var(--s-bg)}.r2poiG_studio .r2poiG_filter[aria-pressed=true] span{color:inherit;opacity:.7}.r2poiG_pipeline{gap:4px;display:grid;position:relative}.r2poiG_pipeline li{position:relative}.r2poiG_pipeline li:not(:last-child):before{content:"";background:var(--s-line);z-index:0;width:1px;position:absolute;top:40px;bottom:-8px;left:25px}.r2poiG_studio .r2poiG_taskItem{z-index:1;border-radius:var(--s-radius);text-align:left;white-space:normal;background:0 0;border:1px solid #0000;grid-template-columns:auto minmax(0,1fr);grid-template-areas:"r2poiG_step r2poiG_main""r2poiG_step r2poiG_badges";align-items:start;gap:4px 12px;width:100%;padding:12px;font-weight:400;display:grid;position:relative}.r2poiG_studio .r2poiG_taskItem[aria-current=true]{background:var(--s-active);border-color:var(--s-line)}.r2poiG_step{background:var(--s-bg);border:1.5px solid var(--s-line-strong);width:28px;height:28px;color:var(--s-muted);border-radius:50%;grid-area:r2poiG_step;place-items:center;font-size:12px;font-weight:600;display:grid}li[data-status=completed] .r2poiG_step{border-color:var(--s-ok);color:var(--s-ok);background:var(--s-ok-soft)}li[data-status=running] .r2poiG_step{border-color:var(--s-accent);color:var(--s-accent);background:var(--s-accent-soft)}li[data-status=failed] .r2poiG_step,li[data-status=interrupted] .r2poiG_step{border-color:var(--s-bad);color:var(--s-bad)}li[data-status=blocked] .r2poiG_step{border-style:dashed}li[data-status=waiting] .r2poiG_step{border-color:var(--s-warn);color:var(--s-warn);background:var(--s-warn-soft)}.r2poiG_taskMain{grid-area:r2poiG_main;gap:3px;min-width:0;display:grid}.r2poiG_taskMain>strong{overflow-wrap:anywhere;font-size:13.5px;font-weight:600;line-height:1.45}.r2poiG_taskOwner{color:var(--s-ink-2);flex-wrap:wrap;align-items:center;gap:6px;min-width:0;font-size:12.5px;display:inline-flex}.r2poiG_taskOwner small{color:var(--s-faint)}.r2poiG_reason{color:var(--s-muted);font-size:11.5px}.r2poiG_reason[data-kind=revision],.r2poiG_reason[data-kind=needsYou]{color:var(--s-warn)}.r2poiG_reason[data-kind=progress],.r2poiG_reason[data-kind=needsYou]{-webkit-line-clamp:2;overflow-wrap:anywhere;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.r2poiG_reason[data-kind=progress]{color:var(--s-accent)}.r2poiG_taskBadges{flex-wrap:wrap;grid-area:r2poiG_badges;gap:4px;display:flex}.r2poiG_detailHead{grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:10px 16px;display:grid}.r2poiG_detailTitle{align-items:flex-start;gap:12px;min-width:0;display:flex}.r2poiG_detailTitle h2{overflow-wrap:anywhere;font-size:18px}.r2poiG_stepLarge{background:var(--s-sunken);color:var(--s-muted);border-radius:6px;flex:none;margin-top:2px;padding:1px 8px;font-size:13px;font-weight:600}.r2poiG_detailBadges{flex-wrap:wrap;justify-content:flex-end;gap:6px;display:flex}.r2poiG_detailHead>.r2poiG_actions{grid-column:1/-1}.r2poiG_block{border-top:1px solid var(--s-line-soft);gap:10px;padding-top:16px;display:grid}.r2poiG_blockHead{justify-content:space-between;align-items:center;gap:8px;display:flex}.r2poiG_blockHead h3 small{color:var(--s-faint);font-weight:400}.r2poiG_linkList{flex-wrap:wrap;gap:6px;display:flex}.r2poiG_studio .r2poiG_taskLink{border-color:var(--s-line);white-space:normal;text-align:left;gap:8px;max-width:100%;min-height:30px;padding:3px 4px 3px 10px;font-weight:400}.r2poiG_taskLink b{color:var(--s-muted);white-space:nowrap;font-weight:600}.r2poiG_revisionCard{border-radius:var(--s-radius-sm);border:1px solid var(--s-warn-soft);background:color-mix(in srgb, var(--s-warn-soft) 55%, transparent);gap:8px;padding:12px 14px;display:grid}.r2poiG_revisionCard>strong{color:var(--s-warn);font-size:12.5px}.r2poiG_revisionCard[data-kind=superseded]{border-style:dashed;border-color:var(--s-line-strong);background:0 0}.r2poiG_revisionCard[data-kind=superseded]>strong{color:var(--s-muted)}.r2poiG_studio blockquote{border-left:3px solid var(--s-warn);background:var(--s-raised);white-space:pre-wrap;overflow-wrap:anywhere;border-radius:0 6px 6px 0;gap:2px;padding:6px 12px;font-size:13px;display:grid}.r2poiG_studio blockquote small{color:var(--s-muted);font-size:11px}.r2poiG_reviewForm{gap:10px;display:grid}.r2poiG_facts{grid-template-columns:110px minmax(0,1fr);gap:10px 16px;font-size:13px;display:grid}.r2poiG_facts dt{color:var(--s-muted);padding-top:2px;font-size:12px}.r2poiG_facts dd{overflow-wrap:anywhere;min-width:0}.r2poiG_pathList{gap:2px;display:grid}.r2poiG_miniTimeline{gap:12px;display:grid}.r2poiG_miniTimeline li{border-left:2px solid var(--s-line);padding-left:12px}.r2poiG_handoffMeta{color:var(--s-muted);flex-wrap:wrap;align-items:baseline;gap:4px 8px;font-size:12px;display:flex}.r2poiG_handoffMeta strong{color:var(--s-ink);font-size:13px}.r2poiG_handoffMeta time{color:var(--s-faint);margin-left:auto;font-size:11.5px}.r2poiG_disclosure{border:1px solid var(--s-line);border-radius:var(--s-radius)}.r2poiG_disclosure>summary{cursor:pointer;color:var(--s-ink-2);padding:11px 14px;font-size:13px;font-weight:600}.r2poiG_disclosure>summary small{color:var(--s-faint);font-weight:400}.r2poiG_disclosure[open]>summary{border-bottom:1px solid var(--s-line-soft)}.r2poiG_disclosureBody{gap:10px;padding:12px 14px 16px;display:grid}.r2poiG_session{border-radius:var(--s-radius-sm);background:var(--s-sunken);gap:4px;padding:10px 12px;font-size:12.5px;display:grid}.r2poiG_copyLine{align-items:center;gap:8px;min-width:0;display:flex}.r2poiG_copyLine code{background:var(--s-raised);border:1px solid var(--s-line-soft);white-space:nowrap;border-radius:6px;flex:1;min-width:0;padding:5px 9px;overflow-x:auto}.r2poiG_studio .r2poiG_copyLine button{min-height:28px;padding:2px 9px;font-size:12px}.r2poiG_fileGrid{gap:8px;display:grid}.r2poiG_fileCard{border:1px solid var(--s-line);border-radius:var(--s-radius-sm);background:var(--s-raised);overflow:hidden}.r2poiG_thumb{background:var(--s-sunken);border-bottom:1px solid var(--s-line-soft);text-align:center;display:block}.r2poiG_thumb img{object-fit:contain;max-width:100%;max-height:260px;margin:0 auto;display:block}.r2poiG_fileRow{grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;padding:9px 10px;display:grid}.r2poiG_fileIcon{background:var(--s-sunken);min-width:38px;height:26px;color:var(--s-muted);white-space:nowrap;border-radius:6px;place-items:center;padding:0 5px;font-size:10.5px;font-weight:600;display:grid}.r2poiG_fileIcon[data-kind=image]{color:#b23473;background:#e8308c21}.r2poiG_fileIcon[data-kind=document]{color:#345eb2;background:#306ee821}.r2poiG_fileIcon[data-kind=web]{color:#ab602b;background:#ee7c2b24}.r2poiG_fileIcon[data-kind=code]{color:#1f7a5c;background:#1fad7e24}.r2poiG_fileIcon[data-kind=data]{color:#7143b1;background:#8d52e024}body[data-ds-dark-theme] .r2poiG_fileIcon[data-kind]{filter:brightness(1.6)}.r2poiG_fileName{min-width:0;display:grid}.r2poiG_fileName strong{overflow-wrap:anywhere;font-size:13px;font-weight:600}.r2poiG_fileName small{color:var(--s-faint);overflow-wrap:anywhere;font-size:11px}.r2poiG_fileActions{gap:4px;display:flex}.r2poiG_studio .r2poiG_fileActions button,.r2poiG_fileActions .r2poiG_linkButton{min-height:28px;padding:2px 10px;font-size:12px}.r2poiG_codePreview{border-top:1px solid var(--s-line-soft);background:var(--s-sunken);max-height:360px;font-family:var(--s-mono);white-space:pre-wrap;overflow-wrap:anywhere;margin:0;padding:12px 14px;font-size:12px;line-height:1.6;overflow:auto}.r2poiG_handoffs{padding:20px var(--s-gutter) 40px;gap:22px;max-width:980px;display:grid}.r2poiG_composer{border:1px solid var(--s-line);border-radius:var(--s-radius);background:var(--s-raised);gap:10px;padding:16px;display:grid}.r2poiG_composerHead,.r2poiG_timelineHead{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;display:flex}.r2poiG_composerHead h2{font-size:15px}.r2poiG_composerFoot{justify-content:space-between;align-items:center;gap:12px;display:flex}.r2poiG_inlineField{color:var(--s-muted);align-items:center;gap:8px;min-width:0;font-size:12.5px;display:inline-flex}.r2poiG_inlineField select{width:auto;max-width:240px;min-height:32px}.r2poiG_timeline{gap:0;display:grid}.r2poiG_timeline li{grid-template-columns:34px minmax(0,1fr);gap:12px;padding-bottom:16px;display:grid;position:relative}.r2poiG_timeline li:not(:last-child):before{content:"";background:var(--s-line);width:1px;position:absolute;top:38px;bottom:2px;left:16.5px}.r2poiG_timelineDot{padding-top:4px}.r2poiG_timelineCard{border:1px solid var(--s-line);border-radius:var(--s-radius);gap:8px;min-width:0;padding:12px 14px;display:grid}.r2poiG_timeline li[data-from=user] .r2poiG_timelineCard{background:var(--s-sunken);border-color:#0000}.r2poiG_studio .r2poiG_taskChip{border-color:var(--s-line);min-height:24px;color:var(--s-ink-2);white-space:normal;text-align:left;border-radius:12px;justify-self:start;max-width:100%;padding:1px 9px;font-size:11.5px;font-weight:500}.r2poiG_dialog{border:1px solid var(--s-line);background:var(--s-bg);width:min(720px,100vw - 32px);max-height:calc(100vh - 48px);color:var(--s-ink);box-shadow:var(--s-shadow);border-radius:14px;padding:0}.r2poiG_dialog::backdrop{background:#0a0e186b}.r2poiG_dialogForm{grid-template-rows:auto minmax(0,1fr) auto;max-height:calc(100vh - 50px);display:grid}.r2poiG_dialogHead{border-bottom:1px solid var(--s-line-soft);justify-content:space-between;align-items:flex-start;gap:12px;padding:18px 22px 14px;display:flex}.r2poiG_dialogBody{gap:16px;padding:18px 22px;display:grid;overflow-y:auto}.r2poiG_dialogFoot{border-top:1px solid var(--s-line-soft);flex-wrap:wrap;justify-content:flex-end;align-items:center;gap:8px;padding:12px 22px;display:flex}.r2poiG_dialogFoot .r2poiG_formStatus{margin-right:auto}.r2poiG_optionCards{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;display:grid}.r2poiG_optionCards>legend,.r2poiG_teamPicker>legend{color:var(--s-ink-2);margin-bottom:6px;font-size:12.5px;font-weight:500}.r2poiG_optionCards>legend{grid-column:1/-1}.r2poiG_teamPicker>legend small{color:var(--s-faint);font-weight:400}.r2poiG_optionCards label{border:1px solid var(--s-line-strong);border-radius:var(--s-radius-sm);cursor:pointer;align-items:flex-start;gap:10px;padding:11px 12px;display:flex}.r2poiG_optionCards label:has(input:checked){border-color:var(--s-accent);background:var(--s-accent-soft)}.r2poiG_optionCards input{margin-top:3px!important}.r2poiG_optionCards span{gap:2px;min-width:0;display:grid}.r2poiG_optionCards strong{font-size:13px;font-weight:600}.r2poiG_optionCards small{color:var(--s-muted)}.r2poiG_teamPicker{gap:4px;display:grid}.r2poiG_teamPicker label{border:1px solid var(--s-line);border-radius:var(--s-radius-sm);cursor:pointer;grid-template-columns:auto 18px auto minmax(0,1fr) auto;align-items:center;gap:10px;padding:7px 10px;display:grid}.r2poiG_teamPicker label[data-checked=false]{opacity:.65}.r2poiG_teamPicker label[data-checked=true]{border-color:var(--s-line-strong)}.r2poiG_order{color:var(--s-accent);text-align:center;font-size:11px;font-weight:700}.r2poiG_studio .r2poiG_meetingItem{border-radius:var(--s-radius);text-align:left;white-space:normal;background:0 0;border:1px solid #0000;justify-content:stretch;gap:6px;width:100%;padding:12px;font-weight:400;display:grid}.r2poiG_studio .r2poiG_meetingItem[aria-current=true]{background:var(--s-active);border-color:var(--s-line)}.r2poiG_meetingItem>small{color:var(--s-muted);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.r2poiG_meetingItemHead{justify-content:space-between;align-items:flex-start;gap:8px;min-width:0;display:flex}.r2poiG_meetingItemHead strong{overflow-wrap:anywhere;font-size:13.5px;font-weight:600}.r2poiG_avatarStack{display:flex}.r2poiG_avatarStack>span{box-shadow:0 0 0 2px var(--s-bg);margin-right:-5px}.r2poiG_badge[data-meeting=open],.r2poiG_badge[data-meeting=drafting]{background:var(--s-accent-soft);color:var(--s-accent)}.r2poiG_badge[data-meeting=drafting] i{animation:1.4s ease-in-out infinite r2poiG_pulse}.r2poiG_badge[data-meeting=review]{background:var(--s-warn-soft);color:var(--s-warn)}.r2poiG_badge[data-meeting=closed]{color:var(--s-faint)}.r2poiG_reason[data-kind=speaking]{color:var(--s-accent)}.r2poiG_meetingCard{gap:14px;max-width:900px;display:grid}.r2poiG_meetingHead{border-bottom:1px solid var(--s-line-soft);gap:10px;padding-bottom:14px;display:grid}.r2poiG_meetingTitle{flex-wrap:wrap;align-items:center;gap:10px;display:flex}.r2poiG_meetingTitle h2{overflow-wrap:anywhere;font-size:18px}.r2poiG_agenda{color:var(--s-ink-2);white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px}.r2poiG_attendeeRow{flex-wrap:wrap;gap:6px;display:flex}.r2poiG_attendeeRow li{border:1px solid var(--s-line);border-radius:14px;align-items:center;gap:5px;max-width:100%;padding:2px 9px 2px 2px;font-size:12px;display:inline-flex}.r2poiG_attendeeRow li[data-host=true]{border-color:var(--s-accent)}.r2poiG_attendeeRow em,.r2poiG_bubbleMeta em{color:var(--s-accent);background:var(--s-accent-soft);border-radius:4px;padding:0 5px;font-size:10.5px;font-style:normal;font-weight:600;line-height:16px}.r2poiG_chat{gap:14px;padding:4px 0;display:grid}.r2poiG_chatEmpty{border:1px dashed var(--s-line-strong);border-radius:var(--s-radius);color:var(--s-muted);text-align:center;padding:24px 16px;font-size:13px}.r2poiG_bubbleRow{grid-template-columns:34px minmax(0,1fr);align-items:start;gap:10px;display:grid}.r2poiG_bubbleRow[data-own=true]{grid-template-columns:minmax(0,1fr) 34px}.r2poiG_bubbleRow[data-own=true]>.r2poiG_avatar{grid-area:1/2}.r2poiG_bubbleRow[data-own=true]>.r2poiG_bubbleBody{grid-area:1/1;justify-items:end}.r2poiG_bubbleBody{justify-items:start;gap:4px;min-width:0;display:grid}.r2poiG_bubbleMeta{color:var(--s-muted);flex-wrap:wrap;align-items:center;gap:4px 8px;font-size:12px;display:flex}.r2poiG_bubbleMeta strong{color:var(--s-ink);font-size:12.5px}.r2poiG_bubbleMeta time{color:var(--s-faint);font-size:11px}.r2poiG_bubble{background:var(--s-sunken);border:1px solid var(--s-line-soft);border-radius:4px 14px 14px;gap:4px;min-width:0;max-width:min(640px,100%);padding:9px 13px;display:grid}.r2poiG_bubbleRow[data-own=true] .r2poiG_bubble{background:var(--s-accent-soft);border-color:#0000;border-radius:14px 4px 14px 14px}.r2poiG_mentionLine{flex-wrap:wrap;gap:4px;display:flex}.r2poiG_mentionLine span{color:var(--s-accent);font-size:11.5px;font-weight:600}.r2poiG_sessionNote{color:var(--s-faint);max-width:100%;font-size:11px}.r2poiG_sessionNote summary{cursor:pointer}.r2poiG_sessionNote code{background:var(--s-sunken);white-space:nowrap;color:var(--s-ink-2);border-radius:5px;margin-top:4px;padding:3px 8px;display:block;overflow-x:auto}.r2poiG_typing{background:var(--s-sunken);color:var(--s-muted);border-radius:4px 14px 14px;flex-wrap:wrap;align-items:center;gap:8px;padding:9px 13px;font-size:12.5px;display:inline-flex}.r2poiG_typing small{color:var(--s-faint)}.r2poiG_dots{gap:3px;display:inline-flex}.r2poiG_dots i{background:var(--s-accent);border-radius:50%;width:5px;height:5px;animation:1.2s ease-in-out infinite r2poiG_pulse}.r2poiG_dots i:nth-child(2){animation-delay:.2s}.r2poiG_dots i:nth-child(3){animation-delay:.4s}.r2poiG_chatComposer{z-index:2;border:1px solid var(--s-line);border-radius:var(--s-radius);background:var(--s-bg);gap:8px;padding:12px 14px;display:grid;position:sticky;bottom:0;box-shadow:0 -8px 20px -12px #0000002e}.r2poiG_mentionChips{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.r2poiG_minutes{border:1px solid var(--s-warn-soft);border-radius:var(--s-radius);background:color-mix(in srgb, var(--s-warn-soft) 30%, transparent);gap:14px;padding:16px 18px;display:grid}.r2poiG_minutes .r2poiG_blockHead{flex-wrap:wrap}.r2poiG_minutesTasks{gap:10px;display:grid}.r2poiG_minutesTasks>legend{color:var(--s-ink-2);margin-bottom:4px;font-size:12.5px;font-weight:500}.r2poiG_studio .r2poiG_minutesTasks>button{justify-self:start}.r2poiG_minutesTask{border:1px solid var(--s-line);border-radius:var(--s-radius-sm);background:var(--s-bg);grid-template-columns:auto minmax(0,1fr) auto;align-items:start;gap:10px;padding:10px;display:grid}.r2poiG_minutesTask>.r2poiG_step{grid-area:auto;margin-top:2px}.r2poiG_minutesTaskFields{gap:8px;min-width:0;display:grid}.r2poiG_minutesTaskActions{gap:2px;display:grid}.r2poiG_studio .r2poiG_minutesTaskActions button{width:28px;min-height:26px;padding:0}.r2poiG_studio .r2poiG_rosterItem[data-bulk=true]{cursor:pointer;grid-template-columns:auto auto minmax(0,1fr) auto}.r2poiG_studio .r2poiG_rosterItem[data-bulk=true]:hover{background:var(--s-hover)}.r2poiG_studio .r2poiG_rosterItem[data-bulk=true]:has(input:checked){background:var(--s-bad-soft);border-color:#0000}.r2poiG_rosterItem[data-locked=true]{cursor:not-allowed}.r2poiG_rosterItem[data-locked=true] small{color:var(--s-faint)}.r2poiG_bulkBar{border-radius:var(--s-radius-sm);background:var(--s-sunken);color:var(--s-ink-2);gap:8px;margin-bottom:10px;padding:10px 12px;font-size:12.5px;display:grid}.r2poiG_memberRow{border:1px solid var(--s-line);border-radius:var(--s-radius-sm);grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;padding:4px 6px;display:grid}.r2poiG_memberRow[aria-current=true]{border-color:var(--s-accent);background:var(--s-accent-soft)}.r2poiG_memberRow>.r2poiG_step{grid-area:auto}.r2poiG_studio .r2poiG_memberMain{text-align:left;white-space:normal;background:0 0;border:0;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;width:100%;padding:6px;font-weight:400;display:grid}.r2poiG_memberEditor{border:1px solid var(--s-accent);border-radius:var(--s-radius);padding:14px}.r2poiG_memberEditor .r2poiG_editorCard{max-width:none}.r2poiG_memberEditor .r2poiG_formFooter{background:0 0;position:static}.r2poiG_applyPlan{border-radius:var(--s-radius);border:1px solid var(--s-warn-soft);background:color-mix(in srgb, var(--s-warn-soft) 40%, transparent);gap:12px;padding:14px 16px;display:grid}.r2poiG_planRow{display:contents}.r2poiG_applyPlan .r2poiG_facts{grid-template-columns:minmax(150px,220px) minmax(0,1fr)}.r2poiG_planRow[data-kind=applyAdd] dt{color:var(--s-ok)}.r2poiG_planRow[data-kind=applyRemove] dt{color:var(--s-bad)}.r2poiG_planRow[data-kind=applyDisable] dt{color:var(--s-warn)}@media (width<=1100px){.r2poiG_workArea{grid-template-columns:minmax(0,1fr)}.r2poiG_listPane{border-right:0;border-bottom:1px solid var(--s-line)}.r2poiG_summaryGrid{grid-template-columns:minmax(0,1fr)}.r2poiG_roster{grid-template-columns:repeat(auto-fill,minmax(min(280px,100%),1fr))}.r2poiG_pipeline li:before{display:none}}@media (width<=720px){.r2poiG_studio{--s-gutter:16px}.r2poiG_topbar{flex-direction:column;align-items:stretch;gap:12px;padding-top:18px}.r2poiG_brand h1{font-size:21px}.r2poiG_workspace{flex-direction:column;align-items:stretch}.r2poiG_workspacePicker{width:100%}.r2poiG_workspace>button{align-self:flex-start;padding-left:0}.r2poiG_fieldPair,.r2poiG_optionCards{grid-template-columns:minmax(0,1fr)}.r2poiG_projectPicker{flex-basis:100%}.r2poiG_projectActions{margin-left:0}.r2poiG_statList{grid-template-columns:repeat(2,minmax(0,1fr))}.r2poiG_detailHead{grid-template-columns:minmax(0,1fr)}.r2poiG_detailBadges{justify-content:flex-start}.r2poiG_facts{grid-template-columns:minmax(0,1fr);gap:2px}.r2poiG_facts dd{margin-bottom:8px}.r2poiG_segmented{grid-template-columns:repeat(2,minmax(0,1fr))}.r2poiG_composerFoot{flex-direction:column;align-items:stretch}.r2poiG_success{grid-template-columns:minmax(0,1fr)}.r2poiG_inputWithButton{flex-direction:column}.r2poiG_dialog{border-radius:0;width:100vw;max-width:100vw;height:100dvh;max-height:100dvh;margin:0}.r2poiG_dialogForm{height:100%;max-height:100dvh}}@media (width<=480px){.r2poiG_tabs{padding-right:8px}.r2poiG_studio .r2poiG_tab{padding:10px 8px;font-size:13px}.r2poiG_tabs>.r2poiG_primary{min-width:34px;padding:6px 10px}.r2poiG_wideLabel{display:none}.r2poiG_rosterItem{grid-template-columns:auto minmax(0,1fr)!important}.r2poiG_rosterMeta{grid-column:2;justify-items:start;max-width:100%}.r2poiG_fileRow{grid-template-columns:auto minmax(0,1fr)}.r2poiG_fileActions{grid-column:1/-1;justify-content:flex-end}.r2poiG_teamPicker label{grid-template-columns:auto 14px auto minmax(0,1fr)}.r2poiG_teamPicker label>:last-child{grid-column:4;justify-self:start}.r2poiG_timeline li{grid-template-columns:minmax(0,1fr)}.r2poiG_timeline li:before,.r2poiG_timelineDot{display:none}.r2poiG_minutesTask{grid-template-columns:minmax(0,1fr)}.r2poiG_minutesTask>.r2poiG_step{display:none}.r2poiG_minutesTaskActions{justify-content:flex-end;display:flex}.r2poiG_bubbleRow,.r2poiG_bubbleRow[data-own=true]{grid-template-columns:minmax(0,1fr)}.r2poiG_bubbleRow>.r2poiG_avatar{display:none}.r2poiG_bubbleRow[data-own=true]>.r2poiG_bubbleBody{grid-column:1}}';
}
var Studio_default = { "srOnly": "r2poiG_srOnly", "summaryMain": "r2poiG_summaryMain", "avatar": "r2poiG_avatar", "emptyState": "r2poiG_emptyState", "spinner": "r2poiG_spinner", "listPane": "r2poiG_listPane", "pulse": "r2poiG_pulse", "workArea": "r2poiG_workArea", "meetingItem": "r2poiG_meetingItem", "teamStrip": "r2poiG_teamStrip", "detailPane": "r2poiG_detailPane", "minutesTaskFields": "r2poiG_minutesTaskFields", "projectTop": "r2poiG_projectTop", "hint": "r2poiG_hint", "healthChip": "r2poiG_healthChip", "copyLine": "r2poiG_copyLine", "bubbleBody": "r2poiG_bubbleBody", "formGroup": "r2poiG_formGroup", "pathList": "r2poiG_pathList", "badges": "r2poiG_badges", "applyPlan": "r2poiG_applyPlan", "composerHead": "r2poiG_composerHead", "dialogHead": "r2poiG_dialogHead", "inputWithButton": "r2poiG_inputWithButton", "criteria": "r2poiG_criteria", "dialogForm": "r2poiG_dialogForm", "block": "r2poiG_block", "codePreview": "r2poiG_codePreview", "timeline": "r2poiG_timeline", "taskOwner": "r2poiG_taskOwner", "main": "r2poiG_main", "memberEditor": "r2poiG_memberEditor", "taskChip": "r2poiG_taskChip", "dialog": "r2poiG_dialog", "ghostDanger": "r2poiG_ghostDanger", "footnote": "r2poiG_footnote", "topbar": "r2poiG_topbar", "paneHead": "r2poiG_paneHead", "blockHead": "r2poiG_blockHead", "fileCard": "r2poiG_fileCard", "linkList": "r2poiG_linkList", "dialogBody": "r2poiG_dialogBody", "iconButton": "r2poiG_iconButton", "workspaceForm": "r2poiG_workspaceForm", "rosterText": "r2poiG_rosterText", "modelTags": "r2poiG_modelTags", "projectBar": "r2poiG_projectBar", "tab": "r2poiG_tab", "modelPicker": "r2poiG_modelPicker", "formStatus": "r2poiG_formStatus", "projectActions": "r2poiG_projectActions", "notice": "r2poiG_notice", "progressLine": "r2poiG_progressLine", "detailBadges": "r2poiG_detailBadges", "count": "r2poiG_count", "reviewForm": "r2poiG_reviewForm", "thumb": "r2poiG_thumb", "fileRow": "r2poiG_fileRow", "dialogFoot": "r2poiG_dialogFoot", "bulkBar": "r2poiG_bulkBar", "teamPicker": "r2poiG_teamPicker", "planRow": "r2poiG_planRow", "timelineHead": "r2poiG_timelineHead", "switch": "r2poiG_switch", "revisionCard": "r2poiG_revisionCard", "meetingTitle": "r2poiG_meetingTitle", "stepLarge": "r2poiG_stepLarge", "facts": "r2poiG_facts", "disclosureBody": "r2poiG_disclosureBody", "agenda": "r2poiG_agenda", "muted": "r2poiG_muted", "rosterMeta": "r2poiG_rosterMeta", "detailCard": "r2poiG_detailCard", "editorHead": "r2poiG_editorHead", "chip": "r2poiG_chip", "badge": "r2poiG_badge", "fileName": "r2poiG_fileName", "chips": "r2poiG_chips", "timelineDot": "r2poiG_timelineDot", "inlineError": "r2poiG_inlineError", "bubbleMeta": "r2poiG_bubbleMeta", "field": "r2poiG_field", "metaLine": "r2poiG_metaLine", "handoffMeta": "r2poiG_handoffMeta", "filter": "r2poiG_filter", "menuBody": "r2poiG_menuBody", "modelOption": "r2poiG_modelOption", "miniTimeline": "r2poiG_miniTimeline", "filterRow": "r2poiG_filterRow", "objective": "r2poiG_objective", "handoffs": "r2poiG_handoffs", "inlineField": "r2poiG_inlineField", "roster": "r2poiG_roster", "tabList": "r2poiG_tabList", "disclosure": "r2poiG_disclosure", "bubble": "r2poiG_bubble", "dangerSolid": "r2poiG_dangerSolid", "mentionLine": "r2poiG_mentionLine", "chatEmpty": "r2poiG_chatEmpty", "meetingItemHead": "r2poiG_meetingItemHead", "reason": "r2poiG_reason", "rosterItem": "r2poiG_rosterItem", "pipeline": "r2poiG_pipeline", "chat": "r2poiG_chat", "minutesTask": "r2poiG_minutesTask", "editorCard": "r2poiG_editorCard", "detailTitle": "r2poiG_detailTitle", "sessionNote": "r2poiG_sessionNote", "chatComposer": "r2poiG_chatComposer", "projectPicker": "r2poiG_projectPicker", "avatarStack": "r2poiG_avatarStack", "workspace": "r2poiG_workspace", "brand": "r2poiG_brand", "offTag": "r2poiG_offTag", "spin": "r2poiG_spin", "engineTag": "r2poiG_engineTag", "memberRow": "r2poiG_memberRow", "actions": "r2poiG_actions", "menu": "r2poiG_menu", "taskItem": "r2poiG_taskItem", "timelineCard": "r2poiG_timelineCard", "checkList": "r2poiG_checkList", "workspacePicker": "r2poiG_workspacePicker", "mentionChips": "r2poiG_mentionChips", "summaryGrid": "r2poiG_summaryGrid", "composerFoot": "r2poiG_composerFoot", "order": "r2poiG_order", "minutesTasks": "r2poiG_minutesTasks", "taskBadges": "r2poiG_taskBadges", "attendeeRow": "r2poiG_attendeeRow", "success": "r2poiG_success", "session": "r2poiG_session", "bar": "r2poiG_bar", "fileGrid": "r2poiG_fileGrid", "segmented": "r2poiG_segmented", "meetingHead": "r2poiG_meetingHead", "statList": "r2poiG_statList", "toolRow": "r2poiG_toolRow", "emptyInline": "r2poiG_emptyInline", "progressHead": "r2poiG_progressHead", "composer": "r2poiG_composer", "meetingCard": "r2poiG_meetingCard", "ghost": "r2poiG_ghost", "formFooter": "r2poiG_formFooter", "optionCards": "r2poiG_optionCards", "mono": "r2poiG_mono", "minutes": "r2poiG_minutes", "minutesTaskActions": "r2poiG_minutesTaskActions", "fieldPair": "r2poiG_fieldPair", "report": "r2poiG_report", "taskLink": "r2poiG_taskLink", "linkButton": "r2poiG_linkButton", "dots": "r2poiG_dots", "wideLabel": "r2poiG_wideLabel", "tabs": "r2poiG_tabs", "summarySide": "r2poiG_summarySide", "primary": "r2poiG_primary", "banner": "r2poiG_banner", "modelList": "r2poiG_modelList", "alert": "r2poiG_alert", "studio": "r2poiG_studio", "memberMain": "r2poiG_memberMain", "fileIcon": "r2poiG_fileIcon", "taskMain": "r2poiG_taskMain", "fileActions": "r2poiG_fileActions", "bubbleRow": "r2poiG_bubbleRow", "healthRow": "r2poiG_healthRow", "typing": "r2poiG_typing", "detailHead": "r2poiG_detailHead", "step": "r2poiG_step" };

// src/client/parts.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Avatar({ id: id2, name, size = "md" }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: Studio_default.avatar, "data-tone": tone(id2), "data-size": size, "aria-hidden": "true", children: initial(name) });
}
function TaskStatus({ phase, t }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: Studio_default.badge, "data-status": phase, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { "aria-hidden": "true" }),
    t(phase)
  ] });
}
function ReviewStatus({ task, t }) {
  if (task.status !== "completed") return null;
  const key = task.reviewStatus === "superseded" ? "superseded" : task.reviewStatus === "accepted" ? "accepted" : "awaitingReview";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: Studio_default.badge, "data-review": task.reviewStatus, children: t(key) });
}
function ProjectStatus({ status, t }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: Studio_default.badge, "data-project": status, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { "aria-hidden": "true" }),
    t(status === "paused" ? "projectPaused" : status === "running" ? "projectRunning" : status === "review" ? "review" : "projectCompleted")
  ] });
}
function EngineTag({ engine: engine2, t }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: Studio_default.engineTag, "data-engine": engine2, children: t(engine2) });
}
function Section({ title, action, children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: `${Studio_default.block} ${className ?? ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: Studio_default.blockHead, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: title }),
      action
    ] }),
    children
  ] });
}
function Busy({ on }) {
  return on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: Studio_default.spinner, "aria-hidden": "true" }) : null;
}

// src/client/HandoffTimeline.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function HandoffTimeline({ state, project, busy, error, t, command, onOpenTask }) {
  const [message, setMessage] = (0, import_react2.useState)("");
  const [recipient, setRecipient] = (0, import_react2.useState)("team");
  const [person, setPerson] = (0, import_react2.useState)("all");
  const [failed, setFailed] = (0, import_react2.useState)(false);
  const { pending, run } = usePending();
  const tasks = state.tasks.filter((task) => task.projectId === project.id);
  const all = state.messages.filter((value) => value.projectId === project.id);
  const shown = person === "all" ? all : all.filter((value) => value.from === person || value.to === person || value.to === "team" && person !== "user");
  const name = (id2) => id2 === "user" ? t("user") : id2 === "team" ? t("everyone") : employeeOf(state.employees, id2)?.name ?? t("unknownEmployee");
  const people = [...new Set(all.flatMap((value) => [value.from, value.to]))].filter((id2) => id2 !== "team");
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Studio_default.handoffs, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("form", { className: Studio_default.composer, onSubmit: (event) => {
      event.preventDefault();
      void run("send", () => command("message", { projectId: project.id, to: recipient, message })).then((ok) => {
        setFailed(!ok);
        if (ok) setMessage("");
      });
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Studio_default.composerHead, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { children: t("newInstruction") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: Studio_default.inlineField, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: t("to") }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("select", { value: recipient, onChange: (event) => {
            setRecipient(event.target.value);
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "team", children: t("everyone") }),
            state.employees.map((employee) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("option", { value: employee.id, children: [
              employee.name,
              employee.role && ` \xB7 ${employee.role}`
            ] }, employee.id))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("textarea", { "aria-label": t("message"), placeholder: t("message"), required: true, rows: 3, value: message, onChange: (event) => {
        setMessage(event.target.value);
      } }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Studio_default.composerFoot, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: Studio_default.muted, children: t("noReasoning") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { className: Studio_default.primary, disabled: busy || !message.trim(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Busy, { on: pending === "send" }),
          t("send")
        ] })
      ] }),
      failed && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: Studio_default.formStatus, "data-state": "error", role: "alert", children: error || t("failure") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Studio_default.timelineHead, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("h2", { children: [
        t("messages"),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("small", { className: Studio_default.muted, children: [
          "\xB7 ",
          all.length
        ] })
      ] }),
      people.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: Studio_default.inlineField, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: t("filterPerson") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("select", { value: person, onChange: (event) => {
          setPerson(event.target.value);
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "all", children: t("everyone") }),
          people.map((id2) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: id2, children: name(id2) }, id2))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ol", { className: Studio_default.timeline, children: shown.map((value) => {
      const task = value.taskId ? tasks.find((item) => item.id === value.taskId) : void 0;
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("li", { "data-from": value.from === "user" ? "user" : "employee", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: Studio_default.timelineDot, children: value.from === "user" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: Studio_default.avatar, "data-tone": "user", "data-size": "md", "aria-hidden": "true", children: t("userInitial") }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Avatar, { id: value.from, name: name(value.from) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Studio_default.timelineCard, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: Studio_default.handoffMeta, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: name(value.from) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { "aria-hidden": "true", children: "\u2192" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: name(value.to) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("time", { dateTime: value.createdAt, children: formatTime(value.createdAt) })
          ] }),
          task && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { className: Studio_default.taskChip, onClick: () => {
            onOpenTask(task.id);
          }, children: [
            "#",
            tasks.indexOf(task) + 1,
            " ",
            task.title
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { className: Studio_default.report, children: value.message })
        ] })
      ] }, value.id);
    }) }),
    !all.length && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: Studio_default.emptyState, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: t("noMessages") }) })
  ] });
}

// src/client/MeetingRoom.tsx
var import_react3 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var statusKey = { open: "meetingOpen", drafting: "meetingDrafting", review: "meetingReview", closed: "meetingClosed" };
function MeetingRoom({ state, workspace, busy, error, t, command, onOpenProject }) {
  const meetings = state.meetings.filter((value) => value.workspaceId === workspace.id);
  const [selected, setSelected] = (0, import_react3.useState)(null);
  const [creating, setCreating] = (0, import_react3.useState)(false);
  const meeting2 = meetings.find((value) => value.id === selected) ?? meetings.at(-1);
  const name = (id2) => employeeOf(state.employees, id2)?.name ?? t("unknownEmployee");
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.workArea, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: Studio_default.listPane, "aria-label": t("meetingsTab"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.paneHead, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: t("meetingsTab") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.muted, children: t("meetingSummary", { open: meetings.filter((value) => value.status !== "closed").length, total: meetings.length }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.primary, onClick: () => {
          setCreating(true);
        }, children: t("newMeeting") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ul", { className: Studio_default.roster, children: [...meetings].reverse().map((value) => {
        const last = value.messages.at(-1);
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: Studio_default.meetingItem, "aria-current": meeting2?.id === value.id && !creating ? "true" : void 0, onClick: () => {
          setSelected(value.id);
          setCreating(false);
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: Studio_default.meetingItemHead, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { children: value.title }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: Studio_default.badge, "data-meeting": value.status, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { "aria-hidden": "true" }),
              t(statusKey[value.status])
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: Studio_default.avatarStack, children: value.attendeeIds.map((id2) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Avatar, { id: id2, name: name(id2), size: "sm" }, id2)) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("small", { children: last ? `${last.from === "user" ? t("user") : name(last.from)}\uFF1A${last.message.slice(0, 60)}` : t("meetingNoMessages") }),
          value.speaking && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("small", { className: Studio_default.reason, "data-kind": "speaking", children: t("speakingNow", { name: name(value.speaking) }) })
        ] }) }, value.id);
      }) }),
      !meetings.length && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.emptyState, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { children: t("noMeetingsTitle") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: t("noMeetings") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.footnote, children: t("meetingHelp") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: Studio_default.detailPane, children: creating || !meeting2 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      MeetingForm,
      {
        state,
        workspace,
        busy,
        error,
        t,
        command,
        first: !meetings.length,
        onDone: (id2) => {
          setCreating(false);
          setSelected(id2);
        }
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(MeetingThread, { meeting: meeting2, state, busy, error, t, command, onOpenProject }, meeting2.id) })
  ] });
}
function MeetingForm({ state, workspace, busy, error, t, command, first, onDone, meeting: meeting2 }) {
  const enabled = state.employees.filter((employee) => employee.enabled || meeting2?.attendeeIds.includes(employee.id));
  const [title, setTitle] = (0, import_react3.useState)(meeting2?.title ?? "");
  const [agenda, setAgenda] = (0, import_react3.useState)(meeting2?.agenda ?? "");
  const [hostId, setHostId] = (0, import_react3.useState)(meeting2?.hostId ?? enabled[0]?.id ?? "");
  const [attendees, setAttendees] = (0, import_react3.useState)(meeting2?.attendeeIds ?? enabled.map((employee) => employee.id));
  const [failed, setFailed] = (0, import_react3.useState)(false);
  const { pending, run } = usePending();
  const id2 = (0, import_react3.useId)();
  const chosen = [.../* @__PURE__ */ new Set([hostId, ...attendees])].filter(Boolean);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("form", { className: Studio_default.editorCard, "aria-labelledby": `${id2}-title`, onSubmit: (event) => {
    event.preventDefault();
    const input = { title, agenda, hostId, attendeeIds: chosen };
    void run("save", () => command(meeting2 ? "updateMeeting" : "createMeeting", meeting2 ? { ...input, id: meeting2.id } : { ...input, workspaceId: workspace.id })).then((ok) => {
      setFailed(!ok);
      if (!ok) return;
      onDone(meeting2 ? meeting2.id : null);
    });
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("header", { className: Studio_default.detailHead, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { id: `${id2}-title`, children: t(meeting2 ? "editAttendees" : "newMeeting") }),
      !meeting2 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.muted, children: t(first ? "meetingIntro" : "meetingHelp") })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("meetingTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { required: true, value: title, placeholder: t("meetingTitlePlaceholder"), onChange: (event) => {
        setTitle(event.target.value);
      } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("agenda") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("textarea", { rows: 3, value: agenda, placeholder: t("agendaPlaceholder"), onChange: (event) => {
        setAgenda(event.target.value);
      } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("host") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("select", { required: true, value: hostId, onChange: (event) => {
        setHostId(event.target.value);
      }, children: enabled.map((employee) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("option", { value: employee.id, children: [
        employee.name,
        employee.role && ` \xB7 ${employee.role}`
      ] }, employee.id)) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("small", { className: Studio_default.muted, children: t("hostHelp") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("fieldset", { className: Studio_default.teamPicker, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("legend", { children: [
        t("attendees"),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("small", { children: [
          "\xB7 ",
          t("selectedCount", { count: chosen.length })
        ] })
      ] }),
      enabled.map((employee) => {
        const isHost = employee.id === hostId;
        const checked = isHost || attendees.includes(employee.id);
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { "data-checked": checked, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { type: "checkbox", checked, disabled: isHost, onChange: (event) => {
            setAttendees(event.target.checked ? [...attendees, employee.id] : attendees.filter((value) => value !== employee.id));
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: Studio_default.order, children: isHost ? "\u2605" : "" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Avatar, { id: employee.id, name: employee.name, size: "sm" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: Studio_default.rosterText, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { children: employee.name }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("small", { children: [
              employee.role || t("noRole"),
              isHost && ` \xB7 ${t("hostTag")}`
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(EngineTag, { engine: employee.engine, t })
        ] }, employee.id);
      }),
      !enabled.length && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.inlineError, children: t("noEnabledEmployees") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("footer", { className: Studio_default.formFooter, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.actions, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: Studio_default.primary, disabled: busy || !hostId, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Busy, { on: pending === "save" }),
          t(meeting2 ? "saveAttendees" : "startMeeting")
        ] }),
        (meeting2 || !first) && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: Studio_default.ghost, onClick: () => {
          onDone(null);
        }, children: t("cancelAction") })
      ] }),
      failed && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.formStatus, "data-state": "error", role: "alert", children: error || t("failure") })
    ] })
  ] });
}
function MeetingThread({ meeting: meeting2, state, busy, error, t, command, onOpenProject }) {
  const [message, setMessage] = (0, import_react3.useState)("");
  const [mentions, setMentions] = (0, import_react3.useState)([]);
  const [editing, setEditing] = (0, import_react3.useState)(false);
  const [confirmEnd, setConfirmEnd] = (0, import_react3.useState)(false);
  const [failed, setFailed] = (0, import_react3.useState)(false);
  const { pending, run } = usePending();
  const list = (0, import_react3.useRef)(null);
  const stick = (0, import_react3.useRef)(true);
  const employee = (id2) => employeeOf(state.employees, id2);
  const name = (id2) => id2 === "user" ? t("client") : employee(id2)?.name ?? t("unknownEmployee");
  const project = meeting2.projectId ? state.projects.find((value) => value.id === meeting2.projectId) : void 0;
  const active = meeting2.speaking !== null || meeting2.queue.length > 0;
  const ended = meeting2.status === "closed" && !meeting2.projectId;
  const next = meeting2.speaking ?? (meeting2.status === "drafting" ? meeting2.hostId : meeting2.queue[0]);
  (0, import_react3.useLayoutEffect)(() => {
    const node = list.current?.closest("main");
    if (node && stick.current) node.scrollTop = node.scrollHeight;
  }, [meeting2.messages.length, meeting2.speaking]);
  (0, import_react3.useEffect)(() => {
    const node = list.current?.closest("main");
    if (!node) return;
    const update = () => {
      stick.current = node.scrollHeight - node.scrollTop - node.clientHeight < 160;
    };
    node.addEventListener("scroll", update, { passive: true });
    return () => {
      node.removeEventListener("scroll", update);
    };
  }, []);
  const act = (key, action) => () => {
    void run(key, () => command(action, { id: meeting2.id })).then((ok) => {
      setFailed(!ok);
    });
  };
  const send = () => {
    if (!message.trim()) return;
    stick.current = true;
    void run("send", () => command("meetingMessage", { id: meeting2.id, message, mentions })).then((ok) => {
      setFailed(!ok);
      if (ok) {
        setMessage("");
        setMentions([]);
      }
    });
  };
  if (editing) return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    MeetingForm,
    {
      state,
      workspace: state.workspaces.find((value) => value.id === meeting2.workspaceId),
      busy,
      error,
      t,
      command,
      first: false,
      meeting: meeting2,
      onDone: () => {
        setEditing(false);
      }
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("article", { className: Studio_default.meetingCard, "aria-labelledby": `meeting-${meeting2.id}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("header", { className: Studio_default.meetingHead, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.meetingTitle, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { id: `meeting-${meeting2.id}`, children: meeting2.title }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: Studio_default.badge, "data-meeting": meeting2.status, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { "aria-hidden": "true" }),
          t(statusKey[meeting2.status])
        ] })
      ] }),
      meeting2.agenda && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.agenda, children: meeting2.agenda }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ul", { className: Studio_default.attendeeRow, children: meeting2.attendeeIds.map((id2) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("li", { "data-host": id2 === meeting2.hostId, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Avatar, { id: id2, name: name(id2), size: "sm" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: name(id2) }),
        id2 === meeting2.hostId && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("em", { children: t("hostTag") })
      ] }, id2)) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.actions, children: [
        meeting2.status === "open" && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: Studio_default.primary, disabled: busy || active || !meeting2.messages.length, title: active ? t("waitForSpeaker") : void 0, onClick: act("minutes", "draftMinutes"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Busy, { on: pending === "minutes" }),
          t("draftMinutes")
        ] }),
        meeting2.status === "open" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.ghost, disabled: busy, onClick: () => {
          setEditing(true);
        }, children: t("editAttendees") }),
        active && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: Studio_default.ghostDanger, disabled: busy, onClick: act("stop", "stopMeeting"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Busy, { on: pending === "stop" }),
          t("stopSpeaking")
        ] }),
        meeting2.status !== "closed" && (confirmEnd ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.dangerSolid, disabled: busy, onClick: () => {
            setConfirmEnd(false);
            act("end", "closeMeeting")();
          }, children: t("confirmEnd") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.ghost, onClick: () => {
            setConfirmEnd(false);
          }, children: t("cancelAction") })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.ghost, disabled: busy, onClick: () => {
          setConfirmEnd(true);
        }, children: t("endMeeting") })),
        ended && (meeting2.minutes ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: Studio_default.primary, disabled: busy, onClick: act("review", "reviewMinutes"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Busy, { on: pending === "review" }),
            t("editMinutes")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { disabled: busy || !meeting2.messages.length, onClick: act("minutes", "draftMinutes"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Busy, { on: pending === "minutes" }),
            t("redraftMinutes")
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: Studio_default.primary, disabled: busy || !meeting2.messages.length, onClick: act("minutes", "draftMinutes"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Busy, { on: pending === "minutes" }),
          t("draftMinutes")
        ] })),
        ended && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: Studio_default.ghost, disabled: busy, onClick: act("reopen", "resumeMeeting"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Busy, { on: pending === "reopen" }),
          t("reopenMeeting")
        ] }),
        project && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.primary, onClick: () => {
          onOpenProject(project.id);
        }, children: t("viewProject") })
      ] })
    ] }),
    ended && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.notice, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { children: t("meetingEndedTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: t("meetingEndedHelp") })
    ] }),
    meeting2.error && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: Studio_default.alert, role: "alert", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: meeting2.error }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("ol", { className: Studio_default.chat, ref: list, "aria-live": "polite", children: [
      !meeting2.messages.length && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { className: Studio_default.chatEmpty, children: t("meetingEmpty", { host: name(meeting2.hostId) }) }),
      meeting2.messages.map((value) => {
        const own = value.from === "user";
        const person = own ? void 0 : employee(value.from);
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("li", { className: Studio_default.bubbleRow, "data-own": own, children: [
          own ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: Studio_default.avatar, "data-tone": "user", "data-size": "md", "aria-hidden": "true", children: t("userInitial") }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Avatar, { id: value.from, name: person?.name }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.bubbleBody, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { className: Studio_default.bubbleMeta, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { children: name(value.from) }),
              person?.role && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: person.role }),
              value.from === meeting2.hostId && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("em", { children: t("hostTag") }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("time", { dateTime: value.createdAt, children: formatTime(value.createdAt) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.bubble, children: [
              !!value.mentions.length && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.mentionLine, children: value.mentions.map((id2) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
                "@",
                name(id2)
              ] }, id2)) }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.report, children: value.message })
            ] }),
            value.nativeSession && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("details", { className: Studio_default.sessionNote, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("summary", { children: [
                t(value.nativeSession.engine),
                " \xB7 ",
                t("nativeSession")
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("code", { children: resumeCommand(value.nativeSession) })
            ] })
          ] })
        ] }, value.id);
      }),
      next && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("li", { className: Studio_default.bubbleRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Avatar, { id: next, name: name(next) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: Studio_default.bubbleBody, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.typing, role: "status", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: Studio_default.dots, "aria-hidden": "true", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", {}),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", {}),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", {})
          ] }),
          t(meeting2.status === "drafting" ? "draftingNow" : meeting2.speaking ? "speakingNow" : "aboutToSpeak", { name: name(next) }),
          meeting2.queue.length > (meeting2.speaking ? 0 : 1) && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("small", { children: [
            " \xB7 ",
            t("upNext", { names: meeting2.queue.slice(meeting2.speaking ? 0 : 1).map(name).join("\u3001") })
          ] })
        ] }) })
      ] })
    ] }),
    meeting2.status === "open" && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("form", { className: Studio_default.chatComposer, onSubmit: (event) => {
      event.preventDefault();
      send();
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.mentionChips, role: "group", "aria-label": t("mention"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: Studio_default.muted, children: t("mention") }),
        meeting2.attendeeIds.map((id2) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "button",
          {
            type: "button",
            className: Studio_default.filter,
            "aria-pressed": mentions.includes(id2),
            onClick: () => {
              setMentions(mentions.includes(id2) ? mentions.filter((value) => value !== id2) : [...mentions, id2]);
            },
            children: [
              "@",
              name(id2)
            ]
          },
          id2
        ))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "textarea",
        {
          "aria-label": t("composerPlaceholder"),
          placeholder: t("composerPlaceholder"),
          rows: 3,
          value: message,
          onChange: (event) => {
            setMessage(event.target.value);
          },
          onKeyDown: (event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing) {
              event.preventDefault();
              send();
            }
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.composerFoot, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { className: Studio_default.muted, children: [
          mentions.length ? t("mentionReply", { names: mentions.map(name).join("\u3001") }) : t("hostReply", { name: name(meeting2.hostId) }),
          " \xB7 ",
          t("sendShortcut")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: Studio_default.primary, disabled: busy || !message.trim(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Busy, { on: pending === "send" }),
          t("sendMessage")
        ] })
      ] }),
      failed && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.formStatus, "data-state": "error", role: "alert", children: error || t("failure") })
    ] }),
    meeting2.status === "review" && meeting2.minutes && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(MinutesEditor, { meeting: meeting2, minutes: meeting2.minutes, state, busy, error, t, command }),
    meeting2.status === "closed" && meeting2.minutes && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(MinutesView, { minutes: meeting2.minutes, name, t }),
    failed && meeting2.status !== "open" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.formStatus, "data-state": "error", role: "alert", children: error || t("failure") })
  ] });
}
function MinutesEditor({ meeting: meeting2, minutes, state, busy, error, t, command }) {
  const [draft, setDraft] = (0, import_react3.useState)({ ...minutes, decisionsText: minutes.decisions.join("\n") });
  const [cwd, setCwd] = (0, import_react3.useState)("");
  const [sessionMode, setSessionMode] = (0, import_react3.useState)("employee-project");
  const [failed, setFailed] = (0, import_react3.useState)(false);
  const [saved, setSaved] = (0, import_react3.useState)(false);
  const { pending, run } = usePending();
  const id2 = (0, import_react3.useId)();
  const candidates = state.employees.filter((employee) => employee.enabled && meeting2.attendeeIds.includes(employee.id));
  const workspace = state.workspaces.find((value2) => value2.id === meeting2.workspaceId);
  const value = () => ({
    summary: draft.summary,
    projectName: draft.projectName,
    objective: draft.objective,
    acceptanceCriteria: draft.acceptanceCriteria,
    tasks: draft.tasks,
    decisions: draft.decisionsText.split("\n").map((line) => line.trim()).filter(Boolean)
  });
  const setTask = (index, patch) => {
    setSaved(false);
    setDraft({ ...draft, tasks: draft.tasks.map((task, position) => position === index ? { ...task, ...patch } : task) });
  };
  const move = (index, offset) => {
    const tasks = [...draft.tasks];
    const [task] = tasks.splice(index, 1);
    if (task) tasks.splice(index + offset, 0, task);
    setDraft({ ...draft, tasks });
  };
  const field = (key, label, rows) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: Studio_default.field, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t(label) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("textarea", { rows, value: draft[key], onChange: (event) => {
      setSaved(false);
      setDraft({ ...draft, [key]: event.target.value });
    } })
  ] });
  const complete = !!draft.projectName.trim() && !!draft.objective.trim() && draft.tasks.length > 0 && draft.tasks.every((task) => task.title.trim() && task.instruction.trim());
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: Studio_default.minutes, "aria-labelledby": `${id2}-title`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("header", { className: Studio_default.blockHead, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { id: `${id2}-title`, children: t("minutes") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: Studio_default.muted, children: t("minutesHelp") })
    ] }),
    field("summary", "summary", 4),
    field("decisionsText", "decisions", 3),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.fieldPair, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("projectName") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { required: true, value: draft.projectName, onChange: (event) => {
          setSaved(false);
          setDraft({ ...draft, projectName: event.target.value });
        } })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("projectDirectory") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: Studio_default.mono, placeholder: workspace?.path, value: cwd, onChange: (event) => {
          setCwd(event.target.value);
        } })
      ] })
    ] }),
    field("objective", "objective", 2),
    field("acceptanceCriteria", "acceptanceCriteria", 3),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("fieldset", { className: Studio_default.minutesTasks, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("legend", { children: t("minutesTasks") }),
      draft.tasks.map((task, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.minutesTask, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: Studio_default.step, children: index + 1 }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.minutesTaskFields, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.fieldPair, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: Studio_default.field, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("assignee") }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("select", { value: task.employeeId, onChange: (event) => {
                setTask(index, { employeeId: event.target.value });
              }, children: candidates.map((employee) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("option", { value: employee.id, children: [
                employee.name,
                employee.role && ` \xB7 ${employee.role}`
              ] }, employee.id)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: Studio_default.field, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("taskTitle") }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { required: true, value: task.title, onChange: (event) => {
                setTask(index, { title: event.target.value });
              } })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: Studio_default.field, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("instruction") }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("textarea", { required: true, rows: 2, value: task.instruction, onChange: (event) => {
              setTask(index, { instruction: event.target.value });
            } })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.minutesTaskActions, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: Studio_default.ghost, "aria-label": t("moveUp"), disabled: index === 0, onClick: () => {
            move(index, -1);
          }, children: "\u2191" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: Studio_default.ghost, "aria-label": t("moveDown"), disabled: index === draft.tasks.length - 1, onClick: () => {
            move(index, 1);
          }, children: "\u2193" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: Studio_default.ghostDanger, "aria-label": t("removeTask"), onClick: () => {
            setDraft({ ...draft, tasks: draft.tasks.filter((_, position) => position !== index) });
          }, children: "\xD7" })
        ] })
      ] }, index)),
      !draft.tasks.length && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.emptyInline, children: t("noMinutesTasks") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { type: "button", className: Studio_default.ghost, disabled: !candidates.length, onClick: () => {
        const first = candidates[0];
        if (first) setDraft({ ...draft, tasks: [...draft.tasks, { employeeId: first.id, title: "", instruction: "" }] });
      }, children: [
        "+ ",
        t("addMinutesTask")
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("fieldset", { className: Studio_default.optionCards, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("legend", { children: t("sessionMode") }),
      ["employee-project", "new-task"].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { type: "radio", name: `${id2}-session`, checked: sessionMode === mode, onChange: () => {
          setSessionMode(mode);
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { children: t(mode === "employee-project" ? "employeeSession" : "freshSession") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("small", { children: t(mode === "employee-project" ? "employeeSessionHelp" : "freshSessionHelp") })
        ] })
      ] }, mode))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("footer", { className: Studio_default.formFooter, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.actions, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: Studio_default.primary, disabled: busy || !complete, onClick: () => {
          void run("project", () => command("meetingProject", { id: meeting2.id, minutes: value(), cwd, sessionMode })).then((ok) => {
            setFailed(!ok);
          });
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Busy, { on: pending === "project" }),
          t("createFromMinutes")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: Studio_default.ghost, disabled: busy, onClick: () => {
          void run("save", () => command("saveMinutes", { id: meeting2.id, minutes: value() })).then((ok) => {
            setFailed(!ok);
            setSaved(ok);
          });
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Busy, { on: pending === "save" }),
          t("saveMinutes")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.ghost, disabled: busy, onClick: () => {
          void run("resume", () => command("resumeMeeting", { id: meeting2.id })).then((ok) => {
            setFailed(!ok);
          });
        }, children: t("resumeMeeting") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.formStatus, role: "status", "data-state": failed ? "error" : saved ? "ok" : "idle", children: failed ? error || t("failure") : saved ? t("settingsSaved") : complete ? "" : t("minutesIncomplete") })
    ] })
  ] });
}
function MinutesView({ minutes, name, t }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: Studio_default.minutes, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("header", { className: Studio_default.blockHead, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: t("minutes") }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("dl", { className: Studio_default.facts, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dt", { children: t("summary") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.report, children: minutes.summary }) }),
      !!minutes.decisions.length && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dt", { children: t("decisionsShort") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ul", { className: Studio_default.pathList, children: minutes.decisions.map((value, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("li", { children: [
          "\xB7 ",
          value
        ] }, index)) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dt", { children: t("projectName") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dd", { children: minutes.projectName }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dt", { children: t("objective") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.report, children: minutes.objective }) }),
      minutes.acceptanceCriteria && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dt", { children: t("acceptanceCriteria") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.report, children: minutes.acceptanceCriteria }) })
      ] }),
      !!minutes.tasks.length && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dt", { children: t("minutesTasks") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ol", { className: Studio_default.pathList, children: minutes.tasks.map((task, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("b", { children: [
            "#",
            index + 1
          ] }),
          " ",
          task.title,
          " \xB7 ",
          name(task.employeeId)
        ] }, index)) }) })
      ] })
    ] })
  ] });
}

// src/client/ProjectView.tsx
var import_react4 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function ProjectBar({ state, projects, project, busy, t, command, onSelect }) {
  const { pending, run } = usePending();
  const [exported, setExported] = (0, import_react4.useState)("");
  const tasks = state.tasks.filter((task) => task.projectId === project.id);
  const stats = projectStats(tasks);
  const workspace = state.workspaces.find((value) => value.id === project.workspaceId);
  const anyRunning = tasks.some((task) => task.status === "running");
  const team = [...new Set(tasks.map((task) => task.employeeId))].map((id2) => ({ id: id2, employee: employeeOf(state.employees, id2) }));
  const percent2 = stats.active ? Math.round(stats.completed / stats.active * 100) : 0;
  const act = (key, action) => () => {
    void run(key, () => command(action, { id: project.id }));
  };
  const separator = workspace?.path.includes("\\") ? "\\" : "/";
  const exportPath = workspace ? [workspace.path.replace(/[\\/]+$/, ""), ".studio", "projects", project.id].join(separator) : "";
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: Studio_default.projectBar, "aria-label": t("project"), children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: Studio_default.projectTop, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: Studio_default.projectPicker, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: Studio_default.srOnly, children: t("project") }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { "aria-label": t("project"), value: project.id, onChange: (event) => {
          setExported("");
          onSelect(event.target.value);
        }, children: projects.map((value) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: value.id, children: value.name }, value.id)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ProjectStatus, { status: project.status, t }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: `${Studio_default.actions} ${Studio_default.projectActions}`, children: [
        project.status === "paused" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { className: Studio_default.primary, disabled: busy || !stats.ready, title: stats.ready ? void 0 : t("noReadyTasks"), onClick: act("start", "startProject"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Busy, { on: pending === "start" }),
          t("start")
        ] }),
        project.status === "review" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { className: Studio_default.primary, disabled: busy, onClick: act("accept", "acceptProject"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Busy, { on: pending === "accept" }),
          t("acceptProject")
        ] }),
        project.status === "running" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { disabled: busy, onClick: act("pause", "pauseProject"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Busy, { on: pending === "pause" }),
          t("pause")
        ] }),
        (project.status === "running" || anyRunning) && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { className: Studio_default.ghostDanger, disabled: busy, onClick: act("stop", "stopProject"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Busy, { on: pending === "stop" }),
          t("stop")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { className: project.status === "completed" ? Studio_default.primary : Studio_default.ghost, disabled: busy, onClick: () => {
          void run("export", () => command("exportProject", { id: project.id })).then((ok) => {
            setExported(ok ? exportPath : "");
          });
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Busy, { on: pending === "export" }),
          t("exportProject")
        ] })
      ] })
    ] }),
    exported && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: Studio_default.success, role: "status", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: t("exported") }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("code", { children: exported }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: Studio_default.ghost, onClick: () => {
        setExported("");
      }, children: t("close") })
    ] }),
    !!stats.needsYou && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: Studio_default.notice, "data-tone": "needsYou", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: t("projectNeedsYou", { count: stats.needsYou }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: t("projectNeedsYouHelp") })
    ] }),
    project.status === "review" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: Studio_default.notice, "data-tone": "review", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: t("reviewReady") }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: t("reviewReadyHelp") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: Studio_default.summaryGrid, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: Studio_default.summaryMain, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { children: t("objective") }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: Studio_default.objective, children: project.objective }),
        project.acceptanceCriteria && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { children: t("acceptanceCriteria") }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: Studio_default.criteria, children: project.acceptanceCriteria })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: Studio_default.summarySide, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: Studio_default.progress, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: Studio_default.progressHead, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: t("progress") }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: t("taskSummary", { done: stats.completed, total: stats.active }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: Studio_default.bar, role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": percent2, "aria-label": t("progress"), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { width: `${percent2}%` } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("dl", { className: Studio_default.statList, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { "data-tone": "running", children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dt", { children: t("running") }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dd", { children: stats.running })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { "data-tone": "waiting", children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dt", { children: t("filter_waiting") }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dd", { children: stats.ready + stats.blocked })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { "data-tone": "review", children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dt", { children: t("awaitingReview") }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dd", { children: stats.review })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { "data-tone": "attention", children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dt", { children: t("filter_attention") }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dd", { children: stats.attention })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: Studio_default.teamStrip, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: Studio_default.muted, children: t("team") }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("ul", { children: team.map(({ id: id2, employee }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("li", { title: `${employee?.name ?? ""}${employee?.role ? ` \xB7 ${employee.role}` : ""}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Avatar, { id: id2, name: employee?.name, size: "sm" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: employee?.name ?? t("unknownEmployee") })
          ] }, id2)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: Studio_default.metaLine, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: t(project.sessionMode === "employee-project" ? "employeeSession" : "freshSession") }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: `${Studio_default.metaLine} ${Studio_default.mono}`, title: project.cwd, children: project.cwd })
      ] })
    ] })
  ] });
}

// src/client/ProjectDialog.tsx
var import_react5 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var empty = { name: "", cwd: "", objective: "", acceptanceCriteria: "", sessionMode: "employee-project", employeeIds: null };
function ProjectDialog({ open, state, workspace, busy, error, t, command, onClose, onCreated }) {
  const dialog = (0, import_react5.useRef)(null);
  const id2 = (0, import_react5.useId)();
  const [draft, setDraft] = (0, import_react5.useState)(empty);
  const [failed, setFailed] = (0, import_react5.useState)(false);
  const { pending, run } = usePending();
  (0, import_react5.useEffect)(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);
  const enabled = state.employees.filter((employee) => employee.enabled);
  const chosen = draft.employeeIds ?? enabled.map((employee) => employee.id);
  const team = enabled.filter((employee) => chosen.includes(employee.id));
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("dialog", { ref: dialog, className: Studio_default.dialog, "aria-labelledby": `${id2}-title`, onClose, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("form", { method: "dialog", className: Studio_default.dialogForm, onSubmit: (event) => {
    event.preventDefault();
    void run("create", () => command("createProject", { ...draft, workspaceId: workspace.id, employeeIds: team.map((employee) => employee.id) })).then((ok) => {
      setFailed(!ok);
      if (ok) {
        setDraft(empty);
        onCreated();
      }
    });
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("header", { className: Studio_default.dialogHead, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { id: `${id2}-title`, children: t("projectSettings") }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: Studio_default.muted, children: t("projectIn", { name: workspace.name }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: Studio_default.iconButton, "aria-label": t("close"), onClick: onClose, children: "\xD7" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: Studio_default.dialogBody, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: t("projectName") }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("input", { required: true, value: draft.name, onChange: (event) => {
          setDraft({ ...draft, name: event.target.value });
        } })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: t("objective") }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("textarea", { required: true, rows: 3, placeholder: t("objectivePlaceholder"), value: draft.objective, onChange: (event) => {
          setDraft({ ...draft, objective: event.target.value });
        } })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: t("acceptanceCriteria") }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("textarea", { rows: 3, placeholder: t("criteriaPlaceholder"), value: draft.acceptanceCriteria, onChange: (event) => {
          setDraft({ ...draft, acceptanceCriteria: event.target.value });
        } })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: t("projectDirectory") }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("input", { className: Studio_default.mono, placeholder: workspace.path, value: draft.cwd, onChange: (event) => {
          setDraft({ ...draft, cwd: event.target.value });
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("small", { className: Studio_default.muted, children: t("projectDirectoryHelp") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("fieldset", { className: Studio_default.optionCards, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("legend", { children: t("sessionMode") }),
        ["employee-project", "new-task"].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("input", { type: "radio", name: `${id2}-session`, checked: draft.sessionMode === mode, onChange: () => {
            setDraft({ ...draft, sessionMode: mode });
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("strong", { children: t(mode === "employee-project" ? "employeeSession" : "freshSession") }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("small", { children: t(mode === "employee-project" ? "employeeSessionHelp" : "freshSessionHelp") })
          ] })
        ] }, mode))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("fieldset", { className: Studio_default.teamPicker, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("legend", { children: [
          t("selectTeam"),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("small", { children: [
            "\xB7 ",
            t("selectedCount", { count: team.length })
          ] })
        ] }),
        enabled.map((employee) => {
          const order2 = team.findIndex((value) => value.id === employee.id);
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { "data-checked": order2 >= 0, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("input", { type: "checkbox", checked: order2 >= 0, onChange: (event) => {
              setDraft({ ...draft, employeeIds: event.target.checked ? [...chosen, employee.id] : chosen.filter((value) => value !== employee.id) });
            } }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: Studio_default.order, children: order2 >= 0 ? order2 + 1 : "" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Avatar, { id: employee.id, name: employee.name, size: "sm" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: Studio_default.rosterText, children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("strong", { children: employee.name }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("small", { children: employee.role || t("noRole") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(EngineTag, { engine: employee.engine, t })
          ] }, employee.id);
        }),
        !enabled.length && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: Studio_default.inlineError, children: t("noEnabledEmployees") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("p", { className: Studio_default.hint, children: [
        t("roleTask"),
        " ",
        t("nativeSessionHelp")
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("footer", { className: Studio_default.dialogFoot, children: [
      failed && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: Studio_default.formStatus, "data-state": "error", role: "alert", children: error || t("failure") }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: Studio_default.ghost, onClick: onClose, children: t("cancelAction") }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("button", { type: "submit", className: Studio_default.primary, disabled: busy || !team.length, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Busy, { on: pending === "create" }),
        t("createProject")
      ] })
    ] })
  ] }) });
}

// src/client/TaskBoard.tsx
var import_react8 = require("react");

// src/client/TaskDetail.tsx
var import_react7 = require("react");

// src/client/ArtifactList.tsx
var import_react6 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var order = ["image", "document", "web", "code", "data", "other"];
var textLimit = 64 * 1024;
function ArtifactList({ artifacts, t }) {
  if (!artifacts.length) return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: Studio_default.emptyInline, children: t("noArtifacts") });
  const sorted = [...artifacts].sort((a, b) => order.indexOf(fileKind(a.name)) - order.indexOf(fileKind(b.name)));
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("ul", { className: Studio_default.fileGrid, children: sorted.map((file) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ArtifactItem, { file, t }, file.id)) });
}
function ArtifactItem({ file, t }) {
  const kind = fileKind(file.name);
  const type = imageType(file.name);
  const [image, setImage] = (0, import_react6.useState)("");
  const [text2, setText] = (0, import_react6.useState)(null);
  const [open, setOpen] = (0, import_react6.useState)(false);
  const [failed, setFailed] = (0, import_react6.useState)(false);
  (0, import_react6.useEffect)(() => {
    if (!type || file.size > 8 * 1024 * 1024) return;
    const controller = new AbortController();
    let url = "";
    void fetch(artifactUrl(file), { signal: controller.signal, credentials: "same-origin" }).then(async (response) => {
      if (!response.ok) throw new Error(String(response.status));
      url = URL.createObjectURL(new Blob([await response.arrayBuffer()], { type }));
      setImage(url);
    }).catch(() => {
      if (!controller.signal.aborted) setFailed(true);
    });
    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [file.id, type]);
  const toggle = () => {
    setOpen((value) => !value);
    if (text2 !== null) return;
    void fetch(artifactUrl(file), { credentials: "same-origin" }).then(async (response) => {
      if (!response.ok) throw new Error(String(response.status));
      const body = await response.text();
      setText(body.length > textLimit ? `${body.slice(0, textLimit)}
\u2026` : body);
    }).catch(() => {
      setFailed(true);
    });
  };
  const base = file.name.split(/[\\/]/).at(-1) ?? file.name;
  const folder = file.name.slice(0, file.name.length - base.length);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("li", { className: Studio_default.fileCard, "data-kind": kind, children: [
    image && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("a", { className: Studio_default.thumb, href: image, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("img", { src: image, alt: base, onError: () => {
      setImage("");
      setFailed(true);
    } }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: Studio_default.fileRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: Studio_default.fileIcon, "data-kind": kind, "aria-hidden": "true", children: t(`kind_${kind}`) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: Studio_default.fileName, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("strong", { title: file.name, children: base }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("small", { children: [
          folder && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: Studio_default.mono, children: [
            folder,
            " \xB7 "
          ] }),
          formatSize(file.size),
          " \xB7 ",
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: Studio_default.mono, title: file.sha256, children: file.sha256.slice(0, 10) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: Studio_default.fileActions, children: [
        previewableText(file) && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { className: Studio_default.ghost, "aria-expanded": open, onClick: toggle, children: t(open ? "hidePreview" : "preview") }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("a", { className: Studio_default.linkButton, href: artifactUrl(file), download: true, children: t("download") })
      ] })
    ] }),
    failed && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: Studio_default.inlineError, children: t("previewFailed") }),
    open && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("pre", { className: Studio_default.codePreview, children: text2 ?? t("loading") })
  ] });
}

// src/client/TaskDetail.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function TaskDetail({ task, tasks, state, progress, project, busy, t, command, onSelect, onEdit }) {
  const [changes, setChanges] = (0, import_react7.useState)("");
  const [reply, setReply] = (0, import_react7.useState)("");
  const { pending, run } = usePending();
  const phase = taskPhase(task, tasks);
  const owner = employeeOf(state.employees, task.employeeId);
  const step = (value) => `#${tasks.indexOf(value) + 1}`;
  const waiting = waitingOn(task, tasks);
  const original = revisionOf(task, tasks);
  const revisions = revisionsFor(task, tasks);
  const request = changeRequest(task, state.messages);
  const artifacts = state.artifacts.filter((file) => file.taskId === task.id);
  const handoffs = state.messages.filter((message) => message.taskId === task.id && message.id !== request?.id);
  const name = (id2) => id2 === "user" ? t("user") : id2 === "team" ? t("everyone") : employeeOf(state.employees, id2)?.name ?? t("unknownEmployee");
  const link = (value) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("button", { className: Studio_default.taskLink, onClick: () => {
    onSelect(value.id);
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("b", { children: step(value) }),
    value.title,
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TaskStatus, { phase: taskPhase(value, tasks), t })
  ] }, value.id);
  const canReview = task.status === "completed" && task.reviewStatus !== "superseded";
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("article", { className: Studio_default.detailCard, "aria-labelledby": `task-${task.id}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("header", { className: Studio_default.detailHead, children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.detailTitle, children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: Studio_default.stepLarge, children: step(task) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h2", { id: `task-${task.id}`, children: task.title }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { className: Studio_default.taskOwner, children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Avatar, { id: task.employeeId, name: owner?.name, size: "sm" }),
            owner?.name ?? t("unknownEmployee"),
            owner?.role && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("small", { children: [
              " \xB7 ",
              owner.role
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.detailBadges, children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TaskStatus, { phase, t }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ReviewStatus, { task, t })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.actions, children: [
        task.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { className: Studio_default.ghost, onClick: onEdit, children: t("edit") }),
        ["failed", "cancelled", "interrupted"].includes(task.status) && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("button", { className: Studio_default.primary, disabled: busy, onClick: () => {
          void run("retry", () => command("retryTask", { id: task.id }));
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Busy, { on: pending === "retry" }),
          t("retry")
        ] }),
        ["pending", "running", "waiting"].includes(task.status) && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("button", { className: Studio_default.ghostDanger, disabled: busy, onClick: () => {
          void run("cancel", () => command("cancelTask", { id: task.id }));
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Busy, { on: pending === "cancel" }),
          t("cancel")
        ] })
      ] })
    ] }),
    task.error && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.alert, role: "alert", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: t("failureReason") }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { children: task.error })
    ] }),
    !!waiting.length && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.notice, children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: t("waitingTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: Studio_default.linkList, children: waiting.map(link) })
    ] }),
    task.status === "running" && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.notice, "data-tone": "running", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: t("runningNotice", { name: owner?.name ?? "" }) }),
      task.startedAt && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { children: t("startedAt", { time: formatTime(task.startedAt) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: Studio_default.progressLine, children: progress ? /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("small", { children: t("latestProgress", { time: formatTime(progress.at) }) }),
        progress.text
      ] }) : t("noProgressYet") })
    ] }),
    task.status === "waiting" && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("form", { className: Studio_default.notice, "data-tone": "needsYou", onSubmit: (event) => {
      event.preventDefault();
      void run("reply", () => command("answerTask", { id: task.id, reply })).then((ok) => {
        if (ok) setReply("");
      });
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: t("needsYouTitle", { name: owner?.name ?? "" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("pre", { className: Studio_default.report, children: task.question }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: t("yourReply") }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("textarea", { required: true, rows: 3, placeholder: t("replyPlaceholder"), value: reply, onChange: (event) => {
          setReply(event.target.value);
        } })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.actions, children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("button", { className: Studio_default.primary, disabled: busy, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Busy, { on: pending === "reply" }),
          t("replyContinue")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: Studio_default.muted, children: t(project.status === "running" ? "replyHelp" : "replyPausedHelp") })
      ] })
    ] }),
    original && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.revisionCard, children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: t("revisionOf") }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: Studio_default.linkList, children: link(original) }),
      request && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("blockquote", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("small", { children: t("changeInstruction") }),
        request.message
      ] })
    ] }),
    !!revisions.length && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.revisionCard, "data-kind": "superseded", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: t("supersededBy") }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: Studio_default.linkList, children: revisions.map(link) }),
      revisions.map((value) => changeRequest(value, state.messages)).filter(Boolean).map((value) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("blockquote", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("small", { children: t("changeInstruction") }),
        value?.message
      ] }, value?.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Section, { title: t("result"), children: task.result ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("pre", { className: Studio_default.report, children: task.result }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: Studio_default.emptyInline, children: t("noResult") }) }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Section, { title: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
      t("artifacts"),
      !!artifacts.length && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("small", { children: [
        " \xB7 ",
        artifacts.length
      ] })
    ] }), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ArtifactList, { artifacts, t }) }),
    canReview && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Section, { title: t("reviewResult"), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("form", { className: Studio_default.reviewForm, onSubmit: (event) => {
      event.preventDefault();
      void run("changes", () => command("requestChanges", { id: task.id, instruction: changes })).then((ok) => {
        if (ok) setChanges("");
      });
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: t("changeInstruction") }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("textarea", { required: true, rows: 3, placeholder: t("changePlaceholder"), value: changes, onChange: (event) => {
          setChanges(event.target.value);
        } })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.actions, children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("button", { disabled: busy || project.status === "running", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Busy, { on: pending === "changes" }),
          t("requestChanges")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: Studio_default.muted, children: t(project.status === "running" ? "pauseBeforeChanges" : "changesHelp") })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Section, { title: t("overview"), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("dl", { className: Studio_default.facts, children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("dt", { children: t("instruction") }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("pre", { className: Studio_default.report, children: task.instruction }) }),
      !!task.dependsOn.length && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("dt", { children: t("dependencies") }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("dd", { className: Studio_default.linkList, children: task.dependsOn.map((id2) => tasks.find((value) => value.id === id2)).filter((value) => !!value).map(link) })
      ] }),
      !!task.outputFiles.length && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("dt", { children: t("declaredFiles") }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("ul", { className: Studio_default.pathList, children: task.outputFiles.map((file) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("li", { className: Studio_default.mono, children: file }, file)) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("dt", { children: t("attempt") }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("dd", { children: task.attempt }),
      task.startedAt && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("dt", { children: t("timeline") }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("dd", { children: [
          formatTime(task.startedAt),
          task.finishedAt && ` \u2192 ${formatTime(task.finishedAt)}`
        ] })
      ] })
    ] }) }),
    !!handoffs.length && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Section, { title: t("relatedHandoffs"), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("ul", { className: Studio_default.miniTimeline, children: handoffs.map((message) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("li", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { className: Studio_default.handoffMeta, children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: name(message.from) }),
        " \u2192 ",
        name(message.to),
        " \xB7 ",
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("time", { dateTime: message.createdAt, children: formatTime(message.createdAt) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("pre", { className: Studio_default.report, children: message.message })
    ] }, message.id)) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("details", { className: Studio_default.disclosure, children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("summary", { children: [
        t("executionInfo"),
        !!task.nativeSessions.length && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("small", { children: [
          " \xB7 ",
          t("sessionCount", { count: task.nativeSessions.length })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.disclosureBody, children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: Studio_default.hint, children: t("nativeSessionHelp") }),
        task.nativeSessions.map((session) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.session, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: t(session.engine) }),
            " \xB7 ",
            t(session.continued ? "continuedSession" : "newSession"),
            " \xB7 ",
            t("attemptN", { n: session.attempt })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CopyLine, { text: resumeCommand(session), t }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: `${Studio_default.muted} ${Studio_default.mono}`, children: session.cwd })
        ] }, `${session.id}-${session.attempt}`)),
        !task.nativeSessions.length && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: Studio_default.muted, children: t("noSessions") }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h4", { children: t("assignment") }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("pre", { className: Studio_default.report, children: task.assignment || task.instruction })
      ] })
    ] })
  ] });
}
function CopyLine({ text: text2, t }) {
  const [copied, setCopied] = (0, import_react7.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: Studio_default.copyLine, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("code", { children: text2 }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { type: "button", className: Studio_default.ghost, onClick: () => {
      void navigator.clipboard.writeText(text2).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      });
    }, children: t(copied ? "copied" : "copy") })
  ] });
}

// src/client/TaskBoard.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
var filters = {
  all: [],
  needsYou: ["waiting"],
  active: ["running"],
  waiting: ["pending", "blocked"],
  done: ["completed"],
  attention: ["failed", "interrupted", "cancelled"]
};
function TaskBoard({ state, progress, project, busy, error, t, command, selected, onSelect }) {
  const tasks = state.tasks.filter((task2) => task2.projectId === project.id);
  const [filter, setFilter] = (0, import_react8.useState)("all");
  const [draft, setDraft] = (0, import_react8.useState)(null);
  const detail = (0, import_react8.useRef)(null);
  const task = tasks.find((value) => value.id === selected) ?? tasks[0];
  const stats = projectStats(tasks);
  const counts = { all: stats.total, needsYou: stats.needsYou, active: stats.running, waiting: stats.ready + stats.blocked, done: stats.completed, attention: stats.attention };
  const shown = filter === "all" ? tasks : tasks.filter((value) => filters[filter].includes(taskPhase(value, tasks)));
  const edit = (value) => {
    setDraft({
      id: value?.id ?? null,
      employeeId: value?.employeeId ?? state.employees.find((employee) => employee.enabled)?.id ?? "",
      title: value?.title ?? "",
      instruction: value?.instruction ?? "",
      dependsOn: value?.dependsOn ?? [],
      files: value?.outputFiles.join("\n") ?? ""
    });
    reveal();
  };
  const reveal = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1100px)").matches) {
      requestAnimationFrame(() => {
        detail.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };
  const select = (id2) => {
    onSelect(id2);
    setDraft(null);
    reveal();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: Studio_default.workArea, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("section", { className: Studio_default.listPane, "aria-label": t("tasks"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: Studio_default.paneHead, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h2", { children: t("tasks") }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: Studio_default.muted, children: t("taskSummary", { done: stats.completed, total: stats.active }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { className: Studio_default.primary, disabled: busy, onClick: () => {
          edit();
        }, children: t("addTask") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: Studio_default.filterRow, role: "group", "aria-label": t("filterTasks"), children: Object.keys(filters).filter((key) => key !== "needsYou" || counts.needsYou).map((key) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("button", { className: Studio_default.filter, "aria-pressed": filter === key, onClick: () => {
        setFilter(key);
      }, "data-tone": key, children: [
        t(`filter_${key}`),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: counts[key] })
      ] }, key)) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("ol", { className: Studio_default.pipeline, children: shown.map((value) => {
        const phase = taskPhase(value, tasks);
        const owner = employeeOf(state.employees, value.employeeId);
        const waiting = phase === "blocked" ? waitingOn(value, tasks) : [];
        const original = revisionOf(value, tasks);
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("li", { "data-status": phase, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("button", { className: Studio_default.taskItem, "aria-current": task?.id === value.id ? "true" : void 0, onClick: () => {
          select(value.id);
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: Studio_default.step, children: tasks.indexOf(value) + 1 }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: Studio_default.taskMain, children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("strong", { children: value.title }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: Studio_default.taskOwner, children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Avatar, { id: value.employeeId, name: owner?.name, size: "sm" }),
              owner?.name ?? t("unknownEmployee"),
              owner?.role && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("small", { children: [
                " \xB7 ",
                owner.role
              ] })
            ] }),
            !!waiting.length && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("small", { className: Studio_default.reason, children: t("waitingFor", { names: waiting.map((dependency) => `#${tasks.indexOf(dependency) + 1}`).join("\u3001") }) }),
            phase === "running" && progress[value.id] && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("small", { className: Studio_default.reason, "data-kind": "progress", children: progress[value.id]?.text }),
            phase === "waiting" && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("small", { className: Studio_default.reason, "data-kind": "needsYou", children: value.question }),
            original && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("small", { className: Studio_default.reason, "data-kind": "revision", children: t("revisionOfShort", { step: tasks.indexOf(original) + 1 }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: Studio_default.taskBadges, children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(TaskStatus, { phase, t }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ReviewStatus, { task: value, t })
          ] })
        ] }) }, value.id);
      }) }),
      !tasks.length && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: Studio_default.emptyState, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("strong", { children: t("noTasks") }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { children: t("noTasksHelp") })
      ] }),
      !!tasks.length && !shown.length && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: Studio_default.emptyInline, children: t("noFilteredTasks") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: Studio_default.detailPane, ref: detail, children: draft ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(TaskForm, { draft, setDraft, tasks, state, project, busy, error, t, command }) : task ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(TaskDetail, { task, tasks, state, progress: progress[task.id], project, busy, t, command, onSelect: select, onEdit: () => {
      edit(task);
    } }, task.id) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: Studio_default.emptyState, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { children: t("selectTask") }) }) })
  ] });
}
function TaskForm({ draft, setDraft, tasks, state, project, busy, error, t, command }) {
  const { pending, run } = usePending();
  const [failed, setFailed] = (0, import_react8.useState)(false);
  const first = (0, import_react8.useRef)(null);
  (0, import_react8.useEffect)(() => {
    first.current?.focus();
  }, [draft.id]);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("form", { className: Studio_default.editorCard, onSubmit: (event) => {
    event.preventDefault();
    const input = {
      projectId: project.id,
      employeeId: draft.employeeId,
      title: draft.title,
      instruction: draft.instruction,
      dependsOn: draft.dependsOn,
      outputFiles: draft.files.split("\n").map((name) => name.trim()).filter(Boolean)
    };
    void run("save", () => command(draft.id ? "editTask" : "createTask", draft.id ? { id: draft.id, task: input } : input)).then((ok) => {
      setFailed(!ok);
      if (ok) setDraft(null);
    });
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("header", { className: Studio_default.detailHead, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h2", { children: t(draft.id ? "editTask" : "addTask") }) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: t("assignee") }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("select", { ref: first, required: true, value: draft.employeeId, onChange: (event) => {
        setDraft({ ...draft, employeeId: event.target.value });
      }, children: state.employees.filter((employee) => employee.enabled || employee.id === draft.employeeId).map((employee) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("option", { value: employee.id, children: [
        employee.name,
        employee.role && ` \xB7 ${employee.role}`
      ] }, employee.id)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: t("taskTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("input", { required: true, value: draft.title, onChange: (event) => {
        setDraft({ ...draft, title: event.target.value });
      } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: t("instruction") }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("textarea", { required: true, rows: 6, value: draft.instruction, onChange: (event) => {
        setDraft({ ...draft, instruction: event.target.value });
      } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("fieldset", { className: Studio_default.checkList, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("legend", { children: t("dependencies") }),
      tasks.filter((value) => value.id !== draft.id).map((value) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("label", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("input", { type: "checkbox", checked: draft.dependsOn.includes(value.id), onChange: (event) => {
          setDraft({ ...draft, dependsOn: event.target.checked ? [...draft.dependsOn, value.id] : draft.dependsOn.filter((id2) => id2 !== value.id) });
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("b", { children: [
            "#",
            tasks.indexOf(value) + 1
          ] }),
          " ",
          value.title
        ] })
      ] }, value.id)),
      tasks.length <= (draft.id ? 1 : 0) && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: Studio_default.muted, children: t("noDependencies") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: t("files") }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("textarea", { className: Studio_default.mono, rows: 3, value: draft.files, onChange: (event) => {
        setDraft({ ...draft, files: event.target.value });
      } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("footer", { className: Studio_default.formFooter, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: Studio_default.actions, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("button", { className: Studio_default.primary, disabled: busy, children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Busy, { on: pending === "save" }),
          t(pending === "save" ? "saving" : "save")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { type: "button", className: Studio_default.ghost, onClick: () => {
          setDraft(null);
        }, children: t("close") })
      ] }),
      failed && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: Studio_default.formStatus, "data-state": "error", role: "alert", children: error || t("failure") })
    ] })
  ] });
}

// src/client/TeamView.tsx
var import_react11 = require("react");

// ../../../deepseek-harness/packages/util/crypto/lib/index.js
function randomUUID() {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes, (byte, index) => {
    return (index === 6 ? byte & 15 | 64 : index === 8 ? byte & 63 | 128 : byte).toString(16).padStart(2, "0");
  }).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// src/roster.ts
function hasHistory(state, id2) {
  return state.tasks.some((task) => task.employeeId === id2) || state.meetings.some((meeting2) => meeting2.attendeeIds.some((value) => value === id2) || meeting2.messages.some((message) => message.from === id2) || meeting2.minutes?.tasks.some((task) => task.employeeId === id2) === true);
}
function seat(value) {
  return `${value.name.trim()}\0${value.role.trim()}`;
}
function planTemplate(state, template) {
  const plan = { keep: [], add: [], remove: [], disable: [] };
  const claimed = /* @__PURE__ */ new Set();
  for (const member of template.members) {
    const match = state.employees.find((employee) => !claimed.has(employee.id) && seat(employee) === seat(member));
    if (match) {
      claimed.add(match.id);
      plan.keep.push(match);
    } else plan.add.push(member);
  }
  for (const employee of state.employees) {
    if (claimed.has(employee.id)) continue;
    if (hasHistory(state, employee.id)) {
      if (employee.enabled) plan.disable.push(employee);
    } else plan.remove.push(employee);
  }
  return plan;
}
function settings(employee) {
  return JSON.stringify([employee.name.trim(), employee.role.trim(), employee.responsibilities.trim(), employee.engine]);
}
function redundantEmployees(state) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const employee of state.employees) {
    const key = settings(employee);
    if (seen.has(key) && !hasHistory(state, employee.id)) result.push(employee);
    seen.add(key);
  }
  return result;
}
function toMember(employee) {
  const { id: _id, cwd: _cwd, enabled: _enabled, ...member } = employee;
  return member;
}

// src/client/EmployeeEditor.tsx
var import_react9 = require("react");
var import_jsx_runtime9 = require("react/jsx-runtime");
var efforts = {
  claude: ["", "low", "medium", "high", "xhigh", "max"],
  codex: ["", "low", "medium", "high", "xhigh", "max", "ultra"],
  harness: ["", "off", "low", "high", "max"],
  compatible: ["", "minimal", "low", "medium", "high", "xhigh"]
};
var engines = ["codex", "claude", "harness", "compatible"];
function EmployeeEditor({ employee, catalog, busy, isNew, error, t, save, remove, variant = "employee" }) {
  const member = variant === "member";
  const [draft, setDraft] = (0, import_react9.useState)(employee);
  const [customModel, setCustomModel] = (0, import_react9.useState)(false);
  const [outcome, setOutcome] = (0, import_react9.useState)("idle");
  const [confirmDelete, setConfirmDelete] = (0, import_react9.useState)(false);
  const id2 = (0, import_react9.useId)();
  const change = (key, value) => {
    setOutcome("idle");
    setDraft((previous) => ({ ...previous, [key]: value }));
  };
  const models = draft.engine === "compatible" ? void 0 : catalog?.[draft.engine === "claude" ? "claude" : draft.engine === "codex" ? "codex" : "harness"];
  const selectedModel = models?.find((model2) => model2.id === draft.model);
  const isCustomModel = customModel || draft.engine === "compatible" || !!draft.model && !selectedModel;
  const effortOptions = selectedModel?.efforts.length ? ["", ...selectedModel.efforts] : efforts[draft.engine];
  const dirty = isNew || JSON.stringify(draft) !== JSON.stringify(employee);
  const text2 = (key, placeholder = "", required = false) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: Studio_default.field, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: t(key) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { required, value: draft[key], placeholder, onChange: (event) => {
      change(key, event.target.value);
    } })
  ] });
  const pickModel = (model2) => {
    setOutcome("idle");
    setDraft((previous) => ({ ...previous, model: model2, effort: "" }));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("form", { className: Studio_default.editorCard, "aria-labelledby": `${id2}-title`, onSubmit: (event) => {
    event.preventDefault();
    setOutcome("saving");
    void save(draft).then((ok) => {
      setOutcome(ok ? "saved" : "failed");
    });
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("header", { className: Studio_default.editorHead, children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Avatar, { id: draft.id, name: draft.name, size: "lg" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h2", { id: `${id2}-title`, children: draft.name || t("newEmployee") }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { children: [
          draft.role || t("noRole"),
          !member && !draft.enabled && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
            " \xB7 ",
            t("disabled")
          ] }),
          member && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
            " \xB7 ",
            t("templateMember")
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("fieldset", { className: Studio_default.formGroup, children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("legend", { children: t("profile") }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: Studio_default.fieldPair, children: [
        text2("name", "", true),
        text2("role")
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: t("responsibilities") }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("textarea", { rows: 3, value: draft.responsibilities, onChange: (event) => {
          change("responsibilities", event.target.value);
        } })
      ] }),
      !member && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: Studio_default.switch, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { type: "checkbox", checked: draft.enabled, onChange: (event) => {
          change("enabled", event.target.checked);
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: t("enabled") })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("fieldset", { className: Studio_default.formGroup, children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("legend", { children: t("execution") }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: Studio_default.segmented, role: "radiogroup", "aria-label": t("engine"), children: engines.map((engine2) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { "data-engine": engine2, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { type: "radio", name: `${id2}-engine`, value: engine2, checked: draft.engine === engine2, onChange: () => {
          setCustomModel(false);
          setOutcome("idle");
          setDraft((previous) => ({ ...previous, engine: engine2, model: engine2 === "claude" ? "sonnet" : "", effort: "", thinkingFormat: engine2 === "compatible" ? "zai" : "none" }));
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: t(engine2) })
      ] }, engine2)) }),
      draft.engine !== "compatible" && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        ModelPicker,
        {
          t,
          name: `${id2}-model`,
          models,
          value: draft.model,
          custom: isCustomModel,
          loadError: draft.engine === "claude" ? catalog?.claudeError ?? "" : "",
          onPick: (model2) => {
            setCustomModel(false);
            pickModel(model2);
          },
          onCustom: () => {
            setCustomModel(true);
            setOutcome("idle");
          }
        }
      ),
      isCustomModel && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: t("modelId") }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { "aria-label": t("modelId"), className: Studio_default.mono, value: draft.model, placeholder: t("modelIdPlaceholder"), onChange: (event) => {
          pickModel(event.target.value);
        } })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { id: `${id2}-effort`, children: [
          t("effort"),
          selectedModel && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("small", { children: [
            " \xB7 ",
            selectedModel.name
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: Studio_default.chips, role: "radiogroup", "aria-labelledby": `${id2}-effort`, children: effortOptions.map((effort) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: Studio_default.chip, children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { type: "radio", name: `${id2}-effort`, checked: draft.effort === effort, onChange: () => {
            change("effort", effort);
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: effort || t("nativeDefault") })
        ] }, effort || "default")) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: Studio_default.hint, children: t(draft.engine === "compatible" ? "providerHelp" : "nativeHelp") }),
      draft.engine === "compatible" && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: Studio_default.fieldPair, children: [
          text2("baseURL"),
          text2("apiKeyEnv")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: Studio_default.field, children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: t("thinkingFormat") }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("select", { "aria-label": t("thinkingFormat"), value: draft.thinkingFormat, onChange: (event) => {
            change("thinkingFormat", event.target.value);
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "none", children: t("protocolNone") }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "zai", children: t("zai") }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "deepseek", children: t("deepseekProtocol") })
          ] })
        ] })
      ] }),
      (draft.engine === "compatible" || draft.engine === "harness") && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: Studio_default.fieldPair, children: ["contextWindow", "maxTokens"].map((key) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: t(key) }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { type: "number", min: key === "contextWindow" ? 1024 : 1, value: draft[key], onChange: (event) => {
          change(key, Number(event.target.value));
        } })
      ] }, key)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("fieldset", { className: Studio_default.formGroup, children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("legend", { children: t(member ? "permission" : "workplace") }),
      !member && text2("cwd", t("unassignedCwd")),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: t("permission") }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("select", { "aria-label": t("permission"), value: draft.permission, onChange: (event) => {
          change("permission", event.target.value);
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "read-only", children: t("readOnly") }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "workspace-write", children: t("workspaceWrite") }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "full-access", children: t("fullAccess") })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("footer", { className: Studio_default.formFooter, children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: Studio_default.actions, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("button", { type: "submit", className: Studio_default.primary, disabled: busy || !dirty, children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Busy, { on: outcome === "saving" }),
          t(outcome === "saving" ? "saving" : member ? "updateMember" : "save")
        ] }),
        confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { type: "button", className: Studio_default.dangerSolid, disabled: busy, onClick: () => {
            setOutcome("deleting");
            void remove(draft.id).then((ok) => {
              setConfirmDelete(false);
              setOutcome(ok ? "idle" : "failed");
            });
          }, children: t("confirmDelete") }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { type: "button", className: Studio_default.ghost, onClick: () => {
            setConfirmDelete(false);
          }, children: t("cancelAction") })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { type: "button", className: Studio_default.ghostDanger, disabled: busy, onClick: () => {
          setConfirmDelete(true);
        }, children: t(member ? "removeMember" : isNew ? "discard" : "delete") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: Studio_default.formStatus, role: "status", "data-state": outcome === "failed" ? "error" : outcome === "saved" && !dirty ? "ok" : "idle", children: outcome === "failed" ? error || t("failure") : outcome === "saved" && !dirty ? t(member ? "memberUpdated" : "settingsSaved") : dirty && !isNew ? t("unsaved") : "" })
    ] })
  ] });
}
function ModelPicker({ t, name, models, value, custom, loadError, onPick, onCustom }) {
  const [query, setQuery] = (0, import_react9.useState)("");
  const list = models?.filter((model2) => model2.id !== "") ?? [];
  const needle = query.trim().toLowerCase();
  const shown = needle ? list.filter((model2) => `${model2.name} ${model2.id}`.toLowerCase().includes(needle)) : list;
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("fieldset", { className: Studio_default.modelPicker, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("legend", { children: [
      t("model"),
      models && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("small", { children: [
        " \xB7 ",
        t("modelCount", { count: list.length })
      ] })
    ] }),
    loadError && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { role: "alert", className: Studio_default.inlineError, children: loadError }),
    list.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { type: "search", className: Studio_default.modelSearch, "aria-label": t("searchModels"), placeholder: t("searchModels"), value: query, onChange: (event) => {
      setQuery(event.target.value);
    } }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: Studio_default.modelList, children: [
      !needle && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: Studio_default.modelOption, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { type: "radio", name, checked: !custom && value === "", onChange: () => {
          onPick("");
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("strong", { children: t("nativeDefault") }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { children: t("nativeDefaultHelp") })
        ] })
      ] }),
      models === void 0 && !loadError && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: Studio_default.muted, children: t("loadingModels") }),
      shown.map((model2) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: Studio_default.modelOption, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { type: "radio", name, checked: !custom && value === model2.id, onChange: () => {
          onPick(model2.id);
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("strong", { children: model2.name }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { className: Studio_default.mono, children: model2.id }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: Studio_default.modelTags, children: [
            model2.imageInput && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("em", { children: t("imageInput") }),
            !!model2.efforts.length && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("em", { children: t("effortCount", { count: model2.efforts.length }) })
          ] })
        ] })
      ] }, model2.id)),
      needle && !shown.length && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: Studio_default.muted, children: t("noModelMatch") }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: Studio_default.modelOption, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { type: "radio", name, checked: custom, onChange: onCustom }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("strong", { children: t("customModel") }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { children: t("customModelHelp") })
        ] })
      ] })
    ] })
  ] });
}

// src/client/TemplatesView.tsx
var import_react10 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
function TemplatesView({ state, view, t, command, onDone }) {
  const [selected, setSelected] = (0, import_react10.useState)(null);
  const [draft, setDraft] = (0, import_react10.useState)(null);
  const template = draft ?? state.templates.find((value) => value.id === selected) ?? state.templates[0];
  const create = (members, name) => {
    const id2 = randomUUID();
    setDraft({ id: id2, name, description: "", members, createdAt: "" });
    setSelected(id2);
  };
  const blank = () => toMember({
    id: "",
    name: t("newMember"),
    role: "",
    responsibilities: "",
    engine: "codex",
    model: "",
    effort: "",
    permission: "workspace-write",
    cwd: "",
    enabled: true,
    baseURL: "",
    apiKeyEnv: "",
    thinkingFormat: "none",
    contextWindow: 262144,
    maxTokens: 32768
  });
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: Studio_default.workArea, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("section", { className: Studio_default.listPane, "aria-label": t("templates"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: Studio_default.paneHead, children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("h2", { children: t("templates") }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: Studio_default.muted, children: t("templatesHelp") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("button", { className: Studio_default.ghost, onClick: onDone, children: t("backToRoster") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: Studio_default.actions, children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("button", { className: Studio_default.primary, disabled: !!draft, onClick: () => {
          create([blank()], t("newTemplate"));
        }, children: t("newTemplate") }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("button", { disabled: !!draft || !state.employees.some((employee) => employee.enabled), onClick: () => {
          create(state.employees.filter((employee) => employee.enabled).map(toMember), t("myTeam"));
        }, children: t("saveTeamAsTemplate") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("ul", { className: Studio_default.roster, style: { marginTop: 12 }, children: [
        draft && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("button", { className: Studio_default.meetingItem, "aria-current": "true", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { className: Studio_default.meetingItemHead, children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("strong", { children: draft.name }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: Studio_default.badge, children: t("unsavedTemplate") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("small", { children: t("memberCount", { count: draft.members.length }) })
        ] }) }),
        state.templates.map((value) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
          "button",
          {
            className: Studio_default.meetingItem,
            "aria-current": !draft && template?.id === value.id ? "true" : void 0,
            onClick: () => {
              setDraft(null);
              setSelected(value.id);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { className: Studio_default.meetingItemHead, children: [
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("strong", { children: value.name }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("small", { children: t("memberCount", { count: value.members.length }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: Studio_default.avatarStack, children: value.members.slice(0, 10).map((member, index) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Avatar, { id: `${value.id}-${index}`, name: member.name, size: "sm" }, index)) }),
              value.description && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("small", { children: value.description })
            ]
          }
        ) }, value.id))
      ] }),
      !state.templates.length && !draft && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: Studio_default.emptyState, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { children: t("noTemplates") }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: Studio_default.detailPane, children: template ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      TemplateEditor,
      {
        template,
        isNew: draft?.id === template.id,
        state,
        view,
        t,
        command,
        blank,
        onSaved: () => {
          setDraft(null);
        },
        onDiscard: () => {
          setDraft(null);
          setSelected(null);
        },
        onApplied: onDone
      },
      template.id
    ) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: Studio_default.emptyState, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { children: t("selectTemplate") }) }) })
  ] });
}
function TemplateEditor({ template, isNew, state, view, t, command, blank, onSaved, onDiscard, onApplied }) {
  const [draft, setDraft] = (0, import_react10.useState)(template);
  const [editing, setEditing] = (0, import_react10.useState)(null);
  const [confirmDelete, setConfirmDelete] = (0, import_react10.useState)(false);
  const [applying, setApplying] = (0, import_react10.useState)(false);
  const [outcome, setOutcome] = (0, import_react10.useState)("idle");
  const { pending, run } = usePending();
  const dirty = isNew || JSON.stringify({ ...draft, createdAt: "" }) !== JSON.stringify({ ...template, createdAt: "" });
  const update = (patch) => {
    setOutcome("idle");
    setDraft({ ...draft, ...patch });
  };
  const move = (index, offset) => {
    const members = [...draft.members];
    const [member] = members.splice(index, 1);
    if (member) members.splice(index + offset, 0, member);
    update({ members });
    setEditing(null);
  };
  const asEmployee = (member, index) => ({ ...member, id: `${draft.id}-member-${index}`, cwd: "", enabled: true });
  const valid = !!draft.name.trim() && draft.members.length > 0 && draft.members.every((member) => member.name.trim() && member.role.trim());
  const plan = applying ? planTemplate(state, template) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: Studio_default.editorCard, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("header", { className: Studio_default.detailHead, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("h2", { children: draft.name || t("newTemplate") }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("p", { className: Studio_default.muted, children: [
        t("memberCount", { count: draft.members.length }),
        isNew && ` \xB7 ${t("unsavedTemplate")}`
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: Studio_default.fieldPair, children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: t("templateName") }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("input", { required: true, value: draft.name, onChange: (event) => {
          update({ name: event.target.value });
        } })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: t("templateDescription") }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("input", { value: draft.description, onChange: (event) => {
          update({ description: event.target.value });
        } })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("fieldset", { className: Studio_default.minutesTasks, children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("legend", { children: t("templateMembers") }),
      draft.members.map((member, index) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: Studio_default.memberRow, "aria-current": editing === index ? "true" : void 0, children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: Studio_default.step, children: index + 1 }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("button", { type: "button", className: Studio_default.memberMain, onClick: () => {
          setEditing(editing === index ? null : index);
        }, "aria-expanded": editing === index, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Avatar, { id: `${draft.id}-${index}`, name: member.name, size: "sm" }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { className: Studio_default.rosterText, children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("strong", { children: member.name || t("newMember") }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("small", { children: member.role || t("noRole") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { className: Studio_default.rosterMeta, children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(EngineTag, { engine: member.engine, t }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("small", { className: Studio_default.mono, children: [
              member.model || t("nativeDefault"),
              member.effort && ` \xB7 ${member.effort}`
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { className: Studio_default.minutesTaskActions, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("button", { type: "button", className: Studio_default.ghost, "aria-label": t("moveUp"), disabled: index === 0, onClick: () => {
            move(index, -1);
          }, children: "\u2191" }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("button", { type: "button", className: Studio_default.ghost, "aria-label": t("moveDown"), disabled: index === draft.members.length - 1, onClick: () => {
            move(index, 1);
          }, children: "\u2193" })
        ] })
      ] }, index)),
      editing !== null && draft.members[editing] && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: Studio_default.memberEditor, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        EmployeeEditor,
        {
          variant: "member",
          employee: asEmployee(draft.members[editing], editing),
          catalog: view.catalog,
          busy: false,
          isNew: false,
          error: "",
          t,
          save: (employee) => {
            if (!employee.name.trim() || !employee.role.trim()) return Promise.resolve(false);
            update({ members: draft.members.map((value, position) => position === editing ? toMember(employee) : value) });
            return Promise.resolve(true);
          },
          remove: () => {
            update({ members: draft.members.filter((_, position) => position !== editing) });
            setEditing(null);
            return Promise.resolve(true);
          }
        },
        `${draft.id}-${editing}-${draft.members.length}`
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("button", { type: "button", className: Studio_default.ghost, onClick: () => {
        update({ members: [...draft.members, blank()] });
        setEditing(draft.members.length);
      }, children: [
        "+ ",
        t("addMember")
      ] })
    ] }),
    plan && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("section", { className: Studio_default.applyPlan, "aria-label": t("applyTitle"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("h3", { children: [
        t("applyTitle"),
        " \xB7 ",
        template.name
      ] }),
      !plan.add.length && !plan.remove.length && !plan.disable.length ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: Studio_default.muted, children: t("applyNoChange") }) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("dl", { className: Studio_default.facts, children: [
        ["applyKeep", plan.keep.map((value) => value.name)],
        ["applyAdd", plan.add.map((value) => value.name)],
        ["applyRemove", plan.remove.map((value) => value.name)],
        ["applyDisable", plan.disable.map((value) => value.name)]
      ].filter(([, names]) => names.length).map(([key, names]) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: Studio_default.planRow, "data-kind": key, children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("dt", { children: [
          t(key),
          " \xB7 ",
          names.length
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("dd", { children: names.join("\u3001") })
      ] }, key)) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: Studio_default.actions, children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("button", { className: plan.remove.length ? Studio_default.dangerSolid : Studio_default.primary, disabled: view.busy, onClick: () => {
          void run("apply", () => command("applyTemplate", { id: template.id })).then((ok) => {
            if (ok) onApplied();
            else setOutcome("failed");
          });
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Busy, { on: pending === "apply" }),
          t("confirmApply")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("button", { className: Studio_default.ghost, onClick: () => {
          setApplying(false);
        }, children: t("cancelAction") })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("footer", { className: Studio_default.formFooter, children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: Studio_default.actions, children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("button", { className: Studio_default.primary, disabled: view.busy || !dirty || !valid, onClick: () => {
          void run("save", () => command("saveTemplate", draft)).then((ok) => {
            setOutcome(ok ? "saved" : "failed");
            if (ok) onSaved();
          });
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Busy, { on: pending === "save" }),
          t("saveTemplate")
        ] }),
        !isNew && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("button", { disabled: view.busy || dirty, title: dirty ? t("saveBeforeApply") : void 0, onClick: () => {
          setApplying(true);
        }, children: t("applyTemplate") }),
        isNew ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("button", { className: Studio_default.ghost, onClick: onDiscard, children: t("cancelAction") }) : confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_jsx_runtime10.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("button", { className: Studio_default.dangerSolid, disabled: view.busy, onClick: () => {
            void run("delete", () => command("deleteTemplate", { id: template.id })).then((ok) => {
              if (ok) onDiscard();
              else setOutcome("failed");
            });
          }, children: t("confirmDelete") }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("button", { className: Studio_default.ghost, onClick: () => {
            setConfirmDelete(false);
          }, children: t("cancelAction") })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("button", { className: Studio_default.ghostDanger, disabled: view.busy, onClick: () => {
          setConfirmDelete(true);
        }, children: t("deleteTemplate") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: Studio_default.formStatus, role: "status", "data-state": outcome === "failed" ? "error" : outcome === "saved" && !dirty ? "ok" : "idle", children: outcome === "failed" ? view.error || t("failure") : outcome === "saved" && !dirty ? t("templateSaved") : !valid ? t("templateIncomplete") : dirty && !isNew ? t("unsaved") : "" })
    ] })
  ] });
}

// src/client/TeamView.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
function TeamView({ state, view, t, command, checkHealth }) {
  const [mode, setMode] = (0, import_react11.useState)("roster");
  const [selected, setSelected] = (0, import_react11.useState)(null);
  const [draft, setDraft] = (0, import_react11.useState)(null);
  const [query, setQuery] = (0, import_react11.useState)("");
  const [checking, setChecking] = (0, import_react11.useState)(false);
  const [bulk, setBulk] = (0, import_react11.useState)(false);
  const [picked, setPicked] = (0, import_react11.useState)([]);
  const [confirmBulk, setConfirmBulk] = (0, import_react11.useState)(false);
  const [bulkFailed, setBulkFailed] = (0, import_react11.useState)(false);
  const { pending, run } = usePending();
  if (mode === "templates") return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(TemplatesView, { state, view, t, command, onDone: () => {
    setMode("roster");
  } });
  const employee = draft ?? state.employees.find((value) => value.id === selected) ?? state.employees[0];
  const needle = query.trim().toLowerCase();
  const shown = needle ? state.employees.filter((value) => `${value.name} ${value.role} ${value.model} ${t(value.engine)}`.toLowerCase().includes(needle)) : state.employees;
  const enabled = state.employees.filter((value) => value.enabled).length;
  const redundant = redundantEmployees(state);
  const chosen = picked.filter((id2) => state.employees.some((value) => value.id === id2));
  const addEmployee = () => {
    const id2 = randomUUID();
    setDraft({
      id: id2,
      name: t("newEmployee"),
      role: "",
      responsibilities: "",
      engine: "codex",
      model: "",
      effort: "",
      permission: "workspace-write",
      cwd: "",
      enabled: true,
      baseURL: "",
      apiKeyEnv: "",
      thinkingFormat: "none",
      contextWindow: 262144,
      maxTokens: 32768
    });
    setSelected(id2);
  };
  const exitBulk = () => {
    setBulk(false);
    setPicked([]);
    setConfirmBulk(false);
    setBulkFailed(false);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: Studio_default.workArea, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("section", { className: Studio_default.listPane, "aria-label": t("employees"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: Studio_default.paneHead, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h2", { children: t("employees") }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: Studio_default.muted, children: t("rosterSummary", { total: state.employees.length, enabled }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { className: Studio_default.primary, onClick: addEmployee, disabled: !!draft || bulk, children: t("addEmployee") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: Studio_default.toolRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("input", { type: "search", "aria-label": t("searchEmployees"), placeholder: t("searchEmployees"), value: query, onChange: (event) => {
          setQuery(event.target.value);
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { onClick: () => {
          exitBulk();
          setDraft(null);
          setMode("templates");
        }, children: t("templates") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: Studio_default.healthRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("button", { className: Studio_default.ghost, disabled: checking, onClick: () => {
          setChecking(true);
          void checkHealth().finally(() => {
            setChecking(false);
          });
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Busy, { on: checking }),
          t("health")
        ] }),
        !bulk && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("button", { className: Studio_default.ghost, disabled: !!draft || !state.employees.length, onClick: () => {
          setBulk(true);
        }, children: [
          t("bulkManage"),
          !!redundant.length && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: Studio_default.count, children: redundant.length })
        ] }),
        view.health && ["codex", "claude", "harness"].map((engine2) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { className: Studio_default.healthChip, title: view.health?.[engine2].version, "data-available": view.health?.[engine2].available, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("i", { "aria-hidden": "true" }),
          t(engine2),
          " \xB7 ",
          t(view.health?.[engine2].available ? "available" : "unavailable")
        ] }, engine2))
      ] }),
      bulk && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: Studio_default.bulkBar, role: "region", "aria-label": t("bulkManage"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { children: t("bulkHelp") }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: Studio_default.actions, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { className: Studio_default.ghost, disabled: !redundant.length, title: t("redundantHelp"), onClick: () => {
            setPicked(redundant.map((value) => value.id));
            setConfirmBulk(false);
          }, children: t("selectRedundant", { count: redundant.length }) }),
          confirmBulk ? /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("button", { className: Studio_default.dangerSolid, disabled: view.busy, onClick: () => {
            void run("bulk", () => command("deleteEmployees", { ids: chosen })).then((ok) => {
              setBulkFailed(!ok);
              if (ok) {
                exitBulk();
                setSelected(null);
              }
            });
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Busy, { on: pending === "bulk" }),
            t("confirmBulkDelete", { count: chosen.length })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { className: Studio_default.ghostDanger, disabled: !chosen.length, onClick: () => {
            setConfirmBulk(true);
          }, children: t("deleteSelected", { count: chosen.length }) }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { className: Studio_default.ghost, onClick: exitBulk, children: t("exitBulk") })
        ] }),
        bulkFailed && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: Studio_default.inlineError, role: "alert", children: view.error || t("failure") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("ul", { className: Studio_default.roster, children: [
        draft && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("button", { className: Studio_default.rosterItem, "aria-current": "true", onClick: () => {
          setSelected(draft.id);
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Avatar, { id: draft.id, name: draft.name }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { className: Studio_default.rosterText, children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("strong", { children: draft.name }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("small", { children: t("unsavedEmployee") })
          ] })
        ] }) }),
        shown.map((value) => {
          const locked = bulk && hasHistory(state, value.id);
          const body = /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_jsx_runtime11.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Avatar, { id: value.id, name: value.name }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { className: Studio_default.rosterText, children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("strong", { children: [
                value.name,
                !value.enabled && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("em", { className: Studio_default.offTag, children: t("disabled") })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("small", { children: [
                value.role || t("noRole"),
                locked && ` \xB7 ${t("historyLocked")}`
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { className: Studio_default.rosterMeta, children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(EngineTag, { engine: value.engine, t }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("small", { className: Studio_default.mono, title: value.model, children: [
                value.model || t("nativeDefault"),
                value.effort && ` \xB7 ${value.effort}`
              ] })
            ] })
          ] });
          return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: bulk ? /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("label", { className: Studio_default.rosterItem, "data-disabled": !value.enabled, "data-bulk": "true", "data-locked": locked, children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("input", { type: "checkbox", disabled: locked, checked: chosen.includes(value.id), onChange: (event) => {
              setConfirmBulk(false);
              setPicked(event.target.checked ? [...chosen, value.id] : chosen.filter((id2) => id2 !== value.id));
            } }),
            body
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "button",
            {
              className: Studio_default.rosterItem,
              "data-disabled": !value.enabled,
              "aria-current": !draft && employee?.id === value.id ? "true" : void 0,
              onClick: () => {
                setDraft(null);
                setSelected(value.id);
              },
              children: body
            }
          ) }, value.id);
        })
      ] }),
      !state.employees.length && !draft && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: Studio_default.emptyState, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("strong", { children: t("noEmployeesTitle") }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { children: t("noEmployees") }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { onClick: () => {
          setMode("templates");
        }, children: t("templates") })
      ] }),
      !!state.employees.length && !shown.length && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: Studio_default.emptyInline, children: t("noEmployeeMatch") }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: Studio_default.footnote, children: t("noReasoning") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: Studio_default.detailPane, children: employee ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      EmployeeEditor,
      {
        employee,
        isNew: draft?.id === employee.id,
        catalog: view.catalog,
        busy: view.busy,
        error: view.error,
        t,
        save: async (value) => {
          const ok = await command("saveEmployee", value);
          if (ok) {
            setDraft(null);
            setSelected(value.id);
          }
          return ok;
        },
        remove: async (id2) => {
          if (draft?.id === id2) {
            setDraft(null);
            setSelected(null);
            return true;
          }
          const ok = await command("deleteEmployee", { id: id2 });
          if (ok) setSelected(null);
          return ok;
        }
      },
      employee.id
    ) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: Studio_default.emptyState, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { children: t("selectEmployee") }) }) })
  ] });
}

// src/client/StudioPanel.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
function StudioPanel({ useStudio, command, refresh, checkHealth, pickDirectory, t }) {
  const view = useStudio((snapshot) => snapshot);
  const state = view.state;
  const [chosenTab, setTab] = (0, import_react12.useState)(null);
  const [projectId, setProjectId] = (0, import_react12.useState)(null);
  const [taskId, setTaskId] = (0, import_react12.useState)(null);
  const [workspaceForm, setWorkspaceForm] = (0, import_react12.useState)(false);
  const [projectForm, setProjectForm] = (0, import_react12.useState)(false);
  const workspace = state?.workspaces.find((value) => value.id === state.activeWorkspaceId);
  const projects = state?.projects.filter((value) => value.workspaceId === workspace?.id) ?? [];
  const project = projects.find((value) => value.id === projectId) ?? projects.at(-1);
  const tab = chosenTab ?? (projects.length ? "tasks" : "employees");
  const projectTasks = state && project ? state.tasks.filter((task) => task.projectId === project.id) : [];
  const stats = projectStats(projectTasks);
  const handoffCount = state && project ? state.messages.filter((value) => value.projectId === project.id).length : 0;
  const openMeetings = state?.meetings.filter((value) => value.workspaceId === workspace?.id && value.status !== "closed").length ?? 0;
  const counts = { employees: String(state?.employees.length ?? 0), tasks: projectTasks.length ? `${stats.completed}/${stats.active}` : "0", meetings: String(openMeetings), messages: String(handoffCount) };
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("main", { className: Studio_default.studio, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("header", { className: Studio_default.topbar, children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: Studio_default.brand, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h1", { children: t("title") }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { children: t("subtitle") })
      ] }),
      state && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        WorkspaceSwitcher,
        {
          state,
          workspace,
          busy: view.busy,
          t,
          command,
          formOpen: workspaceForm || !workspace,
          onToggleForm: () => {
            setWorkspaceForm((value) => !value);
          },
          onChanged: () => {
            setProjectId(null);
            setTaskId(null);
          }
        }
      )
    ] }),
    state && (workspaceForm || !workspace) && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      WorkspaceForm,
      {
        t,
        busy: view.busy,
        error: view.error,
        command,
        pickDirectory,
        first: !state.workspaces.length,
        onDone: () => {
          setWorkspaceForm(false);
          setProjectId(null);
          setTaskId(null);
        },
        onCancel: workspace ? () => {
          setWorkspaceForm(false);
        } : void 0
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("nav", { className: Studio_default.tabs, "aria-label": t("title"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: Studio_default.tabList, children: ["tasks", "meetings", "employees", "messages"].map((name) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("button", { className: Studio_default.tab, "aria-current": tab === name ? "page" : void 0, onClick: () => {
        setTab(name);
      }, children: [
        t(name === "tasks" ? "projectsTab" : name === "meetings" ? "meetingsTab" : name),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: Studio_default.count, children: counts[name] })
      ] }, name)) }),
      workspace && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("button", { className: Studio_default.primary, "aria-label": t("newProject"), onClick: () => {
        setProjectForm(true);
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { "aria-hidden": "true", children: "+" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: Studio_default.wideLabel, children: t("newProject") })
      ] })
    ] }),
    view.error && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: Studio_default.banner, role: "alert", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: view.error }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { className: Studio_default.ghost, onClick: () => {
        void refresh();
      }, children: t("refresh") })
    ] }),
    !state ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: Studio_default.emptyState, children: view.error ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { children: t("connectionError") }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("p", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: Studio_default.spinner, "aria-hidden": "true" }),
      " ",
      t("checking")
    ] }) }) : tab === "employees" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(TeamView, { state, view, t, command, checkHealth }) : !workspace ? /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: Studio_default.emptyState, children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("strong", { children: t("workspaceFirst") }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { children: t("workspaceHelp") })
    ] }) : tab === "meetings" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      MeetingRoom,
      {
        state,
        workspace,
        busy: view.busy,
        error: view.error,
        t,
        command,
        onOpenProject: (id2) => {
          setProjectId(id2);
          setTaskId(null);
          setTab("tasks");
        }
      },
      `meetings-${workspace.id}`
    ) : !project ? /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: Studio_default.emptyState, children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("strong", { children: t("noProjectsTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { children: t("noProjects") }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { className: Studio_default.primary, onClick: () => {
        setProjectForm(true);
      }, children: t("newProject") })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ProjectBar, { state, projects, project, busy: view.busy, t, command, onSelect: (id2) => {
        setProjectId(id2);
        setTaskId(null);
      } }, `bar-${project.id}`),
      tab === "tasks" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(TaskBoard, { state, progress: view.progress, project, busy: view.busy, error: view.error, t, command, selected: taskId, onSelect: setTaskId }, `tasks-${project.id}`) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(HandoffTimeline, { state, project, busy: view.busy, error: view.error, t, command, onOpenTask: (id2) => {
        setTaskId(id2);
        setTab("tasks");
      } }, `handoffs-${project.id}`)
    ] }),
    state && workspace && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      ProjectDialog,
      {
        open: projectForm,
        state,
        workspace,
        busy: view.busy,
        error: view.error,
        t,
        command,
        onClose: () => {
          setProjectForm(false);
        },
        onCreated: () => {
          setProjectForm(false);
          setProjectId(null);
          setTaskId(null);
          setTab("tasks");
        }
      }
    )
  ] });
}
function WorkspaceSwitcher({ state, workspace, busy, t, command, formOpen, onToggleForm, onChanged }) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: Studio_default.workspace, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("label", { className: Studio_default.workspacePicker, children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: t("companyWorkspace") }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("select", { "aria-label": t("companyWorkspace"), value: workspace?.id ?? "", disabled: busy || !state.workspaces.length, onChange: (event) => {
        void command("selectWorkspace", { id: event.target.value });
        onChanged();
      }, children: [
        !workspace && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("option", { value: "", children: t("workspaceFirst") }),
        state.workspaces.map((value) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("option", { value: value.id, children: value.name }, value.id))
      ] }),
      workspace && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("small", { className: Studio_default.mono, title: workspace.path, children: workspace.path })
    ] }),
    !!state.workspaces.length && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { className: Studio_default.ghost, "aria-expanded": formOpen, onClick: onToggleForm, children: t("addWorkspace") })
  ] });
}
function WorkspaceForm({ t, busy, error, first, command, pickDirectory, onDone, onCancel }) {
  const [draft, setDraft] = (0, import_react12.useState)({ name: "", path: "" });
  const [pickError, setPickError] = (0, import_react12.useState)("");
  const [failed, setFailed] = (0, import_react12.useState)(false);
  const { pending, run } = usePending();
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("section", { className: Studio_default.workspaceForm, "aria-label": t("addWorkspace"), children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h2", { children: t(first ? "welcomeTitle" : "addWorkspace") }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: Studio_default.muted, children: t("workspaceHelp") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("form", { onSubmit: (event) => {
      event.preventDefault();
      void run("create", () => command("createWorkspace", draft)).then((ok) => {
        setFailed(!ok);
        if (ok) {
          setDraft({ name: "", path: "" });
          onDone();
        }
      });
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: Studio_default.fieldPair, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("label", { className: Studio_default.field, children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: t("companyName") }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("input", { required: true, value: draft.name, onChange: (event) => {
            setDraft({ ...draft, name: event.target.value });
          } })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("label", { className: Studio_default.field, children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: t("companyDirectory") }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { className: Studio_default.inputWithButton, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("input", { required: true, className: Studio_default.mono, value: draft.path, onChange: (event) => {
              setDraft({ ...draft, path: event.target.value });
            } }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { type: "button", onClick: () => {
              setPickError("");
              void pickDirectory().then((path) => {
                if (path) setDraft((value) => ({ ...value, path }));
              }).catch((caught) => {
                setPickError(caught instanceof Error ? caught.message : t("failure"));
              });
            }, children: t("browseDirectory") })
          ] })
        ] })
      ] }),
      (pickError || failed) && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: Studio_default.formStatus, "data-state": "error", role: "alert", children: pickError || error || t("failure") }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: Studio_default.actions, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("button", { className: Studio_default.primary, disabled: busy, children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Busy, { on: pending === "create" }),
          t("useWorkspace")
        ] }),
        onCancel && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { type: "button", className: Studio_default.ghost, onClick: onCancel, children: t("cancelAction") })
      ] })
    ] })
  ] });
}

// src/client/locales.ts
var zh = {
  companyWorkspace: "\u516C\u53F8\u5DE5\u4F5C\u533A",
  workspaceFirst: "\u5148\u9009\u62E9\u5171\u4EAB\u5DE5\u4F5C\u76EE\u5F55",
  addWorkspace: "\u6DFB\u52A0\u5DE5\u4F5C\u533A",
  companyName: "\u516C\u53F8 / \u5DE5\u4F5C\u533A\u540D\u79F0",
  companyDirectory: "\u5171\u4EAB\u76EE\u5F55\uFF08Git \u4ED3\u5E93\u6216\u73B0\u6709\u6587\u4EF6\u5939\uFF09",
  browseDirectory: "\u6D4F\u89C8\u6587\u4EF6\u5939",
  useWorkspace: "\u4F7F\u7528\u8FD9\u4E2A\u5DE5\u4F5C\u533A",
  workspaceHelp: "\u5458\u5DE5\u5728\u8FD9\u4E2A\u76EE\u5F55\u534F\u4F5C\uFF0C\u9879\u76EE\u76EE\u5F55\u987B\u4F4D\u4E8E\u5176\u4E2D\u3002\u5DF2\u6709 Git \u4ED3\u5E93\u53EF\u76F4\u63A5\u4F7F\u7528\uFF1B\u539F\u751F\u4F1A\u8BDD\u7531\u6BCF\u540D\u5458\u5DE5\u72EC\u7ACB\u4FDD\u5B58\u3002",
  acceptanceCriteria: "\u9A8C\u6536\u6807\u51C6",
  sessionMode: "\u5458\u5DE5\u4F1A\u8BDD",
  employeeSession: "\u540C\u4E00\u5458\u5DE5\u5728\u9879\u76EE\u4E2D\u5EF6\u7EED\u4F1A\u8BDD",
  freshSession: "\u6BCF\u6B21\u4EFB\u52A1\u65B0\u5EFA\u72EC\u7ACB\u4F1A\u8BDD",
  nativeSessionHelp: "\u8C03\u7528\u539F\u751F\u5DE5\u5177\u4F1A\u4FDD\u5B58\u72EC\u7ACB\u4F1A\u8BDD\uFF0C\u4E0D\u4F1A\u65B0\u5EFA\u684C\u9762\u9879\u76EE\uFF0C\u4E5F\u4E0D\u4FDD\u8BC1\u81EA\u52A8\u663E\u793A\u5728\u684C\u9762\u804A\u5929\u5217\u8868\u3002\u53EF\u4F7F\u7528\u4F1A\u8BDD\u6062\u590D\u547D\u4EE4\u7EE7\u7EED\uFF1B\u53EA\u6709\u6700\u7EC8\u5BF9\u8BDD\u548C\u6210\u679C\u8FDB\u5165\u56E2\u961F\u4EA4\u63A5\u3002",
  review: "\u5F85\u9A8C\u6536",
  acceptProject: "\u901A\u8FC7\u9879\u76EE\u9A8C\u6536",
  exportProject: "\u5BFC\u51FA\u534F\u4F5C\u6587\u6863\u5230\u4ED3\u5E93",
  changeInstruction: "\u8FD4\u5DE5\u8981\u6C42",
  requestChanges: "\u521B\u5EFA\u8FD4\u5DE5\u4EFB\u52A1",
  exportLocation: "\u5BFC\u51FA\u7684\u4EFB\u52A1\u6587\u6863\u3001\u4EA4\u63A5\u8BB0\u5F55\u548C\u6210\u679C\u526F\u672C\u4F4D\u4E8E\u516C\u53F8\u76EE\u5F55\u7684 {path}\u3002",
  accepted: "\u5DF2\u9A8C\u6536",
  awaitingReview: "\u5F85\u9A8C\u6536",
  superseded: "\u5DF2\u5EFA\u7ACB\u8FD4\u5DE5\u4EFB\u52A1",
  nativeSessions: "\u539F\u751F\u4F1A\u8BDD\u8BB0\u5F55",
  continuedSession: "\u5EF6\u7EED\u4F1A\u8BDD",
  newSession: "\u65B0\u4F1A\u8BDD",
  title: "\u5DE5\u4F5C\u5BA4",
  subtitle: "\u914D\u7F6E\u56E2\u961F\uFF0C\u5206\u914D\u4EFB\u52A1\uFF0C\u7528\u7ED3\u679C\u534F\u4F5C\u3002",
  employees: "\u5458\u5DE5",
  tasks: "\u4EFB\u52A1",
  messages: "\u4EA4\u63A5\u8BB0\u5F55",
  addEmployee: "\u6DFB\u52A0\u5458\u5DE5",
  name: "\u59D3\u540D",
  role: "\u5C97\u4F4D",
  engine: "\u6267\u884C\u5DE5\u5177",
  model: "\u6A21\u578B",
  effort: "\u601D\u8003\u7B49\u7EA7",
  responsibilities: "\u804C\u8D23",
  cwd: "\u5DE5\u4F5C\u76EE\u5F55",
  customModel: "\u81EA\u5B9A\u4E49\u6A21\u578B ID",
  modelId: "\u6A21\u578B ID",
  modelIdPlaceholder: "\u586B\u5199\u539F\u751F\u5DE5\u5177\u652F\u6301\u7684\u5B8C\u6574\u6A21\u578B ID",
  imageInput: "\u652F\u6301\u56FE\u7247",
  permission: "\u6743\u9650",
  save: "\u4FDD\u5B58",
  edit: "\u7F16\u8F91",
  delete: "\u5220\u9664",
  enabled: "\u542F\u7528\u5458\u5DE5",
  employeeSettings: "\u5458\u5DE5\u8BBE\u7F6E",
  nativeDefault: "\u7EE7\u627F\u539F\u751F\u8BBE\u7F6E",
  projectDirectory: "\u9879\u76EE\u5DE5\u4F5C\u76EE\u5F55",
  objective: "\u76EE\u6807\u63CF\u8FF0",
  projectName: "\u9879\u76EE\u540D\u79F0",
  objectivePlaceholder: "\u63CF\u8FF0\u4F60\u5E0C\u671B\u56E2\u961F\u5B8C\u6210\u7684\u4EFB\u52A1",
  createProject: "\u521B\u5EFA\u9879\u76EE",
  team: "\u56E2\u961F",
  selectTeam: "\u53C2\u4E0E\u5458\u5DE5\uFF08\u6309\u4EA4\u4ED8\u987A\u5E8F\uFF09",
  noEmployees: "\u6DFB\u52A0\u5458\u5DE5\u6216\u9009\u62E9\u4E00\u5957\u56E2\u961F\u6A21\u677F\u5F00\u59CB\u3002",
  noProjects: "\u521B\u5EFA\u9879\u76EE\u540E\uFF0C\u5373\u53EF\u5206\u914D\u548C\u63A8\u8FDB\u4EFB\u52A1\u3002",
  noTasks: "\u9879\u76EE\u8FD8\u6CA1\u6709\u4EFB\u52A1\u3002",
  noMessages: "\u6700\u7EC8\u5DE5\u4F5C\u6C47\u62A5\u3001\u540C\u4E8B\u4EA4\u63A5\u548C\u4F60\u7684\u6307\u4EE4\u4F1A\u663E\u793A\u5728\u8FD9\u91CC\u3002",
  project: "\u9879\u76EE",
  start: "\u5F00\u59CB\u5DE5\u4F5C",
  pause: "\u6682\u505C\u5206\u914D",
  stop: "\u505C\u6B62\u6267\u884C",
  retry: "\u91CD\u8BD5",
  cancel: "\u505C\u6B62\u4EFB\u52A1",
  addTask: "\u6DFB\u52A0\u4EFB\u52A1",
  taskTitle: "\u4EFB\u52A1\u6807\u9898",
  instruction: "\u4EFB\u52A1\u5B89\u6392",
  dependencies: "\u524D\u7F6E\u4EFB\u52A1",
  files: "\u4EA4\u4ED8\u6587\u4EF6\uFF08\u6BCF\u884C\u4E00\u4E2A\u76F8\u5BF9\u8DEF\u5F84\uFF09",
  result: "\u5DE5\u4F5C\u6C47\u62A5",
  artifacts: "\u7ED3\u679C\u6587\u4EF6",
  assignment: "\u5B9E\u9645\u4EFB\u52A1\u6307\u4EE4",
  noReasoning: "\u53EA\u5171\u4EAB\u5BF9\u8BDD\u548C\u7ED3\u679C\u6587\u4EF6\u3002\u539F\u751F\u4F1A\u8BDD\u4E0E\u601D\u8003\u8FC7\u7A0B\u7531\u5404\u6267\u884C\u5DE5\u5177\u72EC\u7ACB\u4FDD\u5B58\u3002",
  to: "\u63A5\u6536\u8005",
  send: "\u53D1\u9001\u6307\u4EE4",
  message: "\u7ED9\u56E2\u961F\u6216\u5458\u5DE5\u53D1\u5E03\u4EFB\u52A1\u3001\u8865\u5145\u8981\u6C42",
  everyone: "\u5168\u4F53\u5458\u5DE5",
  health: "\u8FDE\u63A5\u68C0\u67E5",
  checking: "\u68C0\u67E5\u4E2D\u2026",
  available: "\u53EF\u7528",
  unavailable: "\u4E0D\u53EF\u7528",
  refresh: "\u5237\u65B0",
  baseURL: "API \u5730\u5740",
  apiKeyEnv: "\u5BC6\u94A5\u5F15\u7528\uFF08\u73AF\u5883\u53D8\u91CF\u540D\uFF09",
  thinkingFormat: "\u601D\u8003\u534F\u8BAE",
  contextWindow: "\u4E0A\u4E0B\u6587\u7A97\u53E3",
  maxTokens: "\u6700\u5927\u8F93\u51FA Token",
  providerHelp: "GLM \u7B49\u517C\u5BB9\u670D\u52A1\u7531\u72EC\u7ACB Harness \u4F1A\u8BDD\u6267\u884C\u3002\u5BC6\u94A5\u5728\u539F\u6709\u51ED\u636E\u8BBE\u7F6E\u6216\u73AF\u5883\u53D8\u91CF\u4E2D\u914D\u7F6E\u3002",
  nativeHelp: "\u6A21\u578B\u7559\u7A7A\u65F6\u7EE7\u627F\u672C\u673A\u8BBE\u7F6E\u3002\u6A21\u578B\u548C\u601D\u8003\u7B49\u7EA7\u76F4\u63A5\u4F20\u7ED9\u539F\u751F\u5DE5\u5177\uFF1B\u4E0D\u652F\u6301\u7684\u7EC4\u5408\u4F1A\u660E\u786E\u5931\u8D25\u3002",
  readOnly: "\u53EA\u8BFB / \u89C4\u5212",
  workspaceWrite: "\u5DE5\u4F5C\u533A\u5199\u5165 / \u6279\u51C6\u7F16\u8F91",
  fullAccess: "\u5B8C\u5168\u8BBF\u95EE",
  pending: "\u5F85\u5904\u7406",
  running: "\u8FD0\u884C\u4E2D",
  waiting: "\u7B49\u4F60\u5904\u7406",
  completed: "\u5DF2\u5B8C\u6210",
  failed: "\u5931\u8D25",
  cancelled: "\u5DF2\u505C\u6B62",
  interrupted: "\u6267\u884C\u4E2D\u65AD",
  paused: "\u5DF2\u6682\u505C",
  blocked: "\u7B49\u5F85\u524D\u7F6E\u4EFB\u52A1",
  attempt: "\u6267\u884C\u6B21\u6570",
  created: "\u521B\u5EFA\u65F6\u95F4",
  source: "\u53D1\u9001\u8005",
  user: "\u4F60",
  saving: "\u4FDD\u5B58\u4E2D\u2026",
  close: "\u5173\u95ED",
  download: "\u4E0B\u8F7D",
  selectProject: "\u9009\u62E9\u9879\u76EE",
  roleTask: "\u6309\u5F53\u524D\u56E2\u961F\u751F\u6210\u5C97\u4F4D\u4EFB\u52A1\uFF0C\u521B\u5EFA\u540E\u70B9\u51FB\u5F00\u59CB\u5DE5\u4F5C\u3002",
  failure: "\u64CD\u4F5C\u5931\u8D25",
  connectionError: "\u65E0\u6CD5\u8FDE\u63A5\u5DE5\u4F5C\u5BA4\uFF0C\u8BF7\u68C0\u67E5\u670D\u52A1\u5E76\u5237\u65B0\u3002",
  newEmployee: "\u65B0\u5458\u5DE5",
  selected: "\u53C2\u4E0E",
  projectSettings: "\u65B0\u5EFA\u9879\u76EE",
  lastResult: "\u4EFB\u52A1\u8BE6\u60C5",
  unassignedCwd: "\u7EE7\u627F\u9879\u76EE\u76EE\u5F55",
  noResult: "\u4EFB\u52A1\u5B8C\u6210\u540E\u663E\u793A\u6700\u7EC8\u6C47\u62A5\u3002",
  handoffTo: "\u4EA4\u63A5\u7ED9",
  protocolNone: "\u6807\u51C6\u517C\u5BB9\u534F\u8BAE",
  codex: "Codex",
  claude: "Claude Code",
  harness: "DeepSeek Harness",
  compatible: "GLM / \u517C\u5BB9 API",
  downloadAll: "\u7ED3\u679C\u6587\u4EF6",
  settingsSaved: "\u5DF2\u4FDD\u5B58",
  zai: "Z.ai",
  deepseekProtocol: "DeepSeek",
  fileMetadata: "{size} KB \xB7 SHA256 {hash}",
  projectsTab: "\u9879\u76EE",
  newProject: "\u65B0\u5EFA\u9879\u76EE",
  noProjectsTitle: "\u8FD8\u6CA1\u6709\u9879\u76EE",
  welcomeTitle: "\u5148\u5EFA\u7ACB\u516C\u53F8\u5DE5\u4F5C\u533A",
  noRole: "\u672A\u8BBE\u7F6E\u5C97\u4F4D",
  disabled: "\u5DF2\u505C\u7528",
  profile: "\u57FA\u672C\u4FE1\u606F",
  execution: "\u6267\u884C\u4E0E\u6A21\u578B",
  workplace: "\u5DE5\u4F5C\u4F4D\u7F6E\u4E0E\u6743\u9650",
  confirmDelete: "\u786E\u8BA4\u5220\u9664",
  cancelAction: "\u53D6\u6D88",
  discard: "\u653E\u5F03\u65B0\u5458\u5DE5",
  unsaved: "\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539",
  modelCount: "{count} \u4E2A\u6A21\u578B",
  searchModels: "\u641C\u7D22\u6A21\u578B\u540D\u79F0\u6216 ID",
  nativeDefaultHelp: "\u4F7F\u7528\u672C\u673A\u5DE5\u5177\u5F53\u524D\u7684\u9ED8\u8BA4\u6A21\u578B",
  loadingModels: "\u6B63\u5728\u8BFB\u53D6\u672C\u673A\u6A21\u578B\u76EE\u5F55\u2026",
  effortCount: "{count} \u6863\u601D\u8003\u7B49\u7EA7",
  noModelMatch: "\u6CA1\u6709\u5339\u914D\u7684\u6A21\u578B\uFF0C\u53EF\u4F7F\u7528\u81EA\u5B9A\u4E49\u6A21\u578B ID\u3002",
  customModelHelp: "\u586B\u5199\u76EE\u5F55\u4E2D\u6CA1\u6709\u7684\u5B8C\u6574\u6A21\u578B ID",
  rosterSummary: "\u5171 {total} \u4EBA\uFF0C{enabled} \u4EBA\u542F\u7528",
  searchEmployees: "\u641C\u7D22\u59D3\u540D\u3001\u5C97\u4F4D\u6216\u6A21\u578B",
  templates: "\u56E2\u961F\u6A21\u677F",
  unsavedEmployee: "\u5C1A\u672A\u4FDD\u5B58",
  noEmployeesTitle: "\u56E2\u961F\u8FD8\u662F\u7A7A\u7684",
  noEmployeeMatch: "\u6CA1\u6709\u5339\u914D\u7684\u5458\u5DE5\u3002",
  selectEmployee: "\u9009\u62E9\u4E00\u540D\u5458\u5DE5\u67E5\u770B\u8BBE\u7F6E\u3002",
  kind_image: "\u56FE\u7247",
  kind_document: "\u6587\u6863",
  kind_web: "\u7F51\u9875",
  kind_code: "\u4EE3\u7801",
  kind_data: "\u6570\u636E",
  kind_other: "\u6587\u4EF6",
  preview: "\u9884\u89C8",
  hidePreview: "\u6536\u8D77",
  previewFailed: "\u65E0\u6CD5\u8BFB\u53D6\u6587\u4EF6\u5185\u5BB9\uFF0C\u53EF\u76F4\u63A5\u4E0B\u8F7D\u3002",
  loading: "\u8BFB\u53D6\u4E2D\u2026",
  noArtifacts: "\u6CA1\u6709\u8BB0\u5F55\u7ED3\u679C\u6587\u4EF6\u3002",
  taskSummary: "{done} / {total} \u5DF2\u5B8C\u6210",
  filterTasks: "\u6309\u72B6\u6001\u7B5B\u9009\u4EFB\u52A1",
  filter_all: "\u5168\u90E8",
  filter_needsYou: "\u7B49\u4F60\u5904\u7406",
  filter_active: "\u8FDB\u884C\u4E2D",
  filter_waiting: "\u7B49\u5F85\u4E2D",
  filter_done: "\u5DF2\u5B8C\u6210",
  filter_attention: "\u9700\u5904\u7406",
  unknownEmployee: "\u672A\u77E5\u5458\u5DE5",
  waitingFor: "\u7B49\u5F85 {names} \u5B8C\u6210",
  revisionOfShort: "\u8FD4\u5DE5\u81EA #{step}",
  noTasksHelp: "\u6DFB\u52A0\u4EFB\u52A1\u5E76\u6307\u5B9A\u8D1F\u8D23\u4EBA\u540E\uFF0C\u5373\u53EF\u5F00\u59CB\u5DE5\u4F5C\u3002",
  noFilteredTasks: "\u5F53\u524D\u7B5B\u9009\u4E0B\u6CA1\u6709\u4EFB\u52A1\u3002",
  selectTask: "\u9009\u62E9\u4E00\u9879\u4EFB\u52A1\u67E5\u770B\u8BE6\u60C5\u3002",
  editTask: "\u7F16\u8F91\u4EFB\u52A1",
  assignee: "\u8D1F\u8D23\u4EBA",
  projectNeedsYou: "\u6709 {count} \u4E2A\u4EFB\u52A1\u5728\u7B49\u4F60\u5904\u7406",
  projectNeedsYouHelp: "\u5458\u5DE5\u9047\u5230\u53EA\u6709\u4F60\u80FD\u505A\u7684\u4E8B\uFF0C\u5DF2\u6682\u505C\u7B49\u5F85\u3002\u6253\u5F00\u6807\u8BB0\u4E3A\u201C\u7B49\u4F60\u5904\u7406\u201D\u7684\u4EFB\u52A1\uFF0C\u6309\u8BF4\u660E\u64CD\u4F5C\u540E\u56DE\u590D\u5373\u53EF\u7EE7\u7EED\u3002",
  latestProgress: "\u6700\u65B0\u8FDB\u5C55 \xB7 {time}",
  noProgressYet: "\u5458\u5DE5\u8FD8\u6CA1\u6709\u6C47\u62A5\u8FDB\u5C55\u3002",
  needsYouTitle: "{name} \u9700\u8981\u4F60\u5904\u7406",
  yourReply: "\u4F60\u7684\u56DE\u590D",
  replyPlaceholder: "\u505A\u5B8C\u540E\u5728\u8FD9\u91CC\u544A\u8BC9\u5458\u5DE5\u7ED3\u679C\uFF0C\u4F8B\u5982\u201C\u5DF2\u5728\u624B\u673A\u4E0A\u5141\u8BB8\u9EA6\u514B\u98CE\u6743\u9650\u201D",
  replyContinue: "\u56DE\u590D\u5E76\u7EE7\u7EED",
  replyHelp: "\u5458\u5DE5\u4F1A\u5728\u539F\u4F1A\u8BDD\u4E2D\u7EE7\u7EED\u8FD9\u9879\u4EFB\u52A1\uFF0C\u6267\u884C\u65F6\u95F4\u91CD\u65B0\u8BA1\u65F6\u3002",
  replyPausedHelp: "\u9879\u76EE\u5DF2\u6682\u505C\uFF1A\u56DE\u590D\u540E\u70B9\u51FB\u201C\u5F00\u59CB\u5DE5\u4F5C\u201D\uFF0C\u5458\u5DE5\u624D\u4F1A\u7EE7\u7EED\u3002",
  noDependencies: "\u9879\u76EE\u4E2D\u8FD8\u6CA1\u6709\u5176\u4ED6\u4EFB\u52A1\u3002",
  failureReason: "\u5931\u8D25\u539F\u56E0",
  waitingTitle: "\u7B49\u5F85\u4EE5\u4E0B\u524D\u7F6E\u4EFB\u52A1\u5B8C\u6210",
  runningNotice: "{name} \u6B63\u5728\u5904\u7406\u8FD9\u9879\u4EFB\u52A1",
  startedAt: "\u5F00\u59CB\u4E8E {time}",
  revisionOf: "\u8FD9\u662F\u9488\u5BF9\u4EE5\u4E0B\u6210\u679C\u7684\u8FD4\u5DE5",
  supersededBy: "\u5DF2\u9488\u5BF9\u6B64\u6210\u679C\u5EFA\u7ACB\u8FD4\u5DE5\u4EFB\u52A1",
  reviewResult: "\u5BA1\u9605\u6210\u679C",
  changePlaceholder: "\u8BF4\u660E\u9700\u8981\u4FEE\u6539\u7684\u5730\u65B9\uFF0C\u5458\u5DE5\u4F1A\u5728\u8FD4\u5DE5\u4EFB\u52A1\u4E2D\u5904\u7406\u3002",
  pauseBeforeChanges: "\u9879\u76EE\u8FD0\u884C\u4E2D\uFF0C\u8BF7\u5148\u6682\u505C\u6216\u505C\u6B62\u518D\u63D0\u51FA\u4FEE\u6539\u610F\u89C1\u3002",
  changesHelp: "\u539F\u6210\u679C\u4F1A\u4FDD\u7559\uFF0C\u7CFB\u7EDF\u4E3A\u540C\u4E00\u5458\u5DE5\u5EFA\u7ACB\u8FD4\u5DE5\u4EFB\u52A1\uFF0C\u672A\u6267\u884C\u7684\u4E0B\u6E38\u4EFB\u52A1\u6539\u4E3A\u7B49\u5F85\u8FD4\u5DE5\u7ED3\u679C\u3002",
  overview: "\u4EFB\u52A1\u6982\u51B5",
  declaredFiles: "\u58F0\u660E\u7684\u4EA4\u4ED8\u6587\u4EF6",
  timeline: "\u6267\u884C\u65F6\u95F4",
  relatedHandoffs: "\u76F8\u5173\u4EA4\u63A5",
  executionInfo: "\u6267\u884C\u4FE1\u606F\u4E0E\u539F\u751F\u4F1A\u8BDD",
  sessionCount: "{count} \u4E2A\u4F1A\u8BDD",
  attemptN: "\u7B2C {n} \u6B21\u6267\u884C",
  noSessions: "\u8FD8\u6CA1\u6709\u8BB0\u5F55\u539F\u751F\u4F1A\u8BDD\u3002",
  copy: "\u590D\u5236",
  copied: "\u5DF2\u590D\u5236",
  projectPaused: "\u672A\u5F00\u59CB / \u5DF2\u6682\u505C",
  projectRunning: "\u8FDB\u884C\u4E2D",
  projectCompleted: "\u5DF2\u9A8C\u6536",
  noReadyTasks: "\u6CA1\u6709\u53EF\u5F00\u59CB\u7684\u5F85\u6267\u884C\u4EFB\u52A1",
  exported: "\u5DF2\u5BFC\u51FA\u5230",
  reviewReady: "\u6240\u6709\u4EFB\u52A1\u5DF2\u5B8C\u6210\uFF0C\u7B49\u5F85\u4F60\u9A8C\u6536\u9879\u76EE",
  reviewReadyHelp: "\u67E5\u770B\u5404\u4EFB\u52A1\u6210\u679C\u3002\u9700\u8981\u4FEE\u6539\u65F6\u5728\u4EFB\u52A1\u8BE6\u60C5\u4E2D\u63D0\u51FA\u8FD4\u5DE5\uFF1B\u786E\u8BA4\u65E0\u8BEF\u540E\u70B9\u51FB\u300C\u901A\u8FC7\u9879\u76EE\u9A8C\u6536\u300D\u3002",
  progress: "\u8FDB\u5EA6",
  projectIn: "\u5F52\u5C5E\u516C\u53F8\u5DE5\u4F5C\u533A\uFF1A{name}",
  criteriaPlaceholder: "\u9010\u6761\u5199\u660E\u4EA4\u4ED8\u65F6\u9700\u8981\u6EE1\u8DB3\u7684\u6761\u4EF6",
  projectDirectoryHelp: "\u7559\u7A7A\u4F7F\u7528\u516C\u53F8\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55\uFF1B\u4E5F\u53EF\u586B\u5199\u5176\u4E2D\u7684\u5B50\u76EE\u5F55\u3002",
  employeeSessionHelp: "\u540C\u4E00\u5458\u5DE5\u7684\u540E\u7EED\u4EFB\u52A1\u7EED\u63A5\u4E4B\u524D\u7684\u4F1A\u8BDD\uFF0C\u4FDD\u7559\u5DE5\u4F5C\u8BB0\u5FC6\u3002",
  freshSessionHelp: "\u6BCF\u9879\u4EFB\u52A1\u5F00\u542F\u72EC\u7ACB\u4F1A\u8BDD\uFF0C\u4E92\u4E0D\u5F71\u54CD\u3002",
  selectedCount: "\u5DF2\u9009 {count} \u4EBA",
  noEnabledEmployees: "\u6CA1\u6709\u542F\u7528\u7684\u5458\u5DE5\uFF0C\u8BF7\u5148\u5728\u300C\u5458\u5DE5\u300D\u4E2D\u6DFB\u52A0\u6216\u542F\u7528\u3002",
  newInstruction: "\u53D1\u5E03\u5DE5\u4F5C\u8BF4\u660E",
  filterPerson: "\u67E5\u770B",
  userInitial: "\u4F60",
  meetingsTab: "\u4F1A\u8BAE\u5BA4",
  newMeeting: "\u65B0\u5EFA\u4F1A\u8BAE",
  meetingSummary: "{open} \u573A\u8FDB\u884C\u4E2D\uFF0C\u5171 {total} \u573A",
  meetingOpen: "\u8BA8\u8BBA\u4E2D",
  meetingDrafting: "\u6574\u7406\u7EAA\u8981\u4E2D",
  meetingReview: "\u5F85\u786E\u8BA4\u7EAA\u8981",
  meetingClosed: "\u5DF2\u7ED3\u675F",
  meetingNoMessages: "\u8FD8\u6CA1\u6709\u53D1\u8A00",
  noMeetingsTitle: "\u8FD8\u6CA1\u6709\u4F1A\u8BAE",
  noMeetings: "\u4EE5\u7532\u65B9\u8EAB\u4EFD\u53EC\u96C6\u5458\u5DE5\u5F00\u4F1A\uFF0C\u6C9F\u901A\u9700\u6C42\uFF0C\u518D\u628A\u4F1A\u8BAE\u7EAA\u8981\u4E00\u952E\u53D8\u6210\u9879\u76EE\u3002",
  meetingHelp: "\u4F1A\u8BAE\u53EA\u8BA8\u8BBA\uFF0C\u4E0D\u6539\u6587\u4EF6\u3002\u5458\u5DE5\u6BCF\u6B21\u53D1\u8A00\u90FD\u4EE5\u53EA\u8BFB\u65B9\u5F0F\u8C03\u7528\u81EA\u5DF1\u914D\u7F6E\u7684\u6267\u884C\u5DE5\u5177\u548C\u6A21\u578B\u3002",
  meetingIntro: "\u4F60\u4F5C\u4E3A\u7532\u65B9\u63D0\u51FA\u9700\u6C42\uFF0C\u4E3B\u6301\u4EBA\u8D1F\u8D23\u63D0\u95EE\u548C\u5F15\u5BFC\uFF0C@ \u67D0\u4F4D\u5458\u5DE5\u53EF\u8BF7\u5176\u53D1\u8A00\u3002\u8BA8\u8BBA\u7ED3\u675F\u540E\u7531\u4E3B\u6301\u4EBA\u6574\u7406\u7EAA\u8981\uFF0C\u786E\u8BA4\u540E\u751F\u6210\u9879\u76EE\u548C\u4EFB\u52A1\u3002",
  meetingTitle: "\u4F1A\u8BAE\u4E3B\u9898",
  meetingTitlePlaceholder: "\u4F8B\u5982\uFF1A\u4E60\u60EF\u6253\u5361 App \u9700\u6C42\u6C9F\u901A",
  agenda: "\u8BAE\u9898 / \u80CC\u666F",
  agendaPlaceholder: "\u7B80\u5355\u5199\u4E0B\u4F60\u60F3\u505A\u4EC0\u4E48\u3001\u7ED9\u8C01\u7528\u3001\u6709\u4EC0\u4E48\u9650\u5236\uFF0C\u4F1A\u8BAE\u4E2D\u53EF\u4EE5\u7EE7\u7EED\u8865\u5145\u3002",
  host: "\u4E3B\u6301\u4EBA",
  hostHelp: "\u4E3B\u6301\u4EBA\u56DE\u590D\u4F60\u672A @ \u4EFB\u4F55\u4EBA\u7684\u6D88\u606F\uFF0C\u5E76\u5728\u4F1A\u540E\u6574\u7406\u7EAA\u8981\u3002",
  attendees: "\u53C2\u4F1A\u5458\u5DE5",
  hostTag: "\u4E3B\u6301\u4EBA",
  editAttendees: "\u7F16\u8F91\u4F1A\u8BAE",
  saveAttendees: "\u4FDD\u5B58\u4F1A\u8BAE\u8BBE\u7F6E",
  startMeeting: "\u5F00\u59CB\u4F1A\u8BAE",
  client: "\u7532\u65B9\uFF08\u4F60\uFF09",
  waitForSpeaker: "\u8BF7\u7B49\u5F85\u5F53\u524D\u53D1\u8A00\u7ED3\u675F",
  draftMinutes: "\u6574\u7406\u4F1A\u8BAE\u7EAA\u8981",
  stopSpeaking: "\u505C\u6B62\u53D1\u8A00",
  endMeeting: "\u7ED3\u675F\u4F1A\u8BAE",
  confirmEnd: "\u786E\u8BA4\u7ED3\u675F",
  viewProject: "\u67E5\u770B\u9879\u76EE",
  editMinutes: "\u7EE7\u7EED\u7F16\u8F91\u7EAA\u8981",
  redraftMinutes: "\u91CD\u65B0\u6574\u7406\u7EAA\u8981",
  reopenMeeting: "\u91CD\u65B0\u5F00\u542F\u4F1A\u8BAE",
  meetingEndedTitle: "\u4F1A\u8BAE\u5DF2\u7ED3\u675F\uFF0C\u8FD8\u6CA1\u6709\u521B\u5EFA\u9879\u76EE",
  meetingEndedHelp: "\u53EF\u4EE5\u6574\u7406\u4F1A\u8BAE\u7EAA\u8981\u5E76\u6309\u7EAA\u8981\u521B\u5EFA\u9879\u76EE\uFF08\u521B\u5EFA\u540E\u5728\u9879\u76EE\u9875\u70B9\u300C\u5F00\u59CB\u5DE5\u4F5C\u300D\uFF09\uFF0C\u6216\u91CD\u65B0\u5F00\u542F\u4F1A\u8BAE\u7EE7\u7EED\u8BA8\u8BBA\u3002",
  meetingEmpty: "\u4F1A\u8BAE\u5DF2\u5F00\u59CB\u3002\u5148\u8BF4\u8BF4\u4F60\u60F3\u8981\u7684\u4EA7\u54C1\uFF0C{host} \u4F1A\u63A5\u7740\u63D0\u95EE\u3002",
  nativeSession: "\u539F\u751F\u4F1A\u8BDD",
  speakingNow: "{name} \u6B63\u5728\u53D1\u8A00\u2026",
  aboutToSpeak: "{name} \u51C6\u5907\u53D1\u8A00\u2026",
  draftingNow: "{name} \u6B63\u5728\u6574\u7406\u4F1A\u8BAE\u7EAA\u8981\u2026",
  upNext: "\u63A5\u4E0B\u6765\uFF1A{names}",
  mention: "\u70B9\u540D",
  composerPlaceholder: "\u4EE5\u7532\u65B9\u8EAB\u4EFD\u8BF4\u660E\u9700\u6C42\u3001\u63D0\u95EE\u6216\u8865\u5145\u2026",
  mentionReply: "\u5C06\u7531 {names} \u4F9D\u6B21\u56DE\u590D",
  hostReply: "\u672A\u70B9\u540D\u65F6\u7531\u4E3B\u6301\u4EBA {name} \u56DE\u590D",
  sendShortcut: "Ctrl+Enter \u53D1\u9001",
  sendMessage: "\u53D1\u9001",
  minutes: "\u4F1A\u8BAE\u7EAA\u8981",
  minutesHelp: "\u786E\u8BA4\u6216\u4FEE\u6539\u540E\u521B\u5EFA\u9879\u76EE\uFF0C\u4EFB\u52A1\u6309\u987A\u5E8F\u4F9D\u6B21\u6267\u884C\u3002",
  summary: "\u7ED3\u8BBA\u6982\u8FF0",
  decisions: "\u5DF2\u786E\u5B9A\u4E8B\u9879\uFF08\u6BCF\u884C\u4E00\u6761\uFF09",
  decisionsShort: "\u5DF2\u786E\u5B9A\u4E8B\u9879",
  minutesTasks: "\u4EFB\u52A1\u5B89\u6392\uFF08\u6309\u4EA4\u4ED8\u987A\u5E8F\uFF09",
  moveUp: "\u4E0A\u79FB",
  moveDown: "\u4E0B\u79FB",
  removeTask: "\u79FB\u9664\u4EFB\u52A1",
  noMinutesTasks: "\u8FD8\u6CA1\u6709\u4EFB\u52A1\uFF0C\u81F3\u5C11\u6DFB\u52A0\u4E00\u9879\u540E\u624D\u80FD\u521B\u5EFA\u9879\u76EE\u3002",
  addMinutesTask: "\u6DFB\u52A0\u4EFB\u52A1",
  createFromMinutes: "\u6309\u7EAA\u8981\u521B\u5EFA\u9879\u76EE",
  saveMinutes: "\u4FDD\u5B58\u7EAA\u8981",
  resumeMeeting: "\u7EE7\u7EED\u8BA8\u8BBA",
  minutesIncomplete: "\u9700\u8981\u9879\u76EE\u540D\u79F0\u3001\u76EE\u6807\u548C\u81F3\u5C11\u4E00\u9879\u5B8C\u6574\u4EFB\u52A1\u3002",
  templatesHelp: "\u5E94\u7528\u6A21\u677F\u4F1A\u7528\u6A21\u677F\u6210\u5458\u66FF\u6362\u5F53\u524D\u56E2\u961F\uFF0C\u91CD\u590D\u5E94\u7528\u4E0D\u4F1A\u91CD\u590D\u6DFB\u52A0\u3002",
  backToRoster: "\u8FD4\u56DE\u5458\u5DE5\u540D\u5355",
  newTemplate: "\u65B0\u5EFA\u6A21\u677F",
  saveTeamAsTemplate: "\u5F53\u524D\u56E2\u961F\u5B58\u4E3A\u6A21\u677F",
  myTeam: "\u6211\u7684\u56E2\u961F",
  unsavedTemplate: "\u672A\u4FDD\u5B58",
  memberCount: "{count} \u4EBA",
  noTemplates: "\u8FD8\u6CA1\u6709\u56E2\u961F\u6A21\u677F\u3002",
  selectTemplate: "\u9009\u62E9\u4E00\u4E2A\u6A21\u677F\u67E5\u770B\u6210\u5458\u3002",
  templateName: "\u6A21\u677F\u540D\u79F0",
  templateDescription: "\u8BF4\u660E",
  templateMembers: "\u6210\u5458\uFF08\u6309\u4EA4\u4ED8\u987A\u5E8F\uFF09",
  addMember: "\u6DFB\u52A0\u6210\u5458",
  newMember: "\u65B0\u6210\u5458",
  templateMember: "\u6A21\u677F\u6210\u5458",
  updateMember: "\u66F4\u65B0\u6210\u5458",
  removeMember: "\u79FB\u9664\u6210\u5458",
  memberUpdated: "\u6210\u5458\u5DF2\u66F4\u65B0\uFF0C\u4FDD\u5B58\u6A21\u677F\u540E\u751F\u6548",
  saveTemplate: "\u4FDD\u5B58\u6A21\u677F",
  applyTemplate: "\u7528\u6B64\u6A21\u677F\u66FF\u6362\u56E2\u961F",
  deleteTemplate: "\u5220\u9664\u6A21\u677F",
  templateSaved: "\u6A21\u677F\u5DF2\u4FDD\u5B58",
  templateIncomplete: "\u6A21\u677F\u9700\u8981\u540D\u79F0\u548C\u81F3\u5C11\u4E00\u540D\u6210\u5458\uFF0C\u6BCF\u540D\u6210\u5458\u90FD\u8981\u6709\u59D3\u540D\u548C\u5C97\u4F4D\u3002",
  saveBeforeApply: "\u5148\u4FDD\u5B58\u6A21\u677F\u518D\u5E94\u7528",
  applyTitle: "\u66FF\u6362\u5F53\u524D\u56E2\u961F",
  applyKeep: "\u4FDD\u7559\uFF08\u59D3\u540D\u548C\u5C97\u4F4D\u4E00\u81F4\uFF0C\u6CBF\u7528\u73B0\u6709\u8BBE\u7F6E\uFF09",
  applyAdd: "\u65B0\u589E",
  applyRemove: "\u5220\u9664\uFF08\u6CA1\u6709\u4EFB\u52A1\u6216\u4F1A\u8BAE\u8BB0\u5F55\uFF09",
  applyDisable: "\u505C\u7528\uFF08\u6709\u4EFB\u52A1\u6216\u4F1A\u8BAE\u8BB0\u5F55\uFF0C\u4FDD\u7559\u6570\u636E\uFF09",
  applyNoChange: "\u5F53\u524D\u56E2\u961F\u5DF2\u4E0E\u6A21\u677F\u4E00\u81F4\uFF0C\u65E0\u9700\u66F4\u6539\u3002",
  confirmApply: "\u786E\u8BA4\u66FF\u6362",
  bulkManage: "\u6279\u91CF\u7BA1\u7406",
  bulkHelp: "\u52FE\u9009\u8981\u5220\u9664\u7684\u5458\u5DE5\u3002\u6709\u4EFB\u52A1\u6216\u4F1A\u8BAE\u8BB0\u5F55\u7684\u5458\u5DE5\u53EA\u80FD\u505C\u7528\uFF0C\u4E0D\u80FD\u5220\u9664\u3002",
  selectRedundant: "\u9009\u4E2D\u91CD\u590D\u5458\u5DE5\uFF08{count}\uFF09",
  redundantHelp: "\u4E0E\u524D\u9762\u7684\u5458\u5DE5\u59D3\u540D\u3001\u5C97\u4F4D\u3001\u804C\u8D23\u548C\u6267\u884C\u5DE5\u5177\u90FD\u76F8\u540C\uFF0C\u4E14\u6CA1\u6709\u5386\u53F2\u8BB0\u5F55\uFF1B\u4FDD\u7559\u6700\u65E9\u7684\u4E00\u4F4D\u3002",
  deleteSelected: "\u5220\u9664\u6240\u9009\uFF08{count}\uFF09",
  confirmBulkDelete: "\u786E\u8BA4\u5220\u9664 {count} \u4EBA",
  exitBulk: "\u5B8C\u6210",
  historyLocked: "\u6709\u5386\u53F2\u8BB0\u5F55"
};
var en = {
  companyWorkspace: "Company workspace",
  workspaceFirst: "Choose a shared working directory first",
  addWorkspace: "Add workspace",
  companyName: "Company / workspace name",
  companyDirectory: "Shared directory (Git repository or existing folder)",
  browseDirectory: "Browse folders",
  useWorkspace: "Use this workspace",
  workspaceHelp: "Employees collaborate in this directory. Project directories must stay inside it. Existing Git repositories can be used directly; each employee retains a private native session.",
  acceptanceCriteria: "Acceptance criteria",
  sessionMode: "Employee sessions",
  employeeSession: "Continue each employee\u2019s session within this project",
  freshSession: "Start a separate session for each task",
  nativeSessionHelp: "Native execution saves separate sessions. It does not create desktop projects or guarantee a desktop chat listing. Resume commands let you continue the sessions; the team receives final messages and deliverables only.",
  review: "Awaiting acceptance",
  acceptProject: "Accept project",
  exportProject: "Export collaboration documents to repository",
  changeInstruction: "Requested changes",
  requestChanges: "Create revision task",
  exportLocation: "Exported briefs, handoffs, and artifact copies are stored at {path} in the company directory.",
  accepted: "Accepted",
  awaitingReview: "Awaiting acceptance",
  superseded: "Revision task created",
  nativeSessions: "Native session records",
  continuedSession: "Continued session",
  newSession: "New session",
  title: "Studio",
  subtitle: "Configure a team. Assign work. Collaborate through results.",
  employees: "Employees",
  tasks: "Tasks",
  messages: "Handoffs",
  addEmployee: "Add employee",
  name: "Name",
  role: "Role",
  engine: "Execution tool",
  model: "Model",
  effort: "Reasoning effort",
  responsibilities: "Responsibilities",
  cwd: "Working directory",
  customModel: "Custom model ID",
  modelId: "Model ID",
  modelIdPlaceholder: "Enter the exact model ID supported by the native tool",
  imageInput: "Image input",
  permission: "Permissions",
  save: "Save",
  edit: "Edit",
  delete: "Delete",
  enabled: "Employee enabled",
  employeeSettings: "Employee settings",
  nativeDefault: "Inherit native settings",
  projectDirectory: "Project directory",
  objective: "Objective",
  projectName: "Project name",
  objectivePlaceholder: "Describe what you want the team to build",
  createProject: "Create project",
  team: "Team",
  selectTeam: "Employees in delivery order",
  noEmployees: "Add an employee or choose a team template.",
  noProjects: "Create a project to assign and advance tasks.",
  noTasks: "This project has no tasks.",
  noMessages: "Final reports, colleague handoffs, and your instructions appear here.",
  project: "Project",
  start: "Start work",
  pause: "Pause assignments",
  stop: "Stop execution",
  retry: "Retry",
  cancel: "Stop task",
  addTask: "Add task",
  taskTitle: "Task title",
  instruction: "Assignment",
  dependencies: "Dependencies",
  files: "Deliverable files (one relative path per line)",
  result: "Work report",
  artifacts: "Result files",
  assignment: "Actual assignment",
  noReasoning: "Only messages and result files are shared. Native tools retain their own sessions and reasoning.",
  to: "Recipient",
  send: "Send instruction",
  message: "Assign work or add requirements for the team or an employee",
  everyone: "All employees",
  health: "Check connections",
  checking: "Checking\u2026",
  available: "Available",
  unavailable: "Unavailable",
  refresh: "Refresh",
  baseURL: "API URL",
  apiKeyEnv: "Credential reference (environment variable)",
  thinkingFormat: "Thinking protocol",
  contextWindow: "Context window",
  maxTokens: "Maximum output tokens",
  providerHelp: "GLM and compatible services run in isolated Harness sessions. Configure credentials in existing settings or environment variables.",
  nativeHelp: "An empty model inherits local settings. Models and efforts reach the native tool directly; unsupported combinations fail explicitly.",
  readOnly: "Read only / plan",
  workspaceWrite: "Workspace writes / accept edits",
  fullAccess: "Full access",
  pending: "Pending",
  running: "Running",
  waiting: "Needs you",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Stopped",
  interrupted: "Interrupted",
  paused: "Paused",
  blocked: "Waiting for dependencies",
  attempt: "Attempts",
  created: "Created",
  source: "Sender",
  user: "You",
  saving: "Saving\u2026",
  close: "Close",
  download: "Download",
  selectProject: "Choose a project",
  roleTask: "Create role assignments for the selected team, then start work.",
  failure: "Operation failed",
  connectionError: "Cannot connect to Studio. Check the server and refresh.",
  newEmployee: "New employee",
  selected: "Participating",
  projectSettings: "Create project",
  lastResult: "Task details",
  unassignedCwd: "Use project directory",
  noResult: "The final report appears when the task completes.",
  handoffTo: "Handoff to",
  protocolNone: "Standard compatibility",
  codex: "Codex",
  claude: "Claude Code",
  harness: "DeepSeek Harness",
  compatible: "GLM / compatible API",
  downloadAll: "Result files",
  settingsSaved: "Saved",
  zai: "Z.ai",
  deepseekProtocol: "DeepSeek",
  fileMetadata: "{size} KB \xB7 SHA256 {hash}",
  projectsTab: "Projects",
  newProject: "New project",
  noProjectsTitle: "No projects yet",
  welcomeTitle: "Set up a company workspace",
  noRole: "No role set",
  disabled: "Disabled",
  profile: "Profile",
  execution: "Execution & model",
  workplace: "Workplace & permissions",
  confirmDelete: "Confirm delete",
  cancelAction: "Cancel",
  discard: "Discard new employee",
  unsaved: "Unsaved changes",
  modelCount: "{count} models",
  searchModels: "Search model name or ID",
  nativeDefaultHelp: "Use the local tool\u2019s current default model",
  loadingModels: "Reading the local model catalog\u2026",
  effortCount: "{count} effort levels",
  noModelMatch: "No matching model. Use a custom model ID instead.",
  customModelHelp: "Enter a full model ID that is not listed",
  rosterSummary: "{total} people, {enabled} enabled",
  searchEmployees: "Search name, role, or model",
  templates: "Team templates",
  unsavedEmployee: "Not saved yet",
  noEmployeesTitle: "Your team is empty",
  noEmployeeMatch: "No matching employees.",
  selectEmployee: "Select an employee to view settings.",
  kind_image: "Image",
  kind_document: "Doc",
  kind_web: "Web",
  kind_code: "Code",
  kind_data: "Data",
  kind_other: "File",
  preview: "Preview",
  hidePreview: "Hide",
  previewFailed: "Could not read the file. You can still download it.",
  loading: "Loading\u2026",
  noArtifacts: "No result files recorded.",
  taskSummary: "{done} / {total} done",
  filterTasks: "Filter tasks by status",
  filter_all: "All",
  filter_needsYou: "Needs you",
  filter_active: "Running",
  filter_waiting: "Waiting",
  filter_done: "Done",
  filter_attention: "Needs attention",
  unknownEmployee: "Unknown employee",
  waitingFor: "Waiting for {names}",
  revisionOfShort: "Revision of #{step}",
  noTasksHelp: "Add a task and choose an assignee to start work.",
  noFilteredTasks: "No tasks match this filter.",
  selectTask: "Select a task to see details.",
  editTask: "Edit task",
  assignee: "Assignee",
  projectNeedsYou: "{count} task(s) need you",
  projectNeedsYouHelp: 'An employee hit something only you can do and paused. Open the task marked "Needs you", follow the steps, then reply to continue.',
  latestProgress: "Latest update \xB7 {time}",
  noProgressYet: "The employee has not reported progress yet.",
  needsYouTitle: "{name} needs you",
  yourReply: "Your reply",
  replyPlaceholder: 'Tell the employee what you did, e.g. "Microphone permission allowed on the phone"',
  replyContinue: "Reply and continue",
  replyHelp: "The employee continues this task in the same session; the time limit restarts.",
  replyPausedHelp: "The project is paused: after replying, click Start for the employee to continue.",
  noDependencies: "There are no other tasks in this project yet.",
  failureReason: "Failure reason",
  waitingTitle: "Waiting for these tasks to complete",
  runningNotice: "{name} is working on this task",
  startedAt: "Started {time}",
  revisionOf: "This revises the following result",
  supersededBy: "A revision task was created for this result",
  reviewResult: "Review result",
  changePlaceholder: "Describe what should change. The employee handles it in a revision task.",
  pauseBeforeChanges: "The project is running. Pause or stop it before requesting changes.",
  changesHelp: "The original result is kept. A revision task is created for the same employee, and pending downstream tasks wait for it.",
  overview: "Overview",
  declaredFiles: "Declared deliverables",
  timeline: "Run time",
  relatedHandoffs: "Related handoffs",
  executionInfo: "Execution & native sessions",
  sessionCount: "{count} sessions",
  attemptN: "attempt {n}",
  noSessions: "No native session recorded yet.",
  copy: "Copy",
  copied: "Copied",
  projectPaused: "Not started / paused",
  projectRunning: "Running",
  projectCompleted: "Accepted",
  noReadyTasks: "No pending tasks to start",
  exported: "Exported to",
  reviewReady: "All tasks are complete and ready for your acceptance",
  reviewReadyHelp: "Review each result. Request a revision from the task details if needed, then choose \u201CAccept project\u201D.",
  progress: "Progress",
  projectIn: "In company workspace: {name}",
  criteriaPlaceholder: "List the conditions the delivery must meet",
  projectDirectoryHelp: "Leave empty to use the workspace root, or enter a subdirectory inside it.",
  employeeSessionHelp: "Later tasks for the same employee continue the earlier session and keep its working memory.",
  freshSessionHelp: "Each task starts an independent session.",
  selectedCount: "{count} selected",
  noEnabledEmployees: "No enabled employees. Add or enable one under Employees first.",
  newInstruction: "Post an instruction",
  filterPerson: "Show",
  userInitial: "Y",
  meetingsTab: "Meetings",
  newMeeting: "New meeting",
  meetingSummary: "{open} active of {total}",
  meetingOpen: "Discussing",
  meetingDrafting: "Drafting minutes",
  meetingReview: "Minutes to confirm",
  meetingClosed: "Ended",
  meetingNoMessages: "No one has spoken yet",
  noMeetingsTitle: "No meetings yet",
  noMeetings: "Call a meeting as the client, discuss requirements, then turn the minutes into a project.",
  meetingHelp: "Meetings are discussion only. Each employee turn runs their configured tool and model in read-only mode.",
  meetingIntro: "You state requirements as the client; the host asks questions and steers. Mention an employee to ask them directly. Afterwards the host drafts minutes that become a project once you confirm.",
  meetingTitle: "Topic",
  meetingTitlePlaceholder: "e.g. Habit tracker app requirements",
  agenda: "Agenda / background",
  agendaPlaceholder: "What you want to build, for whom, and any constraints. You can add more during the meeting.",
  host: "Host",
  hostHelp: "The host answers messages that mention no one and drafts the minutes.",
  attendees: "Attendees",
  hostTag: "Host",
  editAttendees: "Edit meeting",
  saveAttendees: "Save meeting",
  startMeeting: "Start meeting",
  client: "Client (you)",
  waitForSpeaker: "Wait for the current speaker to finish",
  draftMinutes: "Draft minutes",
  stopSpeaking: "Stop speaker",
  endMeeting: "End meeting",
  confirmEnd: "Confirm end",
  viewProject: "View project",
  editMinutes: "Edit minutes",
  redraftMinutes: "Redraft minutes",
  reopenMeeting: "Reopen meeting",
  meetingEndedTitle: "Meeting ended without a project",
  meetingEndedHelp: "Draft the minutes and create a project from them (then choose \u201CStart work\u201D on the project page), or reopen the meeting to keep discussing.",
  meetingEmpty: "The meeting has started. Describe the product you want; {host} will follow up.",
  nativeSession: "native session",
  speakingNow: "{name} is speaking\u2026",
  aboutToSpeak: "{name} is about to speak\u2026",
  draftingNow: "{name} is drafting the minutes\u2026",
  upNext: "Next: {names}",
  mention: "Ask",
  composerPlaceholder: "As the client, state requirements, ask, or add details\u2026",
  mentionReply: "{names} will reply in turn",
  hostReply: "Host {name} replies when no one is mentioned",
  sendShortcut: "Ctrl+Enter to send",
  sendMessage: "Send",
  minutes: "Minutes",
  minutesHelp: "Confirm or edit, then create the project; tasks run in order.",
  summary: "Summary",
  decisions: "Decisions (one per line)",
  decisionsShort: "Decisions",
  minutesTasks: "Tasks (in delivery order)",
  moveUp: "Move up",
  moveDown: "Move down",
  removeTask: "Remove task",
  noMinutesTasks: "No tasks yet. Add at least one to create the project.",
  addMinutesTask: "Add task",
  createFromMinutes: "Create project from minutes",
  saveMinutes: "Save minutes",
  resumeMeeting: "Resume discussion",
  minutesIncomplete: "A project name, objective, and at least one complete task are required.",
  templatesHelp: "Applying a template replaces the current team with its members; applying it again adds nothing.",
  backToRoster: "Back to employees",
  newTemplate: "New template",
  saveTeamAsTemplate: "Save current team as template",
  myTeam: "My team",
  unsavedTemplate: "Unsaved",
  memberCount: "{count} people",
  noTemplates: "No team templates yet.",
  selectTemplate: "Select a template to see its members.",
  templateName: "Template name",
  templateDescription: "Description",
  templateMembers: "Members (in delivery order)",
  addMember: "Add member",
  newMember: "New member",
  templateMember: "Template member",
  updateMember: "Update member",
  removeMember: "Remove member",
  memberUpdated: "Member updated; save the template to keep it",
  saveTemplate: "Save template",
  applyTemplate: "Replace team with this template",
  deleteTemplate: "Delete template",
  templateSaved: "Template saved",
  templateIncomplete: "A template needs a name and at least one member, each with a name and role.",
  saveBeforeApply: "Save the template before applying it",
  applyTitle: "Replace current team",
  applyKeep: "Kept (same name and role, settings unchanged)",
  applyAdd: "Added",
  applyRemove: "Deleted (no task or meeting history)",
  applyDisable: "Disabled (task or meeting history, data kept)",
  applyNoChange: "The team already matches this template.",
  confirmApply: "Confirm replace",
  bulkManage: "Bulk manage",
  bulkHelp: "Select employees to delete. Employees with task or meeting history can only be disabled.",
  selectRedundant: "Select duplicates ({count})",
  redundantHelp: "Same name, role, responsibilities, and tool as an earlier employee, with no history; the earliest copy stays.",
  deleteSelected: "Delete selected ({count})",
  confirmBulkDelete: "Confirm deleting {count}",
  exitBulk: "Done",
  historyLocked: "has history"
};

// src/client/mount.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
var inject = ["slots", "locale", "layout", "uiWorkspace"];
function StudioIcon({ size }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("circle", { cx: "9", cy: "7", r: "3" }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("path", { d: "M3 20v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2" })
  ] });
}
function apply(ctx) {
  const controller = new StudioController();
  ctx.effect(() => ctx.locale.register("wStudio", { zh, en }), "studio: dictionaries");
  ctx.effect(() => controller.start(), "studio: public company state");
  const t = ctx.locale.bind("wStudio");
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({ name: "sidebar.panellist", id: "w-studio", order: 5, label: () => t("title") }, StudioIcon));
  ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: "w-studio", locale: "wStudio", inject: () => ({
    hooks: { studio: controller },
    command: controller.command,
    refresh: controller.refresh,
    checkHealth: controller.checkHealth,
    pickDirectory: () => ctx.uiWorkspace.pickDirectory()
  }) }, StudioPanel));
}
return module.exports;}});
