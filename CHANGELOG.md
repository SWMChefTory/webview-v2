# Changelog

모든 주요 변경사항은 이 파일에 기록됩니다.

포맷은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 따르며,
이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 준수합니다.

---

## [1.1.9] - 2026-03-05

### 추가

- **레시피 노출/클릭 추적 시스템**: IntersectionObserver 기반 레시피 카드 노출(Impression) 및 클릭(Click-through) 추적 구현
  - 8개 Surface 전체 커버: `HOME_MY_RECIPES`, `HOME_POPULAR_RECIPES`, `HOME_POPULAR_SHORTS`, `USER_RECIPES`, `POPULAR_RECIPES`, `SEARCH_TRENDING`, `SEARCH_RESULTS`, `CATEGORY_RESULTS`
  - `useRecipeTracking` 훅: requestId 관리, observeRef(노출 감지), trackClick(클릭 추적) 제공
  - `useImpressionObserver` 훅: threshold 0.5, 1초 debounce 배치 전송, 세션 내 중복 방지
  - click 시 impression 미전송 건 자동 보충 (CTR 정합성 보장)
  - `visibilitychange` 이벤트로 탭 이탈 시 잔여 버퍼 flush
  - `resetKey` 패턴으로 카테고리/검색어 변경 시 requestId 자동 갱신
- **공유 위젯 확장**: `ShortsRecipeListMobile`, `NormalRecipeListMobile`에 `observeRef` prop 추가

### 수정

- **position 0-based 통일**: 기존 Amplitude 1-based position과 분리하여 추적 시스템은 0-based로 통일
- **모바일 shorts/normal 별도 인덱싱**: 필터된 리스트 기준 0-based index 사용

---

## [1.1.8] - 2026-03-02

### 추가

- **나의 레시피 Amplitude 이벤트 추적**: 카테고리 선택, 추가, 삭제 등 주요 동작에 이벤트 추적 연동
  - `USER_CATEGORY_SELECT`, `USER_CATEGORY_CREATE_OPEN`, `USER_CATEGORY_DELETE_SUCCESS` 등

---

## [1.1.7] - 2026-03-02

### 추가

- **레시피 신고 기능**: 레시피 상세 페이지에 더보기 메뉴 → 신고하기 기능 구현
  - `RecipeReportModal` 위젯: 신고 사유 선택 및 제출 UI
  - `RecipeMoreMenu` 위젯: 드롭다운 방식의 더보기 메뉴
  - `recipe-report` entity: 신고 API 연동 및 Zod 스키마 정의
- **유튜브 검색 배너**: 검색 결과 및 빈 결과 화면에서 유튜브로 바로 검색할 수 있는 배너 위젯
- **Amplitude 신규 이벤트 10개 추가**: `recipe_enroll_click/success/fail`, `recipe_detail_comment_detail_click`, `recipe_detail_ingredient_detail_click`, `recipe_detail_video_seek`, `search_trend_recipe_click`, `category_view`, `category_recipe_click`, `tutorial_handsfree_complete`

### 리팩토링

- **RecipeCardWrapper 제거 및 네비게이션 리팩토링**:
  - `RecipeCardWrapper` 컴포넌트 완전 삭제, `navigateToRecipeDetail` 유틸리티로 대체
  - 14개 파일에서 인라인 onClick 패턴으로 전환
- **Amplitude 이벤트 구조 개선**:
  - 카드 생성 이벤트 4개 삭제, 쿠팡 이벤트 3개 리네이밍
  - entity 훅에서 `track()` 제거 → 컴포넌트 레벨 mutate 콜백으로 이동
  - `mutateAsync` + try/catch → `mutate` + `{ onSuccess, onError }` 콜백 패턴으로 변경

### 수정

- **딥링크 이중 실행 버그 수정**: 유튜브 검색 배너 딥링크 중복 호출 방지
- **레시피 차단 상태 번역 추가**: `progress.blocked` 키 추가, BANNED/BLOCKED 상태 텍스트 표시
- **recipe title null 허용**: 레시피 스키마에서 `recipeTitle`을 nullable로 변경
- **ChallengeRecipeCard**: 카드 이벤트 관련 필드 제거
- **IngredientPurchaseModal**: 리네이밍된 쿠팡 이벤트 enum 적용

---

## [1.1.6] - 2026-02-24

### 추가

