<script setup>
import { Layers, LayoutDashboard, User as UserIcon, Star, LogOut, Edit2 } from 'lucide-vue-next';

defineProps({
  user: {
    type: Object,
    required: true,
  },
  currentView: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['viewChange', 'logout', 'profileClick', 'logoClick']);

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: '대시보드' },
  { id: 'myTasks', icon: UserIcon, label: '나에게 할당된 업무' },
  { id: 'favorites', icon: Star, label: '즐겨찾기 업무' },
];
</script>

<template>
  <div class="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
    <!-- 로고 -->
    <div class="p-6 border-b border-gray-200">
      <button 
        @click="emit('logoClick')"
        class="flex items-center gap-2 hover:opacity-80 transition-opacity w-full"
      >
        <div class="bg-blue-600 p-1.5 rounded">
          <Layers class="size-5 text-white" />
        </div>
        <span class="font-bold text-gray-900">Kanban-Flow</span>
      </button>
    </div>

    <!-- 사용자 프로필 -->
    <div class="p-4 border-b border-gray-200">
      <button 
        @click="emit('profileClick')"
        class="w-full flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors group"
      >
        <div class="size-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.name"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            :class="`w-full h-full flex items-center justify-center ${
              user.avatar || 'bg-orange-200 text-orange-700'
            }`"
          >
            <span class="font-medium text-sm">
              {{ user.name.charAt(0) }}
            </span>
          </div>
        </div>
        <div class="flex-1 min-w-0 text-left">
          <p class="font-medium text-gray-900 truncate">{{ user.name }}</p>
          <p class="text-sm text-gray-500 truncate">{{ user.email }}</p>
        </div>
        <Edit2 class="size-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </button>
    </div>

    <!-- 메뉴 -->
    <nav class="flex-1 p-3">
      <div class="mb-4">
        <p class="text-xs text-gray-500 px-3 mb-2">메뉴</p>
        <div class="space-y-1">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="emit('viewChange', item.id)"
            :class="`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === item.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`"
          >
            <component :is="item.icon" class="size-5" />
            <span class="text-sm font-medium">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- 로그아웃 -->
    <div class="p-4 border-t border-gray-200">
      <button
        @click="emit('logout')"
        class="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut class="size-5" />
        <span class="text-sm font-medium">로그아웃</span>
      </button>
      <p class="text-xs text-gray-400 text-center mt-2">
        {{ user.email }}
      </p>
    </div>
  </div>
</template>
