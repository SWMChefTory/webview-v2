export interface RecipeStep {
  id: string;
  stepOrder: number;
  subtitle: string;
  details: StepDetail[];
}
export interface StepDetail {
  text: string;
  start: number; 
}