- **OAuth 인증 전환**: 웹 브라우저 로그인을 외부 랜딩페이지에서 내부 `/auth` 페이지로 전환
- **OAuth 회원가입**: 신규 사용자 OAuth 회원가입 플로우 추가 (약관 동의 모달)
- **레시피 상세 조회**: 레시피 detail 조회 기능 구현 및 데스크톱/태블릿 지원
- **설정 페이지**: 버전정보 페이지 추가, 카카오톡 문의하기 기능
- **온보딩 개선**: 완료 단계 다음버튼 활성화 및 인기레시피 이동 기능
- **인기 레시피**: 커서 기반 페이지네이션으로 전환
- **레시피 카드**: 카드 클릭 시 레시피 생성에서 레시피 조회로 전환

### UI/UX 개선

- **레시피 상세 UI 전면 개편**: 아이콘 교체, 패딩/스켈레톤 통일, 설명 더보기, 구분선 추가, 재료칩 정렬, iOS 스크롤 개선
- **온보딩 Step2**: 서브스테이트 4단계에서 3단계로 변경 (변경된 레시피 상세 UI 반영), cooking 모드 다음버튼 딜레이 4초에서 2초로 단축
- **온보딩 Analytics**: Amplitude 이벤트 3개 핵심 이벤트로 단순화
- **크레딧 충전**: 충전 모달 개선 및 에러 처리 강화
- **레시피 카테고리/검색**: 카테고리, 검색 결과 조회 페이지 UI/UX 개선
- **설정 페이지**: 리팩토링 및 문의하기 레이아웃 개선
- **레시피 카드**: 디자인 개선

### 수정

- **Auth**: 무한 리다이렉트 방지, Apple redirect URL 수정, errorcode 변경
- **Auth 보안**: 인증 코드 보안 및 안정성 개선, origin fallback 하드코딩을 환경변수(`NEXT_PUBLIC_SITE_URL`)로 수정
- **레시피 상세**: ErrorBoundary 추가, 태블릿/데스크탑 베리 잠금 구현, 모바일 더보기 렌더링 버그 수정
- **플로팅버튼**: 동작 수정 및 번역 추가
- **레시피 등록**: 모달 이미지 버그 수정
- **인기레시피**: 라우팅 경로 변경
- **에러 처리**: 실패한 레시피 조회 시 에러바운더리 도입

### 리팩토링

- **Auth**: 데드 코드 삭제 및 인증 관련 코드 정리
- **레시피 상세**: 데드코드 삭제 및 i18n 정비

### 인프라

- Dockerfile에서 Google/Apple Client ID 환경변수 연동
- GitHub Secrets 기반 환경변수 관리
- gitflow 환경변수 로직 추가
- Apple 로그인 인프라 설정

### 삭제

- 챌린지 페이지 삭제
- 불필요한 컴포넌트 제거

---

## [1.1.5] - 2026-02-09

### 추가

- **온보딩 기능**: 첫 방문 사용자를 위한 3단계 온보딩 튜토리얼
  - Step 1: 레시피 공유 튜토리얼 (4개 하위 스텝)
  - Step 2: 음성 인식 튜토리얼 (WebSocket STT, TEN VAD)
  - Step 3: 완료 & 인기 레시피 (30베리 보상 지급)
  - Tory 캐릭터 애니메이션 및 Framer Motion 트랜지션
  - 건너뛰기 기능 지원
  - Amplitude 이벤트 추적 통합

- **크레딧 충전 모달**: 카카오톡 공유를 통한 베리 충전 기능
  - 일일 3회 충전 한도
  - 클립보드 복사 → 카카오톡 공유 → 완료 화면 플로우
  - 모든 에러를 사용자 친화적으로 처리 (한도 초과 UI로 안내)
  - 드래그해서 닫기 지원
  - 충전 완료 시 Balance 갱신

- **플로팅 버튼 개선**: YouTube URL 입력을 통한 레시피 생성 연결
  - 첫 방문 시 Popover 툴팁 안내
  - 빈 URL 전달로 YouTube 입력 유도

- **파비콘 추가**: 브랜드 파비콘 (`public/favicon.ico`)

### 다국어 지원

- **온보딩 다국어**: 한국어 (`public/locales/ko/onboarding.json`), 영어 (`public/locales/en/onboarding.json`)
- **충전 다국어**: 한국어 (`public/locales/ko/recharge.json`), 영어 (`public/locales/en/recharge.json`)

### UI/UX 개선

- 온보딩 스텝별 슬라이드 애니메이션 및 햅틱 피드백
- 음성 인식 실패 시 터치 버튼 대체 지원
- 반응형 온보딩 UI (모바일/태블릿/데스크탑)
- 크레딧 충전 모달 반응형 디자인

