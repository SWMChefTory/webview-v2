import client from "@/src/shared/client/main/client";
import { z } from "zod";

const AutoCompleteDataSchema = z.object({
  autocompletes: z.array(
    z.object({
      autocomplete: z.string(),
    })
  ),
});

export type AutoCompletesData = z.infer<typeof AutoCompleteDataSchema>;

export async function fetchAutoCompleteData(searchQuery: string) {
  const response = await client.get(`/recipes/search/autocomplete`, {
    params: { query: encodeURIComponent(searchQuery), scope: "RECIPE" },
  });
  return AutoCompleteDataSchema.parse(response.data);
}
