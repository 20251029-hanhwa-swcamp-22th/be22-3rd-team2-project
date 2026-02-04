<script setup>
import { ref, computed, watch } from 'vue';
import { X, Check, ChevronDown, Star } from 'lucide-vue-next';
import AlertModal from './AlertModal.vue';
import ConfirmModal from './ConfirmModal.vue';

const props = defineProps({
  task: {
    type: Object,
    default: null,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  isNewTask: {
    type: Boolean,
    default: false,
  },
  boardMembers: {
    type: Array,
    default: () => [],
  },
  boardCreatedBy: {
    type: String,
    default: '',
  },
  availableUsers: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'save', 'delete']);

// 담당자 목록 생성
const assigneeOptions = computed(() => {
  const options = [];
  const creatorEmail = props.boardCreatedBy;
  
  if (props.boardMembers && props.boardMembers.length > 0) {
    // 보드에 멤버가 있는 경우
    if (creatorEmail && props.availableUsers && props.availableUsers.length > 0) {
      const isCreatorInMembers = props.boardMembers.find(member => member.email === creatorEmail);
      if (isCreatorInMembers) {
        options.push({
          id: isCreatorInMembers.id,
          name: isCreatorInMembers.name,
          email: isCreatorInMembers.email,
          isCreator: true
        });
      } else {
        const creator = props.availableUsers.find(user => user.email === creatorEmail);
        if (creator) {
          options.push({
            id: creator.email,
            name: creator.name,
            email: creator.email,
            isCreator: true
          });
        }
      }
    }
    
    props.boardMembers.forEach(member => {
      if (member.email !== creatorEmail) {
        options.push({
          id: member.id,
          name: member.name,
          email: member.email,
          isCreator: false
        });
      }
    });
  } else {
    if (props.availableUsers && props.availableUsers.length > 0) {
      const creator = props.availableUsers.find(user => user.email === creatorEmail);
      if (creator) {
        options.push({
          id: creator.email,
          name: creator.name,
          email: creator.email,
          isCreator: true
        });
      }
      
      props.availableUsers.forEach(user => {
        if (user.email !== creatorEmail) {
          options.push({
            id: user.email,
            name: user.name,
            email: user.email,
            isCreator: false
          });
        }
      });
    }
  }
  
  return options;
});

const creatorName = computed(
  () => assigneeOptions.value.find((option) => option.isCreator)?.name || ''
);

const formData = ref({
  id: '',
  title: '',
  description: '',
  assignees: [],
  priority: 'Medium',
  column: 'todo',
  createdAt: new Date(),
  updatedAt: new Date(),
  boardId: '',
  isFavorite: false
});

const isAssigneeDropdownOpen = ref(false);

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      formData.value = { ...newTask };
    } else if (props.isNewTask && creatorName.value) {
      formData.value = {
        id: '',
        title: '',
        description: '',
        assignees: [creatorName.value],
        priority: 'Medium',
        column: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        boardId: '',
        isFavorite: false,
      };
    }
  },
  { immediate: true }
);

// Alert Modal State
const isAlertOpen = ref(false);
const alertMessage = ref('');

const showAlert = (message) => {
  alertMessage.value = message;
  isAlertOpen.value = true;
};

// Confirm Modal State
const isDeleteConfirmOpen = ref(false);

const handleSave = () => {
  if (!formData.value.title.trim()) {
    showAlert('제목을 입력해주세요.');
    return;
  }
  if (!formData.value.assignees || formData.value.assignees.length === 0) {
    showAlert('담당자를 최소 1명 이상 선택해주세요.');
    return;
  }
  
  emit('save', {
    ...formData.value,
    updatedAt: new Date(),
  });
};

const handleDelete = () => {
  isDeleteConfirmOpen.value = true;
};

const confirmDelete = () => {
  emit('delete', formData.value.id);
  isDeleteConfirmOpen.value = false;
};

const handleAssigneeToggle = (assigneeName) => {
  const currentAssignees = formData.value.assignees || [];
  if (currentAssignees.includes(assigneeName)) {
    formData.value.assignees = currentAssignees.filter((name) => name !== assigneeName);
  } else {
    formData.value.assignees = [...currentAssignees, assigneeName];
  }
};

