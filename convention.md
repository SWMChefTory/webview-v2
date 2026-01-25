# Code Convention

We are currently defining our code conventions. Additional rules and guidelines may be added as they are identified.


---

## 1. Use arrow functions instead of function declarations

Arrow functions provide a consistent style with modern TypeScript codebases.
Please prefer arrow functions for utility functions and type-related helpers.

In addition, arrow functions allow explicit function types to be assigned to variables, which makes it easier to extract and reuse function type definitions later. While we are not introducing shared function types yet, this approach helps prevent future duplication and keeps the codebase flexible and extensible.

Before (function declaration)

```ts
function isCuisineType(value: string): value is CuisineType {
  return Object.values(CuisineType).includes(value as CuisineType);
}
```

After (arrow function)

```ts
const isCuisineType = (value: string): value is CuisineType =>
  Object.values(CuisineType).includes(value as CuisineType);
```
  
  
  
  
---

## 2. Prefer `type` over `interface` unless declaration merging is required

By default, use `type` instead of `interface`.
`interface` should be used **only** when declaration merging is explicitly required.

This mainly applies to extending or augmenting existing types from external libraries.

---

### When `interface` is acceptable

Use `interface` **only** to leverage declaration merging, such as when augmenting library or global types.

---

### Example: Augmenting a library type

```ts
// Extending a library type via declaration merging
interface Window {
  analytics?: {
    track(event: string): void;
  };
}
```

Another common example is augmenting module types:

```ts
// Extending a third-party module's types
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}
```

---

### Not recommended

Do **not** use `interface` for general object shapes or internal domain models.

```ts
// Not recommended
interface User {
  id: string;
  name: string;
}
```

Use `type` instead:

```ts
type User = {
  id: string;
  name: string;
};
```



