# Code Convention

We are currently defining our code conventions. Additional rules and guidelines may be added as they are identified.

# Project Specific

---

## Use arrow functions instead of function declarations

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

## Prefer `type` over `interface` unless declaration merging is required

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

### Use IntersectionObserver for infinite scroll

For infinite scroll implementations, prefer `IntersectionObserver` API over manual `onScroll` event handling.

`IntersectionObserver` provides better performance, accuracy, and maintainability for detecting when elements enter the viewport.

### Recommended Pattern

```tsx
const observerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const target = observerRef.current;
  if (!target) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    {
      threshold: 0.1,
      rootMargin: "200px", // Preload before reaching the end
    }
  );

  observer.observe(target);

  return () => {
    observer.disconnect();
  };
}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

// In JSX
<div ref={observerRef} />
```

### Why IntersectionObserver?

- **Performance**: Runs asynchronously without blocking the main thread. `onScroll` fires on every scroll event and requires manual throttling/debouncing.
- **Accuracy**: Detects element visibility reliably. `rootMargin` allows preloading before the user reaches the end. Manual scroll calculations (`scrollLeft + clientWidth >= scrollWidth`) can be imprecise.
- **Maintainability**: Integrates cleanly with React's `useEffect` cleanup pattern. No need for manual ref state management or reset logic.
- **Browser Support**: Supported in all modern browsers (IE11+ with polyfill).

### Not Recommended

Avoid manual `onScroll` event handling for infinite scroll:

```tsx
// Not recommended
onScroll={(e) => {
  const el = e.currentTarget;
  const reachedEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
  
  if (reachedEnd) {
    if (!calledRef.current) {
      calledRef.current = true;
      onReachEnd?.();
    }
  } else {
    calledRef.current = false;
  }
}}
```

**Drawbacks:**
- Fires on every scroll event (performance overhead)
- Requires manual state management with refs
- Manual scroll position calculations are error-prone
- Needs additional throttling/debouncing logic

---

## Use react-modal-sheet for modals

For modal implementations, use the `react-modal-sheet` library.

This library provides a mobile-friendly bottom sheet component with smooth animations and gesture support.

**Reference**: https://www.npmjs.com/package/react-modal-sheet

### Basic Usage

```tsx
import Sheet from 'react-modal-sheet';

const MyModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          {/* Your modal content */}
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
};
```

### Why react-modal-sheet?

- **Mobile-optimized**: Native-like bottom sheet behavior with gesture support
- **Accessibility**: Built-in ARIA attributes and focus management
- **Customizable**: Flexible styling and animation options
- **Lightweight**: Minimal bundle size impact

Refer to the [official documentation](https://www.npmjs.com/package/react-modal-sheet) for advanced usage, customization options, and API reference.

---

# External Conventions (Vercel / React / Next.js)

We follow external best practices by default, unless this document explicitly overrides them.

Priority Order

This Code Convention document (project rules)
Vercel / Next.js / React official guidance
Common community conventions
Agent Requirements

When an agent generates or edits code, it MUST:

Follow the priority order above
Preserve existing patterns in the codebase unless they conflict with this document
Avoid adding new dependencies unless explicitly requested
Keep changes minimal and scoped to the request
Next.js / React (Vercel guidance)

If the project uses Next.js App Router:

Default to Server Components; use "use client" only when required (state, effects, browser APIs, event handlers, client-only libs)
Prefer server-side data fetching for SSG/SSR; avoid client fetching unless the data is user-specific or interaction-driven
Keep client components as small “interactive islands”; pass serializable props from server components
If the project uses Next.js Pages Router:

Do not apply “Server/Client Component” rules (RSC doesn’t exist there)
Use getStaticProps / getServerSideProps / API Routes for server-only work; keep UI components isomorphic
TypeScript Style Alignment

Prefer type over interface unless declaration merging is required (see rule #2)
Prefer arrow functions over function declarations for utilities and type guards (see rule #1)