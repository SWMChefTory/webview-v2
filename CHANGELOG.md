# Changelog

모든 주요 변경사항은 이 파일에 기록됩니다.

포맷은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 따르며,
이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 준수합니다.

---

## [Unreleased]

### 추가 예정
- 준비 중인 기능들

### 수정 예정
- 알려진 버그들

### 수정
- **레시피 생성 모달/폼 다국어 지원 추가**: recipe-creating-modal, recipe-creating-form의 하드코딩된 한국어 텍스트를 i18n으로 교체
  - `recipeCreating.modal` 섹션 신규 추가 (등록 완료, 생성중, 실패 메시지, 이동하기, 등록할게요, 충전하기, 제목/제출 버튼 텍스트)
  - `recipeCreating.berry` 섹션에 `usesOne` 키 추가
  - recipeErollModal.tsx, recipeCardWrapper.tsx, recipeCreatingForm.tsx의 하드코딩된 한국어 텍스트를 `t()` 함수 호출로 교체

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
