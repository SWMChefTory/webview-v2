/**
 * HandsFreeModeTooltip - Visual Showcase
 *
 * 이 파일은 다양한 컨텍스트에서 툴팁이 어떻게 보이는지 보여주는 샘플입니다.
 * 실제 프로덕션에서는 제거하거나 Storybook으로 이동하세요.
 */

import { HandsFreeModeTooltip, HandsFreeModeTooltipCompact, HandsFreeModeTooltipInline } from "./HandsFreeModeTooltip";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Story 1: 기본 사용법
 */
export function StoryBasic() {
  return (
    <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-8">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          기본 툴팁 사용법
        </h2>
        <p className="mb-8 text-gray-600">
          아이콘을 호버하거나 클릭하면 툴팁이 나타납니다.
        </p>

        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-semibold text-gray-800">
            핸즈프리 요리모드
          </span>
          <HandsFreeModeTooltip />
        </div>
      </div>
    </div>
  );
}

/**
 * Story 2: 다양한 위치
 */
export function StoryPositions() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center gap-8 bg-gray-50 p-8">
      <h2 className="text-2xl font-bold text-gray-900">다양한 위치</h2>

      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {/* Top */}
        <div className="flex flex-col items-center gap-2">
          <HandsFreeModeTooltip side="top" />
          <span className="text-sm text-gray-600">Top</span>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center gap-2">
          <HandsFreeModeTooltip side="bottom" />
          <span className="text-sm text-gray-600">Bottom</span>
        </div>

        {/* Left */}
        <div className="flex flex-col items-center gap-2">
          <HandsFreeModeTooltip side="left" />
          <span className="text-sm text-gray-600">Left</span>
        </div>

        {/* Right */}
        <div className="flex flex-col items-center gap-2">
          <HandsFreeModeTooltip side="right" />
          <span className="text-sm text-gray-600">Right</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Story 3: Compact Variant
 */
export function StoryCompact() {
  return (
    <div className="flex min-h-[300px] items-center justify-center bg-white p-8">
      <div className="max-w-md space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Compact Variant</h2>
        <p className="text-gray-600">
          공간이 제한된 상황에서 사용하기 좋습니다.
        </p>

        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              핸즈프리 요리모드
            </p>
            <p className="text-sm text-gray-600">
              음성으로 조작하는 스마트 요리 경험
            </p>
          </div>
          <HandsFreeModeTooltipCompact />
        </div>
      </div>
    </div>
  );
}

/**
 * Story 4: Inline Variant
 */
export function StoryInline() {
  return (
    <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-lg text-center">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          문장 내 통합 예시
        </h2>

        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-gray-700">
            토리의{" "}
            <HandsFreeModeTooltipInline>
              <span className="font-semibold text-orange-600 underline decoration-orange-300 decoration-2 underline-offset-2">
                핸즈프리 요리모드
              </span>
            </HandsFreeModeTooltipInline>
            를 사용하면 요리 중에도
            <br />
            음성으로 자유롭게 조작할 수 있습니다.
          </p>

          <p className="text-sm text-gray-500">
            👆 밑줄 친 텍스트 옆의 아이콘을 클릭해보세요
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Story 5: 카드 UI 내에서
 */
export function StoryCard() {
  return (
    <div className="flex min-h-[500px] items-center justify-center bg-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        {/* Header Image */}
        <div className="relative h-48 bg-gradient-to-br from-orange-400 to-orange-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">👨‍🍳</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-3 flex items-start justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              스마트 요리 가이드
            </h3>
            <HandsFreeModeTooltipCompact />
          </div>

          <p className="mb-4 text-gray-600">
            음성 명령으로 요리 과정을 쉽게 따라할 수 있습니다.
            손이 더러워도 걱정 없이 조리해보세요.
          </p>

          <button className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-orange-600">
            자세히 보기
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Story 6: 다크모드
 */
export function StoryDarkMode() {
  return (
    <div className="flex min-h-[400px] items-center justify-center bg-gray-900 p-8">
      <div className="max-w-md space-y-6 text-center">
        <h2 className="text-2xl font-bold text-white">다크모드 지원</h2>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-lg font-semibold text-white">
                핸즈프리 요리모드
              </span>
              <HandsFreeModeTooltip />
            </div>
            <p className="text-sm text-gray-400">
              다크모드에서도 자연스럽게 blending됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Story 7: 접근성 데모
 */
export function StoryAccessibility() {
  return (
    <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-8">
      <div className="max-w-lg text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          ♿ 접근성 완벽 지원
        </h2>

        <div className="mb-8 space-y-3 text-left">
          <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm">
            <span className="text-2xl" aria-hidden="true">⌨️</span>
            <div>
              <p className="font-semibold text-gray-900">키보드 내비게이션</p>
              <p className="text-sm text-gray-600">
                Tab, Enter, Space, Esc 키로 완벽하게 조작 가능
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm">
            <span className="text-2xl" aria-hidden="true">🔊</span>
            <div>
              <p className="font-semibold text-gray-900">스크린 리더</p>
              <p className="text-sm text-gray-600">
                aria-label과 semantic HTML로 완벽 호환
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm">
            <span className="text-2xl" aria-hidden="true">🎬</span>
            <div>
              <p className="font-semibold text-gray-900">Reduced Motion</p>
              <p className="text-sm text-gray-600">
                시스템 설정에 따라 애니메이션 자동 비활성화
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 p-4">
          <span className="font-semibold text-gray-800">
            직접 테스트해보세요
          </span>
          <HandsFreeModeTooltip />
        </div>
      </div>
    </div>
  );
}

/**
 * Story 8: 실제 온보딩 컨텍스트
 */
export function StoryOnboardingContext() {
  return (
    <div className="flex min-h-[600px] items-center justify-center bg-gradient-to-b from-orange-50 to-white p-8">
      <div className="w-full max-w-sm">
        {/* 온보딩 카드 스타일 */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-white/90">
                STEP 2 · COOKING MODE
              </span>
              <span className="text-xs font-medium text-white/80">
                4/4
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title with Tooltip */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">
                핸즈프리 요리모드
              </h1>
              <HandsFreeModeTooltipCompact />
            </div>

            <p className="mb-6 text-center text-sm text-gray-600">
              요리 중에도 음성으로 자유롭게 조작하세요
            </p>

            {/* Preview Image Placeholder */}
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
            </div>

            {/* Voice Status */}
            <div className="flex flex-col items-center gap-3 rounded-xl bg-orange-50 p-4">
              <p className="text-sm font-medium text-orange-600">
                마이크를 눌러 음성 명령을 시작하세요
              </p>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 shadow-lg">
                <span className="text-2xl">🎤</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                이전
              </button>
              <button className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-orange-600">
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * All Stories Showcase
 */
export function AllStoriesShowcase() {
  return (
    <div className="space-y-0">
      <StoryBasic />
      <div className="h-px bg-gray-200" />
      <StoryPositions />
      <div className="h-px bg-gray-200" />
      <StoryCompact />
      <div className="h-px bg-gray-200" />
      <StoryInline />
      <div className="h-px bg-gray-200" />
      <StoryCard />
      <div className="h-px bg-gray-200" />
      <StoryDarkMode />
      <div className="h-px bg-gray-200" />
      <StoryAccessibility />
      <div className="h-px bg-gray-200" />
      <StoryOnboardingContext />
    </div>
  );
}
