import Header, { BackButton } from "@/src/shared/ui/header/header";
import {
  useUserRecipePageController,
  UserRecipePageProps,
} from "./UserRecipe.controller";

export function UserRecipeMobile() {
  const props = useUserRecipePageController("mobile");
  return <UserRecipeMobileLayout {...props} />;
}

export function UserRecipeMobileLayout({
  title,
  onBack,
  categorySection,
  recipeListSection,
}: UserRecipePageProps) {
  return (
    <div className="flex flex-col overflow-hidden h-[100vh] w-[100vw] select-none bg-white">
      <Header leftContent={<BackButton onClick={onBack} />} />
      <div className="pl-5 text-2xl font-bold pb-2">{title}</div>
      {categorySection}
      {recipeListSection}
    </div>
  );
}
