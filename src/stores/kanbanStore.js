import { defineStore } from 'pinia';
import { seedBoards, seedTasks, seedLogs } from '../data/seed';
import {
  initializeAuth,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
  getCurrentUser,
  updateProfile as authUpdateProfile,
  getAllRegisteredUsers,
} from '../utils/auth';
import {
  fetchBoards,
  fetchTasks,
  fetchLogs,
  createBoard,
  updateBoard as updateBoardApi,
  deleteBoard as deleteBoardApi,
  createTask,
  updateTask,
  deleteTask,
  createLog,
  deleteLog,
} from '../services/kanbanApi';

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    isLoggedIn: false,
    currentUser: null,
    currentView: 'dashboard',
    selectedBoardId: null,
    boards: [],
    tasks: [],
    logs: [],
    registeredUsers: [],
    isDataLoaded: false,
  }),
  getters: {
    selectedBoard(state) {
      return state.boards.find((b) => b.id === state.selectedBoardId) || null;
    },
    boardTasks(state) {
      if (!state.selectedBoardId) return [];
      return state.tasks.filter((t) => t.boardId === state.selectedBoardId);
    },
    boardLogs(state) {
      if (!state.selectedBoardId) return [];
      return state.logs.filter((l) => l.boardId === state.selectedBoardId);
    },
  },
  actions: {
    async initialize() {
      initializeAuth();
      const user = getCurrentUser();
      if (user) {
        this.currentUser = user;
        this.isLoggedIn = true;
      }
      this.registeredUsers = getAllRegisteredUsers();
      await this.loadData();
    },
    async loadData() {
      try {
        const [boards, tasks, logs] = await Promise.all([
          fetchBoards(),
          fetchTasks(),
          fetchLogs(),
        ]);
        this.boards = boards;
        this.tasks = tasks;
        this.logs = logs;
        this.isDataLoaded = true;
      } catch (error) {
        this.boards = seedBoards;
        this.tasks = seedTasks;
        this.logs = seedLogs;
        this.isDataLoaded = true;
      }
    },
    async loginUser(email, password) {
      const user = authLogin(email, password);
      if (user) {
        this.currentUser = user;
        this.isLoggedIn = true;
        return true;
      }
      return false;
    },
    async registerUser(name, email, password) {
      const success = authRegister(name, email, password);
      if (success) {
        const existingUser = this.registeredUsers.find((user) => user.email === email);
        if (!existingUser) {
          this.registeredUsers = [
            ...this.registeredUsers,
            {
              name,
              email,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            },
          ];
        }
      }
      return success;
    },
    logoutUser() {
      authLogout();
      this.currentUser = null;
      this.isLoggedIn = false;
      this.selectedBoardId = null;
      this.currentView = 'dashboard';
    },
    async updateProfile(user) {
      if (!this.currentUser) return false;
      const success = authUpdateProfile(user.name, user.avatar);
      if (success) {
        this.currentUser = user;
        this.registeredUsers = this.registeredUsers.map((u) =>
          u.email === user.email ? { ...u, name: user.name, avatar: user.avatar } : u
        );
      }
      return success;
    },
    setView(view) {
      this.currentView = view;
    },
    selectBoard(boardId) {
      this.selectedBoardId = boardId;
    },
    async saveBoard(board, isNew) {
      if (isNew) {
        const newBoard = {
          ...board,
          id: `board${Date.now()}`,
          createdAt: new Date().toISOString(),
          createdBy: this.currentUser?.email || '',
          createdByName: this.currentUser?.name || '',
        };
        this.boards = [...this.boards, newBoard];
        try {
          await createBoard(newBoard);
        } catch (error) {
          // Ignore API errors to keep UI responsive
        }
        return newBoard;
      }

      this.boards = this.boards.map((b) => (b.id === board.id ? board : b));
      try {
        await updateBoardApi(board);
      } catch (error) {
        // Ignore API errors to keep UI responsive
      }
      return board;
    },
    async updateBoard(board) {
      this.boards = this.boards.map((b) => (b.id === board.id ? board : b));
      try {
        await updateBoardApi(board);
      } catch (error) {
        // Ignore API errors to keep UI responsive
      }
    },
    async deleteBoard(boardId) {
      const relatedTasks = this.tasks.filter((task) => task.boardId === boardId);
      const relatedLogs = this.logs.filter((log) => log.boardId === boardId);

      this.boards = this.boards.filter((board) => board.id !== boardId);
      this.tasks = this.tasks.filter((task) => task.boardId !== boardId);
      this.logs = this.logs.filter((log) => log.boardId !== boardId);

      if (this.selectedBoardId === boardId) {
        this.selectedBoardId = null;
      }

      await Promise.all([
        deleteBoardApi(boardId).catch(() => {}),
        ...relatedTasks.map((task) => deleteTask(task.id).catch(() => {})),
        ...relatedLogs.map((log) => deleteLog(log.id).catch(() => {})),
      ]);
    },
    async updateTasks(newTasks) {
      const previousTasks = this.tasks;
      this.tasks = newTasks;

      const previousById = new Map(previousTasks.map((task) => [task.id, task]));
      const nextById = new Map(newTasks.map((task) => [task.id, task]));

      const createdTasks = newTasks.filter((task) => !previousById.has(task.id));
      const updatedTasks = newTasks.filter((task) => previousById.has(task.id));
      const removedTasks = previousTasks.filter((task) => !nextById.has(task.id));

      await Promise.all([
        ...createdTasks.map((task) => createTask(task).catch(() => {})),
        ...updatedTasks.map((task) => updateTask(task).catch(() => {})),
        ...removedTasks.map((task) => deleteTask(task.id).catch(() => {})),
      ]);
    },
    async updateLogs(newLogs) {
      const previousLogs = this.logs;
      this.logs = newLogs;

      const previousIds = new Set(previousLogs.map((log) => log.id));
      const createdLogs = newLogs.filter((log) => !previousIds.has(log.id));

      await Promise.all(createdLogs.map((log) => createLog(log).catch(() => {})));
    },
  },
});
