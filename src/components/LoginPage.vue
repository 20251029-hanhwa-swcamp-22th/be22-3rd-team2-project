<script setup>
import { ref } from 'vue';
import { Layers, Mail, Lock, User, Eye, EyeOff } from 'lucide-vue-next';

const emit = defineEmits(['login', 'register']);

const isLoginMode = ref(true);
const showPassword = ref(false);
const formData = ref({
  name: '',
  email: '',
  password: '',
});
const error = ref('');

const handleSubmit = () => {
  error.value = '';

  if (isLoginMode.value) {
    // 로그인
    if (!formData.value.email || !formData.value.password) {
      error.value = '이메일과 비밀번호를 입력해주세요.';
      return;
    }
    emit('login', formData.value.email, formData.value.password, (success) => {
      if (!success) {
        error.value = '이메일 또는 비밀번호가 올바르지 않습니다.';
      }
    });
  } else {
    // 회원가입
    if (!formData.value.name || !formData.value.email || !formData.value.password) {
      error.value = '모든 필드를 입력해주세요.';
      return;
    }
    if (formData.value.password.length < 6) {
      error.value = '비밀번호는 6자 이상이어야 합니다.';
      return;
    }
    emit('register', formData.value.name, formData.value.email, formData.value.password, (success) => {
      if (!success) {
        error.value = '이미 등록된 이메일입니다.';
      } else {
        error.value = '';
        isLoginMode.value = true;
        formData.value = { name: '', email: '', password: '' };
      }
    });
  }
};

const handleDemoLogin = () => {
  emit('login', 'user@naver.com', 'demo123', () => {});
};

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  error.value = '';
  formData.value = { name: '', email: '', password: '' };
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg mb-4">
          <div class="bg-blue-600 p-2 rounded">
            <Layers class="size-6 text-white" />
          </div>
          <span class="font-bold text-gray-900 text-xl">Kanban-Flow</span>
        </div>
        <p class="text-white text-sm">협업형 업무 관리 칸반 보드</p>
      </div>

      <!-- 로그인/회원가입 폼 -->
      <div class="bg-white rounded-xl shadow-2xl p-8">
        <div class="mb-6">
          <h2 class="font-bold text-gray-900 text-center mb-2">
            {{ isLoginMode ? '로그인' : '회원가입' }}
          </h2>
          <p class="text-sm text-gray-600 text-center">
            {{ isLoginMode
              ? '계정에 로그인하여 시작하세요'
              : '새 계정을 만들어 시작하세요' }}
          </p>
        </div>

        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="!isLoginMode">
            <label for="name" class="block text-sm font-medium text-gray-900 mb-1.5">이름</label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="홍길동"
                class="w-full pl-10 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-900 mb-1.5">이메일</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="user@naver.com"
                class="w-full pl-10 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-900 mb-1.5">비밀번호</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••"
                class="w-full pl-10 pr-10 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <EyeOff v-if="showPassword" class="size-5" />
                <Eye v-else class="size-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {{ isLoginMode ? '로그인' : '회원가입' }}
          </button>
        </form>

        <template v-if="isLoginMode">
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          <button
            type="button"
            @click="handleDemoLogin"
            class="w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            데모 계정으로 시작하기
          </button>
        </template>

        <div class="mt-6 text-center">
          <button
            type="button"
            @click="toggleMode"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {{ isLoginMode
              ? '계정이 없으신가요? 회원가입'
              : '이미 계정이 있으신가요? 로그인' }}
          </button>
        </div>
      </div>

      <!-- 데모 안내 -->
      <div class="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <p class="text-white text-sm text-center">
          💡 <strong>데모 계정:</strong> user@naver.com / demo123
        </p>
      </div>
    </div>
  </div>
</template>
