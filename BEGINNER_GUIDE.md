## 📄 소스 코드 문법 및 로직 상세 분석
이 문서는 `src/` 디렉토리에 존재하는 모든 파일을 빠짐없이 순서대로 분석합니다. 각 섹션은 실제 코드 기반으로 Syntax와 Logic을 설명합니다.

---

## 📂 1. src/services/ (API 통신)

### 1.1 `src/services/api.js`
Axios 인스턴스를 생성하는 모듈입니다.
- `import axios from 'axios'`: Axios 라이브러리 로드.
- `const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'`: 환경 변수 우선, 없으면 기본 URL 사용.
- `axios.create({ baseURL, headers })`: 공통 헤더 포함한 HTTP 클라이언트 생성.
- `export const apiClient`: 생성된 인스턴스 export.

### 1.2 `src/services/kanbanApi.js`
보드/업무/로그 CRUD API 함수 모음입니다.
- `fetchBoards / fetchTasks / fetchLogs`: `GET` 요청으로 목록 조회.
- `createBoard / createTask / createLog`: `POST` 요청으로 생성.
- `updateBoard / updateTask`: `PUT` 요청으로 전체 수정.
- `deleteBoard / deleteTask / deleteLog`: `DELETE` 요청으로 삭제.
- 각 함수는 `apiClient`를 사용하여 일관된 설정을 유지합니다.

---

## 📂 2. src/data/ (초기 데이터)

### 2.1 `src/data/seed.js`
API 실패 시 대체로 사용하는 기본 데이터입니다.
- `seedBoards / seedTasks / seedLogs`: 초기 보드, 업무, 로그 배열.
- 날짜는 문자열 ISO 포맷으로 저장되어 JSON Server와 호환됩니다.

---

## 📂 3. src/stores/ (상태 관리)

### 3.1 `src/stores/kanbanStore.js`
Pinia 기반 전역 상태 스토어입니다.
- `defineStore('kanban', { state, getters, actions })`: 스토어 정의.
- `state`: 로그인 상태, 선택된 보드, 보드/업무/로그 목록 등 전역 상태.
- `getters`: `selectedBoard`, `boardTasks`, `boardLogs` 파생 상태 계산.
- `initialize()`: 인증 초기화 + 사용자 로드 + 데이터 로딩.
- `loadData()`: API 호출 실패 시 `seed` 데이터로 fallback.
- `loginUser / registerUser / logoutUser`: 인증 로직 연동.
- `saveBoard / updateBoard / deleteBoard`: 보드 CRUD 및 관련 데이터 정리.
- `updateTasks`: 로컬 상태 갱신 후 API 반영.
- `updateLogs`: 새 로그만 API 반영.

---

## 📂 4. src/utils/ (유틸리티)

### 4.1 `src/utils/auth.js`
로컬 스토리지 기반 인증 유틸입니다.
- `USERS_KEY / CURRENT_USER_KEY`: 저장 키 상수.
- `initializeAuth()`: 기본 유저 시드 저장.
- `register()`: 신규 사용자 등록.
- `login()`: 로그인 성공 시 현재 사용자 저장.
- `logout()`: 현재 사용자 제거.
- `updateProfile()`: 사용자 정보 및 아바타 갱신.
- `getAllRegisteredUsers()`: 사용자 목록을 아바타 URL 포함 형태로 반환.

---

## 📂 5. src/components/ (UI 컴포넌트)

### 5.1 `src/components/LoginPage.vue`
로그인/회원가입 화면 컴포넌트입니다.
- `ref`로 폼 상태(`formData`) 관리.
- `emit('login'/'register')`로 상위 컴포넌트에 이벤트 전달.
- 비밀번호 표시 토글, 데모 로그인 제공.

### 5.2 `src/components/Sidebar.vue`
좌측 사이드바 UI입니다.
- 사용자 정보, 메뉴, 로그아웃 버튼 표시.
- `emit('viewChange')`로 대시보드/내업무/즐겨찾기 전환.

