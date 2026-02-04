# � Kanban-Flow 시스템 초보자 가이드

이 문서는 Kanban-Flow 프로젝트의 전체적인 시스템 흐름, 함수 호출 구조, 데이터 관리, 그리고 유효성 검증 및 모달 시스템에 대해 상세하게 설명합니다.

---

## 1. 🏗️ 시스템 아키텍처 및 기술 스택 (System Architecture)

### 1-1. 기술 스택
- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **State Management**: Pinia (`stores/kanbanStore.js`)
- **Routing**: Vue Router (`router/index.js`)
- **Styling**: Tailwind CSS (Utility-first)
- **Icons**: Lucide Vue Next

### 1-2. 전체 데이터 흐름 (Data Flow)
1. **진입점**: `main.js`에서 앱이 마운트되고, `router`와 `pinia`가 설치됩니다.
2. **라우팅 가드 (`router/index.js`)**:
   - 페이지 이동 전(`beforeEach`) 로그인 상태(`store.isLoggedIn`)를 확인합니다.
   - 로그인이 안 된 경우 `/login`으로 리다이렉트합니다.
   - `/board/:id`와 같은 경로 진입 시 `store.selectBoard(id)`를 호출하여 해당 보드 데이터를 활성화합니다.
3. **상태 관리 (`kanbanStore.js`)**:
   - `boards`, `tasks`, `logs`, `currentUser` 등의 핵심 데이터는 Pinia Store에서 전역으로 관리됩니다.
   - API 호출(실제/Mock)은 Store의 Action(`loadData`, `saveBoard`, `addTask` 등)을 통해 이루어집니다.

---

## 2. � 상세 시스템 플로우 (System Flow Scenarios)

### 시나리오 A: 애플리케이션 시작 및 로그인
1. **앱 실행**: 사용자가 접속하면 `App.vue`가 로드됩니다.
2. **초기화**: `router.beforeEach`에서 `store.initialize()`가 실행되어 로컬 스토리지 등에서 이전 세션을 복구합니다.
3. **로그인 판별**: 
   - 로그인 X → `Login` 페이지 (`LoginPage.vue`) 표시.
   - 로그인 O → `Dashboard` 페이지 (`DashboardView.vue`) 표시.

### 시나리오 B: 대시보드에서 보드 관리
1. **보드 목록 조회**: `DashboardView.vue`는 `store.boards`를 구독하여 사용자가 접근 가능한 보드만 필터링해 보여줍니다.
2. **새 보드 생성**:
   - 사용자가 "새 보드" 버튼 클릭 → `emit('createBoard')` 발생.
   - 상위 컴포넌트(`App.vue`)에서 `BoardModal`을 엽니다 (`isBoardModalOpen = true`).
   - `BoardModal`에서 정보 입력 후 "생성하기" 클릭 → `emit('save')` 발생.
   - `App.vue`의 `handleSaveBoard` 함수가 호출되어 `store.saveBoard()` 실행.

### 시나리오 C: 칸반 보드 내 업무 관리 (핵심)
1. **보드 진입**: `/board/:id` 경로 진입 → `KanbanBoardView.vue` 마운트 → `store.selectBoard(id)` 호출.
2. **업무 생성 (Task Creation)**:
   - "새 작업 추가" 버튼 클릭 → `handleAddTask` 함수 실행 → `TaskModal` 열림 (`isModalOpen = true`).
   - `TaskModal`에서 제목/담당자 입력 후 "저장" 클릭 → 유효성 검증(Validation) 수행.
   - 성공 시 `emit('save')` → `handleSaveTask` 함수 실행 → `store.addTask()` 호출 및 로그(Log) 기록.
3. **업무 이동 (Drag & Drop)**:
   - `KanbanColumn.vue`에서 드래그 이벤트 발생 → `emit('drop')`으로 부모에게 알림.
   - `KanbanBoardView.vue`의 `handleDrop` 함수 실행 → `store.updateTaskItem()` 호출로 상태(Column) 변경 및 로그 기록.

