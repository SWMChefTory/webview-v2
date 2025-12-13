import PopularRecipeContent from "@/src/views/popular-recipe/ui";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import router from "next/router";

function PopularRecipePage() {
  return (
    <div className="overflow-y-hidden w-screen h-screen">
      <Header
        leftContent={
          <BackButton
            onClick={() => {
              router.back();
            }}
          />
        }
        color="bg-white"
      />
      {/* <HeaderSpacing/> */}
      <PopularRecipeContent />
    </div>
  );
}

export default PopularRecipePage;