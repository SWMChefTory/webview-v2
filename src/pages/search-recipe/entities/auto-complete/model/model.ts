import { useQuery } from "@tanstack/react-query";
import {
  fecthAutoCompleteData,
  AutoCompletesData,
} from "@/src/pages/search-recipe/entities/auto-complete/api/api";

const AUTO_COMPLETE_DATA_QUERY_KEY = "autoCompleteData";

class AutoComplete {
  public autocomplete: string;
  constructor(autocomplete: string) {
    this.autocomplete = autocomplete;
  }
}

class AutoCompletes {
  public autocompletes!: AutoComplete[];
  constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }
  static create(data: AutoCompletesData) {
    return new AutoCompletes(data);
  }

  static createEmpty() {
    return new AutoCompletes({ autocompletes: [] });
  }
}

export function useFetchAutoCompleteData(searchQuery: string) {
  const { data } = useQuery({
    queryKey: [AUTO_COMPLETE_DATA_QUERY_KEY, searchQuery],
    queryFn: () => fecthAutoCompleteData(searchQuery),
    select: (data) => AutoCompletes.create(data),
    initialData: AutoCompletes.createEmpty(),
  });

  return {
    autoCompleteData: data,
  };
}
