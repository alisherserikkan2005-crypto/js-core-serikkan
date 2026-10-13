// Part 1 - own helper functions (no lodash).

function assertArray(arr, name = "argument") {
  if (!Array.isArray(arr)) {
    throw new TypeError(`${name} must be an array`);
  }
}

/** Array without duplicates (keeps first occurrence). */
export function unique(arr) {
  assertArray(arr, "unique(arr)");
  return [...new Set(arr)];
}

/** Group items by the key returned from keyFn. */
export function groupBy(arr, keyFn) {
  assertArray(arr, "groupBy(arr)");
  if (typeof keyFn !== "function") {
    throw new TypeError("groupBy(keyFn) must be a function");
  }
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    return { ...groups, [key]: [...(groups[key] ?? []), item] };
  }, {});
}

/** Split an array into pieces of the given size. */
export function chunk(arr, size) {
  assertArray(arr, "chunk(arr)");
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError("chunk(size) must be a positive integer");
  }
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/** Deep copy without JSON.parse(JSON.stringify()). Supports Date, Map, Set, cycles. */
export function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") {
    return value; // primitives and functions are returned as is
  }
  if (seen.has(value)) {
    return seen.get(value); // circular reference
  }
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  if (value instanceof Map) {
    const copy = new Map();
    seen.set(value, copy);
    value.forEach((v, k) => copy.set(deepClone(k, seen), deepClone(v, seen)));
    return copy;
  }
  if (value instanceof Set) {
    const copy = new Set();
    seen.set(value, copy);
    value.forEach((v) => copy.add(deepClone(v, seen)));
    return copy;
  }
  if (Array.isArray(value)) {
    const copy = [];
    seen.set(value, copy);
    value.forEach((item, i) => {
      copy[i] = deepClone(item, seen);
    });
    return copy;
  }
  const copy = {};
  seen.set(value, copy);
  for (const [key, val] of Object.entries(value)) {
    copy[key] = deepClone(val, seen);
  }
  return copy;
}

/** Caches results of fn. The cache lives in a closure. */
export function memoize(fn) {
  if (typeof fn !== "function") {
    throw new TypeError("memoize(fn) must be a function");
  }
  const cache = new Map(); // private: only the returned function can see it
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/** Counter factory. `count` is hidden in a closure. */
export function counter(start = 0) {
  let count = start;
  return {
    inc: () => ++count,
    dec: () => --count,
    value: () => count,
  };
}
