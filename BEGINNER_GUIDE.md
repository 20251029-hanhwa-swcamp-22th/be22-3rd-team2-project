# 📄 소스 코드 문법 및 로직 상세 분석

이 문서는 프로젝트 내 `src/` 디렉토리에 존재하는 **모든 소스 파일**을 하나도 빠짐없이 순서대로 분석합니다.
각 섹션은 해당 파일의 실제 코드를 기반으로 하며, 기술적인 문법(Syntax)과 동작 논리(Logic)를 설명합니다.

---

## 📂 1. `src/api/` (API 통신)

### 📄 1.1 `src/api/client.js`
Axios 라이브러리를 사용하여 HTTP 클라이언트 인스턴스를 생성하는 파일입니다.

```javascript
import axios from 'axios';
```
*   **Import**: `axios` 패키지를 가져옵니다.

```javascript
const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
});
```
*   **Method**: `axios.create()` 메서드는 사용자 정의 설정이 적용된 Axios 인스턴스를 반환합니다.
*   **Object Literal**: 설정 객체입니다.
    *   `baseURL`: 요청 URL의 접두사(Prefix)입니다.
    *   `timeout`: 5000ms(5초) 후 요청을 중단시킵니다.

```javascript
export default apiClient;
```
*   **Export Default**: 생성된 인스턴스를 모듈의 기본값으로 내보냅니다.

---

## 📂 2. `src/composables/` (비즈니스 로직)

### 📄 2.1 `src/composables/useBoard.js`
상태 관리와 CRUD 로직이 캡슐화된 Composition API 모듈입니다.

```javascript
import { ref } from 'vue';
import apiClient from '@/api/client';
```
*   **Ref**: Vue의 반응형 참조 객체 생성 함수입니다.

```javascript
const tasks = ref([]);
const activities = ref([]);
const isLoading = ref(false);
```
*   **Reactive State**: `ref()`로 감싸진 변수들은 값이 변경될 때 의존성이 있는 컴포넌트들을 자동으로 다시 렌더링합니다.

```javascript
export function useBoard() { ... }
```
*   **Named Export**: `useBoard` 함수를 내보냅니다. 이 함수는 클로저(Closure)를 활용하여 상태에 접근하는 메서드들을 반환합니다.

#### 주요 비동기 메서드
*   **`fetchTasks`**: `async/await` 패턴을 사용하여 `apiClient.get('/tasks')`를 호출(권한: GET)하고 결과값을 `tasks.value`에 할당합니다.
*   **`fetchActivities`**: 활동 로그를 조회합니다. Query String `_sort=timestamp`를 사용하여 서버 측 정렬을 수행합니다.
*   **`logActivity`**: 사용자 행동(생성/수정/삭제 등)을 `POST /activities`로 기록합니다.
*   **`addTask`, `updateTask`, `deleteTask`**: 각각 `POST`, `PATCH`, `DELETE` HTTP 메서드를 사용하여 리소스를 조작하고, 성공 시 로컬 상태(`tasks.value`)를 갱신(Mutation)합니다.

---

## 📂 3. `src/components/` (UI 컴포넌트)

### 📄 3.1 `src/components/Board.vue`
애플리케이션의 최상위 레이아웃을 담당하는 스마트 컴포넌트입니다.

*   **Logic**: `useBoard` 훅을 호출하여 전역 상태를 구독합니다.
*   **Watch**: `watch` API를 사용하여 `tasks` 데이터나 `filter` 조건이 변경될 때마다 `distributeTasks` 함수를 트리거하여 화면을 갱신합니다.
*   **Template**: `FilterBar`, `Column` (x3), `ActivityLog`, `TaskModal` 컴포넌트들을 조립하여 화면을 구성합니다.

### 📄 3.2 `src/components/Column.vue`
특정 상태(Status)의 업무 목록을 세로로 나열하는 컨테이너입니다.

```javascript
import draggable from 'vuedraggable';
```
*   **Library**: `vuedraggable` 라이브러리를 사용하여 드래그 앤 드롭 기능을 구현합니다.

