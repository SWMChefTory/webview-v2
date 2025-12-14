import { useTranslation } from "next-i18next";

function AlreadyEnrolledChip({ isEnrolled }: { isEnrolled: boolean }) {
  const {t}=useTranslation('shared.recipe-creating-status-chip');

  if (!isEnrolled) {
    return null;
  }
  return (
    <div className="flex px-[8] py-[4] bg-gray-800/70 z-10 rounded-md items-center justify-center text-white">
      {t("regist")}
    </div>
  );
}

function CreatingStatusChip({isInCreating}:{isInCreating: boolean}){
  const {t}=useTranslation('recipe-creating-status-chip');

  if(!isInCreating){
    return null;
  }
  return (
    <div className="flex px-[8] py-[4] bg-gray-800/70 z-10 rounded-md items-center justify-center text-white">
      {t("creating")}
    </div>
  );
}

function NewRecipeChip() {
  return (
    <div className="flex w-[28] h-[28] bg-orange-500 z-10 rounded-md items-center justify-center text-white  font-bold">
      N
    </div>
  );
}

export { AlreadyEnrolledChip, NewRecipeChip, CreatingStatusChip };
