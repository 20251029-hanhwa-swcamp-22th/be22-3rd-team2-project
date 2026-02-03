<script setup>
/**
 * [업무 생성/수정 모달 컴포넌트]
 * 새로운 업무를 만들거나 기존 업무를 수정하는 팝업창입니다.
 * 폼 유효성 검사(Validation) 기능이 포함되어 있습니다.
 */

import { reactive, watch, ref } from 'vue';
import { X } from 'lucide-vue-next';

// 부모로부터 받는 데이터
const props = defineProps({
  isOpen: Boolean, // 모달 열림 여부
  initialData: Object // 수정할 때 채워넣을 기존 데이터 (생성 시에는 null)
});

// 부모에게 보낼 이벤트들
const emit = defineEmits(['close', 'submit', 'delete']);

// 입력 폼 데이터 (반응형 객체)
const form = reactive({
  title: '',
  description: '',
  assignee: '',
  priority: 'Medium',
  status: 'Todo'
});

// 에러 메시지 저장 객체
const errors = reactive({
  title: '',
  assignee: ''
});

// [데이터 동기화]
// 모달이 열리거나 초기 데이터가 바뀌면 폼 내용을 업데이트합니다.
watch(() => [props.isOpen, props.initialData], () => {
  if (props.isOpen) {
    if (props.initialData) {
      // 수정 모드: 기존 데이터로 폼 채우기
      Object.assign(form, {
        title: props.initialData.title,
        description: props.initialData.description,
        assignee: props.initialData.assignee,
        priority: props.initialData.priority,
        status: props.initialData.status
      });
    } else {
      // 생성 모드: 폼 초기화
      Object.assign(form, {
        title: '',
        description: '',
        assignee: '',
        priority: 'Medium',
        status: 'Todo'
      });
    }
    // 에러 메시지 초기화
    errors.title = '';
    errors.assignee = '';
  }
});

/**
 * [유효성 검사]
 * 필수 입력 항목(제목, 담당자)이 비어있는지 확인합니다.
 */
const validate = () => {
    let isValid = true;
    errors.title = '';
    errors.assignee = '';

    if (!form.title.trim()) {
        errors.title = '제목을 입력해주세요';
        isValid = false;
    }
    if (!form.assignee.trim()) {
        errors.assignee = '담당자를 입력해주세요';
        isValid = false;
    }
    return isValid;
};

// 제출 버튼 클릭 시 실행
const handleSubmit = () => {
    if (validate()) {
        // 검사 통과 시 부모에게 데이터 전달
        emit('submit', { ...form });
        emit('close'); // 모달 닫기
    }
};

// 삭제 버튼 클릭 시 실행
const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
        emit('delete', props.initialData.id);
        emit('close');
    }
};
</script>

<template>
  <!-- 모달 오버레이 (배경 어둡게 처리) -->
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <!-- 모달 컨텐츠 박스 -->
    <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <!-- 헤더: 제목과 닫기 버튼 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-800">
          {{ initialData ? '업무 수정' : '새 업무 생성' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X :size="24" />
        </button>
      </div>

      <!-- 입력 폼 -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        
        <!-- 1. 제목 입력 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input
            v-model="form.title"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            placeholder="업무 제목"
          />
          <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- 2. 담당자 입력 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">담당자</label>
            <input
              v-model="form.assignee"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="담당자 이름"
            />
            <p v-if="errors.assignee" class="text-red-500 text-xs mt-1">{{ errors.assignee }}</p>
          </div>
          
          <!-- 3. 중요도 선택 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">중요도</label>
            <select
              v-model="form.priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <!-- 4. 상태 선택 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">상태</label>
          <select
            v-model="form.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todo">할 일 (Todo)</option>
            <option value="InProgress">진행 중 (In Progress)</option>
            <option value="Done">완료 (Done)</option>
          </select>
        </div>

        <!-- 5. 설명 입력 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">설명</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="상세 내용을 입력하세요"
          ></textarea>
        </div>

        <!-- 하단 버튼 영역 -->
        <div class="flex gap-3 pt-4">
          <!-- 삭제 버튼 (수정 모드일 때만 표시) -->
          <button
            v-if="initialData"
            type="button"
            @click="handleDelete"
            class="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            삭제
          </button>
          
          <div class="flex-1"></div>
          
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            {{ initialData ? '수정 완료' : '생성하기' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
