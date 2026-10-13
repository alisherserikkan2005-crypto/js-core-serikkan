import { describe, it, expect } from "vitest";
import { Store, SortedStore } from "../src/Store.js";

describe("Store", () => {
  it("adds and finds items", () => {
    const s = new Store().add({ name: "ticket", price: 50 });
    expect(s.find("ticket")).toEqual({ name: "ticket", price: 50 });
    expect(s.size).toBe(1);
  });
  it("removes items and reports the result", () => {
    const s = Store.from([{ name: "a", price: 1 }]);
    expect(s.remove("a")).toBe(true);
    expect(s.remove("a")).toBe(false);
  });
  it("total is 0 for an empty store", () => {
    expect(new Store().total()).toBe(0);
  });
  it("total sums prices, zero price included", () => {
    const s = Store.from([{ name: "a", price: 0 }, { name: "b", price: 7 }]);
    expect(s.total()).toBe(7);
  });
  it("throws when adding a wrong type", () => {
    expect(() => new Store().add("nope")).toThrow(TypeError);
  });
  it("keeps the private array safe", () => {
    const s = Store.from([{ name: "a", price: 1 }]);
    s.list().push({ name: "hack", price: 1 });
    expect(s.size).toBe(1);
  });
});

describe("SortedStore", () => {
  it("is a Store and uses static from()", () => {
    const s = SortedStore.from([]);
    expect(s).toBeInstanceOf(SortedStore);
    expect(s).toBeInstanceOf(Store);
  });
  it("overrides list(): sorted by price, via super", () => {
    const s = SortedStore.from([{ name: "b", price: 30 }, { name: "a", price: 10 }]);
    expect(s.list().map((i) => i.name)).toEqual(["a", "b"]);
  });
});