### 5.3 `src/components/DashboardView.vue`
보드 목록 및 내 업무/즐겨찾기 화면입니다.
- `accessibleBoards` 계산: 생성자 또는 멤버만 표시.
- `searchQuery`로 보드/업무 필터링.
- `myTasks`, `favoriteTasks` 계산.
- 카드 클릭 시 상위 이벤트 전달.

### 5.4 `src/components/BoardCard.vue`
보드 카드 UI 컴포넌트입니다.
- 보드 제목/설명/멤버 수 표시.
- 생성자 이름을 계산하여 표시.

### 5.5 `src/components/BoardModal.vue`
보드 생성/수정 모달입니다.
- `formData`로 입력값 관리.
- 팀원 초대/선택, 보드 색상 선택.
- 저장 시 멤버 객체 배열로 변환 후 `emit('save')`.

### 5.6 `src/components/KanbanBoardView.vue`
보드 상세 화면입니다.
- 업무 필터(담당자/우선순위) 적용.
- 드래그 앤 드롭으로 컬럼 이동.
- 업무 생성/수정/삭제 시 로그 자동 기록.
- 보드 수정/삭제 메뉴(생성자만 표시).
- 업무 CRUD 완료 시 `AlertModal` 표시.

### 5.7 `src/components/KanbanColumn.vue`
상태별 업무 컬럼입니다.
- `tasks`를 반복 렌더링.
- 드래그 이벤트를 상위에 전달.

### 5.8 `src/components/TaskCard.vue`
업무 카드 컴포넌트입니다.
- 우선순위 색상, 담당자 요약 표시.
- 즐겨찾기 토글 버튼 포함.

### 5.9 `src/components/TaskModal.vue`
업무 생성/수정 모달입니다.
- 담당자 목록 구성 로직 포함.
- 필수값(제목, 담당자) 검증.
- 삭제 시 확인 후 `emit('delete')`.

### 5.10 `src/components/FilterBar.vue`
담당자/중요도 필터 UI입니다.
- `emit('assigneeChange' / 'priorityChange')`로 상태 변경.

### 5.11 `src/components/ActivityTimeline.vue`
활동 로그 타임라인입니다.
- 액션 유형에 따른 아이콘/색상 적용.
- 시간 포맷을 `toLocaleString('ko-KR')`로 표시.

### 5.12 `src/components/ProfileModal.vue`
프로필 수정 모달입니다.
- DiceBear 아바타 랜덤 생성 기능.
- 스타일 변경 및 선택 지원.

### 5.13 `src/components/AlertModal.vue`
커스텀 알림 모달입니다.
- 제목/메시지/확인 버튼 제공.
- 단순 확인형 UX에 사용.

---

## 📂 6. src/styles/ (스타일)

### 6.1 `src/styles/globals.css`
Tailwind 기반 전역 스타일입니다.
- `@tailwind base/components/utilities`로 유틸리티 활성화.
- 기본 폰트/색상/테마 변수 정의.
- `@layer base`로 기본 배경/텍스트 적용.

---

## 📂 7. src/ (진입점 및 문서)

### 7.1 `src/App.vue`
루트 컴포넌트입니다.
- 로그인 여부에 따라 `LoginPage` 또는 메인 레이아웃 렌더링.
- 보드/업무 CRUD 이벤트를 스토어로 위임.
- 보드 생성/수정/삭제 완료 시 `AlertModal` 표시.

### 7.2 `src/main.js`
애플리케이션 엔트리 포인트입니다.
- `createApp(App)`으로 Vue 앱 생성.
- `createPinia()`로 전역 상태 연결.
- `mount('#app')`로 렌더링 시작.

### 7.3 `src/README.md`
`src` 기준 간단 안내 문서입니다.
- 프로젝트 구조, 실행 방법, 기술 스택 요약.

### 7.4 `src/SETUP_INSTRUCTIONS.md`
설치/실행 가이드 상세 문서입니다.
- 의존성 설치, 실행, 문제 해결 정보 포함.

### 7.5 `src/Attributions.md`
외부 리소스/저작권 관련 표기 문서입니다.

### 7.6 `src/guidelines/Guidelines.md`
프로젝트 작업 시 가이드라인 문서입니다.
