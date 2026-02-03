<script setup>
/**
 * [컬럼 컴포넌트]
 * 할 일, 진행 중, 완료 등 각 상태별 세로 영역을 담당합니다.
 * vuedraggable 라이브러리를 사용하여 드래그 앤 드롭 기능을 제공합니다.
 */

import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';
import { computed } from 'vue';

const props = defineProps({
  id: String, // 컬럼 ID (Todo, InProgress, Done)
  title: String, // 컬럼 제목 (할 일, 진행 중, 완료)
  tasks: {
    type: Array,
    default: () => []
  } // 해당 컬럼에 속한 업무 목록
});

const emit = defineEmits(['task-click', 'add', 'change', 'update:tasks', 'drag-start', 'drag-end']);

/**
 * [v-model 연동]
 * vuedraggable은 데이터를 직접 수정하려고 하므로,
 * computed의 get/set을 사용하여 부모의 데이터와 안전하게 연동합니다.
 */
const list = computed({
    get: () => props.tasks, // 값 읽기
    set: (value) => emit('update:tasks', value) // 값 변경 요청
});

// 드래그 앤 드롭으로 인한 변경 이벤트 처리
const onChange = (event) => {
    // 변경 사항을 부모에게 알림 (어떤 아이템이 추가/제거되었는지)
    emit('change', event, props.id);
}

const onAdd = (event) => emit('add', event, props.id);

const onDragStart = () => emit('drag-start');
const onDragEnd = (event) => emit('drag-end', event);
</script>

<template>
  <div class="flex-1 min-w-[300px] flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-200/60">
    <!-- 헤더: 제목과 개수 표시 -->
    <div class="p-4 flex items-center justify-between border-b border-gray-100">
      <div class="flex items-center gap-2">
        <h2 class="font-bold text-gray-700">{{ title }}</h2>
        <span class="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
            {{ tasks.length }}
        </span>
      </div>
    </div>
    
    <!-- 리스트 영역: 실제 드래그 가능한 공간 -->
    <div class="flex-1 p-3 overflow-y-auto custom-scrollbar" style="min-height: 200px">
        <!-- Draggable 라이브러리 설정 -->
        <draggable
            v-model="list"
            :group="{ name: 'tasks', pull: true, put: true }"
            item-key="id"
            :data-column-id="id"
            @change="onChange"
            @add="onAdd"
            @start="onDragStart"
            @end="onDragEnd"
            class="flex flex-col gap-3 h-full"
            ghost-class="opacity-50"
            drag-class="scale-105"
        >
            <!-- 각 아이템 렌더링 (TaskCard) -->
            <template #item="{ element }">
                <div :key="element.id">
                    <TaskCard :task="element" @click="$emit('task-click', element)" />
                </div>
            </template>
        </draggable>
    </div>
  </div>
</template>
