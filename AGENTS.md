# AGENTS.md - Cheftory WebView V2

## Project Overview
Next.js 16 webview application for Cheftory recipe platform. Uses Pages Router with Turbopack, React 19, TanStack Query, Zustand, and Tailwind CSS 4. Supports both React Native WebView and standalone web browser environments.

---

## Build / Lint / Test Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack (localhost:3000) |
| `npm run build` | Production build with Turbopack |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### No Test Framework Configured
This project does not have Jest, Vitest, or Playwright configured. If tests are needed, install a test runner first.

### Docker
```bash
docker build -t cheftory-webview:latest .
docker compose -f docker-compose.dev.yml up -d
```

---

## Code Style Guidelines

### Import Ordering
1. External packages (react, next, libraries)
2. Internal absolute imports (`@/src/...`, `@/components/...`, `@/lib/...`)
3. Relative imports (`./`, `../`)

```typescript
// External
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";

// Internal absolute
import client from "@/src/shared/client/main/client";
import { cn } from "@/lib/utils";

// Relative
import { HomePageMobile } from "./HomePage.mobile";
```

### Path Aliases
- `@/*` maps to project root (configured in tsconfig.json)
- Use `@/src/...` for source files
- Use `@/components/...` for UI components
- Use `@/lib/...` for utilities

### TypeScript Strict Mode
- `strict: true` enabled
- Avoid `as any`, `@ts-ignore`, `@ts-expect-error`
- Use Zod for runtime validation of API responses

---

## Naming Conventions

### Files
| Type | Convention | Example |
|------|------------|---------|
| Pages | `kebab-case` | `search-recipe.tsx` |
| Components | `camelCase.tsx` or `PascalCase.tsx` | `floatingButton.tsx`, `HomePage.mobile.tsx` |
| Hooks | `use*.ts` | `useMediaQuery.ts`, `useHomeTranslation.ts` |
| Stores | `use*Store.ts` | `useRecipeStore.ts` |
| Schemas | `*Schema.ts` | `recipeSchema.ts` |
| API files | `api.ts` | `src/entities/recipe/api/api.ts` |

### Device-specific files
- `.mobile.tsx` - Mobile version (0-767px)
- `.tablet.tsx` - Tablet/Desktop version (768px+)
- `.common.tsx` - Shared logic/components

### Components & Functions
- React components: `PascalCase`
- Hooks: `useCamelCase`
- Functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`

---

## Project Architecture (Feature-Sliced Design)

```
src/
├── shared/          # Shared utilities, hooks, schemas, client
│   ├── client/      # API client (axios), native bridge
│   ├── hooks/       # Reusable hooks
│   ├── schema/      # Zod schemas
│   ├── ui/          # Shared UI components
│   └── constants/   # Constants (breakpoints, etc.)
├── entities/        # Business entities with API + model + UI
│   └── {entity}/
│       ├── api/     # API functions
│       ├── model/   # React Query hooks, domain classes
│       └── ui/      # Entity-specific UI
├── features/        # Feature modules
├── widgets/         # Composite components
└── views/           # Page-level components
    └── {page}/
        ├── ui/      # Page components (index.tsx, .mobile.tsx, .tablet.tsx)
        ├── hooks/   # Page-specific hooks
        └── entities/# Page-specific entities
```

---

## State Management

### Zustand (Client State)
```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  value: string;
}

const useMyStore = create<StoreState>()(
  persist(
    (set, get) => ({
      value: "",
      setValue: (v: string) => set({ value: v }),
    }),
    { name: "my-store" }
  )
);
```

### TanStack Query (Server State)
```typescript
import { useSuspenseQuery } from "@tanstack/react-query";

export const useFetchData = (id: string) => {
  const { data } = useSuspenseQuery({
    queryKey: ["key", id],
    queryFn: () => fetchData(id),
    select: (res) => DomainClass.create(res),
  });
  return { data };
};
```

---

## API & Data Fetching Patterns

### Axios Client with Interceptors
- Auto camelCase/snakeCase conversion
- Token refresh handling (Native + Web)
- Located: `src/shared/client/main/client.ts`

### Zod Schema Validation
```typescript
import { z } from "zod";

const ResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const fetchData = async (id: string) => {
  const response = await client.get(`/endpoint/${id}`);
  return ResponseSchema.parse(response.data);
};
```

### Domain Model Pattern
Transform API responses into domain classes with static factory methods:
```typescript
class DomainModel {
  private constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }
  static create(data: ResponseType) {
    return new DomainModel({ ...data });
  }
}
```

---

## Responsive Design

### Breakpoints
- Mobile: 0-767px
- Tablet: 768-1023px
- Desktop: 1024px+

### Hook Usage
```typescript
import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";

const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
```

### Component Pattern
```typescript
function Page() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  return isMobile ? <PageMobile /> : <PageTablet />;
}
```

---

## UI Components

### shadcn/ui Components
Located in `components/ui/`. Use `cn()` utility for class merging:
```typescript
import { cn } from "@/lib/utils";
<div className={cn("base-class", conditional && "conditional-class")} />
```

### Radix UI Primitives
Used directly for dialogs, toasts, popovers, etc.

---

## i18n

Uses `next-i18next`. Translation hooks per feature:
```typescript
import { useHomeTranslation } from "@/src/views/home/hooks/useHomeTranslation";
const { t } = useHomeTranslation();
```

---

## Error Handling

### React Error Boundary
```typescript
import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary fallbackRender={({ resetErrorBoundary }) => (
  <FallbackComponent onRetry={resetErrorBoundary} />
)}>
  <Component />
</ErrorBoundary>
```

### API Errors
Axios interceptors handle AUTH errors with automatic token refresh.

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `next@16` | Framework (Pages Router + Turbopack) |
| `react@19` | UI Library |
| `@tanstack/react-query` | Server state |
| `zustand` | Client state |
| `zod` | Schema validation |
| `axios` | HTTP client |
| `tailwindcss@4` | Styling |
| `motion` | Animations |
| `@radix-ui/*` | UI primitives |
| `next-i18next` | Internationalization |

---

## Common Gotchas

1. **SSR Safety**: Always check `typeof window !== "undefined"` before accessing browser APIs
2. **Native Bridge**: Code runs in React Native WebView - check `window.ReactNativeWebView` for environment
3. **Turbopack**: Using `--turbopack` flag for dev/build - some Next.js plugins may not be compatible
4. **TypeScript Build Errors**: Currently `ignoreBuildErrors: true` in next.config.ts (temporary)
