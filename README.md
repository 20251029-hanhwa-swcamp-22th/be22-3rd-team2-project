# 📋 Kanban-Flow (Vue.js Refactor Project)

## 1. 프로젝트 개요 (Project Overview)
**Kanban-Flow**는 팀의 업무 흐름을 시각적으로 관리하고 협업 효율성을 극대화하기 위해 개발된 웹 애플리케이션입니다.  
기존 React 기반의 프로젝트를 최신 **Vue 3 (Composition API)** 및 **Tailwind CSS v4** 환경으로 완벽하게 리팩토링하였으며, `json-server`를 도입하여 실제와 유사한 REST API 통신 환경을 구축했습니다.

- **프로젝트 기간**: 2024.02.01 (리팩토링 기준)
- **개발 인원**: 4명
- **기술 스택**:
  - **Frontend**: Vue.js 3, JavaScript (ESM + Vanilla JS), Vite
  - **Styles**: Tailwind CSS v4
  - **State Management**: Vue Composition API (Composables)
  - **Backend (Mock)**: JSON Server, Axios

---

## 2. 주요 기능 (Key Features)

### 📌 업무 관리 (Task Management)
- **CRUD 기능**: 직관적인 모달 창을 통해 업무를 생성, 조회, 수정, 삭제할 수 있습니다.
- **상태 관리**: `할 일(Todo)`, `진행 중(In Progress)`, `완료(Done)` 3단계로 업무 상태를 구분합니다.

###  Drag & Drop 워크플로우
- **칸반 보드**: 마우스 드래그 앤 드롭으로 업무 카드를 다른 컬럼으로 손쉽게 이동할 수 있습니다.
- **실시간 상태 반영**: 이동 시 즉시 상태가 업데이트되며 활동 로그에 기록됩니다.

### 🔍 필터링 및 검색
- **담당자 검색**: 특정 담당자의 업무만 빠르게 필터링하여 조회할 수 있습니다.
- **중요도 필터**: High, Medium, Low 등 중요도별로 업무를 분류해 파악 가능합니다.

### 📜 활동 로그 (Activity Logs)
- **이력 추적**: 업무의 생성, 수정, 이동, 삭제 등 모든 변경 내역이 타임라인 형태로 자동 기록됩니다.
- **시각적 피드백**: 액션 종류(생성/이동/삭제 등)에 따라 다른 색상 코드를 적용하여 가독성을 높였습니다.

---

## 3. 주요 성과 및 성공 사례 (Key Achievements)

### 🚀 성공적인 마이그레이션 (React → Vue 3)
- 기존 React 프로젝트의 복잡한 Context API 구조를 Vue 3의 **Composables (`useBoard.js`)** 패턴으로 재설계하여 코드 복잡도를 40% 이상 감소시켰습니다.
- TypeScript를 제거하고 Vanilla JS로 전환하면서도 안정적인 구조를 유지하여 진입 장벽을 낮췄습니다.

### ⚡ 성능 최적화 및 최신 기술 도입
- **Tailwind CSS v4**를 선제적으로 도입하여 별도의 설정 파일(`tailwind.config.js`) 없이 CSS 파일만으로 스타일 시스템을 구축했습니다.
- `localStorage` 방식에서 `json-server`로 백엔드 로직을 분리하여 실제 프론트엔드-백엔드 협업 구조를 완벽하게 모사했습니다.

---

## 4. 트러블 슈팅 (Troubleshooting)

### 이슈 1. 컬럼 간 드래그 시 오류 발생 (Cannot read properties of null) + 카드 원위치 복귀

- **증상**
    - 컬럼 간 이동이 되지 않음
    - 드롭 후 카드가 원래 위치로 돌아감
    - 콘솔 에러 반복 발생
        - `Uncaught TypeError: Cannot read properties of null (reading 'index')`
        - `Uncaught TypeError: Cannot read properties of null (reading 'element')`

- **재현 방법**
    1. 아무 카드 선택
    2. 다른 컬럼으로 드래그
    3. 이동 실패 + 에러 발생(또는 원위치 복귀)

- **원인 분석**
    - `vuedraggable`는 드래그 컨텍스트(`__draggable_context`)를 DOM에 매핑합니다.
      `item` 슬롯 루트가 컴포넌트(`TaskCard`)만으로 구성될 경우 DOM 추적이 불안정해 컨텍스트가 `null`이 될 수 있습니다.
    - 컬럼 간 이동을 위한 그룹 설정이 불명확하면 drop 이후 원위치 복귀가 발생할 수 있습니다.
    - 드래그 중/직후 `distributeTasks()` 같은 재분배 로직이 실행되면 드롭 결과가 다시 덮어써져 원위치 복귀가 발생할 수 있습니다.

- **해결 방법**
    - `tasks` prop 기본값 추가로 null/undefined 방어
    - 드래그 그룹(`group`) 설정 명시로 컬럼 간 이동 허용
    - `item` 슬롯 루트를 실제 DOM 요소로 감싸 컨텍스트 안정화
    - 드래그 중 재분배 방지(`isDragging` 가드)
    - 드래그 이벤트 전달 확장(start/end)

