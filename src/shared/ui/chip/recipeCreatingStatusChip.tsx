import { useTranslation } from "next-i18next";

function AlreadyEnrolledChip({ isEnrolled }: { isEnrolled: boolean }) {
  const {t}=useTranslation('shared.recipe-creating-status-chip');

  if (!isEnrolled) {
    return null;
  }
  return (
    <div className="flex px-[8] py-[4] lg:px-3 lg:py-1.5 bg-gray-800/70 z-10 rounded-md lg:rounded-lg items-center justify-center text-white lg:text-sm">
      {t("regist")}
    </div>
  );
}

function CreatingStatusChip({isInCreating}:{isInCreating: boolean}){
  const {t}=useTranslation('shared.recipe-creating-status-chip');

  if(!isInCreating){
    return null;
  }
  return (
    <div className="flex px-[8] py-[4] lg:px-3 lg:py-1.5 bg-gray-800/70 z-10 rounded-md lg:rounded-lg items-center justify-center text-white lg:text-sm">
      {t("creating")}
    </div>
  );
}

function NewRecipeChip() {
  return (
    <div className="flex w-[28] h-[28] lg:w-8 lg:h-8 bg-orange-500 z-10 rounded-md lg:rounded-lg items-center justify-center text-white lg:text-base font-bold">
      N
    </div>
  );
}

export { AlreadyEnrolledChip, NewRecipeChip, CreatingStatusChip };
