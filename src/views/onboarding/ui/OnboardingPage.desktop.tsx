import { OnboardingPageMobile } from "./OnboardingPage.mobile";

export function OnboardingPageDesktop() {
  // Desktop Layout: iPhone 시뮬레이션 + 여백 활용
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-8">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center gap-12 lg:gap-16">

        {/* iPhone 시뮬레이션 프레임 */}
        <div className="flex-shrink-0">
          <div className="w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl overflow-hidden min-h-[800px] relative border-[8px] border-gray-900">
            {/* iPhone Notch Simulation */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-50" />
            <OnboardingPageMobile />
          </div>
        </div>

        {/* 오른쪽: 안내 텍스트 (큰 화면에서만) */}
        <div className="hidden lg:block max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Cheftory 온보딩
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            모바일 앱의 완전한 기능을 체험해보세요.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-orange-600">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">YouTube 레시피 저장</h3>
                <p className="text-sm text-gray-600">유튜브 영상을 공유하기만 하면 자동 변환</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-orange-600">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">핸즈프리 요리 모드</h3>
                <p className="text-sm text-gray-600">음성 명령으로 요리 중 쉽게 조작</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-orange-600">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">바로 요리 시작</h3>
                <p className="text-sm text-gray-600">저장된 레시피로 바로 요리 모드 실행</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
