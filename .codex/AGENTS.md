# AGENTS.md

## 1. Project Overview

- **Project Name:** Quick Chat
- **Type:** Frontend & BFF Application
- **Purpose:** 실시간 채팅 웹 어플리케이션의 클라이언트 UI 및 BFF(Backend For Frontend) 레이어 담당

---

## 2. Tech Stack & Environment

- **Package Manager:** `pnpm` (pnpm workspace 기반 모노레포)
- **Language:** TypeScript (`strict` mode), TSX
- **Framework:** React Router v7 Framework (SSR Mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Runtime Target:** Node.js

---

## 3. Architecture & Repository Boundaries

### Monorepo Structure

- 본 저장소는 `pnpm-workspace`를 사용하는 모노레포입니다.
- **Main App Target:** `./apps/webs`
  - 모든 프론트엔드 작업, 라우팅, UI 컴포넌트, 클라이언트 상태 관리는 기본적으로 `./apps/webs` 디렉토리 기준으로 진행합니다.
  - 패키지 추가 시 모노레포 루트 또는 해당 앱 경로(`apps/webs`)의 의존성 분리를 준수합니다 (`pnpm --filter <app-name> add ...`).

### External Boundaries (Out of Scope)

다음 시스템들은 본 저장소 **외부(External)**에 독립적인 프로젝트로 존재하므로, 코드 생성 시 직접 구현하거나 저장소 내부로 끌어들이지 마세요:

1. **Core Backend:** Kotlin/Spring Boot (REST API, 핵심 비즈니스 로직, 인증/인가 등)
2. **Real-time Server:** Go (WebSocket, SSE 전송 계층)

> **Agent Guideline:**
>
> - 에이전트는 프론트엔드 UI, React Router의 SSR Loader/Action, BFF 계층(API 프록시/조합), 클라이언트 측 WebSocket/SSE 수신 및 연결 로직에만 집중해야 합니다.
> - 외부 백엔드/Go 서버 코드를 임의로 로컬 모노레포 내부에 생성하지 마세요.

---

## 4. Development & Coding Rules

### React Router (SSR) & Data Fetching

- React Router v7의 프레임워크 기능(`loader`, `action`, Form 등)을 표준 방식으로 활용합니다.
- 서버 사이드(BFF/Loader)와 클라이언트 사이드 실행 환경의 분리를 인지하고, 클라이언트 전용 객체(`window`, `document`, WebSocket 등)는 마운트 이후(`useEffect` 또는 브라우저 가드)에만 초기화합니다.

### Styling & UI

- **Tailwind CSS v4:** `@theme` 지시어 및 v4 CSS 우선 설정 방식을 준수하며, 불필요한 구버전 `tailwind.config.js` 오버라이드를 지양합니다.
- **shadcn/ui:** 컴포넌트는 `./apps/webs` 내 지정된 UI 디렉토리에 배치하며, 필요 시 기본 컴포넌트를 확장하여 사용합니다.

### TypeScript & Code Quality

- 엄격한 타입 정의 (`any` 사용 금지, `unknown` 활용 후 Type Guard 적용).
- API 응답 및 실시간 이벤트 페이로드는 공통 인터페이스/Zod 스키마 등으로 명확히 모델링합니다.
