<script setup>
import { ref, watch } from 'vue';
import { X, Save, Camera, Shuffle } from 'lucide-vue-next';
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close', 'save']);

const avatarStyles = [
  { name: 'adventurer', label: '모험가' },
  { name: 'avataaars', label: '아바타' },
  { name: 'bottts', label: '로봇' },
  { name: 'personas', label: '페르소나' },
  { name: 'pixel-art', label: '픽셀' },
  { name: 'lorelei', label: '로렐라이' },
  { name: 'fun-emoji', label: '이모지' },
  { name: 'thumbs', label: '엄지' },
];

const formData = ref({
  name: props.user.name,
  email: props.user.email,
  avatar: props.user.avatar || '',
});
const selectedStyle = ref('avataaars');
const randomAvatars = ref([]);

// 랜덤 시드 생성
const generateRandomSeed = () => {
  return Math.random().toString(36).substring(2, 15);
};

// 아바타 URL 생성
const getAvatarUrl = (style, seed) => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

// 랜덤 아바타 생성
const generateRandomAvatars = () => {
  const newAvatars = Array.from({ length: 12 }, () => {
    const seed = generateRandomSeed();
    return getAvatarUrl(selectedStyle.value, seed);
  });
  randomAvatars.value = newAvatars;
};

// 모달이 열릴 때 랜덤 아바타 생성
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    formData.value = {
      name: props.user.name,
      email: props.user.email,
      avatar: props.user.avatar || '',
    };
    if (randomAvatars.value.length === 0) {
      generateRandomAvatars();
    }
  }
});

const handleSave = () => {
  if (!formData.value.name.trim()) {
    alert('이름을 입력해주세요.');
    return;
  }
  
  emit('save', formData.value);
  emit('close');
};

const handleStyleChange = (style) => {
  selectedStyle.value = style;
  const newAvatars = Array.from({ length: 12 }, () => {
    const seed = generateRandomSeed();
    return getAvatarUrl(style, seed);
  });
  randomAvatars.value = newAvatars;
};

const getInitials = (name) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return parts[0].charAt(0) + parts[1].charAt(0);
  }
  return name.charAt(0);
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 class="font-semibold text-gray-900">프로필 수정</h2>
        <button
          @click="emit('close')"
          class="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X class="size-5 text-gray-500" />
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- 현재 프로필 이미지 -->
        <div class="flex flex-col items-center">
          <div class="relative">
            <div class="size-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              <img
                v-if="formData.avatar"
                :src="formData.avatar"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-orange-200 text-orange-700 flex items-center justify-center"
              >
                <span class="font-bold text-3xl">
                  {{ getInitials(formData.name || user.name) }}
                </span>
              </div>
            </div>
            <div class="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg border border-gray-200">
              <Camera class="size-4 text-gray-600" />
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-3">아바타 선택</p>
        </div>

        <!-- 이름 -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-900 mb-1.5">이름</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="이름을 입력하세요"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- 아바타 스타일 선택 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2">아바타 스타일</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="style in avatarStyles"
              :key="style.name"
              @click="handleStyleChange(style.name)"
              :class="`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                selectedStyle === style.name
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`"
            >
              {{ style.label }}
            </button>
          </div>
        </div>

        <!-- 랜덤 아바타 선택 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-900">아바타 선택</label>
            <button
              type="button"
              @click="generateRandomAvatars"
              class="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Shuffle class="size-4" />
              새로 생성
            </button>
          </div>
          <div class="grid grid-cols-6 gap-3">
            <button
              v-for="(avatarUrl, index) in randomAvatars"
              :key="index"
              @click="formData.avatar = avatarUrl"
              :class="`size-16 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                formData.avatar === avatarUrl
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-300'
              }`"
            >
              <img
                :src="avatarUrl"
                :alt="`Avatar ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- 이메일 (읽기 전용) -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-900 mb-1.5">이메일</label>
          <input
            id="email"
            :value="formData.email"
            disabled
            class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
          />
          <p class="text-xs text-gray-500 mt-1">
            이메일은 변경할 수 없습니다.
          </p>
        </div>
      </div>

      <div class="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-end gap-2 sticky bottom-0">
        <button
          @click="emit('close')"
          class="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          @click="handleSave"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save class="size-4" />
          저장
        </button>
      </div>
    </div>
  </div>
</template>
