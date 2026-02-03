<script setup>
/**
 * [활동 로그 컴포넌트]
 * 사용자의 모든 활동 내역을 시간순으로 보여주는 컴포넌트입니다.
 * Board 하단에 위치합니다.
 */
import { computed } from 'vue';
import { useBoard } from '@/composables/useBoard';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Clock, Activity as ActivityIcon } from 'lucide-vue-next';

// 전역 상태에서 activities 데이터 가져오기
const { activities } = useBoard();

/**
 * [활동 유형별 색상 반환]
 * created(초록), updated(파랑), moved(주황), deleted(빨강)
 */
const getActivityColor = (action) => {
    switch (action) {
        case 'created': return 'bg-green-500';
        case 'updated': return 'bg-blue-500';
        case 'moved': return 'bg-orange-500';
        case 'deleted': return 'bg-red-500';
        default: return 'bg-gray-400';
    }
};
</script>

<template>
  <!-- 로그 컨테이너 -->
  <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- 헤더 영역 -->
    <div class="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
      <ActivityIcon :size="18" class="text-gray-500" />
      <h3 class="font-semibold text-gray-700">활동 로그</h3>
    </div>
    
    <!-- 로그 목록 영역 (스크롤 가능) -->
    <div class="max-h-60 overflow-y-auto p-4 custom-scrollbar">
      <!-- 데이터가 없을 경우 -->
      <div v-if="activities.length === 0" class="text-gray-400 text-sm text-center py-4">
          아직 기록된 활동이 없습니다.
      </div>
      
      <!-- 데이터가 있을 경우 -->
      <div v-else class="space-y-4">
          <!-- v-for를 사용하여 로그 목록 렌더링 -->
          <div v-for="activity in activities" :key="activity.id" class="flex gap-3 text-sm">
              <!-- 상태 표시 원 (Dot) -->
              <div 
                  class="w-2 h-2 mt-1.5 rounded-full shrink-0"
                  :class="getActivityColor(activity.action)"
              ></div>
              <!-- 로그 내용 -->
              <div class="flex-1">
                  <p class="text-gray-700">{{ activity.details }}</p>
                  <p class="text-gray-400 text-xs flex items-center gap-1 mt-1">
                    <Clock :size="10" />
                    <!-- 날짜 포맷팅 (예: 2024.02.01 12:00:00) -->
                    {{ format(new Date(activity.timestamp), 'yyyy.MM.dd HH:mm:ss', { locale: ko }) }}
                  </p>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
