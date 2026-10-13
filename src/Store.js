// Part 2 - classes. Items look like { name: string, price: number }.

export class Store {
  #items = []; // private field

  /** Static method: create a store from an array. */
  static from(items = []) {
    const store = new this();
    items.forEach((item) => store.add(item));
    return store;
  }

  add(item) {
    if (item === null || typeof item !== "object") {
      throw new TypeError("item must be an object");
    }
    this.#items.push(item);
    return this;
  }

  remove(name) {
    const before = this.#items.length;
    this.#items = this.#items.filter((item) => item.name !== name);
    return this.#items.length < before;
  }

  find(name) {
    return this.#items.find((item) => item.name === name);
  }

  total() {
    return this.#items.reduce((sum, { price = 0 }) => sum + price, 0);
  }

  /** Getter: number of items. */
  get size() {
    return this.#items.length;
  }

  /** Copy of the items (the private array is never exposed). */
  list() {
    return [...this.#items];
  }
}

export class SortedStore extends Store {
  /** Override: items sorted by price, cheapest first. */
  list() {
    return super.list().sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  }
}
