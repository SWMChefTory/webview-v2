# 레시피 조회 UI/UX 개선 제안서

## 분석 개요

본 문서는 현재 레시피 조회 관련 UI/UX를 분석하고, UI/UX Pro Max 디자인 가이드라인과 DESIGN_SYSTEM.md를 기반으로 한 구체적인 개선 제안을 담고 있습니다.

---

## 1. 현재 상태 분석

### 1.1 레시피 카드 (UserRecipeCard)

**현재 구현 (`src/views/home/ui/userRecipeCard.tsx`):**
- 모바일: 160x90px 세로형 카드
- 태블릿/데스크탑: 320x180px 가로형 카드
- 호버 효과: `group-hover:scale-105`, `group-hover:-translate-y-1`
- 진행 상태 오버레이: 성공 시 전체 영역 클릭 가능

### 1.2 레시피 상세 페이지 (RecipeDetail)

**현재 구현 (`src/views/recipe-detail/ui/RecipeDetail.mobile.tsx`):**
- 고정 YouTube 비디오 플레이어 (상단)
- 스크롤 가능한 컨텐츠 영역
- 하단 고정 FTA 버튼 (요리하기)
- 뒤로가기 버튼 (하단 좌측 고정)

### 1.3 레시피 스텝 페이지 (RecipeStep)

**현재 구현 (`src/views/recipe-step/ui/RecipeStep.mobile.tsx`):**
- 전체 화면 비디오 플레이어
- 진행 바 (타임라인)
- 스텝 컨텐츠 (스크롤 가능)
- 플로팅 컨트롤 바

---

## 2. UI/UX Pro Max 가이드라인 기반 분석

### 2.1 Video-First Hero 패턴 적용

**가이드라인:**
- 비디오 퍼스트 디자인: 86% 높은 참여도
- 비디오 오버레이 CTA (센터/바텀)
- 다크 오버레이 60% + 화이트 텍스트
- 브랜드 액센트 컬러 CTA

**현재 적용 상태:**
- ✅ 비디오 퍼스트 구조 적용됨
- ⚠️ 비디오 오버레이 CTA 미사용
- ❌ 다크 오버레이 미적용 (화이트 배경 사용)

### 2.2 Touch & Interaction (CRITICAL)

**가이드라인:**
- 최소 터치 타겟: 44x44px
- `cursor-pointer` 필수
- 호버 피드백 제공

**현재 적용 상태:**
- ✅ FTA 버튼: 56px 높이 (충족)
- ⚠️ 스텝 카드: `cursor-pointer` 확인 필요
- ✅ 호버 효과: `group-hover:scale-105` 적용됨

### 2.3 Accessibility (CRITICAL)

**가이드라인:**
- 색상 대비: 최소 4.5:1
- 포커스 상태 표시
- `aria-label` 필수

**현재 적용 상태:**
- ✅ `aria-label` 사용 확인됨 (BackButton)
- ⚠️ 포커스 상태 (focus ring) 확인 필요
- ⚠️ `text-gray-500` 대비 확인 필요 (라이트 모드)

---

## 3. 개선 제안

### 3.1 레시피 카드 개선

#### 문제점
1. 모바일 카드가 너무 작아 썸네일 표시가 제한적임
2. 진행 상태 표시가 직관적이지 않음
3. 카드 호버 효과가 모바일에서는 무의미함

#### 제안 1: 카드 크기 및 비율 최적화

**현재:**
```tsx
// 모바일
<div className="w-40 h-[90px]"> // 160x90 (16:9)
```

**제안:**
```tsx
// 모바일 - 더 큰 카드
<div className="w-full aspect-video rounded-lg"> // 16:9 비율 유지, 전체 너비
```

**이유:**
- 16:9 비율은 썸네일에 최적화
- 전체 너비 사용으로 시각적 임팩트 증가
- 스크롤 방향: 세로 (한 카드씩)

#### 제안 2: 진행 상태 시각적 강화

**현재:**
```tsx
// 전체 영역 오버레이 (클릭 가능)
<div className="absolute inset-0 flex items-center overflow-hidden z-10">
  <ProgressDetailsCheckList recipeStatus={recipeStatus} />
</div>
```

