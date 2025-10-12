import { RecipeProgressDetail} from "@/src/entities/user_recipe/type/type";
import { AnimatePresence, motion } from "motion/react";

const detailAddress = {
  [RecipeProgressDetail.READY]: "레시피 생성 준비",
  [RecipeProgressDetail.CAPTION]: "자막 생성",
  [RecipeProgressDetail.INGREDIENT]: "재료 추출",
  [RecipeProgressDetail.TAG]: "태그 추출",
  [RecipeProgressDetail.DETAIL_META]: "상세정보 작성",
  [RecipeProgressDetail.BRIEFING]: "소개 작성",
  [RecipeProgressDetail.STEP]: "조리 단계 생성",
  [RecipeProgressDetail.FINISHED]: "레시피 생성 완료",
};

export const ProgressDetailsCheckList = ({
  recipeProgressDetails,
}: {
  recipeProgressDetails: RecipeProgressDetail[];
}) => {
  return (
    <div className="flex flex-col gap-1 flex-start p-[8] bg-gray-800/80 rounded-md h-full justify-start w-full items-center">
      <div className="text-white font-bold">
        레시피 생성중
        {`${recipeProgressDetails.length}` +
          "/" +
          `${Object.values(RecipeProgressDetail).length}`}
      </div>
      <div className="flex flex-col overflow-y-auto">
        {Object.values(RecipeProgressDetail).map((detail) => {
          return (
            <ProgressDetailCheckElement
              key={detail}
              detail={detail}   
              isFinished={recipeProgressDetails.includes(detail)}
            />
          );
        })}
      </div>
    </div>
  );
};

const ProgressDetailCheckElement = ({
  detail,
  isFinished,
}: {
  detail: RecipeProgressDetail;
  isFinished: boolean;
}) => {
  console.log(isFinished + "isFinished");
  return (
    <div>
      <AnimatePresence>
        {!isFinished && (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            exit={{
              opacity: 0,
              height: 0,
              transition: { duration: 0.5, delay: 0.5 },
            }}
            className="flex gap-2 whitespace-nowrap items-center"
          >
            <SpinnerCircle />
            <div className="text-gray-200">{detailAddress[detail]}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SpinnerCircle = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 52 52"
    width={14}
    height={14}
    fill="none"
    role="img"
    aria-label="loading"
  >
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
      style={{ originX: "50%", originY: "50%" }}
    >
      <circle
        cx="26"
        cy="26"
        r="20"
        stroke="white"
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.25}
      />
      <path
        d="M46 26 A20 20 0 0 1 26 46"
        stroke="orange"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </motion.g>
  </motion.svg>
);
