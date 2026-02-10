# 핸즈프리 요리모드 툴팁 통합 가이드

## 📁 생성된 파일

```
src/views/onboarding/ui/components/
├── HandsFreeModeTooltip.tsx           # 메인 툴팁 컴포넌트
├── HandsFreeModeTooltip.docs.md       # 디자인 가이드 & 문서
└── HandsFreeModeTooltip.stories.tsx   # 비주얼 샘플 & 스토리북

src/views/onboarding/ui/steps/
└── OnboardingStep2WithTooltip.tsx     # 통합 예시 파일
```

---

## 🚀 3단계 통합 방법

### 1️⃣ 기존 파일 수정하기

`src/views/onboarding/ui/steps/OnboardingStep2.tsx`를 엽니다.

### 2️⃣ import 추가

파일 상단에 다음 import를 추가하세요:

```tsx
import { HandsFreeModeTooltipInline } from "../components/HandsFreeModeTooltip";
```

### 3️⃣ Title 부분 수정

`OnboardingStep2` 컴포넌트의 Title 부분(206-219번 라인)을 찾아서 다음과 같이 수정하세요:

**기존 코드:**
```tsx
{/* Title */}
<AnimatePresence mode="wait" initial={false}>
  <motion.h1
    key={`title-${step2State}`}
    variants={slideXVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    custom={{ direction, shouldAnimate }}
    transition={transitionConfig}
    className="text-lg lg:text-xl font-bold text-gray-900 text-center px-4"
  >
    {title}
  </motion.h1>
</AnimatePresence>
```

**수정된 코드:**
```tsx
{/* Title with Tooltip */}
<AnimatePresence mode="wait" initial={false}>
  <motion.div
    key={`title-container-${step2State}`}
    variants={slideXVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    custom={{ direction, shouldAnimate }}
    transition={transitionConfig}
    className="flex items-center justify-center gap-1.5 px-4"
  >
    <motion.h1
      key={`title-${step2State}`}
      className="text-lg lg:text-xl font-bold text-gray-900 text-center"
    >
      {title}
    </motion.h1>

    {/* cooking 상태일 때만 툴팁 표시 */}
    {isCookingState && <HandsFreeModeTooltipInline />}
  </motion.div>
</AnimatePresence>
```

---

## ✅ 완료!

이제 온보딩 스텝 2의 "핸즈프리 요리모드" 섹션에서 정보 아이콘이 표시되고, 호버하거나 클릭하면 툴팁이 나타납니다.

---

## 🎨 다른 위치에 툴팁 추가하기

### 옵션 1: 항상 표시 (모든 상태에서)

```tsx
{/* Title with Tooltip - 항상 표시 */}
<motion.div className="flex items-center justify-center gap-1.5 px-4">
  <motion.h1>{title}</motion.h1>
  <HandsFreeModeTooltipInline />  {/* 조건 제거 */}
</motion.div>
```

### 옵션 2: 특정 상태에서만 표시

```tsx
{/* summary 상태에서만 표시 */}
{step2State === 'summary' && <HandsFreeModeTooltipInline />}

{/* ingredients, steps 상태에서 표시 */}
{(step2State === 'ingredients' || step2State === 'steps') && <HandsFreeModeTooltipInline />}
```

### 옵션 3: Compact 버전 사용

```tsx
import { HandsFreeModeTooltipCompact } from "../components/HandsFreeModeTooltip";

{/* 컴팩트 버전 */}
<motion.div className="flex items-center justify-between">
  <motion.h1>{title}</motion.h1>
  <HandsFreeModeTooltipCompact />
</motion.div>
```

---

## 🐛 트러블슈팅

### 문제: 툴팁이 화면 밖으로 잘림

**해결:** 툴팁의 side prop을 조정하세요.

```tsx
<HandsFreeModeTooltipInline side="bottom" />
```

### 문제: 모바일에서 너무 크게 보임

**해결:** max-w-* 클래스로 크기를 제한하세요.

