import Header, { BackButton } from "@/src/shared/ui/header/header";
import {
  useUserRecipePageController,
  UserRecipePageProps,
} from "./UserRecipe.controller";

export function UserRecipeTablet() {
  const props = useUserRecipePageController("tablet");
  return <UserRecipeTabletLayout {...props} />;
}

export function UserRecipeTabletLayout({
  title,
  onBack,
  categorySection,
  recipeListSection,
}: UserRecipePageProps) {
  return (
    <div className="flex flex-col min-h-screen w-full select-none bg-white">
      <Header leftContent={<BackButton onClick={onBack} />} />
      <div className="w-full max-w-[1024px] mx-auto pb-16 px-8">
        <div className="text-4xl font-bold pb-8 text-gray-900 tracking-tight">{title}</div>
        <div className="mb-8">{categorySection}</div>
        {recipeListSection}
      </div>
    </div>
  );
}