**제안:**
```tsx
// 진행률 표시 막대 + 뱃지 조합
<div className="absolute top-2 left-2 z-20">
  <div className="rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white">
    {progress}%
  </div>
</div>
<div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
  <div
    className="h-full bg-orange-500 transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

**이유:**
- 진행률이 한눈에 보임
- 블랙/75% 배지로 썸네일 위에서 가독성 확보
- 오렌지 컬러로 브랜드 아이덴티티 유지

#### 제안 3: 호버 효과 모바일 최적화

**현재:**
```tsx
className="group-hover:scale-105 transition-transform duration-500"
```

**제안 (터치 디바이스 고려):**
```tsx
// 모바일: 액티브 상태 (터치 피드백)
className="active:scale-95 transition-transform duration-75"

// 데스크탑: 호버 상태
className="hover:scale-105 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
```

**이유:**
- `active:scale-95`로 터치 피드백 제공
- `cursor-pointer`로 클릭 가능성 시각화
- 75-300ms 트랜지션으로 자연스러운 느낌

---

### 3.2 레시피 상세 페이지 개선

#### 문제점
1. 비디오가 상단 고정이라 스크롤 시 컨텐츠가 가려짐
2. 요리하기 버튼 위치가 하단이라 접근성이 낮음
3. 비디오 위에 다크 오버레이가 없어 텍스트 가독성 이슈

#### 제안 1: 비디오 플레이어 오버레이 CTA

**현재:**
```tsx
// 비디오만 표시
<div className="relative w-full aspect-video bg-black">
  <ReactYouTube videoId={videoId} />
</div>
```

**제안:**
```tsx
// 비디오 + 오버레이 CTA
<div className="relative w-full aspect-video bg-black">
  <ReactYouTube videoId={videoId} />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
    <div className="absolute bottom-4 left-4 right-4">
      <button className="w-full py-3 bg-orange-500 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-orange-600 active:scale-[0.98] transition-all">
        요리 시작하기
      </button>
    </div>
  </div>
</div>
```

**이유:**
- 다크 그라데이션 오버레이로 텍스트 가독성 확보
- CTA를 비디오 위에 배치하여 86% 높은 참여도 활용
- 오렌지 컬러로 브랜드 아이덴티티 강조

#### 제안 2: 고정 FTA 버튼 개선

**현재:**
```tsx
<div className="fixed bottom-14 right-10 z-10">
  <div className="flex h-14 w-36 gap-2 items-center justify-center bg-orange-500 rounded-xl shadow-xl">
    ...
  </div>
</div>
```

**제안:**
```tsx
// 안전 영역 고려 + 크기 증가
<div className="fixed bottom-4 right-4 z-10 pb-safe">
  <button className="h-16 px-6 bg-orange-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-orange-600 active:scale-95 transition-all cursor-pointer border-2 border-orange-600">
    <span>요리하기</span>
    <Image src="/images/cook-pot.png" width={28} height={24} alt="" />
  </button>
</div>
```

**이유:**
- `pb-safe`로 iOS 홈 인덱터 고려
- `h-16` (64px)으로 44px 최소 요구사항 초과 달성
- `cursor-pointer` 추가
- `border-2 border-orange-600`으로 경계 강화
- `active:scale-95`로 터치 피드백

#### 제안 3: 재료 섹션 시각 개선

**현재:**
```tsx
<div className="grid grid-cols-3 gap-2">
  <button className="aspect-square min-w-20 border rounded-md">
    <span className="text-center font-bold">{ing.name}</span>
  </button>
</div>
```

**제안:**
```tsx
<div className="grid grid-cols-3 gap-3">
  <button
    className={`aspect-square min-h-[100px] rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
      isSelected
        ? 'border-orange-500 bg-orange-50 shadow-md'
        : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50'
    }`}
  >
    <span className={`font-bold text-base ${isSelected ? 'text-orange-600' : 'text-neutral-900'}`}>
      {ing.name}
    </span>
    {isSelected && (
      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth={3} fill="none"/>
        </svg>
      </div>
    )}
  </button>
