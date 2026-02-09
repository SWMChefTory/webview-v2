import Header, { BackButton } from "@/src/shared/ui/header/header";
import {
  useUserRecipePageController,
  UserRecipePageProps,
} from "./UserRecipe.controller";

export function UserRecipeDesktop() {
  const props = useUserRecipePageController("desktop");
  return <UserRecipeDesktopLayout {...props} />;
}

export function UserRecipeDesktopLayout({
  title,
  onBack,
  categorySection,
  recipeListSection,
}: UserRecipePageProps) {
  return (
    <div className="flex flex-col min-h-screen w-full select-none bg-white">
      <Header leftContent={<BackButton onClick={onBack} />} />
      <div className="w-full max-w-[1600px] mx-auto pb-16 px-8 py-8">
        <div className="text-4xl lg:text-5xl font-bold pb-10 tracking-tight text-gray-900">{title}</div>
        {categorySection}
        <div className="h-8" />
        {recipeListSection}
      </div>
    </div>
  );
}