const handleRemoveAssignee = (assigneeName) => {
  formData.value.assignees = formData.value.assignees.filter((name) => name !== assigneeName);
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 class="font-semibold text-gray-900">
          {{ isNewTask ? '업무 추가' : '업무 수정' }}
        </h2>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="formData.isFavorite = !formData.isFavorite"
            class="p-2 hover:bg-gray-100 rounded transition-colors"
            :title="formData.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'"
          >
            <Star
              :class="`size-5 transition-colors ${
                formData.isFavorite 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-400 hover:text-gray-500'
              }`"
            />
          </button>
          <button
            @click="emit('close')"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X class="size-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div class="p-6 space-y-4">
        <!-- 제목 -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-900 mb-1.5">제목</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            placeholder="제목을 입력하세요"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- 담당자와 중요도 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-1.5">담당자</label>
            
            <!-- 선택된 담당자 태그들 -->
            <div v-if="formData.assignees.length > 0" class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="assignee in formData.assignees"
                :key="assignee"
                class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
              >
                {{ assignee }}
                <button
                  type="button"
                  @click="handleRemoveAssignee(assignee)"
                  class="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X class="size-3" />
                </button>
              </span>
            </div>

            <!-- 담당자 추가 드롭다운 -->
            <div class="relative">
              <button
                type="button"
                @click="isAssigneeDropdownOpen = !isAssigneeDropdownOpen"
                class="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm"
              >
                <span class="text-gray-700">
                  {{ formData.assignees.length > 0 ? formData.assignees[0] : '담당자 선택' }}
                </span>
                <ChevronDown :class="`size-4 text-gray-500 transition-transform ${isAssigneeDropdownOpen ? 'rotate-180' : ''}`" />
              </button>

              <template v-if="isAssigneeDropdownOpen">
                <div
                  class="fixed inset-0 z-10"
                  @click="isAssigneeDropdownOpen = false"
                />
                <div class="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div v-if="assigneeOptions.length > 0" class="py-1">
                    <button
                      v-for="option in assigneeOptions"
                      :key="option.id"
                      type="button"
                      @click.stop="handleAssigneeToggle(option.name)"
                      :class="`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        formData.assignees.includes(option.name) ? 'bg-blue-50' : ''
                      }`"
                    >
                      <span class="flex items-center gap-2">
                        <span :class="formData.assignees.includes(option.name) ? 'font-medium text-blue-700' : 'text-gray-700'">
                          {{ option.name }}
                        </span>
                        <span v-if="option.isCreator" class="text-xs text-gray-500">(생성자)</span>
                      </span>
                      <Check v-if="formData.assignees.includes(option.name)" class="size-4 text-blue-600" />
                    </button>
                  </div>
                  <div v-else class="px-3 py-2 text-sm text-gray-500">
                    선택 가능한 담당자가 없습니다.
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div>
            <label for="priority" class="block text-sm font-medium text-gray-900 mb-1.5">중요도</label>
            <select
              id="priority"
              v-model="formData.priority"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <!-- 상태 -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-900 mb-1.5">상태</label>
          <select
            id="status"
            v-model="formData.column"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todo">할 일 (Todo)</option>
            <option value="inProgress">진행 중 (In Progress)</option>
            <option value="done">완료 (Done)</option>
          </select>
        </div>

        <!-- 설명 -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-900 mb-1.5">설명</label>
          <textarea
            id="description"
            v-model="formData.description"
            placeholder="설명을 입력하세요"
            rows="4"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between">
        <div>
          <button
            v-if="!isNewTask"
            @click="handleDelete"
            class="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            삭제
          </button>
        </div>
        <div class="flex gap-2">
          <button
            @click="emit('close')"
            class="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            @click="handleSave"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            수정 완료
          </button>
        </div>
      </div>
    </div>

    <!-- Alert Modal -->
    <AlertModal
      :isOpen="isAlertOpen"
      :message="alertMessage"
      @close="isAlertOpen = false"
      class="z-[60]"
    />

    <!-- Delete Confirm Modal -->
    <ConfirmModal
      :isOpen="isDeleteConfirmOpen"
      title="업무 삭제"
      message="정말 이 업무를 삭제하시겠습니까?"
      confirmText="삭제"
      type="danger"
      @close="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
      class="z-[60]"
    />
  </div>
</template>
