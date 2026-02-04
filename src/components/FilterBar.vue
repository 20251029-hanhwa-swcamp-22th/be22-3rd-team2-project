<script setup>
import { computed } from 'vue';
import { Filter, X } from 'lucide-vue-next';
const props = defineProps({
  assignees: {
    type: Array,
    required: true,
  },
  selectedAssignee: {
    type: String,
    required: true,
  },
  selectedPriority: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['assigneeChange', 'priorityChange', 'reset']);

const hasActiveFilters = computed(
  () => props.selectedAssignee !== 'All' || props.selectedPriority !== 'All'
);
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <div class="flex items-center gap-4 flex-wrap">
      <div class="flex items-center gap-2">
        <Filter class="size-5 text-gray-600" />
        <span class="font-medium text-gray-700">필터:</span>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">담당자:</label>
        <select
          :value="selectedAssignee"
          @change="(e) => emit('assigneeChange', e.target.value)"
          class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[150px]"
        >
          <option value="All">전체</option>
          <option v-for="assignee in assignees" :key="assignee" :value="assignee">
            {{ assignee }}
          </option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">중요도:</label>
        <select
          :value="selectedPriority"
          @change="(e) => emit('priorityChange', e.target.value)"
          class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[150px]"
        >
          <option value="All">전체</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <button
        v-if="hasActiveFilters"
        @click="emit('reset')"
        class="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 rounded-lg transition-colors ml-auto"
      >
        <X class="size-4" />
        필터 초기화
      </button>
    </div>
  </div>
</template>