### 수정

- **로그인 로직 간소화**: `TokenRefreshFailedError` 처리 제거, 네이티브 로그인만 유지

### 기술 스택

- WebSocket STT 서비스 연동 (요리모드와 동일)
- TEN VAD (Voice Activity Detection) 라이브러리
- Zustand 상태 관리 (온보딩, 충전 모달)
- Framer Motion 애니메이션

---

## [1.1.4] - 2026-01.25
### 수정
- **레시피 생성 모달/폼 다국어 지원 추가**: recipe-creating-modal, recipe-creating-form의 하드코딩된 한국어 텍스트를 i18n으로 교체
  - `recipeCreating.modal` 섹션 신규 추가 (등록 완료, 생성중, 실패 메시지, 이동하기, 등록할게요, 충전하기, 제목/제출 버튼 텍스트)
  - `recipeCreating.berry` 섹션에 `usesOne` 키 추가
  - recipeErollModal.tsx, recipeCardWrapper.tsx, recipeCreatingForm.tsx의 하드코딩된 한국어 텍스트를 `t()` 함수 호출로 교체

---

## [1.1.3] - 2026-01.25
### 추가
	- 베리 충전 버튼 안내 문구 추가
	-	베리 충전 버튼 클릭 시, 현재 구현 중인 기능임을 명확히 안내
	-	실제 결제/충전 기능은 제공되지 않으며, UX 혼란 방지를 위한 사전 고지 목적
	-	향후 결제 플로우 확장 예정
	-	레시피 단계 페이지에서 쇼츠 레시피 UI 지원
	-	쇼츠 레시피 전용 UI를 기존 레시피 단계 페이지에서도 동일하게 제공
	-	쇼츠 기반 레시피도 일반 레시피와 동일한 단계 네비게이션 UX 지원
	-	단계 이동
	-	반복 재생(Loop)
	-	타이머 및 컨트롤 UI 일관성 유지
-	콘텐츠 타입(일반/쇼츠)에 따른 UI 분기 최소화로 유지보수성 개선

### UI/UX 개선
	-	충전 버튼 사용자 기대치 관리
	-	“충전” 액션에 대한 오해를 줄이기 위해 명확한 상태 안내 UX 적용
	-	쇼츠 레시피 몰입도 개선
	-	짧은 영상 흐름을 해치지 않으면서도 단계 기반 조작 가능하도록 UI 조정

---

## [1.1.2] - 2026-01-05

### 추가

- **태블릿 UI 지원**: 태블릿(768px~1023px) 및 데스크탑(1024px~) 반응형 레이아웃 추가
  - 컴포넌트 분리 아키텍처 구현 (`.mobile.tsx`, `.tablet.tsx`, `.common.tsx`)
  - HomePage, CategorySection, MyRecipes, PopularRecipes 등 주요 섹션 태블릿 대응
  - 반응형 그리드 시스템: CategorySection (6열/8열), RecipeCard 최적화
  - `breakpoints` 상수 및 `useMediaQuery` 훅 추가
  - 모바일 UI 100% 보존 (기존 클래스 유지, `md:`/`lg:` 프리픽스만 추가)

- **웹 브라우저 OAuth 로그인 지원**: 웹 브라우저에서 OAuth 로그인 후 접속 가능
  - URL 파라미터 토큰 자동 추출 및 localStorage 저장
  - 환경별 token refresh (Native: bridge / Web: Backend API)
  - Native app 기존 동작 100% 유지

### UI/UX 개선

- **반응형 레이아웃**: 화면 크기에 최적화된 그리드 및 패딩 조정
  - 모바일: 기존 2열 레이아웃 유지
  - 태블릿: 3~4열 카드 그리드, 넓은 패딩
  - 데스크탑: 4~6열 카드 그리드, 최대 너비 제한
- **CategorySection 최적화**: 패딩 중복 제거, 그리드 간격 개선

---

## [1.1.1] - 2026-01-01

### 추가

- **베리 크레딧 시스템**: 레시피 생성 시 베리(크레딧) 차감 기능
  - 홈 헤더에 게임 UI 스타일 베리 잔액 표시 및 충전 버튼
  - 레시피 생성 모달에 베리 아이콘 및 잔액 안내 추가
  - 설정 페이지 베리 UI 개선 (애니메이션, 색상 강조, 아이콘)
  - Amplitude 이벤트 추적 (`RECHARGE_CLICK` 이벤트 추가)