</div>
```

**이유:**
- `min-h-[100px]`으로 44px 터치 타겟 충족
- `cursor-pointer` 추가
- `hover:` 상태로 인터랙티브함 시각화
- 체크마크 아이콘으로 선택 상태 명확화
- `rounded-xl`으로 더 부드러운 느낌

---

### 3.3 레시피 스텝 페이지 개선

#### 문제점
1. 비디오와 스텝 컨텐츠의 시각적 구분이 약함
2. 진행 바가 상세 스텝을 표시하지 않음
3. 플로팅 컨트롤이 화면을 가릴 수 있음

#### 제안 1: 진행 바 시각적 강화

**현재:**
```tsx
// 기본 진행 바
<ProgressBar steps={recipe.recipeSteps} currentDetailStepIndex={currentDetailIndex} />
```

**제안:**
```tsx
// 강화된 진행 바 + 현재 스텝 표시
<div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
  {/* 전체 진행률 */}
  <div
    className="absolute h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300"
    style={{ width: `${overallProgress}%` }}
  />

  {/* 현재 스텝 인디케이터 */}
  {steps.map((step, idx) => (
    <div
      key={idx}
      className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all ${
        idx <= currentIndex
          ? 'bg-orange-500 border-orange-500'
          : 'bg-gray-700 border-gray-600'
      }`}
      style={{ left: `${(idx / totalSteps) * 100}%` }}
    />
  ))}
</div>

// 현재 스텝 텍스트 표시
<div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-sm">
  <span className="text-white text-sm font-semibold">
    스텝 {currentIndex + 1} / {totalSteps}
  </span>
</div>
```

**이유:**
- 스텝별 인디케이터로 진행 상태 한눈에 파악
- 그라데이션으로 시각적 관심 유도
- 블랙/75% 뱃지로 비디오 위에서 가독성 확보

#### 제안 2: 플로팅 컨트롤 개선

**현재:**
```tsx
<FloatingControlBar controller={controller} isLandscape={false} />
```

**제안:**
```tsx
// 닫기 가능한 플로팅 컨트롤 + 축소 모드
<div className={`
  fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200
  transition-all duration-300 z-50
  ${isMinimized ? 'h-14' : 'h-auto'}
`}>
  {isMinimized ? (
    // 축소 모드: 탭하여 확장
    <button
      onClick={() => setIsMinimized(false)}
      className="w-full h-full flex items-center justify-center gap-2 cursor-pointer"
    >
      <span className="font-semibold text-gray-700">컨트롤 표시</span>
      <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth={2} fill="none"/>
      </svg>
    </button>
  ) : (
    // 전체 컨트롤 + 축소 버튼
    <>
      <div className="p-4">
        {/* 컨트롤 내용 */}
      </div>
      <button
        onClick={() => setIsMinimized(true)}
        className="absolute top-2 right-2 p-1 rounded-lg hover:bg-gray-100 active:scale-95 cursor-pointer"
        aria-label="컨트롤 축소"
      >
        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
          <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth={2} fill="none"/>
        </svg>
      </button>
    </>
  )}
</div>
```

**이유:**
- 백드롭 블러로 모던한 느낌
- 축소/확장 기능으로 화면 공간 최적화
- `cursor-pointer`, `aria-label`, `active:scale-95`로 인터랙션 개선

---

## 4. 접근성 (Accessibility) 개선

### 4.1 색상 대비 점검

**문제 발견:**
```tsx
// 라이트 모드에서 대비 부족
<p className="text-sm text-gray-500">...</p>
```

**해결:**
```tsx
// 더 어운 회색으로 대비 개선
<p className="text-sm text-gray-700">...</p>
```

**이유:** WCAG AA 4.5:1 기준 충족

### 4.2 포커스 상태 표시

**문제 발견:**
```tsx
// 포커스 링 없음
<button className="bg-orange-500 text-white">...</button>
```

**해결:**
```tsx
// 포커스 링 추가
<button className="bg-orange-500 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2">...</button>
```

**이유:** 키보드 네비게이션 사용자를 위한 피드백

### 4.3 시멘틱 HTML

**문제 발견:**
```tsx
// div를 버튼처럼 사용
<div onClick={...}>...</div>
```

**해결:**
```tsx
// button 요소 사용
<button onClick={...} className="cursor-pointer">...</button>
```

**이유:** 스크린 리더 호환성 향상

---

## 5. 모바일 우선 경험 개선

### 5.1 세이프 에리어

**현재:**
```tsx
<div className="fixed bottom-14 right-10 z-10">
```

**개선:**
```tsx
<div className="fixed bottom-4 right-4 z-10 pb-safe pt-safe">
```

**이유:** iOS 노치 및 홈 인덱터 고려

### 5.2 터치 타겟 크기

**현재:** 일부 버튼이 44px 미만

**개선:** 모든 터치 타겟을 최소 44px로:
```tsx
// 최소 크기 강제
<button className="min-h-[44px] min-w-[44px] ...">
```

### 5.3 스와이프 제스처

**제안:**
```tsx
// 스텝 간 스와이프로 네비게이션
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: () => goToNextStep(),
  onSwipedRight: () => goToPreviousStep(),
});

<div {...handlers} className="touch-pan-x">
```

**이유:** 모바일 자연스러운 제스처 지원

---

## 6. 성능 최적화

### 6.1 이미지 최적화

**현재:**
```tsx
<img src={thumbnailUrl} alt={title} />
```

**개선:**
```tsx
<Image
  src={thumbnailUrl}
  alt={title}
  width={320}
  height={180}
  loading="lazy"
  placeholder="blur"
/>
```

**이유:** Next.js Image 컴포넌트 활용, 지연 로딩

### 6.2 애니메이션 최적화

**현재:**
```tsx
className="transition-all duration-500" // 너무 김
```

**개선:**
```tsx
className="transform will-change-transform transition-transform duration-300" // transform만, 300ms
```

**이유:** GPU 가속, 성능 향상

---

## 7. 우선순위 정리

### 🔴 높은 우선순위 (즉시 개선)

1. **터치 타겟 크기**: 모든 버튼을 44px 이상으로
2. **cursor-pointer 추가**: 클릭 가능한 모든 요소
3. **색상 대비**: `text-gray-500` → `text-gray-700`
4. **세이프 에리어**: `pb-safe`, `pt-safe` 추가

### 🟡 중간 우선순위 (다음 스프린트)

5. **진행 상태 시각화**: 뱃지 + 프로그레스 바
6. **비디오 오버레이 CTA**: 86% 참여도 향상
7. **포커스 상태**: `focus:ring-*` 추가
8. **이미지 최적화**: Next.js Image 컴포넌트

### 🟢 낮은 우선순위 (향후 개선)

9. **스와이프 제스처**: 스텝 네비게이션
10. **플로팅 컨트롤 축소 모드**
11. **애니메이션 최적화**
12. **로딩 스켈레톤 개선**

---

## 8. 구현 체크리스트

### 카드 컴포넌트
- [ ] `cursor-pointer` 추가
- [ ] `min-h-[44px]` 터치 타겟
- [ ] 진행률 뱃지 추가
- [ ] 진행 바 추가
- [ ] 호버/액티브 상태 개선

### 상세 페이지
- [ ] 비디오 오버레이 CTA
- [ ] `pb-safe` 추가
- [ ] `text-gray-700`으로 대비 개선
- [ ] `focus:ring-*` 추가
- [ ] 시멘틱 `button` 사용

### 스텝 페이지
- [ ] 진행 바 인디케이터
- [ ] 현재 스텝 뱃지
- [ ] 플로팅 컨트롤 개선
- [ ] `cursor-pointer` 추가
- [ ] `aria-label` 추가

---

## 참고 자료

- **DESIGN_SYSTEM.md**: 프로젝트 디자인 시스템
- **UI/UX Pro Max**: Video-First Hero 패턴, Touch & Interaction 가이드
- **Tailwind CSS v4**: 사용 가능한 유틸리티 클래스