---

## 3. 🛡️ 유효성 검증 및 모달 시스템 (Validation & Modals)

각 화면 및 기능별로 입력값을 검증하고 사용자에게 피드백을 주는 방식이 다릅니다.

### 3-1. 업무 관리 (TaskModal.vue)
이 모달은 업무를 생성하거나 수정할 때 사용됩니다.
- **검증 트리거**: "저장" 버튼 클릭 시 (`handleSave` 함수)
- **검증 규칙**:
  1. **제목(`title`)**: 비어있으면 안 됨.
  2. **담당자(`assignees`)**: 최소 1명 이상 선택되어야 함.
- **실패 시 동작**: 
  - 브라우저 기본 `alert` 대신 커스텀 **`AlertModal`** 컴포넌트를 띄워 경고 메시지를 보여줍니다.
- **삭제 시 동작**:
  - "삭제" 버튼 클릭 시 바로 삭제하지 않고 **`ConfirmModal`** 컴포넌트를 띄워 사용자의 최종 확인을 받습니다. ("정말 삭제하시겠습니까?")

### 3-2. 프로필 수정 (ProfileModal.vue)
사용자의 정보(이름, 아바타)를 수정할 때 사용됩니다.
- **검증 트리거**: "저장" 버튼 클릭 시 (`handleSave` 함수)
- **검증 규칙**:
  1. **이름(`name`)**: 비어있으면 안 됨.
- **실패 시 동작**:
  - **`AlertModal`** 컴포넌트를 사용하여 "이름을 입력해주세요." 메시지를 표시합니다.

### 3-3. 보드 생성/수정 (BoardModal.vue)
새로운 보드를 만들거나 설정을 변경할 때 사용됩니다.
- **검증 트리거**: "저장/생성" 버튼 클릭 시 (`handleSave` 함수)
- **검증 규칙**:
  1. **보드 제목(`title`)**: 비어있으면 안 됨.
- **실패 시 동작**:
  - 별도의 모달을 띄우지 않고, **입력 필드 하단에 빨간색 텍스트**("보드 제목을 입력해주세요.")를 노출하는 **인라인 에러(Inline Error)** 방식을 사용합니다. (`showTitleError` 상태값 사용)

### 3-4. 로그인/회원가입 (LoginPage.vue)
- **검증 트리거**: 폼 제출 시 (`handleSubmit` 함수)
- **검증 규칙**:
  - **로그인**: 이메일, 비밀번호 필수.
  - **회원가입**: 이름, 이메일, 비밀번호 필수. 비밀번호는 6자 이상.
- **실패 시 동작**:
  - 폼 상단에 **붉은색 박스 형태의 에러 메시지**를 표시합니다. (`error` 상태값 사용)

---

## 4. 🧩 주요 컴포넌트 호출 관계 요약

| 기능 | 주체 컴포넌트 | 호출되는 자식 컴포넌트 | 담당 함수 (이벤트 핸들러) | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| **전역 레이아웃** | `App.vue` | `Sidebar`, `RouterView`, `BoardModal`, `ProfileModal` | `handleCreateBoard`, `handleEditProfile` | 모달 상태를 전역에서 관리 |
| **대시보드** | `DashboardView.vue` | `BoardCard` | `emit('createBoard')` -> App.vue로 전달 | 보드 클릭 시 라우팅 처리 |
| **칸반 보드** | `KanbanBoardView.vue` | `KanbanColumn`, `TaskModal`, `FilterBar`, `ActivityTimeline` | `handleAddTask`, `handleSaveTask` | 보드 내 모든 액션의 중심 |
| **컬럼/카드** | `KanbanColumn.vue` | `TaskCard` | `emit('edit')`, `emit('drop')` | 드래그 앤 드롭 이벤트 발생지 |

---

이 문서는 프로젝트의 구조를 이해하고 유지보수하는 데 도움을 주기 위해 작성되었습니다. 새로운 기능을 추가할 때는 위 흐름을 참고하여 적절한 위치에 로직을 배치하세요.
