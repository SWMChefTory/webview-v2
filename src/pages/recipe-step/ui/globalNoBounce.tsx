/* =====================================================================================
   전역: 바운스/풀투리프레시 방지 + 배경/높이/가로 스크롤 고정
===================================================================================== */
export const GlobalNoBounce = () => (
  <style jsx global>{`
    html,
    body,
    #__next {
      width: 100%;
      height: 100%;
      background: #000;
    }
    /* 상하좌우 끌어당김 방지 + 가로 스크롤 숨김 */
    html,
    body {
      position: fixed;
      inset: 0;
      overflow: hidden;
      overscroll-behavior: none;
      touch-action: manipulation;
    }
    html,
    body,
    #__next {
      overflow-x: hidden;
    }
  `}</style>
);
