# Kanban-Flow Vue 3

협업형 업무 관리 칸반 보드 - Vue 3 + Pinia + Axios + Tailwind CSS + JSON Server로 구현

## 주요 기능

- ✅ **칸반 보드**: 드래그 앤 드롭으로 작업 이동
- ✅ **작업 관리**: CRUD 작업 생성, 수정, 삭제
- ✅ **필터링**: 담당자, 우선순위별 필터링
- ✅ **활동 로그**: 모든 작업 변경 이력 추적
- ✅ **보드 관리**: 여러 보드 생성 및 관리
- ✅ **팀원 초대**: 보드에 팀원 초대 기능
- ✅ **즐겨찾기**: 중요한 작업 즐겨찾기
- ✅ **로그인/회원가입**: 사용자 인증
- ✅ **프로필 관리**: DiceBear API를 활용한 아바타 선택

## 기술 스택

- **Frontend**: Vue 3 (Composition API)
- **State**: Pinia
- **HTTP**: Axios
- **Mock API**: JSON Server
- **Styling**: Tailwind CSS
- **Icons**: Lucide Vue Next
- **Build Tool**: Vite

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# Mock API (JSON Server)
npm run mock

# 프론트 + Mock API 동시 실행
npm run dev:full

# 프로덕션 빌드
npm run build

# 프리뷰
npm run preview
```

## 데모 계정

- **이메일**: user@naver.com
- **비밀번호**: demo123

## 프로젝트 구조

```
/
├── components/           # Vue 컴포넌트
│   ├── ActivityTimeline.vue
│   ├── BoardCard.vue
│   ├── BoardModal.vue
│   ├── DashboardView.vue
│   ├── FilterBar.vue
│   ├── KanbanBoardView.vue
│   ├── KanbanColumn.vue
│   ├── LoginPage.vue
│   ├── ProfileModal.vue
│   ├── Sidebar.vue
│   ├── TaskCard.vue
│   └── TaskModal.vue
├── utils/               # 유틸리티 함수
│   └── auth.js
├── services/            # Axios API 모듈
│   ├── api.js
│   └── kanbanApi.js
├── stores/              # Pinia 스토어
│   └── kanbanStore.js
├── data/                # 초기 데이터
│   └── seed.js
├── styles/              # 스타일
│   └── globals.css
├── App.vue              # 메인 앱 컴포넌트
├── main.js              # 진입점
└── index.html           # HTML 템플릿
```

## 주요 컴포넌트

### App.vue
메인 애플리케이션 컴포넌트로 전체 상태 관리

### DashboardView.vue
대시보드, 내 업무, 즐겨찾기 뷰를 표시

### KanbanBoardView.vue
칸반 보드 메인 뷰로 드래그 앤 드롭, 필터링, 작업 관리 기능 포함

### TaskModal.vue
작업 생성/수정 모달

### BoardModal.vue
보드 생성/수정 및 팀원 초대 모달

## 로컬 스토리지

모든 데이터는 브라우저의 로컬 스토리지에 저장됩니다:
- `kanban_users`: 사용자 계정 정보
- `kanban_current_user`: 현재 로그인한 사용자

보드/업무/로그 데이터는 JSON Server를 통해 로딩되며,
서버가 없을 경우 기본 seed 데이터로 동작합니다.

## 라이선스

MIT
