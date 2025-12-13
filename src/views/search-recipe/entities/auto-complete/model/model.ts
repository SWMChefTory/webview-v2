import { useQuery } from "@tanstack/react-query";
import {
  fetchAutoCompleteData,
  AutoCompletesData,
} from "@/src/views/search-recipe/entities/auto-complete/api/api";

const AUTO_COMPLETE_DATA_QUERY_KEY = "autoCompleteData";

export class AutoComplete {
  public autocomplete: string;
  constructor(autocomplete: string) {
    this.autocomplete = autocomplete;
  }
}

export class AutoCompletes {
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
  const { data, isLoading } = useQuery({
    queryKey: [AUTO_COMPLETE_DATA_QUERY_KEY, searchQuery],
    queryFn: () => fetchAutoCompleteData(searchQuery),
    select: (data) => AutoCompletes.create(data),
    enabled: searchQuery.trim().length > 0,
  });

  return {
    autoCompleteData: data ?? AutoCompletes.createEmpty(),
    isLoading,
  };
}

export function useInitialAutoCompleteData() {
  const { data, isLoading } = useQuery({
    queryKey: [AUTO_COMPLETE_DATA_QUERY_KEY, "initial"],
    queryFn: () => fetchAutoCompleteData(""),
    select: (data) => AutoCompletes.create(data)
  });

  return {
    autoCompleteData: data ?? AutoCompletes.createEmpty(),
    isLoading,
  };
}