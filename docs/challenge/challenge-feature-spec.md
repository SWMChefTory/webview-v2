# 집밥 챌린지 기능 기획서

## 개요

사용자가 일주일 동안 3번의 집밥을 요리하고 인증하는 챌린지 기능.
챌린지 참여자에게만 홈 화면에 배너가 표시되며, 카카오톡 오픈채팅방에서 사진 인증을 진행한다.

**특성**: 임시/이벤트성 기능으로, 종료 후 쉽게 삭제 가능하도록 설계

---

## 챌린지 종류

| 챌린지 | 대상 | 설명 |
|--------|------|------|
| 자취생 챌린지 | 자취생 | 간단하고 빠른 레시피 위주 |
| 주부 챌린지 | 주부 | 다양한 난이도의 레시피 |

---

## 챌린지 기간

- **주차 단위**: 월요일 ~ 일요일 (7일)
- **중도 참여**: 가능 (화요일 이후 참여해도 같은 주차 기간 적용)
- **기간 고정**: 참여 시점과 무관하게 해당 주 일요일에 종료

---

## 사용자 플로우

```
1. 사전 등록
   - 사용자가 챌린지 참여 신청 (외부 채널)
   - 관리자가 닉네임#태그로 서버 DB에 참여자 등록

2. 앱 진입
   - 홈 화면 → 챌린지 참여자만 배너 노출
   - 배너 클릭 → 챌린지 상세 페이지 이동

3. 챌린지 진행
   - 레시피 목록에서 원하는 레시피 선택
   - 레시피 보고 요리 진행
   - 카카오톡 오픈채팅방에서 완성 사진 인증

4. 인증 처리
   - 관리자가 카톡에서 인증 확인
   - 서버 DB에서 해당 사용자 완료 횟수 +1

5. 완료 확인
   - 앱에서 진행 상황 실시간 반영 (3개 박스)
   - 3번 완료 시 챌린지 성공
```

---

## 화면 설계

### 1. 홈 배너 (검색바 아래)

**위치**: 검색바 아래, 카테고리 섹션 위

**레이아웃 (진행 중)**:
```
┌─────────────────────────────────────────────────┐
│  [아이콘] 자취생 집밥 챌린지                       │
│                                                 │
│     ■ ■ □   2/3 완료                           │
│                                                 │
│                           [레시피 확인하기 →]    │
└─────────────────────────────────────────────────┘
```

**레이아웃 (완료 시 3/3)**:
```
┌─────────────────────────────────────────────────┐
│  [아이콘] 자취생 집밥 챌린지                       │
│                                                 │
│     ■ ■ ■   축하합니다! 이번 주 완료!            │
│                                                 │
└─────────────────────────────────────────────────┘
```

**스타일**:
- 배경: 따뜻한 그라데이션 (오렌지/노랑 계열)
- 완료 시: 축하 느낌 (녹색/골드 계열)
- 높이: 약 80-100px
- 모서리: rounded-xl
- 그림자: 약한 shadow

**조건부 렌더링**:
- `isParticipant === true`인 경우에만 표시
- 참여자가 아니면 컴포넌트 자체를 렌더링하지 않음 (null 반환)

---

### 2. 챌린지 상세 페이지 (`/challenge`)

#### 2-1. 참여자 화면

**레이아웃**:
```
┌─────────────────────────────────────────────────┐
│ ← [챌린지 타입] 집밥 챌린지                       │
├─────────────────────────────────────────────────┤
│                                                 │
│   12월 16일 ~ 12월 22일                          │
│                                                 │
│   이번 주 진행 상황                              │
│                                                 │
│   ┌─────┐  ┌─────┐  ┌─────┐                    │
│   │  ✓  │  │  ✓  │  │     │                    │
│   │ 1회 │  │ 2회 │  │ 3회 │                    │
│   └─────┘  └─────┘  └─────┘                    │
│                                                 │
│   2/3 완료! 한 번만 더 하면 성공!                 │
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │  💬 카카오톡에서 인증하기                 │   │
│   └─────────────────────────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│   이번 주 추천 레시피                            │
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │ [썸네일] 레시피 제목                     │   │
│   │          조리시간 | 난이도               │   │
│   └─────────────────────────────────────────┘   │
│                                                 │
│   ...                                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

**완료 시 (3/3)**:
```
│   이번 주 진행 상황                              │
│                                                 │
│   ┌─────┐  ┌─────┐  ┌─────┐                    │
│   │  ✓  │  │  ✓  │  │  ✓  │                    │
│   │ 1회 │  │ 2회 │  │ 3회 │                    │
│   └─────┘  └─────┘  └─────┘                    │
│                                                 │
│   🎉 축하합니다! 이번 주 챌린지 완료!             │
│                                                 │
│   다음 주에도 함께해요!                          │
```

#### 2-2. 비참여자 화면 (직접 URL 접근 시)

**레이아웃**:
```
┌─────────────────────────────────────────────────┐
│ ← 집밥 챌린지                                    │
├─────────────────────────────────────────────────┤
│                                                 │
│         [일러스트 이미지]                        │
│                                                 │
│   현재 챌린지 참여 대상이 아닙니다               │
│                                                 │
│   다음 챌린지에 참여하고 싶으시다면              │
│   아래 버튼을 눌러 신청해주세요!                  │
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │  📝 다음 챌린지 참여 신청하기            │   │
│   └─────────────────────────────────────────┘   │
│            (구글폼 링크 연결)                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### 3. 상태별 UI 정리

