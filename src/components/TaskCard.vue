<script setup>
/**
 * [할 일 카드 컴포넌트]
 * 칸반 보드의 각 컬럼 안에 들어가는 개별 업무 카드입니다.
 * 업무의 제목, 설명, 중요도, 담당자, 날짜 등을 표시합니다.
 */

import { computed } from 'vue';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, MoreVertical } from 'lucide-vue-next';

// 부모 컴포넌트로부터 전달받은 데이터 (Props)
const props = defineProps({
  task: {
    type: Object, // task는 객체 형태여야 함
    required: true // 필수적으로 전달되어야 함
  }
});

// 부모에게 보낼 이벤트 정의 (클릭 시)
const emit = defineEmits(['click']);

/**
 * [중요도 스타일 설정]
 * task.priority 값(High, Medium, Low)에 따라 
 * 배지의 색상과 텍스트를 계산하여 반환합니다.
 */
const priorityConfig = computed(() => {
  switch (props.task.priority) {
    case 'High':
      return { color: 'bg-red-100 text-red-700', label: '높음' };
    case 'Medium':
      return { color: 'bg-yellow-100 text-yellow-700', label: '중간' };
    case 'Low':
      return { color: 'bg-blue-100 text-blue-700', label: '낮음' };
    default:
      return { color: 'bg-gray-100 text-gray-700', label: '-' };
  }
});

// 날짜 포맷팅 함수 (예: 2월 1일)
const formatDate = (dateString) => {
  return format(new Date(dateString), 'M월 d일', { locale: ko });
};
</script>

<template>
  <!-- 카드 전체 컨테이너: 클릭 시 'click' 이벤트 발생 -->
  <div
    @click="$emit('click', task)"
    class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
  >
    <!-- 1. 카드 상단: 중요도 배지와 더보기 아이콘 -->
    <div class="flex justify-between items-start mb-3">
        <!-- 중요도 배지 (색상은 위에서 계산됨) -->
        <span :class="`px-2.5 py-1 rounded-md text-xs font-medium ${priorityConfig.color}`">
            {{ priorityConfig.label }}
        </span>
        <!-- 더보기 버튼 (마우스를 올렸을 때만 보임: group-hover) -->
        <button class="text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 p-1 rounded transition-all">
            <MoreVertical :size="16" />
        </button>
    </div>
    
    <!-- 2. 업무 제목 (최대 2줄까지만 표시: line-clamp-2) -->
    <h4 class="font-semibold text-gray-800 mb-2 line-clamp-2 tracking-tight">
        {{ task.title }}
    </h4>
    
    <!-- 3. 업무 설명 (최대 2줄) -->
    <p class="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px] leading-relaxed">
        {{ task.description }}
    </p>
    
    <!-- 4. 카드 하단: 담당자와 날짜 -->
    <div class="flex items-center justify-between pt-3 border-t border-gray-50">
        <!-- 담당자 정보 -->
        <div class="flex items-center gap-2">
            <!-- 담당자 이니셜 아바타 -->
            <div class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                {{ task.assignee.charAt(0) }}
            </div>
            <span class="text-xs text-gray-500 font-medium">{{ task.assignee }}</span>
        </div>
        
        <!-- 생성 날짜 -->
        <div class="flex items-center gap-1.5 text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded-md">
            <Calendar :size="12" />
            <span>{{ formatDate(task.createdAt) }}</span>
        </div>
    </div>
  </div>
</template>
