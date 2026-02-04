<script setup>
import { Clock, FileEdit, Trash2, Plus, ArrowRight } from 'lucide-vue-next';

defineProps({
  logs: {
    type: Array,
    required: true,
  },
});

const getIcon = (action) => {
  if (action.includes('생성')) return Plus;
  if (action.includes('삭제')) return Trash2;
  if (action.includes('이동')) return ArrowRight;
  return FileEdit;
};

const getActionColor = (action) => {
  if (action.includes('생성')) return 'bg-green-100 text-green-700';
  if (action.includes('삭제')) return 'bg-red-100 text-red-700';
  if (action.includes('이동')) return 'bg-blue-100 text-blue-700';
  return 'bg-yellow-100 text-yellow-700';
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <Clock class="size-5" />
      활동 로그
    </h2>

    <p v-if="logs.length === 0" class="text-gray-500 text-center py-8">
      아직 활동 기록이 없습니다.
    </p>

    <div v-else class="space-y-4">
      <div v-for="(log, index) in logs" :key="log.id" class="flex gap-4">
        <div class="relative">
          <div :class="`p-2 rounded-full ${getActionColor(log.action)}`">
            <component :is="getIcon(log.action)" class="size-4" />
          </div>
          <div
            v-if="index < logs.length - 1"
            class="absolute left-1/2 top-10 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"
          />
        </div>

        <div class="flex-1 pb-4">
          <div class="flex items-start justify-between">
            <div>
              <p class="font-medium text-gray-900">{{ log.action }}</p>
              <p class="text-sm text-gray-600 mt-1">{{ log.details }}</p>
            </div>
            <span class="text-xs text-gray-500 whitespace-nowrap ml-4">
              {{
                new Date(log.timestamp).toLocaleString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
