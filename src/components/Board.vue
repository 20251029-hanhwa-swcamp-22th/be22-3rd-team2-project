<script setup>
/**
 * [메인 보드 컴포넌트]
 * 이 앱의 가장 핵심적인 화면입니다.
 * 필터, 3개의 컬럼(Todo, InProgress, Done), 활동 로그, 모달 등을 모두 조합합니다.
 */

import { ref, computed, watch } from 'vue';
import { useBoard } from '@/composables/useBoard';
import { Plus } from 'lucide-vue-next';
import Column from './Column.vue';
import FilterBar from './FilterBar.vue';
import ActivityLog from './ActivityLog.vue';
import TaskModal from './TaskModal.vue';

// 전역 비즈니스 로직(Composable) 사용
const { tasks, addTask, updateTask, deleteTask, moveTask, isLoading } = useBoard();

// 로컬 상태 변수들
const assigneeFilter = ref(''); // 담당자 필터
const priorityFilter = ref('All'); // 중요도 필터
const isModalOpen = ref(false); // 모달 열림 여부
const editingTask = ref(null); // 현재 수정 중인 업무 (없으면 생성 모드)
const isDragging = ref(false);
const handledMoveIds = new Set();

// Drag & Drop을 위해 각 상태별로 분리된 로컬 리스트
const todoList = ref([]);
const inProgressList = ref([]);
const doneList = ref([]);

/**
 * [업무 분배 함수]
 * 전체 업무 목록(tasks)을 필터링한 후, 상태(Status)에 따라 
 * 3개의 리스트로 나누어 담습니다.
 */
const distributeTasks = () => {
    if (isDragging.value) return;
    // 1. 필터 적용
    const filtered = tasks.value.filter(task => {
        const matchesAssignee = task.assignee.toLowerCase().includes(assigneeFilter.value.toLowerCase());
        const matchesPriority = priorityFilter.value === 'All' || task.priority === priorityFilter.value;
        return matchesAssignee && matchesPriority;
    });

    // 2. 상태별 분류
    // Array.filter()는 조건에 맞는 아이템만 골라내 새로운 배열을 만듭니다.
    todoList.value = filtered.filter(t => t.status === 'Todo');
    inProgressList.value = filtered.filter(t => t.status === 'InProgress');
    doneList.value = filtered.filter(t => t.status === 'Done');
};

// tasks(서버 데이터)나 필터 조건이 바뀌면 distributeTasks를 실행하여 화면 갱신
watch([tasks, assigneeFilter, priorityFilter], distributeTasks, { deep: true });

// 새 업무 생성 버튼 클릭 시
const handleCreateTask = () => {
    editingTask.value = null; // 수정할 데이터 없음 (생성 모드)
    isModalOpen.value = true;
};

// 업무 카드 클릭 시 (수정 모드)
const handleEditTask = (task) => {
    editingTask.value = task; // 클릭한 업무 데이터 설정
    isModalOpen.value = true;
};

// 모달에서 '저장/수정' 버튼 클릭 시 처리
const handleModalSubmit = async (data) => {
    // async 함수 안에서는 await을 사용해 비동기 작업(저장)이 끝날 때까지 기다릴 수 있습니다.
    // 만약 데이터가 많아서 저장이 1초 걸린다면, 1초 동안 기다렸다가 모달을 닫아야 안전합니다.
    if (editingTask.value) {
        await updateTask(editingTask.value.id, data);
    } else {
        await addTask(data);
    }
    // 저장이 완료된 후(await 다음 줄)에 실행됩니다.
};

// 모달에서 '삭제' 버튼 클릭 시 처리
const handleModalDelete = async (id) => {
    // 삭제 요청을 보내고, 서버가 "삭제했어!"라고 응답할 때까지 기다립니다.
    await deleteTask(id);
};

// Drag & Drop 이벤트 처리 (컬럼 간 이동)
const onColumnChange = (event, columnId) => {
    // 'added': 다른 컬럼에서 이 컬럼으로 아이템이 들어왔을 때 발생
    if (event.added) {
        const { element } = event.added;
        if (!element) return;
        handledMoveIds.add(element.id);
        // 서버에 상태 업데이트 요청 (예: Todo -> Done)
        // 여기서는 await을 쓰지 않아도 됩니다. (화면은 이미 바뀌었고, 저장은 백그라운드에서 해도 되니까요)
        moveTask(element.id, columnId);
        
        // [낙관적 업데이트]
        // vuedraggable이 이미 컬럼 간 이동을 반영하므로
        // 여기서 status를 직접 바꾸지 않습니다. (드래그 중 리렌더로 인한 컨텍스트 손상 방지)
    }
};

const onColumnAdd = (event, columnId) => {
    const { element } = event || {};
    if (!element) return;
    moveTask(element.id, columnId);
    handledMoveIds.add(element.id);
};

const handleDragStart = () => {
    isDragging.value = true;
};

const handleDragEnd = (event) => {
    isDragging.value = false;
    distributeTasks();

    if (!event || !event.item) return;
    const element =
        event.item._underlying_vm_ ||
        event.item.__draggable_context?.element ||
        event.item?.__draggable_context?.element;
    const targetColumnId =
        event.to?.dataset?.columnId ||
        event.to?.closest?.('[data-column-id]')?.dataset?.columnId;
    if (!element || !targetColumnId) return;
    if (handledMoveIds.has(element.id)) {
        handledMoveIds.delete(element.id);
        return;
    }
    if (element.status !== targetColumnId) {
        moveTask(element.id, targetColumnId);
    }
};
</script>

<template>
  <!-- 로딩 중일 때 표시되는 스피너 -->
  <div v-if="isLoading" class="flex items-center justify-center h-screen bg-gray-50">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>

  <!-- 메인 화면 -->
  <div v-else class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- 1. 헤더: 제목과 생성 버튼 -->
      <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Kanban-Flow</h1>
          <p class="text-gray-500">협업형 업무 관리 칸반 보드</p>
        </div>
        <button
          @click="handleCreateTask"
          class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus :size="20" />
          새 업무 생성
        </button>
      </header>

      <!-- 2. 필터 바 -->
      <FilterBar
        v-model:assigneeFilter="assigneeFilter"
        v-model:priorityFilter="priorityFilter"
      />

      <!-- 3. 칸반 보드 (3개의 컬럼) -->
      <div class="flex flex-col lg:flex-row gap-6 h-auto lg:h-[600px] overflow-x-auto pb-4">
        <Column
            id="Todo"
            title="할 일"
            v-model:tasks="todoList"
            @task-click="handleEditTask"
            @change="onColumnChange"
            @add="onColumnAdd"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
        />
        <Column
            id="InProgress"
            title="진행 중"
            v-model:tasks="inProgressList"
            @task-click="handleEditTask"
            @change="onColumnChange"
            @add="onColumnAdd"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
        />
        <Column
            id="Done"
            title="완료"
            v-model:tasks="doneList"
            @task-click="handleEditTask"
            @change="onColumnChange"
            @add="onColumnAdd"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
        />
      </div>

      <!-- 4. 활동 로그 -->
      <ActivityLog />

      <!-- 5. 업무 생성/수정 모달 (평소엔 숨겨져 있음) -->
      <TaskModal
        :is-open="isModalOpen"
        :initial-data="editingTask"
        @close="isModalOpen = false"
        @submit="handleModalSubmit"
        @delete="handleModalDelete"
      />
    </div>
  </div>
</template>
