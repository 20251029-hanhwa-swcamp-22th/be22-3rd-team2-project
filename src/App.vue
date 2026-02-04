<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import Sidebar from './components/Sidebar.vue';
import DashboardView from './components/DashboardView.vue';
import KanbanBoardView from './components/KanbanBoardView.vue';
import BoardModal from './components/BoardModal.vue';
import LoginPage from './components/LoginPage.vue';
import ProfileModal from './components/ProfileModal.vue';
import AlertModal from './components/AlertModal.vue';
import { useKanbanStore } from './stores/kanbanStore';

const store = useKanbanStore();
const {
  isLoggedIn,
  currentUser,
  currentView,
  selectedBoardId,
  boards,
  tasks,
  logs,
  registeredUsers,
  selectedBoard,
  boardTasks,
  boardLogs,
} = storeToRefs(store);

const isBoardModalOpen = ref(false);
const editingBoard = ref(null);
const isNewBoard = ref(false);
const isProfileModalOpen = ref(false);
const isAlertOpen = ref(false);
const alertTitle = ref('알림');
const alertMessage = ref('');

const showAlert = (message, title = '알림') => {
  alertTitle.value = title;
  alertMessage.value = message;
  isAlertOpen.value = true;
};

onMounted(() => {
  store.initialize();
});

const handleLogin = async (email, password, callback) => {
  const success = await store.loginUser(email, password);
  callback(success);
};

const handleRegister = async (name, email, password, callback) => {
  const success = await store.registerUser(name, email, password);
  callback(success);
};

const handleLogout = () => {
  if (window.confirm('정말 로그아웃하시겠습니까?')) {
    store.logoutUser();
  }
};

const handleLogoClick = () => {
  store.selectBoard(null);
  store.setView('dashboard');
};

const handleBoardClick = (boardId) => {
  const board = boards.value.find((b) => b.id === boardId);
  if (!board) {
    alert('보드를 찾을 수 없습니다.');
    return;
  }

  const isCreator = board.createdBy === currentUser.value?.email;
  const isMember = board.members?.some((member) => member.email === currentUser.value?.email);

  if (!isCreator && !isMember) {
    alert('이 보드에 접근할 권한이 없습니다. 보드 참여자만 볼 수 있습니다.');
    return;
  }

  store.selectBoard(boardId);
};

const handleBackToDashboard = () => {
  store.selectBoard(null);
  store.setView('dashboard');
};

const handleViewChange = (view) => {
  store.setView(view);
  store.selectBoard(null);
};

const handleTaskClick = (task) => {
  const board = boards.value.find((b) => b.id === task.boardId);
  if (!board) {
    alert('보드를 찾을 수 없습니다.');
    return;
  }

  const isCreator = board.createdBy === currentUser.value?.email;
  const isMember = board.members?.some((member) => member.email === currentUser.value?.email);

  if (!isCreator && !isMember) {
    alert('이 보드에 접근할 권한이 없습니다.');
    return;
  }

  store.selectBoard(task.boardId);
};

const handleCreateBoard = () => {
  editingBoard.value = null;
  isNewBoard.value = true;
  isBoardModalOpen.value = true;
};

const handleEditBoard = (board) => {
  editingBoard.value = { ...board };
  isNewBoard.value = false;
  isBoardModalOpen.value = true;
};

const handleDeleteBoard = async (boardId) => {
  if (!window.confirm('정말 이 보드를 삭제하시겠습니까?')) return;
  await store.deleteBoard(boardId);
  if (selectedBoardId.value === boardId) {
    store.selectBoard(null);
    store.setView('dashboard');
  }
  showAlert('보드가 삭제되었습니다.', '완료');
};

const handleSaveBoard = async (board) => {
  const wasNew = isNewBoard.value;
  await store.saveBoard(board, isNewBoard.value);
  isBoardModalOpen.value = false;
  editingBoard.value = null;
  isNewBoard.value = false;
  showAlert(wasNew ? '보드가 생성되었습니다.' : '보드가 수정되었습니다.', '완료');
};

const handleBoardUpdate = async (updatedBoard) => {
  await store.updateBoard(updatedBoard);
};

const handleOpenProfileModal = () => {
  isProfileModalOpen.value = true;
};

const handleCloseProfileModal = () => {
  isProfileModalOpen.value = false;
};

const handleUpdateProfile = async (user) => {
  await store.updateProfile(user);
};
</script>

<template>
  <!-- 로그인하지 않은 경우 -->
  <LoginPage 
    v-if="!isLoggedIn || !currentUser"
    @login="handleLogin"
    @register="handleRegister"
  />

  <!-- 로그인한 경우 -->
  <div v-else class="flex h-screen overflow-hidden">
    <!-- 사이드바 -->
    <Sidebar
      :user="currentUser"
      :current-view="currentView"
      @view-change="handleViewChange"
      @logout="handleLogout"
      @profile-click="handleOpenProfileModal"
      @logo-click="handleLogoClick"
    />

    <!-- 메인 콘텐츠 -->
    <KanbanBoardView
      v-if="selectedBoard"
      :board="selectedBoard"
      :tasks="boardTasks"
      :logs="boardLogs"
      :current-user-email="currentUser.email"
      :available-users="registeredUsers"
      :on-edit-board="handleEditBoard"
      :on-delete-board="handleDeleteBoard"
      @back="handleBackToDashboard"
      @tasks-change="(newTasks) => store.updateTasks(newTasks)"
      @logs-change="(newLogs) => store.updateLogs(newLogs)"
      @board-update="handleBoardUpdate"
    />

    <DashboardView
      v-else
      :boards="boards"
      :tasks="tasks"
      :current-view="currentView"
      :current-user-name="currentUser.name"
      :current-user-email="currentUser.email"
      :registered-users="registeredUsers"
      @board-click="handleBoardClick"
      @create-board="handleCreateBoard"
      @task-click="handleTaskClick"
    />

    <!-- 보드 생성/수정 모달 -->
    <BoardModal
      :board="editingBoard"
      :is-open="isBoardModalOpen"
      :is-new-board="isNewBoard"
      :available-users="registeredUsers"
      :current-user-email="currentUser.email"
      @close="() => {
        isBoardModalOpen = false;
        editingBoard = null;
        isNewBoard = false;
      }"
      @save="handleSaveBoard"
    />

    <!-- 프로필 수정 모달 -->
    <ProfileModal
      :user="currentUser"
      :is-open="isProfileModalOpen"
      @close="handleCloseProfileModal"
      @save="handleUpdateProfile"
    />

    <AlertModal
      :is-open="isAlertOpen"
      :title="alertTitle"
      :message="alertMessage"
      @close="isAlertOpen = false"
    />
  </div>
</template>
