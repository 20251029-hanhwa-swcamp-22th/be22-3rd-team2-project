<script setup>
/**
 * [필터 바 컴포넌트]
 * 업무 목록을 담당자나 중요도로 필터링하는 기능을 제공합니다.
 * v-model 인터페이스를 통해 부모(Board)와 데이터를 양방향으로 동기화합니다.
 */

import { Filter, X } from 'lucide-vue-next';

// 부모에게서 받는 데이터 (필터 상태들)
const props = defineProps({
  assigneeFilter: String,
  priorityFilter: String
});

// 부모에게 값을 업데이트해달라고 요청하는 이벤트 정의
const emit = defineEmits(['update:assigneeFilter', 'update:priorityFilter']);

const priorities = ['All', 'High', 'Medium', 'Low'];

// 중요도 버튼 클릭 시 부모에게 변경 요청
const setPriority = (p) => {
    emit('update:priorityFilter', p);
};

// 초기화 버튼 클릭 시 모든 필터 리셋 요청
const clearFilters = () => {
    emit('update:assigneeFilter', '');
    emit('update:priorityFilter', 'All');
};
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-4">
    <div class="flex items-center gap-2 text-gray-500 font-medium">
      <Filter :size="18" />
      <span>필터</span>
    </div>

    <!-- 1. 담당자 검색 입력창 -->
    <div class="flex items-center gap-2">
      <input
        type="text"
        placeholder="담당자 검색..."
        :value="assigneeFilter"
        @input="$emit('update:assigneeFilter', $event.target.value)"
        class="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 2. 중요도 필터 버튼들 -->
    <div class="flex items-center gap-1">
      <button
        v-for="p in priorities"
        :key="p"
        @click="setPriority(p)"
        class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
        :class="priorityFilter === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        {{ p === 'All' ? '전체' : p }}
      </button>
    </div>

    <!-- 3. 초기화 버튼 (필터가 하나라도 적용되었을 때만 보임) -->
    <button
        v-if="assigneeFilter || priorityFilter !== 'All'"
        @click="clearFilters"
        class="ml-auto flex items-center gap-1 text-gray-400 hover:text-gray-600 text-xs"
    >
        <X :size="14" />
        <span>초기화</span>
    </button>
  </div>
</template>
