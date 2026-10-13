# js-core-serikkan

Lab 4 (IT1-2310): pure JavaScript - functions, closures, classes, unit tests.

## Structure

- `src/functions.js` - `unique`, `groupBy`, `chunk`, `deepClone`, `memoize`, `counter`
- `src/Store.js` - `Store` (private `#items`, getter `size`, static `from`) and `SortedStore` (overrides `list()` using `super`)
- `tests/` - Vitest unit tests (25 tests, edge cases: empty array, wrong type, zero)

## How to run the tests

```bash
npm i
npm test
```

## Closures in my code


I used closures in two places: `counter()` and `memoize(fn)`. In `counter()` the variable `count` is created inside the function, so it is not global and nobody can change it from outside. The functions `inc`, `dec` and `value` are returned from `counter()`, but they still remember `count` even after `counter()` has finished. This works because a function in JavaScript keeps a link to the variables from the place where it was created. In `memoize(fn)` the same thing happens with the `cache` Map: the returned function remembers it and checks it before calling `fn` again. Because of closures every counter has its own `count` and every memoized function has its own `cache`, so they do not mix.

## Tests passing

![tests](./screenshots/tests.png)

