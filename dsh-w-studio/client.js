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
var employeeSchema = Schema.object({
  id,
  name: short,
  role: short,
  responsibilities: text,
  engine,
  model: short,
  effort: short,
  permission,
  cwd: short,
  enabled: Schema.boolean().required(),
  baseURL: short,
  apiKeyEnv: short,
  thinkingFormat: Schema.union(["none", "deepseek", "zai"]).required(),
  contextWindow: Schema.number().step(1).min(1024).max(1e7).required(),
  maxTokens: Schema.number().step(1).min(1).max(1e6).required()
});
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
var stateSchema = Schema.object({
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
  tasks: Schema.array(Schema.object({
    ...taskFields,
    nativeSessions: Schema.array(Schema.object({
      id,
      engine,
      cwd: short,
      attempt: Schema.natural().min(1).required(),
      continued: Schema.boolean().required()
    })).required(),
    reviewStatus: Schema.union(["pending", "accepted", "superseded"]).required()
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
var catalogSchema = Schema.object({
  codex: Schema.array(model).required(),
  claude: Schema.array(model).required(),
  claudeError: Schema.string().required(),
  harness: Schema.array(model).required()
});
var StudioController = class {
  view = { state: null, health: null, catalog: null, error: "", busy: false };
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
var import_react3 = require("react");

// ../../../deepseek-harness/packages/util/crypto/lib/index.js
function randomUUID() {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes, (byte, index) => {
    return (index === 6 ? byte & 15 | 64 : index === 8 ? byte & 63 | 128 : byte).toString(16).padStart(2, "0");
  }).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// src/client/EmployeeEditor.tsx
var import_react = require("react");

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
  tag.textContent = '.r2poiG_studio{--studio-blue:#3064ee;--studio-ink:#152340;--studio-muted:#69768c;--studio-line:#e5eaf2;height:100%;color:var(--studio-ink);background:#fff;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Microsoft YaHei,sans-serif;font-size:14px;line-height:1.6;overflow:auto}.r2poiG_studio *{box-sizing:border-box}.r2poiG_studio h1{letter-spacing:-.8px;margin:0;font-size:34px;font-weight:700;line-height:1.3}.r2poiG_studio h2{margin:0 0 22px;font-size:21px;font-weight:650;line-height:1.4}.r2poiG_studio h3{margin:24px 0 10px;font-size:15px}.r2poiG_studio p{margin:8px 0}.r2poiG_studio button,.r2poiG_studio input,.r2poiG_studio textarea,.r2poiG_studio select{font:inherit}.r2poiG_studio button{color:var(--studio-ink);cursor:pointer;white-space:nowrap;background:#fff;border:1px solid #d5ddeb;border-radius:6px;padding:8px 16px;font-weight:500;line-height:1.5}.r2poiG_studio button:hover{border-color:var(--studio-blue);color:var(--studio-blue)}.r2poiG_studio button:disabled{opacity:.5;cursor:default}.r2poiG_studio button:focus-visible,.r2poiG_studio input:focus-visible,.r2poiG_studio textarea:focus-visible,.r2poiG_studio select:focus-visible,.r2poiG_studio a:focus-visible{outline:2px solid var(--studio-blue);outline-offset:2px}.r2poiG_studio button.r2poiG_primary{color:#fff;background:var(--studio-blue);border-color:var(--studio-blue)}.r2poiG_studio button.r2poiG_primary:hover{background:#2458d8}.r2poiG_studio button.r2poiG_danger{color:#c33f46}.r2poiG_studio input,.r2poiG_studio textarea,.r2poiG_studio select{width:100%;min-width:0;color:var(--studio-ink);background:#fff;border:1px solid #d5ddeb;border-radius:6px;padding:9px 12px;line-height:1.5}.r2poiG_studio textarea{resize:vertical}.r2poiG_studio input::placeholder,.r2poiG_studio textarea::placeholder{color:#97a2b4}.r2poiG_header{justify-content:space-between;align-items:center;gap:20px;padding:26px 30px 18px;display:flex}.r2poiG_header p{color:var(--studio-muted);font-size:16px}.r2poiG_actions{flex-wrap:wrap;align-items:center;gap:10px;display:flex}.r2poiG_tabs{border-bottom:1px solid var(--studio-line);gap:26px;padding:0 30px;display:flex}.r2poiG_tabs button{border:0;border-bottom:3px solid #0000;border-radius:0;padding:14px 8px;font-size:16px}.r2poiG_tabs button.r2poiG_activeTab{border-bottom-color:var(--studio-blue);color:var(--studio-blue)}.r2poiG_split{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:30px;padding:26px 30px 30px;display:grid}.r2poiG_list{min-width:0}.r2poiG_editor{border-left:1px solid var(--studio-line);min-width:0;padding:4px 0 0 30px}.r2poiG_sectionHeading{justify-content:space-between;align-items:center;gap:12px;margin-bottom:24px;display:flex}.r2poiG_sectionHeading h2{margin:0}.r2poiG_tableHead,.r2poiG_employeeRow{border-bottom:1px solid var(--studio-line);grid-template-columns:minmax(120px,1.25fr) minmax(60px,.85fr) minmax(95px,1fr) auto;align-items:center;gap:12px;padding:19px 0;display:grid}.r2poiG_tableHead{color:var(--studio-muted);padding-top:8px;padding-bottom:14px;font-size:12px}.r2poiG_employeeRow{min-height:88px}.r2poiG_employeeRow>span{overflow-wrap:anywhere}.r2poiG_employeeRow button{padding:5px 10px;font-size:12px}.r2poiG_employeeName{align-items:center;gap:12px;min-width:0;display:flex}.r2poiG_employeeName strong{overflow-wrap:anywhere;font-size:14px}.r2poiG_avatar{color:#345594;background:#e7efff;border-radius:50%;flex:0 0 38px;place-items:center;height:38px;font-size:17px;display:grid}.r2poiG_avatar[data-color="1"]{color:#65518e;background:#eee5ff}.r2poiG_avatar[data-color="2"]{color:#426b51;background:#e2f3e8}.r2poiG_avatar[data-color="3"]{color:#946535;background:#fff0df}.r2poiG_engineName small{color:var(--studio-muted);font-size:11px;display:block}.r2poiG_selectedRow{background:#f9fbff}.r2poiG_field{grid-template-columns:90px minmax(0,1fr);align-items:center;gap:16px;margin-bottom:18px;display:grid}.r2poiG_field>span{font-size:13px;font-weight:500}.r2poiG_numericFields{grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;display:grid}.r2poiG_numericFields label{font-size:12px}.r2poiG_check{align-items:center;gap:8px;font-size:13px;display:inline-flex}.r2poiG_studio .r2poiG_check input{width:16px;height:16px;accent-color:var(--studio-blue)}.r2poiG_hint{color:var(--studio-muted);font-size:12px;margin:12px 0 18px!important}.r2poiG_privacy{color:var(--studio-muted);max-width:440px;font-size:12px;margin-top:28px!important}.r2poiG_projectIntake{border-top:1px solid var(--studio-line);padding:22px 30px 24px}.r2poiG_projectIntake h2{margin-bottom:16px}.r2poiG_intakeFields{grid-template-columns:1fr 1.6fr;gap:24px;display:grid}.r2poiG_intakeFields label,.r2poiG_objectiveRow label,.r2poiG_messageForm label{font-size:13px}.r2poiG_intakeFields input,.r2poiG_objectiveRow textarea,.r2poiG_messageForm select{margin-top:6px}.r2poiG_teamSelection{border:0;flex-wrap:wrap;gap:8px 20px;margin:14px 0;padding:0;display:flex}.r2poiG_teamSelection legend{color:var(--studio-muted);padding:0 0 6px;font-size:12px}.r2poiG_objectiveRow{grid-template-columns:1fr auto;align-items:end;gap:20px;display:grid}.r2poiG_objectiveRow button{min-height:66px;padding:12px 32px}.r2poiG_projectToolbar{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;padding:20px 30px 0;display:flex}.r2poiG_projectToolbar label{grid-template-columns:max-content minmax(0,1fr);align-items:center;gap:12px;width:560px;min-width:0;max-width:100%;display:grid}.r2poiG_projectIntake .r2poiG_projectToolbar{padding:0}.r2poiG_taskRow{text-align:left;justify-content:space-between;gap:12px;width:100%;border:0!important;border-bottom:1px solid var(--studio-line)!important;white-space:normal!important;border-radius:0!important;padding:18px 10px!important;display:flex!important}.r2poiG_taskRow small{color:var(--studio-muted);font-weight:400;display:block}.r2poiG_status{color:var(--studio-muted);flex-shrink:0;font-size:11px}.r2poiG_status[data-status=running]{color:var(--studio-blue)}.r2poiG_status[data-status=completed]{color:#268454}.r2poiG_status[data-status=failed],.r2poiG_status[data-status=interrupted]{color:#c33f46}.r2poiG_report{white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font:inherit;margin:10px 0;font-size:13px;line-height:1.8}.r2poiG_fileList{padding-left:18px}.r2poiG_fileList li{overflow-wrap:anywhere;margin:8px 0}.r2poiG_fileList a{color:var(--studio-blue)}.r2poiG_fileList small{color:var(--studio-muted);font-size:11px;display:block}.r2poiG_stackedField{margin-bottom:16px;font-size:13px;display:block}.r2poiG_stackedField input,.r2poiG_stackedField textarea,.r2poiG_stackedField select{margin-top:6px}.r2poiG_checklist{border:1px solid var(--studio-line);margin:0 0 16px;padding:10px 12px}.r2poiG_checklist label{margin:8px 0;display:flex}.r2poiG_messages{padding:26px 30px}.r2poiG_messageRow{border-bottom:1px solid var(--studio-line);padding:20px 0}.r2poiG_messageRow>div{flex-wrap:wrap;gap:16px;font-size:12px;display:flex}.r2poiG_messageRow span,.r2poiG_messageRow time{color:var(--studio-muted)}.r2poiG_messageForm{grid-template-columns:180px minmax(0,1fr) auto;align-items:end;gap:12px;margin-top:24px;display:grid}.r2poiG_health{flex-wrap:wrap;gap:12px;margin-bottom:16px;font-size:11px;display:flex}.r2poiG_health span[data-available=true]{color:#268454}.r2poiG_health span[data-available=false]{color:#c33f46}.r2poiG_error{color:#a4343b;overflow-wrap:anywhere;background:#fff8f8;border:1px solid #f2d0d0;border-radius:6px;margin:16px 30px;padding:12px 16px;font-size:13px}.r2poiG_error button{margin-left:16px}.r2poiG_editor .r2poiG_error{margin:16px 0}.r2poiG_empty{color:var(--studio-muted);text-align:center;padding:36px 12px}@media (width<=1100px){.r2poiG_split{grid-template-columns:1fr;gap:24px}.r2poiG_editor{border-left:0;border-top:1px solid var(--studio-line);padding:24px 0 0}.r2poiG_header{align-items:start}.r2poiG_header .r2poiG_actions{justify-content:end}}@media (width<=600px){.r2poiG_header{flex-direction:column;gap:12px;padding:20px 16px 12px}.r2poiG_studio h1{font-size:28px}.r2poiG_header p{font-size:14px}.r2poiG_tabs{gap:20px;padding:0 16px}.r2poiG_split,.r2poiG_messages{padding:20px 16px}.r2poiG_employeeRow,.r2poiG_tableHead{grid-template-columns:minmax(90px,1.2fr) minmax(65px,1fr) auto;gap:8px;font-size:12px}.r2poiG_employeeRow>span:nth-child(2),.r2poiG_tableHead>span:nth-child(2),.r2poiG_avatar{display:none}.r2poiG_employeeName strong{font-size:12px}.r2poiG_field{grid-template-columns:75px minmax(0,1fr);gap:10px}.r2poiG_projectIntake{padding:20px 16px}.r2poiG_intakeFields,.r2poiG_objectiveRow,.r2poiG_messageForm{grid-template-columns:1fr;gap:12px}.r2poiG_objectiveRow button{min-height:42px}.r2poiG_projectToolbar{padding:20px 16px 0}.r2poiG_projectToolbar label{max-width:100%}.r2poiG_error{margin:12px 16px}}';
}
var Studio_default = { "intakeFields": "r2poiG_intakeFields", "tableHead": "r2poiG_tableHead", "tabs": "r2poiG_tabs", "messageForm": "r2poiG_messageForm", "projectToolbar": "r2poiG_projectToolbar", "empty": "r2poiG_empty", "studio": "r2poiG_studio", "messageRow": "r2poiG_messageRow", "check": "r2poiG_check", "hint": "r2poiG_hint", "checklist": "r2poiG_checklist", "actions": "r2poiG_actions", "projectIntake": "r2poiG_projectIntake", "engineName": "r2poiG_engineName", "danger": "r2poiG_danger", "sectionHeading": "r2poiG_sectionHeading", "selectedRow": "r2poiG_selectedRow", "taskRow": "r2poiG_taskRow", "teamSelection": "r2poiG_teamSelection", "list": "r2poiG_list", "activeTab": "r2poiG_activeTab", "employeeName": "r2poiG_employeeName", "avatar": "r2poiG_avatar", "status": "r2poiG_status", "stackedField": "r2poiG_stackedField", "health": "r2poiG_health", "split": "r2poiG_split", "error": "r2poiG_error", "header": "r2poiG_header", "primary": "r2poiG_primary", "field": "r2poiG_field", "privacy": "r2poiG_privacy", "report": "r2poiG_report", "numericFields": "r2poiG_numericFields", "fileList": "r2poiG_fileList", "editor": "r2poiG_editor", "objectiveRow": "r2poiG_objectiveRow", "messages": "r2poiG_messages", "employeeRow": "r2poiG_employeeRow" };

// src/client/EmployeeEditor.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var efforts = {
  claude: ["", "low", "medium", "high", "xhigh", "max"],
  codex: ["", "low", "medium", "high", "xhigh", "max", "ultra"],
  harness: ["", "off", "low", "high", "max"],
  compatible: ["", "minimal", "low", "medium", "high", "xhigh"]
};
function EmployeeEditor({ employee, catalog, busy, t, save, remove }) {
  const [draft, setDraft] = (0, import_react.useState)(employee);
  const [customModel, setCustomModel] = (0, import_react.useState)(false);
  const change = (key, value) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
  };
  const models = draft.engine === "compatible" ? void 0 : catalog?.[draft.engine === "claude" ? "claude" : draft.engine === "codex" ? "codex" : "harness"];
  const selectedModel = models?.find((model2) => model2.id === draft.model);
  const isCustomModel = customModel || draft.engine === "compatible" || !!draft.model && !selectedModel;
  const effortOptions = selectedModel?.efforts.length ? ["", ...selectedModel.efforts] : efforts[draft.engine];
  const field = (key, placeholder = "") => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: Studio_default.field, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(key) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: draft[key], placeholder, onChange: (event) => {
      change(key, event.target.value);
    } })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { className: Studio_default.editor, onSubmit: (event) => {
    event.preventDefault();
    void save(draft);
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t("employeeSettings") }),
    field("name"),
    field("role"),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("responsibilities") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { rows: 3, value: draft.responsibilities, onChange: (event) => {
        change("responsibilities", event.target.value);
      } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("engine") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { "aria-label": t("engine"), value: draft.engine, onChange: (event) => {
        const engine2 = event.target.value;
        setCustomModel(false);
        setDraft((previous) => ({ ...previous, engine: engine2, model: engine2 === "claude" ? "sonnet" : "", effort: "", thinkingFormat: engine2 === "compatible" ? "zai" : "none" }));
      }, children: ["codex", "claude", "harness", "compatible"].map((engine2) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: engine2, children: t(engine2) }, engine2)) })
    ] }),
    draft.engine !== "compatible" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("model") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { "aria-label": t("model"), value: isCustomModel ? "__custom__" : draft.model, onChange: (event) => {
        const custom = event.target.value === "__custom__";
        setCustomModel(custom);
        if (!custom) setDraft({ ...draft, model: event.target.value, effort: "" });
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: t("nativeDefault") }),
        models?.filter((model2) => model2.id !== "").map((model2) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: model2.id, children: [
          model2.name,
          " \xB7 ",
          model2.id,
          model2.imageInput ? ` \xB7 ${t("imageInput")}` : ""
        ] }, model2.id)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "__custom__", children: t("customModel") })
      ] })
    ] }),
    isCustomModel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("modelId") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { "aria-label": t("modelId"), value: draft.model, placeholder: t("modelIdPlaceholder"), onChange: (event) => {
        setDraft({ ...draft, model: event.target.value, effort: "" });
      } })
    ] }),
    draft.engine === "claude" && catalog?.claudeError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "alert", className: Studio_default.error, children: catalog.claudeError }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("effort") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { "aria-label": t("effort"), value: draft.effort, onChange: (event) => {
        change("effort", event.target.value);
      }, children: effortOptions.map((effort) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: effort, children: effort || t("nativeDefault") }, effort)) })
    ] }),
    field("cwd", t("unassignedCwd")),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: Studio_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("permission") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { "aria-label": t("permission"), value: draft.permission, onChange: (event) => {
        change("permission", event.target.value);
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "read-only", children: t("readOnly") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "workspace-write", children: t("workspaceWrite") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "full-access", children: t("fullAccess") })
      ] })
    ] }),
    draft.engine === "compatible" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      field("baseURL"),
      field("apiKeyEnv"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: Studio_default.field, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("thinkingFormat") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { "aria-label": t("thinkingFormat"), value: draft.thinkingFormat, onChange: (event) => {
          change("thinkingFormat", event.target.value);
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "none", children: t("protocolNone") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "zai", children: t("zai") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "deepseek", children: t("deepseekProtocol") })
        ] })
      ] })
    ] }),
    (draft.engine === "compatible" || draft.engine === "harness") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: Studio_default.numericFields, children: ["contextWindow", "maxTokens"].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(key) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", min: key === "contextWindow" ? 1024 : 1, value: draft[key], onChange: (event) => {
        change(key, Number(event.target.value));
      } })
    ] }, key)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: Studio_default.check, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: draft.enabled, onChange: (event) => {
        change("enabled", event.target.checked);
      } }),
      t("enabled")
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: Studio_default.hint, children: t(draft.engine === "compatible" ? "providerHelp" : "nativeHelp") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: Studio_default.actions, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "submit", className: Studio_default.primary, disabled: busy, children: t(busy ? "saving" : "save") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: Studio_default.danger, disabled: busy, onClick: () => {
        void remove(draft.id);
      }, children: t("delete") })
    ] })
  ] });
}

