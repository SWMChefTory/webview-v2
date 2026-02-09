# Cheftory WebView UI Architecture

> A comprehensive guide to the responsive UI architecture of the Cheftory WebView application.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Responsive Design System](#responsive-design-system)
4. [Controller Pattern](#controller-pattern)
5. [File Organization](#file-organization)
6. [Component Patterns](#component-patterns)
7. [Styling Patterns](#styling-patterns)
8. [State Management in Views](#state-management-in-views)
9. [Best Practices](#best-practices)

---

## Executive Summary

### What is this Architecture?

The Cheftory WebView UI architecture is a **viewport-first responsive design system** built on Feature-Sliced Design principles. It separates UI concerns by device type (mobile, tablet, desktop) while sharing business logic through a controller pattern.

### Why was it Designed this Way?

| Goal | Solution |
|------|----------|
| **Device-optimized UX** | Separate viewport components for each device class |
| **Code maintainability** | Shared controller logic, isolated UI implementations |
| **Performance** | Load only the required viewport component at runtime |
| **Scalability** | Clear patterns make adding new pages predictable |
| **Team collaboration** | Developers can work on different viewports in parallel |

### Key Benefits

- **Clear separation of concerns**: Business logic (controller) vs. UI (viewport components)
- **Optimal UX per device**: Tailored layouts for mobile, tablet, and desktop
- **Reduced code duplication**: Common components shared across viewports
- **Type safety**: TypeScript interfaces ensure consistent props across viewports
- **SSR-safe**: Built-in handling for server-side rendering edge cases

---

## Architecture Overview

### High-Level Diagram

```
                                  +------------------+
                                  |   pages/*.tsx    |
                                  |  (Next.js Pages) |
                                  +--------+---------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                              src/views/{page}/ui/                                  |
|                                                                                    |
|  +-----------------------------------------------------------------------------+  |
|  |                            index.tsx (Entry Point)                          |  |
|  |                                                                             |  |
|  |    Uses ResponsiveSwitcher to render the appropriate viewport component     |  |
|  +-----------------------------------+-----------------------------------------+  |
|                                      |                                            |
|          +---------------------------+---------------------------+                |
|          |                           |                           |                |
|          v                           v                           v                |
|  +---------------+          +----------------+          +-----------------+       |
|  | *.mobile.tsx  |          | *.tablet.tsx   |          | *.desktop.tsx   |       |
|  |   (0-767px)   |          |  (768-1023px)  |          |   (1024px+)     |       |
|  +-------+-------+          +-------+--------+          +--------+--------+       |
|          |                          |                            |                |
|          +---------------+----------+----------------------------+                |
|                          |                                                        |
|                          v                                                        |
|  +-----------------------------------------------------------------------------+  |
|  |                   *.controller.tsx (Shared Business Logic)                   |  |
|  |                                                                             |  |
|  |   - useHomePageController("mobile" | "tablet" | "desktop")                  |  |
|  |   - Returns: HomePageProps (typed interface)                                |  |
|  |   - Contains: hooks, handlers, variant-specific configurations              |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                    |
|  +-----------------------------------------------------------------------------+  |
|  |                      *.common.tsx (Shared UI Components)                     |  |
|  |                                                                             |  |
|  |   - Components used by multiple viewports                                   |  |
|  |   - Accept isTablet/variant props for minor styling adjustments             |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### Data Flow

```
+-------------+     +--------------+     +------------------+     +--------------+
|   Page      | --> | index.tsx    | --> | ResponsiveSwitcher| --> | Viewport     |
| (Next.js)   |     | (View Entry) |     | (Device Check)    |     | Component    |
+-------------+     +--------------+     +------------------+     +------+-------+
                                                                          |
                                                                          v
                                                                  +--------------+
                                                                  | Controller   |
                                                                  | Hook         |
                                                                  +------+-------+
                                                                          |
                            +---------------------------------------------+
                            |                    |                        |
                            v                    v                        v
                    +--------------+    +--------------+    +----------------------+
                    | React Query  |    | Zustand      |    | Event Handlers       |
                    | (Server Data)|    | (Client Data)|    | (User Interactions)  |
                    +--------------+    +--------------+    +----------------------+
```

---

## Responsive Design System

### Breakpoint Definitions

Located in: `src/shared/constants/breakpoints.ts`

| Device | Breakpoint Range | Tailwind Prefix | Media Query |
|--------|-----------------|-----------------|-------------|
| **Mobile** | 0 - 767px | (none) | `(max-width: 767px)` |
| **Tablet** | 768 - 1023px | `md:` | `(min-width: 768px) and (max-width: 1023px)` |
| **Desktop** | 1024px+ | `lg:`, `xl:`, `2xl:` | `(min-width: 1024px)` |

```typescript
// src/shared/constants/breakpoints.ts

export const BREAKPOINTS = {
  mobile: 767,      // Mobile max width
  tablet: 768,      // Tablet min width
  tabletMax: 1023,  // Tablet max width
  desktop: 1024,    // Desktop min width
} as const;

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.tabletMax}px)`,
  tabletUp: `(min-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
} as const;

export type DeviceType = "mobile" | "tablet" | "desktop";
```

### The useMediaQuery Hook

Located in: `src/shared/hooks/useMediaQuery.ts`

```typescript
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
```

### ResponsiveSwitcher Component

Located in: `src/shared/ui/responsive/ResponsiveSwitcher.tsx`

The `ResponsiveSwitcher` is the core component that handles viewport switching.

```typescript
import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import type { ComponentType, ReactNode } from "react";

type ResponsiveComponents<P> = {
  mobile: ComponentType<P>;
  tablet: ComponentType<P>;
  desktop: ComponentType<P>;
};

type ResponsiveSwitcherProps<P> = ResponsiveComponents<P> & {
  props: P;
  fallback?: ReactNode;
};

export function ResponsiveSwitcher<P extends object>({
  mobile: Mobile,
  tablet: Tablet,
  desktop: Desktop,
  props,
  fallback = null,
}: ResponsiveSwitcherProps<P>) {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  // SSR safety
  if (typeof window === "undefined") {
    return <>{fallback}</>;
  }

  if (isMobile) return <Mobile {...props} />;
  if (isDesktop) return <Desktop {...props} />;
  return <Tablet {...props} />;
}
```

### Variants of ResponsiveSwitcher

| Component | Use Case |
|-----------|----------|
| `ResponsiveSwitcher` | Basic viewport switching |
| `ResponsiveSwitcherWithSkeleton` | With loading skeleton support |
| `useResponsiveComponent` | Hook for getting current viewport component |

---

## Controller Pattern

### What Controllers Do

Controllers centralize business logic that would otherwise be duplicated across viewport components:

1. **Data Fetching**: React Query hooks
2. **State Management**: Zustand stores, local state
3. **Event Handlers**: Click, submit, navigation handlers
4. **Translations**: i18n integration
5. **Variant Configuration**: Device-specific values (sizes, classes)

### Props Interface Pattern

Every controller defines a typed interface for its viewport components:

```typescript
// src/views/home/ui/HomePage.controller.tsx

export type HomePageVariant = "mobile" | "tablet" | "desktop";

export interface HomePageProps {
  logo: React.ReactNode;
  searchBar: React.ReactNode | null;
  header: {
    balance: React.ReactNode;
    profileButton: React.ReactNode;
  };
  sections: {
    challengeBanner: React.ReactNode;
    categorySection: React.ReactNode;
    myRecipes: React.ReactNode;
    popularRecipes: React.ReactNode;
    popularShorts: React.ReactNode;
  };
  floatingButton: React.ReactNode;
  renderToast: (viewportClassName: string) => React.ReactNode;
}
```

### Controller Hook Implementation

```typescript
export function useHomePageController(variant: HomePageVariant): HomePageProps {
  const router = useRouter();
  const { t } = useHomeTranslation();
  const lang = useLangcode();

  // Safe area for native WebView
  useSafeArea({
    top: { color: "transparent", isExists: true },
    bottom: { color: "#FFFFFF", isExists: false },
  });

  // Variant-specific configuration
  const logoClassName = {
    mobile: "h-[20px] w-auto pl-2",
    tablet: "h-[24px] md:h-[28px] w-auto",
    desktop: "h-[32px] xl:h-[36px] w-auto",
  }[variant];

  const searchBarClassName = {
    mobile: "flex flex-row items-center px-4 w-full h-[36px] ...",
    tablet: "flex flex-row items-center px-5 w-full max-w-[600px] ...",
    desktop: "flex flex-row items-center px-6 w-full max-w-[800px] ...",
  }[variant];

  return {
    logo: <img src={logoSrc} alt="logo" className={logoClassName} />,
    searchBar: /* ... */,
    header: { /* ... */ },
    sections: { /* ... */ },
    floatingButton: <FloatingButton />,
    renderToast: (viewportClassName) => (/* ... */),
  };
}
```

### How Viewport Components Receive Props

```typescript
// src/views/home/ui/HomePage.mobile.tsx

import { useHomePageController, HomePageProps } from "./HomePage.controller";

export function HomePageMobile() {
  const props = useHomePageController("mobile");
  return <HomePageMobileLayout {...props} />;
}

export function HomePageMobileLayout({
  logo,
  searchBar,
  header,
  sections,
  floatingButton,
  renderToast,
}: HomePageProps) {
  return (
    <div className="min-h-screen w-screen w-full overflow-hidden">
      <Header
        leftContent={logo}
        rightContent={
          <div className="flex flex-row items-center gap-2">
            {header.balance}
            {header.profileButton}
          </div>
        }
      />
      {searchBar && <div className="pt-2 px-2">{searchBar}</div>}
      {sections.challengeBanner}
      {sections.categorySection}
      {sections.myRecipes}
      {sections.popularRecipes}
      {sections.popularShorts}
      {floatingButton}
      {renderToast("fixed right-3 top-2 z-1000 w-[300px]")}
    </div>
  );
}
```

---

## File Organization

### Directory Structure

```
src/
├── views/
│   └── {page-name}/
│       ├── ui/
│       │   ├── index.tsx              # Entry point with ResponsiveSwitcher
│       │   ├── {Page}.controller.tsx  # Shared business logic
│       │   ├── {Page}.mobile.tsx      # Mobile viewport (0-767px)
│       │   ├── {Page}.tablet.tsx      # Tablet viewport (768-1023px)
│       │   ├── {Page}.desktop.tsx     # Desktop viewport (1024px+)
│       │   ├── {Page}.common.tsx      # Shared UI components
│       │   └── {component}.tsx        # Page-specific components
│       ├── hooks/
│       │   └── use{Page}Translation.ts
│       └── entities/                   # Page-specific entities (if needed)
│
├── shared/
│   ├── ui/
│   │   ├── responsive/
│   │   │   ├── index.ts
│   │   │   └── ResponsiveSwitcher.tsx
│   │   ├── header/
│   │   ├── card/
│   │   └── ...
│   ├── hooks/
│   │   └── useMediaQuery.ts
│   └── constants/
│       └── breakpoints.ts
│
└── entities/                           # Shared business entities
    └── {entity}/
        ├── api/
        ├── model/
        └── ui/
```

### Naming Conventions

| File Type | Pattern | Example |
|-----------|---------|---------|
| Entry Point | `index.tsx` | `src/views/home/ui/index.tsx` |
| Controller | `{Page}.controller.tsx` | `HomePage.controller.tsx` |
| Mobile Viewport | `{Page}.mobile.tsx` | `HomePage.mobile.tsx` |
| Tablet Viewport | `{Page}.tablet.tsx` | `HomePage.tablet.tsx` |
| Desktop Viewport | `{Page}.desktop.tsx` | `HomePage.desktop.tsx` |
| Common Components | `{Page}.common.tsx` | `popularRecipes.common.tsx` |
| Page-specific Component | `{component}.tsx` | `floatingButton.tsx` |

### Index File Pattern

```typescript
// src/views/home/ui/index.tsx

import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import { HomePageMobile } from "./HomePage.mobile";
import { HomePageTablet } from "./HomePage.tablet";
import { HomePageDesktop } from "./HomePage.desktop";

function HomePage() {
  return (
    <ResponsiveSwitcher
      mobile={HomePageMobile}
      tablet={HomePageTablet}
      desktop={HomePageDesktop}
      props={{}}
    />
  );
}

export default HomePage;
```

---

## Component Patterns

### Common Components (*.common.tsx)

Common components are shared across multiple viewports with minor adjustments via props.

```typescript
// src/views/home/ui/popularRecipes.common.tsx

/**
 * Recipe card used by both mobile and tablet
 * @param isTablet - Adjusts sizing for tablet layout
 */
export function RecipeCardReady({
  recipe,
  isTablet = false,
}: {
  recipe: PopularSummaryRecipeDto;
  isTablet?: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <div
        className={`flex relative flex-col ${
          isTablet 
            ? "w-[260px] lg:w-full h-full group" 
            : "w-[320px]"
        }`}
      >
        <div className={`overflow-hidden relative ${
          isTablet 
            ? "rounded-lg h-[146px] lg:h-auto lg:aspect-video" 
            : "rounded-md h-[180px]"
        }`}>
          <img
            src={recipe.videoThumbnailUrl}
            className="block w-full h-full object-cover"
          />
        </div>
        <div className={`font-semibold ${
          isTablet ? "text-sm lg:text-lg" : "text-lg"
        }`}>
          {recipe.recipeTitle}
        </div>
      </div>
    </div>
  );
}
```

### Shared UI Components

Located in `src/shared/ui/`, these are generic components used across the entire application.

```typescript
// src/shared/ui/card/ViewMoreCard.tsx

interface ViewMoreCardProps {
  href: string;
  label?: string;
}

export function ViewMoreCard({ href, label = "See All" }: ViewMoreCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 
                 border-2 border-dashed border-gray-200 hover:border-orange-300 
                 hover:bg-orange-50 transition-all group aspect-[3/4]"
    >
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
        {/* Arrow icon */}
      </div>
      <span className="font-bold text-gray-500 group-hover:text-orange-600">
        {label}
      </span>
    </Link>
  );
}
```

### Feature-Specific Components

Components that belong to a specific page but aren't viewport-specific:

```typescript
// src/views/home/ui/floatingButton.tsx

export function FloatingButton() {
  // Implementation specific to home page
  // Used by all viewports (mobile, tablet, desktop)
}
```

---

## Styling Patterns

### Tailwind CSS Usage

The project uses Tailwind CSS 4 with the following conventions:

#### Responsive Prefixes

```typescript
// Mobile-first approach
className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl"
//          ^Mobile   ^Tablet   ^Desktop  ^Large   ^Extra Large
```

#### Common Breakpoint Patterns

```typescript
// Padding that scales with viewport
className="px-4 md:px-6 lg:px-8 xl:px-10"

// Grid that adapts to screen size
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"

// Max-width containers
className="max-w-[1024px] lg:max-w-[1280px] xl:max-w-[1600px]"
```

### Standard Max-Width Values

| Viewport | Max-Width | Usage |
|----------|-----------|-------|
| Mobile | `100%` (full width) | Natural mobile constraints |
| Tablet | `max-w-[1024px]` | Constrained container |
| Desktop | `max-w-[1600px]` | Wide container |
| Search Bar | `max-w-[600px]` / `max-w-[800px]` / `max-w-[1200px]` | Progressive widths |

### Standard Spacing Values

```typescript
// Vertical spacing between sections
const sectionSpacing = {
  mobile: "mt-4",          // 16px
  tablet: "mt-8 md:mt-12", // 32px - 48px
  desktop: "mt-16 xl:mt-24", // 64px - 96px
};

// Horizontal padding
const containerPadding = {
  mobile: "px-2 md:px-4",
  tablet: "px-6",
  desktop: "px-8 xl:px-10",
};

// Gap in flex/grid layouts
const itemGap = {
  mobile: "gap-2",
  tablet: "gap-3 md:gap-4",
  desktop: "gap-4 lg:gap-5",
};
```

### Viewport-Specific Class Patterns

```typescript
// In controller, variant-specific classes
const containerClass = {
  mobile: "min-h-screen w-screen overflow-hidden",
  tablet: "min-h-screen w-full bg-white",
  desktop: "min-h-screen w-full bg-white",
}[variant];

const headerGap = {
  mobile: "gap-2",
  tablet: "gap-3",
  desktop: "gap-4",
}[variant];
```

---

## State Management in Views

### React Query for Server State

```typescript
// In controller hook
import { useSuspenseQuery } from "@tanstack/react-query";

export function useSearchResultsController(keyword: string) {
  const {
    data: searchResults,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFetchRecipesSearched({ query: keyword });

  // Return as part of controller props
  return {
    searchResults,
    totalElements,
    isFetchingNextPage,
    // ...
  };
}
```

### Zustand for Client State

```typescript
// src/stores/useRecipeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecipeStore {
  selectedRecipeId: string | null;
  setSelectedRecipe: (id: string) => void;
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set) => ({
      selectedRecipeId: null,
      setSelectedRecipe: (id) => set({ selectedRecipeId: id }),
    }),
    { name: "recipe-store" }
  )
);
```

### Local State Patterns

```typescript
// In viewport component for UI-only state
function HomePageMobileLayout(props: HomePageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Local state stays in viewport, business logic in controller
  return (
    <div>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}>Menu</button>
      {isMenuOpen && <Menu />}
    </div>
  );
}
```

---

## Best Practices

### Do's

| Practice | Reason |
|----------|--------|
| Use `ResponsiveSwitcher` for page-level viewport switching | Consistent pattern, cleaner code |
| Keep business logic in controllers | Single source of truth |
| Use typed `Props` interfaces | Type safety across viewports |
| Share common UI via `*.common.tsx` | Reduce duplication |
| Use `isTablet` prop for minor variations | Avoid creating unnecessary viewport files |
| Check `typeof window === "undefined"` for SSR safety | Prevent hydration mismatches |

### Don'ts

| Anti-Pattern | Better Approach |
|--------------|-----------------|
| Duplicating data fetching in each viewport | Use controller hook |
| Creating separate mobile/tablet/desktop for tiny differences | Use conditional classes or `isTablet` prop |
| Hardcoding breakpoint values | Use `BREAKPOINTS` and `MEDIA_QUERIES` constants |
| Using `matchMedia` directly in components | Use `useMediaQuery` hook |
| Mixing controller logic into viewport components | Keep viewports as pure UI |

### Adding a New Page Checklist

```markdown
1. [ ] Create directory: `src/views/{page-name}/ui/`

2. [ ] Create entry point: `index.tsx`
   - Import `ResponsiveSwitcher`
   - Import all three viewport components
   - Export default page component

3. [ ] Create controller: `{Page}.controller.tsx`
   - Define `{Page}Variant` type
   - Define `{Page}Props` interface
   - Implement `use{Page}Controller` hook
   - Add variant-specific configurations

4. [ ] Create viewport components:
   - `{Page}.mobile.tsx` - Mobile layout (0-767px)
   - `{Page}.tablet.tsx` - Tablet layout (768-1023px)
   - `{Page}.desktop.tsx` - Desktop layout (1024px+)

5. [ ] Create common components (if needed):
   - `{Page}.common.tsx` - Shared UI components

6. [ ] Create translation hook: `hooks/use{Page}Translation.ts`

7. [ ] Create Next.js page: `pages/{route}.tsx`
   - Import view component from `src/views/{page-name}/ui`
```

### Adding a New Viewport Component

```markdown
1. [ ] Define the component function with proper naming:
   - `{Page}Mobile`, `{Page}Tablet`, or `{Page}Desktop`

2. [ ] Create a separate layout component:
   - `{Page}MobileLayout`, `{Page}TabletLayout`, or `{Page}DesktopLayout`
   - Accept `{Page}Props` as props

3. [ ] In the main component:
   - Call `use{Page}Controller("{variant}")` to get props
   - Pass props to layout component

4. [ ] In the layout component:
   - Destructure all props
   - Focus only on layout and styling
   - No business logic

5. [ ] Export both components:
   - Main component for ResponsiveSwitcher
   - Layout component for testing and storybook
```

### Template for New Viewport Component

```typescript
// src/views/{page}/ui/{Page}.mobile.tsx

import { use{Page}Controller, {Page}Props } from "./{Page}.controller";

export function {Page}Mobile() {
  const props = use{Page}Controller("mobile");
  return <{Page}MobileLayout {...props} />;
}

export function {Page}MobileLayout({
  // Destructure props
}: {Page}Props) {
  return (
    <div className="min-h-screen">
      {/* Mobile-specific layout */}
    </div>
  );
}
```

---

## Quick Reference

### Import Paths

```typescript
// Responsive utilities
import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { BREAKPOINTS, MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";

// Controller pattern
import { use{Page}Controller, {Page}Props } from "./{Page}.controller";

// Common components
import { ComponentName } from "./{page}.common";
```

### Type Definitions

```typescript
// Variant type (always the same pattern)
export type {Page}Variant = "mobile" | "tablet" | "desktop";

// Props interface (structure varies by page)
export interface {Page}Props {
  // Common props...
}
```

### ResponsiveSwitcher Usage

```typescript
// Basic usage
<ResponsiveSwitcher
  mobile={MobileComponent}
  tablet={TabletComponent}
  desktop={DesktopComponent}
  props={{ id: "123" }}
/>

// With fallback for SSR
<ResponsiveSwitcher
  mobile={MobileComponent}
  tablet={TabletComponent}
  desktop={DesktopComponent}
  props={{}}
  fallback={<LoadingSkeleton />}
/>
```

---

## Conclusion

This architecture provides a scalable, maintainable approach to building responsive UIs in the Cheftory WebView application. By separating concerns between controllers and viewport components, the codebase remains clean and easy to navigate while delivering optimal user experiences across all device types.

For questions or clarifications, refer to the example implementations in `src/views/home/ui/` which demonstrate all patterns described in this document.
