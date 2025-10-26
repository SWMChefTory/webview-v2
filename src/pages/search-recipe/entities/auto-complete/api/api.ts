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

export async function fecthAutoCompleteData(searchQuery: string) {
  console.log("searchQuery!!", searchQuery);
  const response = await client.get(
    `/recipes/search/autocomplete?query=${encodeURIComponent(searchQuery)}`
  );
  console.log(`/recipes/search/autocomplete?query=${encodeURIComponent(searchQuery)}`)
  console.log("response!!", JSON.stringify(response.data, null, 2));
  return AutoCompleteDataSchema.parse(response.data);
}
