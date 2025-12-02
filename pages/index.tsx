import HomePage from "@/src/pages/home/index";

export default HomePage;

interface HomePageProps {
  message?: string;
}

// export const getStaticProps = async () => {
//   // 실제 API 호출이나 DB 조회 로직이 들어가는 곳
//   // 여기서는 간단한 테스트 메시지를 사용합니다.
//   const data = { message: "Next.js 빌드 시점 데이터 로드 완료 (SSG)" };

//   // SSG 빌드 중이므로, 이 함수 내에서 인증 관련 코드(null.token)가
//   // 안전하게 처리되었는지 반드시 확인해야 합니다.

//   return {
//     props: {
//       message: data.message,
//     },
//     // revalidate: 30, // 30초마다 재생성을 원하면 주석 해제 (ISR 적용)
//   };
// };
