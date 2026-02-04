<script setup>
import { User, Star } from 'lucide-vue-next';

defineProps({
  task: {
    type: Object,
    required: true,
  },
  isDragging: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit', 'toggleFavorite']);

const priorityColors = {
  High: 'bg-red-100 text-red-700 border-red-300',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  Low: 'bg-green-100 text-green-700 border-green-300',
};
</script>

<template>
  <div
    :class="`relative bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow ${
      isDragging ? 'opacity-50' : ''
    }`"
    @click="emit('edit', task)"
  >
    <!-- 즐겨찾기 별 아이콘 -->
    <button
      class="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
      @click.stop="emit('toggleFavorite', task.id)"
    >
      <Star
        :class="`size-4 transition-colors ${
          task.isFavorite 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300 hover:text-gray-400'
        }`"
      />
    </button>

    <div class="flex items-start justify-between mb-2 pr-6">
      <h3 class="font-medium text-gray-900 flex-1">{{ task.title }}</h3>
      <span
        :class="`text-xs px-2 py-1 rounded-full border ${
          priorityColors[task.priority]
        }`"
      >
        {{ task.priority }}
      </span>
    </div>
    
    <p v-if="task.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
      {{ task.description }}
    </p>
    
    <div class="flex items-center text-sm text-gray-500">
      <User class="size-4 mr-1" />
      <span>
        {{
          task.assignees.length > 0 
            ? task.assignees.length > 2 
              ? `${task.assignees.slice(0, 2).join(', ')} 외 ${task.assignees.length - 2}명`
              : task.assignees.join(', ')
            : '미할당'
        }}
      </span>
    </div>
  </div>
</template>