// src/client/TaskBoard.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function TaskBoard({ state, project, busy, t, command }) {
  const tasks = state.tasks.filter((task2) => task2.projectId === project.id);
  const [selected, setSelected] = (0, import_react2.useState)(tasks[0]?.id ?? null);
  const [draft, setDraft] = (0, import_react2.useState)(null);
  const task = tasks.find((value) => value.id === selected);
  const [changes, setChanges] = (0, import_react2.useState)("");
  const edit = (value) => {
    setDraft({
      id: value?.id ?? null,
      employeeId: value?.employeeId ?? state.employees.find((employee) => employee.enabled)?.id ?? "",
      title: value?.title ?? "",
      instruction: value?.instruction ?? "",
      dependsOn: value?.dependsOn ?? [],
      files: value?.outputFiles.join("\n") ?? ""
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Studio_default.split, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: Studio_default.list, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: Studio_default.hint, children: project.objective }),
      project.acceptanceCriteria && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: Studio_default.hint, children: [
        t("acceptanceCriteria"),
        ": ",
        project.acceptanceCriteria
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: Studio_default.hint, children: t("exportLocation", { path: `.studio/projects/${project.id}/` }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Studio_default.sectionHeading, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { children: t("tasks") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: Studio_default.primary, disabled: busy, onClick: () => {
          edit();
        }, children: t("addTask") })
      ] }),
      tasks.map((value) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { className: `${Studio_default.taskRow} ${selected === value.id ? Studio_default.selectedRow : ""}`, onClick: () => {
        setSelected(value.id);
        setDraft(null);
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: value.title }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("small", { children: [
            state.employees.find((employee) => employee.id === value.employeeId)?.name,
            value.reviewStatus === "superseded" && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
              " \xB7 ",
              t("superseded")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: Studio_default.status, "data-status": value.status, children: t(value.status === "pending" && !value.dependsOn.every((id2) => tasks.find((dependency) => dependency.id === id2)?.status === "completed") ? "blocked" : value.status) })
      ] }, value.id)),
      !tasks.length && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: Studio_default.empty, children: t("noTasks") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("section", { className: Studio_default.editor, children: draft ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("form", { onSubmit: (event) => {
      event.preventDefault();
      const input = {
        projectId: project.id,
        employeeId: draft.employeeId,
        title: draft.title,
        instruction: draft.instruction,
        dependsOn: draft.dependsOn,
        outputFiles: draft.files.split("\n").map((name) => name.trim()).filter(Boolean)
      };
      void command(draft.id ? "editTask" : "createTask", draft.id ? { id: draft.id, task: input } : input).then((ok) => {
        if (ok) setDraft(null);
      });
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { children: t(draft.id ? "edit" : "addTask") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: Studio_default.stackedField, children: [
        t("employees"),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("select", { required: true, value: draft.employeeId, onChange: (event) => {
          setDraft({ ...draft, employeeId: event.target.value });
        }, children: state.employees.filter((employee) => employee.enabled).map((employee) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("option", { value: employee.id, children: [
          employee.name,
          " \xB7 ",
          employee.role
        ] }, employee.id)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: Studio_default.stackedField, children: [
        t("taskTitle"),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { required: true, value: draft.title, onChange: (event) => {
          setDraft({ ...draft, title: event.target.value });
        } })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: Studio_default.stackedField, children: [
        t("instruction"),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("textarea", { required: true, rows: 5, value: draft.instruction, onChange: (event) => {
          setDraft({ ...draft, instruction: event.target.value });
        } })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("fieldset", { className: Studio_default.checklist, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("legend", { children: t("dependencies") }),
        tasks.filter((value) => value.id !== draft.id).map((value) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: Studio_default.check, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { type: "checkbox", checked: draft.dependsOn.includes(value.id), onChange: (event) => {
            setDraft({ ...draft, dependsOn: event.target.checked ? [...draft.dependsOn, value.id] : draft.dependsOn.filter((id2) => id2 !== value.id) });
          } }),
          value.title
        ] }, value.id))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: Studio_default.stackedField, children: [
        t("files"),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("textarea", { rows: 3, value: draft.files, onChange: (event) => {
          setDraft({ ...draft, files: event.target.value });
        } })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Studio_default.actions, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: Studio_default.primary, disabled: busy, children: t("save") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", onClick: () => {
          setDraft(null);
        }, children: t("close") })
      ] })
    ] }) : task ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { children: t("lastResult") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h3", { children: task.title }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: Studio_default.hint, children: [
        t("attempt"),
        ": ",
        task.attempt
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Studio_default.actions, children: [
        task.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { onClick: () => {
          edit(task);
        }, children: t("edit") }),
        ["failed", "cancelled", "interrupted"].includes(task.status) && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { disabled: busy, onClick: () => {
          void command("retryTask", { id: task.id });
        }, children: t("retry") }),
        ["pending", "running"].includes(task.status) && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: Studio_default.danger, disabled: busy, onClick: () => {
          void command("cancelTask", { id: task.id });
        }, children: t("cancel") })
      ] }),
      task.error && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { role: "alert", className: Studio_default.error, children: task.error }),
      task.status === "completed" && task.reviewStatus !== "superseded" && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("form", { onSubmit: (event) => {
        event.preventDefault();
        void command("requestChanges", { id: task.id, instruction: changes }).then((ok) => {
          if (ok) setChanges("");
        });
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: Studio_default.stackedField, children: [
          t("changeInstruction"),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("textarea", { required: true, rows: 3, value: changes, onChange: (event) => {
            setChanges(event.target.value);
          } })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { disabled: busy || project.status === "running", children: t("requestChanges") })
      ] }),
      task.status === "completed" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: Studio_default.hint, children: t(task.reviewStatus === "superseded" ? "superseded" : task.reviewStatus === "accepted" ? "accepted" : "awaitingReview") }),
      !!task.nativeSessions.length && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("details", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("summary", { children: t("nativeSessions") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: Studio_default.hint, children: t("nativeSessionHelp") }),
        task.nativeSessions.map((session) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("strong", { children: [
            t(session.engine),
            " \xB7 ",
            t(session.continued ? "continuedSession" : "newSession")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { className: Studio_default.report, children: session.engine === "claude" ? `claude --resume ${session.id}` : session.engine === "codex" ? `codex resume ${session.id}` : session.id }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: Studio_default.hint, children: session.cwd })
        ] }, `${session.id}-${session.attempt}`))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h3", { children: t("result") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { className: Studio_default.report, children: task.result || t("noResult") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h3", { children: t("artifacts") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ul", { className: Studio_default.fileList, children: state.artifacts.filter((file) => file.taskId === task.id).map((file) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("li", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: `/api/studio/artifact?id=${encodeURIComponent(file.id)}`, download: true, children: file.name }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("small", { children: t("fileMetadata", { size: Math.ceil(file.size / 1024), hash: file.sha256.slice(0, 12) }) })
      ] }, file.id)) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("details", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("summary", { children: t("assignment") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { className: Studio_default.report, children: task.assignment || task.instruction })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: Studio_default.empty, children: t("noTasks") }) })
  ] });
}