```javascript
const list = computed({
    get: () => props.tasks,
    set: (value) => emit('update:tasks', value)
});
```
*   **Computed Setter**: 계산된 속성(Computed Property)에 `set` 메서드를 정의하여, 드래그로 순서가 변경되었을 때 부모 컴포넌트에 이벤트를 발생(`emit`)시킵니다. 이는 단방향 데이터 흐름을 유지하면서 양방향 바인딩을 구현하는 패턴입니다.

### 📄 3.3 `src/components/TaskCard.vue`
개별 업무 아이템을 표시하는 프레젠테이션 컴포넌트입니다.

```javascript
const props = defineProps({ task: { ... } });
```
*   **Props**: 부모로부터 `task` 객체를 전달받습니다. Type Check(Object)와 Required 옵션이 설정되어 있습니다.

```javascript
const priorityConfig = computed(() => { ... });
```
*   **Computed**: `task.priority` 값(High, Medium, Low)에 따라 적절한 Tailwind CSS 클래스 문자열을 반환하는 순수 함수입니다. 템플릿 내의 복잡한 로직을 제거하기 위해 사용됩니다.

### 📄 3.4 `src/components/TaskModal.vue`
업무 생성 및 수정을 위한 폼(Form) 컴포넌트입니다.

```javascript
const form = reactive({ ... });
```
*   **Reactive**: 객체 내부의 속성들이 반응형을 갖도록 `reactive()` 함수를 사용합니다.

```javascript
watch(() => [props.isOpen, props.initialData], () => { ... });
```
*   **Data Synchronization**: 모달이 열리거나(`isOpen`), 수정할 데이터(`initialData`)가 변경될 때 폼의 값을 초기화하거나 채워 넣습니다.

```javascript
const validate = () => { ... };
```
*   **Validation**: 폼 제출 전 필수 입력값(제목, 담당자)을 검사하는 로직입니다. 유효하지 않으면 `errors` 객체에 메시지를 담고, 제출을 차단(Return False)합니다.

### 📄 3.5 `src/components/ActivityLog.vue`
활동 로그 목록을 표시하는 컴포넌트입니다.

*   **Logic**: `useBoard`에서 `activities` 상태를 가져옵니다.
*   **Rendering**: `v-for` 디렉티브를 사용하여 로그 배열을 순회하며 DOM 요소를 반복 생성합니다.
*   **Styling**: `getActivityColor` 함수를 통해 로그의 타입(생성/수정/삭제)에 따라 동적으로 배경색 클래스(`bg-green-500` 등)를 반환합니다.

### 📄 3.6 `src/components/FilterBar.vue`
검색 및 필터링 조건을 입력받는 UI입니다.

*   **Event Handling**: `` 요소의 `input` 이벤트가 발생할 때마다 `$emit('update:assigneeFilter', ...)`를 호출하여 부모의 상태를 실시간으로 업데이트합니다.
*   **Two-way Binding**: `v-model` 패턴을 따르는 Emits(`update:propName`)를 사용하여 부모-자식 간 데이터 동기화를 처리합니다.

---

## 📂 4. `src/` (진입점 및 설정)

### 📄 4.1 `src/App.vue`
Vue 애플리케이션의 루트 컴포넌트입니다.

*   **Logic**: `Board` 컴포넌트 하나만을 렌더링하는 래퍼(Wrapper) 역할을 합니다.
*   **Structure**: `<script setup>`과 `<template>`만 존재하는 단순한 구조입니다.

### 📄 4.2 `src/main.js`
애플리케이션의 엔트리 포인트(Entry Point)입니다.

```javascript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
```
*   **`createApp`**: Vue 인스턴스를 생성하는 팩토리 함수입니다.
*   **`mount`**: 생성된 Vue 앱을 실제 DOM 요소(ID가 `app`인 div)에 부착(Mounting)하여 렌더링을 시작합니다.

### 📄 4.3 `src/style.css`
전역 CSS 스타일 파일입니다.

```css
@import "tailwindcss";
```
*   **Directive**: Tailwind CSS v4를 로드하기 위한 `@import` 구문입니다.
*   **Theme**: `@theme` 블록 내에서 커스텀 애니메이션(`fade-in`, `zoom-in`) 등을 정의하여 Tailwind의 유틸리티 클래스를 확장합니다.
