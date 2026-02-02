import { useState, useCallback, useRef } from "react";
import type { TabName, RecipeStep, Ingredient } from "../ui/RecipeDetail.controller";

export interface RecipeDetailUIState {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;

  expanded: Set<number>;
  toggleExpanded: (idx: number) => void;
  expandAll: (steps: RecipeStep[]) => void;
  collapseAll: () => void;

  selected: Set<number>;
  toggleSelected: (idx: number) => void;
  selectAll: (ingredients: Ingredient[]) => void;
  deselectAll: () => void;
  isAllSelected: (ingredients: Ingredient[]) => boolean;

  measurementOpen: boolean;
  setMeasurementOpen: (open: boolean) => void;
  purchaseModalOpen: boolean;
  setPurchaseModalOpen: (open: boolean) => void;

  contentRef: React.RefObject<HTMLDivElement | null>;
  scrollToTop: () => void;
}

export interface UseRecipeDetailUIStateOptions {
  initialTab?: TabName;
  initialExpandAll?: boolean;
  steps?: RecipeStep[];
}

export function useRecipeDetailUIState(
  options: UseRecipeDetailUIStateOptions = {}
): RecipeDetailUIState {
  const {
    initialTab = "summary",
    initialExpandAll = false,
    steps = [],
  } = options;

  const [activeTab, setActiveTab] = useState<TabName>(initialTab);

  const [expanded, setExpanded] = useState<Set<number>>(() =>
    initialExpandAll ? new Set(steps.map((_, idx) => idx)) : new Set()
  );

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const toggleExpanded = useCallback((idx: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback((steps: RecipeStep[]) => {
    setExpanded(new Set(steps.map((_, idx) => idx)));
  }, []);

  const collapseAll = useCallback(() => {
    setExpanded(new Set());
  }, []);

  const toggleSelected = useCallback((idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((ingredients: Ingredient[]) => {
    setSelected(new Set(ingredients.map((_, idx) => idx)));
  }, []);

  const deselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const isAllSelected = useCallback(
    (ingredients: Ingredient[]) => selected.size === ingredients.length,
    [selected.size]
  );

  const scrollToTop = useCallback(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return {
    activeTab,
    setActiveTab,
    expanded,
    toggleExpanded,
    expandAll,
    collapseAll,
    selected,
    toggleSelected,
    selectAll,
    deselectAll,
    isAllSelected,
    measurementOpen,
    setMeasurementOpen,
    purchaseModalOpen,
    setPurchaseModalOpen,
    contentRef,
    scrollToTop,
  };
}