// src/client/StudioPanel.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function StudioPanel({ useStudio, command, refresh, checkHealth, pickDirectory, t }) {
  const view = useStudio((snapshot) => snapshot);
  const state = view.state;
  const [tab, setTab] = (0, import_react3.useState)("employees");
  const [selectedEmployee, setSelectedEmployee] = (0, import_react3.useState)(null);
  const [newEmployee, setNewEmployee] = (0, import_react3.useState)(null);
  const [projectId, setProjectId] = (0, import_react3.useState)(null);
  const [projectDraft, setProjectDraft] = (0, import_react3.useState)({ name: "", cwd: "", objective: "", employeeIds: null });
  const [projectForm, setProjectForm] = (0, import_react3.useState)(false);
  const [message, setMessage] = (0, import_react3.useState)("");
  const [recipient, setRecipient] = (0, import_react3.useState)("team");
  const [workspaceDraft, setWorkspaceDraft] = (0, import_react3.useState)({ name: "", path: "" });
  const [workspaceError, setWorkspaceError] = (0, import_react3.useState)("");
  const [workspaceForm, setWorkspaceForm] = (0, import_react3.useState)(false);
  const [acceptanceCriteria, setAcceptanceCriteria] = (0, import_react3.useState)("");
  const [sessionMode, setSessionMode] = (0, import_react3.useState)("employee-project");
  const workspace = state?.workspaces.find((value) => value.id === state.activeWorkspaceId);
  const projects = state?.projects.filter((value) => value.workspaceId === workspace?.id) ?? [];
  const employee = newEmployee ?? state?.employees.find((value) => value.id === selectedEmployee) ?? state?.employees[0];
  const project = projects.find((value) => value.id === projectId) ?? projects.at(-1);
  const draftEmployee = () => {
    const id2 = randomUUID();
    setNewEmployee({
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
    setSelectedEmployee(id2);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("main", { className: Studio_default.studio, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("header", { className: Studio_default.header, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h1", { children: t("title") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: t("subtitle") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: Studio_default.actions, children: ["lean", "full"].map((kind) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { disabled: view.busy, onClick: () => {
        void command("template", { kind });
      }, children: t(kind) }, kind)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("nav", { className: Studio_default.tabs, "aria-label": t("title"), children: ["employees", "tasks", "messages"].map((name) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: tab === name ? Studio_default.activeTab : "", "aria-current": tab === name ? "page" : void 0, onClick: () => {
      setTab(name);
    }, children: t(name) }, name)) }),
    view.error && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.error, role: "alert", children: [
      view.error,
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: () => {
        void refresh();
      }, children: t("refresh") })
    ] }),
    state ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: Studio_default.projectIntake, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.projectToolbar, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
            t("companyWorkspace"),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { "aria-label": t("companyWorkspace"), value: workspace?.id ?? "", onChange: (event) => {
              void command("selectWorkspace", { id: event.target.value });
              setProjectId(null);
            }, children: [
              !workspace && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: t("workspaceFirst") }),
              state.workspaces.map((value) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("option", { value: value.id, children: [
                value.name,
                " \xB7 ",
                value.path
              ] }, value.id))
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: () => {
            setWorkspaceForm((value) => !value);
          }, children: t("addWorkspace") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.hint, children: t("workspaceHelp") }),
        (workspaceForm || !workspace) && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("form", { onSubmit: (event) => {
          event.preventDefault();
          void command("createWorkspace", workspaceDraft).then((ok) => {
            if (ok) {
              setWorkspaceForm(false);
              setWorkspaceDraft({ name: "", path: "" });
              setProjectId(null);
            }
          });
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.intakeFields, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
              t("companyName"),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { required: true, value: workspaceDraft.name, onChange: (event) => {
                setWorkspaceDraft({ ...workspaceDraft, name: event.target.value });
              } })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
              t("companyDirectory"),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { required: true, value: workspaceDraft.path, onChange: (event) => {
                setWorkspaceDraft({ ...workspaceDraft, path: event.target.value });
              } })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.actions, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", onClick: () => {
              void pickDirectory().then((path) => {
                if (path) setWorkspaceDraft((value) => ({ ...value, path }));
                setWorkspaceError("");
              }).catch((error) => {
                setWorkspaceError(error instanceof Error ? error.message : t("failure"));
              });
            }, children: t("browseDirectory") }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.primary, disabled: view.busy, children: t("useWorkspace") })
          ] }),
          workspaceError && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.error, role: "alert", children: workspaceError })
        ] })
      ] }),
      tab === "employees" && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.split, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: Studio_default.list, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.sectionHeading, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.primary, onClick: draftEmployee, children: t("addEmployee") }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: () => {
              void checkHealth();
            }, children: t("health") })
          ] }),
          view.health && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: Studio_default.health, children: ["codex", "claude", "harness"].map((engine2) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { title: view.health?.[engine2].version, "data-available": view.health?.[engine2].available, children: [
            t(engine2),
            " \xB7 ",
            t(view.health?.[engine2].available ? "available" : "unavailable")
          ] }, engine2)) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.tableHead, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("name") }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("role") }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("model") }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("edit") })
          ] }),
          state.employees.map((value, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: `${Studio_default.employeeRow} ${employee?.id === value.id ? Studio_default.selectedRow : ""}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.employeeName, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: Studio_default.avatar, "data-color": index % 4, children: value.name.slice(0, 1) }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { children: value.name })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: value.role }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: Studio_default.engineName, children: [
              t(value.engine),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("small", { children: value.model || t("nativeDefault") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: () => {
              setNewEmployee(null);
              setSelectedEmployee(value.id);
            }, disabled: view.busy, children: t("edit") })
          ] }, value.id)),
          !state.employees.length && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.empty, children: t("noEmployees") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.privacy, children: t("noReasoning") })
        ] }),
        employee && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          EmployeeEditor,
          {
            employee,
            catalog: view.catalog,
            busy: view.busy,
            t,
            save: async (value) => {
              const ok = await command("saveEmployee", value);
              if (ok) {
                setNewEmployee(null);
                setSelectedEmployee(value.id);
              }
              return ok;
            },
            remove: async (id2) => {
              if (newEmployee?.id === id2) {
                setNewEmployee(null);
                setSelectedEmployee(null);
                return true;
              }
              return command("deleteEmployee", { id: id2 });
            }
          },
          employee.id
        )
      ] }),
      tab !== "employees" && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.projectToolbar, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
            t("project"),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { "aria-label": t("project"), value: project?.id ?? "", onChange: (event) => {
              setProjectId(event.target.value);
            }, children: [
              !projects.length && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: t("selectProject") }),
              projects.map((value) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("option", { value: value.id, children: [
                value.name,
                " \xB7 ",
                t(value.status)
              ] }, value.id))
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.actions, children: [
            project && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
              project.status === "paused" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.primary, disabled: view.busy, onClick: () => {
                void command("startProject", { id: project.id });
              }, children: t("start") }),
              project.status === "review" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.primary, disabled: view.busy, onClick: () => {
                void command("acceptProject", { id: project.id });
              }, children: t("acceptProject") }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { disabled: view.busy, onClick: () => {
                void command("exportProject", { id: project.id });
              }, children: t("exportProject") }),
              project.status === "running" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { disabled: view.busy, onClick: () => {
                void command("pauseProject", { id: project.id });
              }, children: t("pause") }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.danger, disabled: view.busy, onClick: () => {
                void command("stopProject", { id: project.id });
              }, children: t("stop") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: () => {
              setProjectForm((value) => !value);
            }, children: t("createProject") })
          ] })
        ] }),
        project ? tab === "tasks" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(TaskBoard, { state, project, busy: view.busy, t, command }, project.id) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: Studio_default.messages, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: t("messages") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.hint, children: t("noReasoning") }),
          state.messages.filter((value) => value.projectId === project.id).map((value) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("article", { className: Studio_default.messageRow, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { children: value.from === "user" ? t("user") : state.employees.find((employee2) => employee2.id === value.from)?.name }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
                t("handoffTo"),
                " ",
                value.to === "team" ? t("everyone") : state.employees.find((employee2) => employee2.id === value.to)?.name
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("time", { children: new Date(value.createdAt).toLocaleString() })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("pre", { className: Studio_default.report, children: value.message })
          ] }, value.id)),
          !state.messages.some((value) => value.projectId === project.id) && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.empty, children: t("noMessages") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("form", { className: Studio_default.messageForm, onSubmit: (event) => {
            event.preventDefault();
            void command("message", { projectId: project.id, to: recipient, message }).then((ok) => {
              if (ok) setMessage("");
            });
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
              t("to"),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { value: recipient, onChange: (event) => {
                setRecipient(event.target.value);
              }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "team", children: t("everyone") }),
                state.employees.map((employee2) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: employee2.id, children: employee2.name }, employee2.id))
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("textarea", { "aria-label": t("message"), placeholder: t("message"), required: true, rows: 3, value: message, onChange: (event) => {
              setMessage(event.target.value);
            } }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.primary, disabled: view.busy, children: t("send") })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.empty, children: t("noProjects") })
      ] }),
      workspace && (tab === "employees" || projectForm || !projects.length) && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: Studio_default.projectIntake, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: t("projectSettings") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("form", { onSubmit: (event) => {
          event.preventDefault();
          const employeeIds = projectDraft.employeeIds ?? state.employees.filter((employee2) => employee2.enabled).map((employee2) => employee2.id);
          void command("createProject", { ...projectDraft, workspaceId: workspace.id, acceptanceCriteria, sessionMode, employeeIds }).then((ok) => {
            if (ok) {
              setTab("tasks");
              setProjectForm(false);
              setProjectId(null);
            }
          });
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.intakeFields, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
              t("projectName"),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { required: true, value: projectDraft.name, onChange: (event) => {
                setProjectDraft({ ...projectDraft, name: event.target.value });
              } })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
              t("projectDirectory"),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { placeholder: workspace.path, value: projectDraft.cwd, onChange: (event) => {
                setProjectDraft({ ...projectDraft, cwd: event.target.value });
              } })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: Studio_default.stackedField, children: [
            t("acceptanceCriteria"),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("textarea", { rows: 3, value: acceptanceCriteria, onChange: (event) => {
              setAcceptanceCriteria(event.target.value);
            } })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: Studio_default.stackedField, children: [
            t("sessionMode"),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { "aria-label": t("sessionMode"), value: sessionMode, onChange: (event) => {
              setSessionMode(event.target.value);
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "employee-project", children: t("employeeSession") }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "new-task", children: t("freshSession") })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.hint, children: t("nativeSessionHelp") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("fieldset", { className: Studio_default.teamSelection, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("legend", { children: t("selectTeam") }),
            state.employees.filter((employee2) => employee2.enabled).map((employee2) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: Studio_default.check, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { type: "checkbox", checked: projectDraft.employeeIds === null || projectDraft.employeeIds.includes(employee2.id), onChange: (event) => {
                const current = projectDraft.employeeIds ?? state.employees.filter((value) => value.enabled).map((value) => value.id);
                setProjectDraft({ ...projectDraft, employeeIds: event.target.checked ? [...current, employee2.id] : current.filter((id2) => id2 !== employee2.id) });
              } }),
              employee2.name
            ] }, employee2.id))
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: Studio_default.objectiveRow, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
              t("objective"),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("textarea", { required: true, placeholder: t("objectivePlaceholder"), rows: 2, value: projectDraft.objective, onChange: (event) => {
                setProjectDraft({ ...projectDraft, objective: event.target.value });
              } })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: Studio_default.primary, disabled: view.busy || !state.employees.some((employee2) => employee2.enabled), children: t("createProject") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.hint, children: t("roleTask") })
        ] })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: Studio_default.empty, children: t(view.error ? "connectionError" : "checking") })
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
  lean: "\u7CBE\u7B80\u4EA7\u54C1\u56E2\u961F",
  full: "\u5B8C\u6574\u7814\u53D1\u56E2\u961F",
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
  templateAdded: "\u56E2\u961F\u6A21\u677F\u5DF2\u6DFB\u52A0\uFF0C\u53EF\u4EE5\u8C03\u6574\u6BCF\u540D\u5458\u5DE5\u3002",
  zai: "Z.ai",
  deepseekProtocol: "DeepSeek",
  fileMetadata: "{size} KB \xB7 SHA256 {hash}"
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
  lean: "Lean product team",
  full: "Full delivery team",
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
  templateAdded: "Team template added. You can customize every employee.",
  zai: "Z.ai",
  deepseekProtocol: "DeepSeek",
  fileMetadata: "{size} KB \xB7 SHA256 {hash}"
};

// src/client/mount.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var inject = ["slots", "locale", "layout", "uiWorkspace"];
function StudioIcon({ size }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("circle", { cx: "9", cy: "7", r: "3" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M3 20v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2" })
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
