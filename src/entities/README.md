# entities layer

FSD(Feature-Sliced Design) 기준에서 `entities`는 "도메인 개념"을 표현합니다.
UI(feature/view/widget)는 `entities`가 제공하는 훅/타입/enum/쿼리키를 사용하고, 네트워크 호출 및 외부 데이터 검증은 `entities` 내부의 `api`에서만 수행합니다.

## Recommended structure (generic)

```
src/entities/<entity>/
  model/
    api/
      schema/
        <entity>Schema.ts
        enum.ts
      api.ts
    use<Something>.ts
  index.ts
  ui/
    ... (no barrel rule)
```

Top-down rules:
- External imports go through `src/entities/<entity>/index.ts` only.
- `api.ts` is the only place that validates external data (`Schema.parse`).
- `model` exposes hooks and query keys.
- `ui` is reusable, but we do not enforce a barrel for bundle safety.

---

## Public API (`index.ts`)

`index.ts` is the single Public API entry for each entity.

What to export:
- Runtime: hooks, constants, query keys, enums
- Types: `export type { ... }`

Naming rule (public types):
- Do not expose types ending with `*Response` from entity `index.ts`.
- Prefer domain names (e.g. `User`, `Recipe`) or `*Dto` / `Paginated*`.
- If an internal type uses `*Response`, re-export it with an alias:
  - `export type { UserResponse as User } from "..."`

API exposure rule:
- Do NOT export `api.ts` functions from entity `index.ts`.
- The entity Public API should expose hooks (model layer) as the primary interface.
- Reason: keeping API functions internal prevents bypassing validation/selection conventions and reduces coupling to endpoints.

Why no `*.d.ts` as Public API:
- In TS, `*.d.ts` is typically used as generated output or ambient declarations.
- Using it as a hand-written Public API tends to cause friction with tooling, pathing, and refactors.
- A single `index.ts` entry is easier to maintain.

Query key rule:
- Query keys MUST be exported from `index.ts` (example: `*_QUERY_KEY as const`).
- Reason: feature/view/widget may need invalidate/refetch with the same key.

---

## model

`model` owns the domain-facing logic.

Responsibilities:
- Provide hooks for reading/writing entity data (TanStack Query recommended)
- Define query keys (`*_QUERY_KEY`) used by hooks

Allowed dependencies:
- Can depend on `model/api`

---

## model/api

`model/api` is the external boundary of the entity.

Responsibilities:
- Perform network calls
- Validate external data with Zod schemas
- Return validated data types

Internal modules:
- `schema/*`: Zod schemas and enums
  - Schema file defines runtime schema and its inferred type (`z.infer<typeof Schema>`)
  - Enum file defines shared enums used by schema/api/model
- `api.ts`: calls backend and validates with `Schema.parse` (or `parseWithErrLog`)

Type export rule:
- Types exposed from `index.ts` SHOULD come from `schema/*` files where they are defined as `z.infer<typeof SomeSchema>`.
- Avoid defining DTO types ad-hoc in `index.ts`.
  - Reason: `index.ts` is the Public API surface; the source of truth for external data shape is the Zod schema.
  - Pattern: `schema/*.ts` exports both `SomeSchema` (runtime) and `SomeDto` (type), then `index.ts` re-exports `SomeDto` via `export type { ... }`.

Why validation lives here:
- If validation is scattered across layers (UI parsing, feature parsing), it creates duplication and inconsistent guarantees.
- Putting all validation in `api.ts` makes the "data contract" explicit and centralized.

---

## ui (no barrel rule)

`ui` contains reusable components for the entity.

Rule:
- We do NOT enforce `ui/index.ts` barrel exports.

Reason:
- UI barrels can encourage wide imports that accidentally pull in more modules than needed.
- Keeping explicit import paths helps bundle hygiene and avoids import surface creep.

---

## Exception: shared schema module

Some schemas/utilities are shared across multiple entities.
In that case, a dedicated module like `src/entities/schema` may exist.

Rules still apply:
- `src/entities/schema/index.ts` is its Public API
- Types are exposed via `export type { ... }` in that `index.ts`
- Entity `model/api/api.ts` imports shared schemas and performs validation

---

## Best practice example (recipe)

Structure:

```
src/entities/recipe/
  model/
    api/
      schema/
        recipeSchema.ts
        enum.ts
      api.ts
    useRecipe.ts
  index.ts
  ui/
    ...
```

`model/api/schema/recipeSchema.ts`

```ts
import { z } from "zod";

export const RecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
});

export type RecipeDto = z.infer<typeof RecipeSchema>;
```

`model/api/api.ts`

```ts
import client from "@/src/shared/client/main/client";
import { RecipeSchema, type RecipeDto } from "./schema/recipeSchema";

export async function fetchRecipe(id: string): Promise<RecipeDto> {
  const res = await client.get(`/recipe/${id}`);
  return RecipeSchema.parse(res.data);
}
```

`model/useRecipe.ts`

```ts
import { useSuspenseQuery } from "@tanstack/react-query";

import { fetchRecipe } from "./api/api";

export const RECIPE_QUERY_KEY = ["recipe"] as const;

export function useRecipe(id: string) {
  return useSuspenseQuery({
    queryKey: [...RECIPE_QUERY_KEY, id],
    queryFn: () => fetchRecipe(id),
  });
}
```

`index.ts`

```ts
export { useRecipe, RECIPE_QUERY_KEY } from "./model/useRecipe";
export type { RecipeDto } from "./model/api/schema/recipeSchema";
export { RecipeSort } from "./model/api/schema/enum";
```

UI import example:

```ts
import RecipeCard from "@/src/entities/recipe/ui/RecipeCard";
```
