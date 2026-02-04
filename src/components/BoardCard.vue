<script setup>
import { computed } from 'vue';
import { Users, CheckSquare, UserCircle } from 'lucide-vue-next';

const props = defineProps({
  board: {
    type: Object,
    required: true,
  },
  registeredUsers: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['click']);

// 생성자 정보 찾기
const creatorName = computed(() => {
  return (
    props.board.createdByName ||
    props.registeredUsers.find((user) => user.email === props.board.createdBy)?.name ||
    props.board.createdBy?.split('@')[0] ||
    '알 수 없음'
  );
});
</script>

<template>
  <div
    @click="emit('click', board.id)"
    class="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer group"
  >
    <div class="flex items-start gap-3 mb-3">
      <div
        :class="`size-10 rounded-lg ${board.color} flex items-center justify-center flex-shrink-0`"
      >
        <CheckSquare class="size-5 text-white" />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {{ board.title }}
        </h3>
        <p class="text-sm text-gray-600 line-clamp-2">{{ board.description }}</p>
      </div>
    </div>

    <div class="flex items-center gap-4 text-sm text-gray-500 mb-2">
      <div class="flex items-center gap-1">
        <Users class="size-4" />
        <span>{{ board.memberCount }} 명</span>
      </div>
    </div>

    <!-- 생성자 정보 -->
    <div class="flex items-center gap-1 text-xs text-gray-400 pt-2 border-t border-gray-100">
      <UserCircle class="size-3.5" />
      <span>생성자: {{ creatorName }}</span>
    </div>
  </div>
</template>