```tsx
<HandsFreeModeTooltip className="max-w-[280px]" />
```

### 문제: 애니메이션이 너무 느림

**해결:** shouldAnimate 변수를 false로 설정하세요.

```tsx
const shouldAnimate = false;  // 모든 애니메이션 비활성화
```

### 문제: 툴팁이 클릭되지 않음

**해결:** z-index를 확인하세요. 기본값은 z-50입니다.

```tsx
<HandsFreeModeTooltip className="z-[100]" />
```

---

## 🎯 커스터마이징

### 툴팁 내용 수정

`HandsFreeModeTooltip.tsx`의 `featureList` 배열을 수정하세요:

```tsx
const featureList: FeatureItem[] = [
  {
    icon: <Mic className="w-5 h-5" />,
    title: "음성 명령",
    description: '"다음 단계", "이전 단계", "동영상 재생/정지"',
  },
  // 여기에 추가하거나 수정하세요
];
```

### 색상 변경

```tsx
// 오렌지 → 블루
bg-orange-500 → bg-blue-500
text-orange-600 → text-blue-600

// 그라데이션 변경
from-orange-400 via-orange-500 to-orange-600
→ from-blue-400 via-blue-500 to-blue-600
```

### 아이콘 변경

```tsx
import { Info, HelpCircle, QuestionMark } from "lucide-react";

// Info → HelpCircle
<Info /> → <HelpCircle />
```

---

## 📱 테스트 체크리스트

통합 후 다음을 테스트하세요:

- [ ] **데스크톱**: 마우스 호버 시 툴팁 표시
- [ ] **모바일**: 탭 시 툴팁 표시
- [ ] **키보드**: Tab → 포커스 이동, Enter/Space → 툴팁 열기
- [ ] **닫기**: Esc 키 또는 외부 영역 터치로 닫기
- [ ] **위치**: 화면 밖으로 잘리지 않음
- [ ] **애니메이션**: 부드럽게 진입/퇴장
- [ ] **다크모드**: 자연스러운 색상 변환
- [ ] **접근성**: 스크린 리더로 내용 확인 가능

---

## 🚀 다음 단계

1. **통합 테스트**: 실제 온보딩 플로우에서 테스트
2. **A/B 테스트**: 툴팁 유무에 따른 사용자 반응 비교
3. **분석 추적**: 툴팁 열기/닫기 이벤트 추적 추가

```tsx
// 예: Amplitude 이벤트 추적
<Popover.Trigger
  onClick={() => {
    track(AMPLITUDE_EVENT.TOOLTIP_OPENED, {
      location: 'onboarding_step2',
      feature: 'hands_free_mode',
    });
  }}
>
```

---

## 💡 추가 아이디어

### 아이디어 1: 툴팁 오픈 시 자동 안내

```tsx
// 처음 진입 시 자동으로 툴팁 열기
useEffect(() => {
  if (step2State === 'cooking' && !hasSeenTooltip) {
    // 자동으로 툴팁 열기 로직
    setHasSeenTooltip(true);
  }
}, [step2State]);
```

### 아이디어 2: 툴팁 닫기 후 확인 표시

```tsx
// 툴팁을 한 번이라도 열었는지 표시
{hasOpenedTooltip && (
  <span className="ml-1 text-green-500">✓</span>
)}
```

### 아이디어 3: 단계별 안내

```tsx
// 각 기능을 순차적으로 강조
const [highlightedFeature, setHighlightedFeature] = useState(0);
```

---

## 📞 도움이 필요하시면

구현 중 문제가 발생하거나 추가 기능이 필요하면 개발팀에 문의해주세요!

---

## 📚 관련 문서

- [디자인 가이드](./src/views/onboarding/ui/components/HandsFreeModeTooltip.docs.md)
- [비주얼 샘플](./src/views/onboarding/ui/components/HandsFreeModeTooltip.stories.tsx)
- [통합 예시](./src/views/onboarding/ui/steps/OnboardingStep2WithTooltip.tsx)