| 상태 | 홈 배너 | 상세 페이지 |
|------|---------|-------------|
| 비참여자 | 표시 안함 (null) | 안내 + 구글폼 링크 |
| 0/3 | 진행 중 배너 | 빈 박스 3개 |
| 1/3 | 진행 중 배너 | 체크 1개 + 빈 박스 2개 |
| 2/3 | 진행 중 배너 | 체크 2개 + 빈 박스 1개 |
| 3/3 | 완료 축하 배너 | 체크 3개 + 축하 메시지 |
| 로딩 중 | 스켈레톤 | 스켈레톤 |
| API 에러 | 표시 안함 | 에러 안내 + 재시도 |

---

## 데이터 구조

### API 응답 (예상)

```typescript
// GET /challenges/my

// 참여자인 경우
interface ChallengeResponse {
  isParticipant: true;
  challengeType: "single" | "housewife";  // 자취생 / 주부
  challengeName: string;                   // "자취생 집밥 챌린지"
  completedCount: number;                  // 완료 횟수 (0-3)
  totalCount: number;                      // 총 횟수 (3)
  startDate: string;                       // "2024-12-16"
  endDate: string;                         // "2024-12-22"
  recipeIds: string[];                     // 이번 주 레시피 ID 목록
  kakaoOpenChatUrl: string;                // 카카오 오픈채팅 URL
}

// 비참여자인 경우
interface NonParticipantResponse {
  isParticipant: false;
}

type ChallengeApiResponse = ChallengeResponse | NonParticipantResponse;
```

### 프론트엔드 타입

```typescript
// src/features/challenge/model/types.ts

export type ChallengeType = "single" | "housewife";

export interface ChallengeInfo {
  isParticipant: true;
  challengeType: ChallengeType;
  challengeName: string;
  completedCount: number;
  totalCount: number;
  startDate: string;
  endDate: string;
  recipeIds: string[];
  kakaoOpenChatUrl: string;
}

export interface NonParticipant {
  isParticipant: false;
}

export type ChallengeData = ChallengeInfo | NonParticipant;

// 챌린지 타입별 표시 이름
export const CHALLENGE_TYPE_LABELS: Record<ChallengeType, string> = {
  single: "자취생",
  housewife: "주부",
};

// 구글폼 URL (비참여자용)
export const CHALLENGE_SIGNUP_FORM_URL = "https://forms.gle/xxx"; // TODO: 실제 URL로 교체
```

### Mock 데이터 (개발용)

```typescript
// src/features/challenge/model/mockData.ts

export const MOCK_CHALLENGE_PARTICIPANT: ChallengeInfo = {
  isParticipant: true,
  challengeType: "single",
  challengeName: "자취생 집밥 챌린지",
  completedCount: 2,
  totalCount: 3,
  startDate: "2024-12-16",
  endDate: "2024-12-22",
  recipeIds: ["recipe-1", "recipe-2", "recipe-3"],
  kakaoOpenChatUrl: "https://open.kakao.com/xxx",
};

export const MOCK_NON_PARTICIPANT: NonParticipant = {
  isParticipant: false,
};
```

---

## 로딩/에러 처리

기존 코드베이스 패턴 적용 (`SSRSuspense`, `SSRErrorBoundary`):

### 컴포넌트 구조

