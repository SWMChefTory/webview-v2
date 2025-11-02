function AlreadyEnrolledChip({ isEnrolled }: { isEnrolled: boolean }) {
  if (!isEnrolled) {
    return null;
  }
  return (
    <div className="flex px-[8] py-[4] bg-gray-800/70 z-10 rounded-md items-center justify-center text-white">
      이미 등록된 레시피예요
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

export { AlreadyEnrolledChip, NewRecipeChip };
