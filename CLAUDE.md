# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development with Turbopack (faster)
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm start

# Linting
npm run lint

# Bundle analysis (uses webpack)
npm run analyze
```

## Architecture Overview

This project uses **Feature-Sliced Design (FSD)** with clear layer boundaries. The codebase is organized as:

```
src/
├── entities/       # Domain concepts (recipe, user, balance, etc.)
├── features/       # Business features that compose entities
├── views/          # Page-level components with responsive variants
├── widgets/        # Reusable UI components
└── shared/         # Cross-cutting utilities (client, hooks, analytics)
```

### Entity Layer Pattern (Critical)

Entities are the core architectural unit. Each entity follows this structure:

```
src/entities/<entity>/
  model/
    api/
      schema/
        <entity>Schema.ts  # Zod schema defining data contract
        enum.ts            # Shared enums
      api.ts              # Network calls + validation (only place)
    use<Something>.ts    # TanStack Query hooks
  index.ts              # Public API entry point (see rules below)
  ui/
    ...components        # No barrel exports - import directly
```

**Key Rules:**
1. **External imports** MUST go through `src/entities/<entity>/index.ts`
2. **Validation** happens ONLY in `model/api/api.ts` using Zod schemas
3. **Do NOT export API functions** from `index.ts` - export hooks instead
4. **Query keys** MUST be exported from `index.ts` (e.g., `*_QUERY_KEY`)
5. **Type naming**: Export domain types (`User`, `Recipe`), not `*Response` types
6. **UI components**: No barrel file - import directly from component path

### Data Flow

```
UI Layer → Entity Hooks → Entity API (validates with Zod) → Backend
```

### Responsive Views

Each view has three variants: `mobile.tsx`, `tablet.tsx`, `desktop.tsx`
Views use a controller pattern for state/logic separation.

## State Management

- **Server State**: TanStack Query (React Query)
- **Client State**: Zustand stores
- **Form State**: Controlled components with hooks

## Key Technologies

- **Next.js 16** with Pages Router (not App Router)
- **TypeScript** with strict mode
- **Tailwind CSS v4** with safe-area and line-clamp plugins
- **Zod** for runtime validation at entity boundaries
- **Radix UI** for accessible primitives
- **Amplitude** for analytics

## Important Patterns

### Adding a New Entity

1. Create structure under `src/entities/<entity>/`
2. Define Zod schema in `model/api/schema/`
3. Implement API functions with validation in `model/api/api.ts`
4. Create TanStack Query hooks in `model/use<Something>.ts`
5. Export public API from `index.ts` (hooks, types, query keys, enums)
6. Do NOT export API functions or create UI barrel files

### Error Handling

- Validation errors logged via `parseWithErrLog` helper
- Component-level error boundaries with `react-error-boundary`

## Notes

- No test framework currently configured
- Turbopack for development, webpack for bundle analysis
- Standalone output configured for Docker deployment
- Korean project (entities README is in Korean)