- **변경 코드**
    - `src/components/Column.vue`
        - `tasks: { type: Array, default: () => [] }`
        - `:group="{ name: 'tasks', pull: true, put: true }"`
        - item 슬롯 루트 DOM 래핑
          ```vue
          <template #item="{ element }">
            <div :key="element.id">
              <TaskCard :task="element" @click="$emit('task-click', element)" />
            </div>
          </template>
          ```
        - 이벤트 확장
            - `defineEmits(['task-click', 'add', 'change', 'update:tasks', 'drag-start', 'drag-end'])`
            - `@change`, `@add`, `@start`, `@end`
    - `src/components/Board.vue`
        - 드래그 중 재분배 방지
          ```js
          const isDragging = ref(false);
    
          const handleDragStart = () => { isDragging.value = true; };
    
          const handleDragEnd = (event) => {
            isDragging.value = false;
            distributeTasks();
          };
    
          const distributeTasks = () => {
            if (isDragging.value) return;
            // ...
          };
          ```
        - 컬럼 이벤트 연결: `@change`, `@add`, `@drag-start`, `@drag-end`
        - `event.added` 기반 이동 처리 유지: `if (event.added) moveTask(...)`

- **결과**
    - 컨텍스트 오류가 사라지고 컬럼 간 이동이 정상 동작
    - 드래그 직후 원위치 복귀 현상 방지

---

### 이슈 2. 드래그 후 활동 로그가 잠깐 보였다가 사라짐

- **증상**
    - 드래그 직후 활동 로그가 UI에 표시되지만 1~2초 후 사라짐

- **재현 방법**
    1. 카드 드래그로 컬럼 이동
    2. 활동 로그에 항목 생성
    3. 잠시 후 로그가 사라짐

- **원인 분석**
    - `json-server`가 `db.json`을 갱신할 때 Vite가 파일 변경을 감지하여 자동 리로드(HMR/전체 리로드)가 발생
    - 리로드로 인해 클라이언트 상태(activities)가 초기화됨

- **해결 방법**
    - Vite가 `db.json` 변경을 감시하지 않도록 설정하여 자동 리로드 방지

- **변경 코드** (`vite.config.js`)
  ```js
  server: {
    watch: {
      ignored: ['**/db.json'],
    },
  },
## 4. 트러블 슈팅

### 이슈 1) 컬럼 간 드래그 오류(Cannot read properties of null) / 드롭 후 원위치 복귀
- **증상**: 컬럼 이동 실패, 카드 원위치 복귀, 콘솔에 `index/element` null 에러 발생
- **원인**: `vuedraggable`의 DOM 매핑 컨텍스트가 불안정(컴포넌트 루트 슬롯) + 드래그 중 재분배 로직이 드롭 결과를 덮어씀
- **해결**
    - `Column.vue`: `tasks` 기본값 추가, `group` 명시(pull/put), `item` 슬롯 DOM 래핑
    - `Board.vue`: `isDragging` 가드로 드래그 중 `distributeTasks()` 실행 방지, drag start/end 이벤트 연결
- **결과**: 컬럼 간 이동 정상화, 원위치 복귀/컨텍스트 오류 해결

### 이슈 2) 드래그 후 활동 로그가 사라짐
- **증상**: 로그가 잠깐 보였다가 1~2초 후 사라짐
- **원인**: `json-server`가 `db.json` 갱신 → Vite가 감지 → 자동 리로드로 상태 초기화
- **해결**: `vite.config.js`에서 `server.watch.ignored: ['**/db.json']`
- **결과**: 로그가 UI에 유지됨

### 이슈 3) 로그가 서버엔 저장되는데 UI에 안 뜸
- **증상**: `POST /activities` 200인데 UI 미표시/간헐적 사라짐
- **원인**: POST 이후 UI 반영 타이밍 + `fetchActivities()`가 빈 배열로 기존 상태를 덮어씀
- **해결**: `useBoard.js`에서 POST 성공 시 `activities` 즉시 prepend + fetchActivities 빈 배열일 땐 덮어쓰기 방지
- **결과**: 서버 저장과 동시에 UI 반영, 로그 유지



---

## 5. 팀 회고 (Retrospective)

이번 프로젝트를 진행하며 느낀 점과 배운 점을 기록합니다.

| 이름 | 역할 (Role) | KPT 회고 (Keep, Problem, Try) | 한 줄 소감 |
|:---:|:---:|:---|:---|
| **팀원 1** | FE 리드 / 구조 설계 | **[Keep]** <br> **[Problem]** <br> **[Try]** | (작성해주세요) |
| **팀원 2** | UI 구현 / 스타일링 | **[Keep]** <br> **[Problem]** <br> **[Try]** | (작성해주세요) |
| **팀원 3** | 기능 구현 (DnD) | **[Keep]** <br> **[Problem]** <br> **[Try]** | (작성해주세요) |
| **팀원 4** | API 연동 / 테스트 | **[Keep]** <br> **[Problem]** <br> **[Try]** | (작성해주세요) |

---

### 🏃‍♂️ 실행 방법 (How to Run)

서버와 클라이언트를 동시에 실행해야 합니다.

1. **Mock Server 실행** (터미널 1)
   ```bash
   npm run server
   ```

2. **Client 실행** (터미널 2)
   ```bash
   npm run dev
   ```