```typescript
// Template + Ready + Skeleton 패턴 (myRecipe.tsx, popularRecipes.tsx 참고)

// 배너
<SSRSuspense fallback={<ChallengeBannerSkeleton />}>
  <ChallengeBannerReady />
</SSRSuspense>

// 상세 페이지
<SSRSuspense fallback={<ChallengePageSkeleton />}>
  <ChallengePageReady />
</SSRSuspense>
```

### 배너 에러 처리

- API 실패 시: 배너 숨김 (null 반환)
- 사용자 경험 우선 (홈 화면 차단하지 않음)

### 상세 페이지 에러 처리

- API 실패 시: 에러 메시지 표시 + 재시도 버튼

---

## 파일 구조

```
src/features/challenge/
├── ui/
│   ├── ChallengeBanner.tsx           # 홈 배너 (Ready + Skeleton)
│   ├── ChallengeProgressBox.tsx      # 진행 상황 박스 (3개)
│   ├── KakaoLinkButton.tsx           # 카카오톡 인증 버튼
│   └── NonParticipantView.tsx        # 비참여자 안내 화면
├── model/
│   ├── types.ts                      # 타입 정의
│   └── mockData.ts                   # Mock 데이터
├── api/
│   └── challengeApi.ts               # API 호출 함수
└── index.ts                          # export

src/views/challenge/
├── ui/
│   └── index.tsx                     # 챌린지 페이지 메인 컴포넌트
└── index.ts

pages/challenge/
└── index.tsx                         # Next.js 페이지 라우트
```

---

## 구현 계획

### Phase 1: UI 구현 (API 없이)

| 순서 | 작업 | 파일 |
|------|------|------|
| 1 | 폴더 구조 생성 | `features/challenge/` |
| 2 | 타입 정의 | `model/types.ts` |
| 3 | Mock 데이터 작성 | `model/mockData.ts` |
| 4 | 진행 상황 박스 | `ui/ChallengeProgressBox.tsx` |
| 5 | 카카오 버튼 | `ui/KakaoLinkButton.tsx` |
| 6 | 홈 배너 컴포넌트 | `ui/ChallengeBanner.tsx` |
| 7 | 비참여자 뷰 | `ui/NonParticipantView.tsx` |
| 8 | 챌린지 페이지 | `views/challenge/ui/index.tsx` |
| 9 | 페이지 라우트 | `pages/challenge/index.tsx` |
| 10 | 홈에 배너 연결 | `views/home/ui/index.tsx` |

### Phase 2: API 연동

| 순서 | 작업 | 파일 |
|------|------|------|
| 1 | API 함수 작성 | `api/challengeApi.ts` |
| 2 | React Query 훅 | `model/useChallengeInfo.ts` |
| 3 | Mock → 실제 API 교체 | 각 컴포넌트 |

---

## 삭제 가이드

챌린지 종료 후 코드 제거 방법:

1. `src/features/challenge/` 폴더 삭제
2. `src/views/challenge/` 폴더 삭제
3. `pages/challenge/` 폴더 삭제
4. `src/views/home/ui/index.tsx`에서 `<ChallengeBanner />` 한 줄 제거
5. (선택) 이 문서 삭제

**예상 소요 시간**: 5분 이내

---

## 참고사항

### 사용자 태그 시스템

- 닉네임#태그 형식으로 사용자 구분
- 태그 생성: `providerSub`를 djb2 해시 → 4자리 숫자
- 구현 위치: `views/settings/entities/user/model.tsx`

### 기존 컴포넌트 재활용

- **레시피 카드**: `PopularRecipes`의 `RecipeCardReady` 참고
- **스켈레톤**: `@/components/ui/skeleton`, `TextSkeleton`
- **Suspense**: `SSRSuspense` 사용
- **컴포넌트 패턴**: `Template` + `Ready` + `Skeleton` 분리

### 다국어

- 추후 영어 지원 시 `useHomeTranslation` 패턴 참고
- 현재는 한국어만 지원

---

## 미정 사항

| 항목 | 상태 | 비고 |
|------|------|------|
| API 엔드포인트 분리 여부 | 미정 | 서버 팀과 협의 필요 |
| 구글폼 URL | 미정 | 생성 후 상수에 추가 |
| 카카오 오픈채팅 URL | 미정 | 생성 후 API에 포함 |

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2024-12-19 | 최초 작성 |
| 2024-12-19 | 기간 정보, 완료 상태, 비참여자 처리, 로딩/에러 패턴 추가 |
