import { apiClient } from './api';

export async function fetchBoards() {
  const { data } = await apiClient.get('/boards');
  return data || [];
}

export async function fetchTasks() {
  const { data } = await apiClient.get('/tasks');
  return data || [];
}

export async function fetchLogs() {
  const { data } = await apiClient.get('/logs');
  return data || [];
}

export async function createBoard(board) {
  const { data } = await apiClient.post('/boards', board);
  return data;
}

export async function updateBoard(board) {
  const { data } = await apiClient.put(`/boards/${board.id}`, board);
  return data;
}

export async function deleteBoard(boardId) {
  await apiClient.delete(`/boards/${boardId}`);
}

export async function createTask(task) {
  const { data } = await apiClient.post('/tasks', task);
  return data;
}

export async function updateTask(task) {
  const { data } = await apiClient.put(`/tasks/${task.id}`, task);
  return data;
}

export async function deleteTask(taskId) {
  await apiClient.delete(`/tasks/${taskId}`);
}

export async function createLog(log) {
  const { data } = await apiClient.post('/logs', log);
  return data;
}

export async function deleteLog(logId) {
  await apiClient.delete(`/logs/${logId}`);
}