### 수정

- **다국어 리팩토링**: i18n 구조 개선 및 기존 패턴 유지
  - 번역 네임스페이스 분리 및 관리 개선
  - 영문 번역 추가 (berry 관련 문구)
- **에러 핸들링 개선**: SSRSuspense ErrorBoundary 강화
  - `useFetchBalance` 호출을 SSRSuspense 경계 내부로 이동
  - ErrorBoundary에 `errorInfo` 파라미터 추가 (스택 추적 개선)
  - 설정 페이지 크래시 방지

### UI/UX 개선

- 홈 헤더 베리 표시: 오렌지 그라데이션 + 버튼, 3D 효과
- 레시피 생성 모달: 베리 아이콘 정렬 개선, 2줄 래핑 방지
- 설정 페이지: 베리 섹션 탭 애니메이션 및 화살표 아이콘 추가

---

## [1.1.0] - 2025-12-29

### 추가

- **다국어 지원 (i18n)**: next-i18next를 활용한 한국어/영어 지원
  - 기기 언어 설정에 따른 자동 언어 전환
  - 주요 UI 문구 번역 완료
- **Amplitude 분석 통합**: 사용자 행동 추적 및 분석 시스템 구축
  - Session Replay 플러그인 통합
  - 페이지 뷰 및 이벤트 추적
- **에러 바운더리**: react-error-boundary를 활용한 안정적인 에러 처리
- **반응형 디자인**: 모바일 및 데스크톱 환경에 최적화된 UI/UX
- **다크 모드**: next-themes를 활용한 라이트/다크 테마 지원

### 수정

- Next.js 16으로 업그레이드 및 성능 최적화
- React 19.1.0으로 업그레이드
- TypeScript 설정 개선

### 기술 스택

- **Frontend Framework**: Next.js 16.0.8
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5.0.8
- **Data Fetching**: TanStack React Query 5.90.2
- **Internationalization**: next-i18next 15.4.3
- **Analytics**: Amplitude Browser SDK 2.32.2

---

## [1.0.0] - 2025-XX-XX

### 추가

- 초기 출시 버전
- Next.js 기반 WebView 애플리케이션
- 레시피 뷰어 및 타이머 기능
- 유튜브 영상 임베딩
- 음성 인식 기능 (VAD)

---

## Release Notes (배포용)

### v1.1.0

**🌍 글로벌 지원**
- 한국어/영어 자동 언어 전환
- 다국어 UI 및 콘텐츠 제공

**📊 분석 및 모니터링**
- Amplitude 통합으로 사용자 행동 분석
- Session Replay로 사용자 경험 개선

**🎨 UI/UX 개선**
- 다크 모드 지원
- 반응형 디자인 최적화
- 안정적인 에러 처리

**⚡ 성능 향상**
- Next.js 16 업그레이드
- React 19.1 업그레이드
- Turbopack 빌드 시스템 적용

---

## Technical Details (개발팀용)

### v1.1.0 - 상세 변경사항

#### Frontend (Next.js/React)

- **Internationalization**:
  - Package: `next-i18next: ^15.4.3`
  - 로케일 감지 및 자동 전환
  - 번역 파일 구조화 (`public/locales/{ko,en}`)

- **Analytics Integration**:
  - Package: `@amplitude/analytics-browser: ^2.32.2`
  - Session Replay Plugin: `@amplitude/plugin-session-replay-browser: ^1.25.2`
  - 페이지 뷰 및 커스텀 이벤트 추적

- **Theme System**:
  - Package: `next-themes: ^0.4.6`
  - CSS 변수 기반 테마 전환
  - 시스템 설정 감지 및 수동 전환 지원

- **Performance Optimization**:
  - Turbopack 빌드 시스템 활성화
  - 코드 스플리팅 및 동적 임포트
  - 이미지 최적화 (Next.js Image)

#### Dependencies Updates

- **Major**:
  - Next.js: 15.x → 16.0.8
  - React: 18.x → 19.1.0
  - Tailwind CSS: 3.x → 4.x
  - TypeScript: 5.x (최신 유지)

- **New Additions**:
  - `@radix-ui/*`: 접근성 좋은 UI 컴포넌트
  - `driver.js`: 사용자 온보딩 가이드
  - `sonner`: 토스트 알림 시스템
  - `vaul`: 드로어 컴포넌트

---

## [이전 버전들]

이전 버전 히스토리는 Git 태그를 참고하세요.
