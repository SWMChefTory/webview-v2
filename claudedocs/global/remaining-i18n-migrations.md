# 남은 i18n 마이그레이션 대상

마지막 업데이트: 2025-12-26

## 완료된 마이그레이션
- ✅ Category
- ✅ Timer
- ✅ Settings
- ✅ Voice Guide
- ✅ Search Overlay
- ✅ Search Results
- ✅ Category Results
- ✅ Recipe Detail

## 남은 마이그레이션 대상

### 1️⃣ Recipe Creating (레시피 생성 위젯)

**파일**:
- `src/widgets/recipe-creating-view/recipeCreatingView.tsx`
- `src/widgets/recipe-creating-view/shareTutorialModal.tsx`

**번역 키 수**: 약 10개
- recipeCreatingView: 4 keys (title, invalidUrl, placeholder, submit)
- shareTutorialModal: 6 keys (title, description, videoFallback, instruction, goCreate, directInput, dontShowAgain)

**복잡도**: ⭐ 간단
- 단순 텍스트 번역
- 특별한 로직 없음

---

### 2️⃣ Category Creating (카테고리 생성 위젯)

**파일**:
- `src/widgets/category-creating-view/categoryCreatingView.tsx`

**번역 키 수**: 5개 (title, placeholder, errorEmpty, errorTooLong, submit)

**복잡도**: ⭐ 간단
- 단순 텍스트 번역
- 에러 메시지 포함

---

### 3️⃣ User Recipe - Category (사용자 레시피 - 카테고리 관리)

**파일**:
- `src/views/user-recipe/ui/categoryListSection.tsx`
- `src/features/format/category/formatCategoryName.ts`

**번역 키 수**: 6개
- categoryDeleteAlert: 4 keys (title, description, subDescription, cancel, confirm)
- formatCategoryName: 2 keys (all, add)

**복잡도**: ⭐⭐ 중간
- `formatCategoryName`은 여러 곳에서 사용될 수 있음
- Delete Alert는 동적 값 포함 (categoryName, count)

---

### 4️⃣ Settings - Withdrawal (설정 - 회원 탈퇴)

**파일**:
- `src/views/settings-sections/ui/withdrawal/membershipWithdrawal.tsx`
- `src/views/settings-sections/ui/withdrawal/writeCustomerFeedbackModalContent.tsx`

**번역 키 수**: 약 28개
- membershipWithdrawal: 17 keys (title, infoBox, reasons with 7 items, feedbackPreview, button)
- writeCustomerFeedbackModalContent: 11 keys (title, reasonLabel, label, placeholder, optional, count, tip with 3 items, cancel, save)

**복잡도**: ⭐⭐⭐ 복잡
- 탈퇴 사유 7개 항목
- 동적 사용자 이름 포함 (`${nickname}님`)
- 피드백 모달 포함
- Tip 항목 배열 처리

---

## 추천 진행 순서

1. **Recipe Creating** (간단, 독립적)
2. **Category Creating** (간단, 독립적)
3. **User Recipe - Category** (중간, formatCategoryName 공통 처리)
4. **Settings - Withdrawal** (복잡, 마지막)

---

## 마이그레이션 패턴 요약

### 기본 구조
1. `public/locales/{ko|en}/{namespace}.json` 생성
2. `hooks/use{Namespace}Translation.ts` 훅 생성
3. `formatMessages` 함수 제거 및 `t()` 호출로 교체
4. 페이지 레벨에서 `serverSideTranslations`에 namespace 추가

### 특수 케이스 처리
- **동적 값**: `{{variable}}` interpolation 사용
- **Template literal keys**: `` t(`tabs.${key}`) `` 패턴
- **Function-based data**: 데이터가 `t()` 필요 시 함수로 변환
- **언어별 로직**: 컴포넌트 내 `if (lang === 'ko')` 분기 유지
