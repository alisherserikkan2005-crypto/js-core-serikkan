import { describe, it, expect, vi } from "vitest";
import { unique, groupBy, chunk, deepClone, memoize, counter } from "../src/functions.js";

describe("unique", () => {
  it("removes duplicates", () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });
  it("returns [] for an empty array", () => {
    expect(unique([])).toEqual([]);
  });
  it("throws on wrong type", () => {
    expect(() => unique("abc")).toThrow(TypeError);
  });
});

describe("groupBy", () => {
  it("groups objects by a computed key", () => {
    const users = [{ n: "a", age: 20 }, { n: "b", age: 30 }, { n: "c", age: 20 }];
    expect(groupBy(users, (u) => u.age)).toEqual({
      20: [users[0], users[2]],
      30: [users[1]],
    });
  });
  it("returns {} for an empty array", () => {
    expect(groupBy([], (x) => x)).toEqual({});
  });
  it("throws if keyFn is not a function", () => {
    expect(() => groupBy([1], null)).toThrow(TypeError);
  });
});

describe("chunk", () => {
  it("splits into pieces, last one may be shorter", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
  it("returns [] for an empty array", () => {
    expect(chunk([], 3)).toEqual([]);
  });
  it("throws on size 0", () => {
    expect(() => chunk([1, 2], 0)).toThrow(RangeError);
  });
});

describe("deepClone", () => {
  it("copies nested objects so changes do not leak", () => {
    const original = { a: { b: [1, 2, { c: 3 }] } };
    const copy = deepClone(original);
    copy.a.b[2].c = 99;
    expect(original.a.b[2].c).toBe(3);
    expect(copy).not.toBe(original);
  });
  it("keeps Date, Map and Set (JSON cannot)", () => {
    const copy = deepClone({ d: new Date(0), m: new Map([[1, 2]]), s: new Set([1]) });
    expect(copy.d).toBeInstanceOf(Date);
    expect(copy.m.get(1)).toBe(2);
    expect(copy.s.has(1)).toBe(true);
  });
  it("handles circular references and primitives", () => {
    const a = { name: "a" };
    a.self = a;
    const copy = deepClone(a);
    expect(copy.self).toBe(copy);
    expect(deepClone(0)).toBe(0);
    expect(deepClone(null)).toBe(null);
  });
});

describe("memoize", () => {
  it("calls the original function once per argument set", () => {
    const fn = vi.fn((x) => x * 2);
    const fast = memoize(fn);
    expect(fast(4)).toBe(8);
    expect(fast(4)).toBe(8);
    expect(fn).toHaveBeenCalledTimes(1);
    fast(5);
    expect(fn).toHaveBeenCalledTimes(2);
  });
  it("caches zero results too", () => {
    const fn = vi.fn(() => 0);
    const fast = memoize(fn);
    fast();
    fast();
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it("throws if not given a function", () => {
    expect(() => memoize(42)).toThrow(TypeError);
  });
});

describe("counter", () => {
  it("increments and decrements", () => {
    const c = counter();
    c.inc();
    c.inc();
    c.dec();
    expect(c.value()).toBe(1);
  });
  it("starts from zero and keeps counters independent", () => {
    const a = counter();
    const b = counter(10);
    a.inc();
    expect(a.value()).toBe(1);
    expect(b.value()).toBe(10);
  });
});
