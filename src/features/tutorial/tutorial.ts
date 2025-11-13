import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import { useIsInTutorialStore } from "@/src/features/tutorial/isInTutorialStore";

export const driverObj = driver({
  showProgress: true,
  stagePadding: 0,
  steps: [
    // 인트로 (선택사항)
    {
      popover: {
        title: "👋 환영합니다!",
        description: "유튜브 레시피를 30초 만에 저장하는 방법을 알려드릴게요",
        showButtons: ["next", "close"],
        onPopoverRender: (popover) => {
          const footer = popover.wrapper.querySelector(
            ".driver-popover-footer"
          );
          if (footer) {
            footer.innerHTML = `
              <button 
                class="custom-skip-btn"
                style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 8px; background: white; color: #666; margin-right: 8px;"
              >
                건너뛰기
              </button>
              <button 
                class="custom-next-btn"
                style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 8px; background: white; color: #666; margin-right: 8px;"
              >
                시작하기
              </button>
            `;

            // 이벤트 리스너 추가
            footer
              .querySelector(".custom-skip-btn")
              ?.addEventListener("click", () => {
                useIsInTutorialStore.getState().finishTutorial();
                driverObj.destroy();
              });

            footer
              .querySelector(".custom-next-btn")
              ?.addEventListener("click", () => {
                driverObj.moveNext();
              });
          }
        },
      },
    },

    // Step 1: 레시피 생성 버튼
    {
      element: "[data-tour='floating-button']",
      popover: {
        title: "레시피 추가하기",
        description: "이 버튼을 누르면 레시피를 추가할 수 있어요.",
        side: "top",
        align: "center",
        showButtons: ["close"],
      },
    },

    // Step 2: URL 입력
    {
      element: "[data-tour='create-recipe']",
      popover: {
        title: "유튜브 링크 입력",
        description:
          "좋아하는 유튜브 레시피 링크를 붙여넣으면 자동으로 레시피가 생성돼요",
        side: "top",
        align: "center",
        showButtons: ["close"],
      },
    },

    // Step 3: 레시피 카드
    {
      element: "[data-tour='recipe-card']",
      popover: {
        title: "레시피 완성!",
        description:
          "생성된 레시피를 클릭하면 상세 정보를 볼 수 있어요. 이제 세프님의 레시피북을 만들어보세요!",
        side: "bottom",
        align: "start",
        showButtons: ["close"],
      },
    },
  ],
  onDestroyStarted: () => {
    useIsInTutorialStore.getState().finishTutorial();
  },
});

export function startTheMagicShow() {
  driverObj.drive();
}