import { ref, computed } from 'vue';
import apiClient from '@/api/client';

// [전역 상태 관리]
// Vue의 Composable 패턴을 사용하여 상태(데이터)를 한곳에서 관리합니다.
// 이렇게 하면 여러 컴포넌트에서 같은 데이터를 공유하고 사용할 수 있습니다.

// tasks: 모든 업무 목록을 저장하는 반응형 변수 (ref)
const tasks = ref([]);
// activities: 모든 활동 로그를 저장하는 반응형 변수
const activities = ref([]);
// isLoading: 데이터를 불러오는 중인지 표시하기 위한 플래그 (로딩 스피너용)
const isLoading = ref(false);

/**
 * useBoard 컴포저블 함수
 * 이 함수를 호출하면 보드 관련 데이터와 함수들을 사용할 수 있습니다.
 */
export function useBoard() {
  
  /**
   * [비동기 함수 (async/await) 상세 설명]
   * 
   * Q. 왜 함수 앞에 'async'라는 단어를 꼭 붙여야 하나요?
   * A. 두 가지 이유가 있습니다.
   *    1. [규칙] 자바스크립트 문법상 'await' (기다려!) 명령어는 오직 'async' 함수 안에서만 작동합니다. 
   *       일반 함수에서 await을 쓰면 에러가 납니다.
   *    2. [표시] 이 함수는 "언젠간 끝나지만 지금 당장은 아닐 수도 있다"는 것을 표시합니다.
   *       async 함수는 항상 'Promise'(약속)라는 특별한 포장지에 싸인 결과를 반환합니다.
   * 
   * Q. 'await'은 뭔가요?
   * A. "서버에서 응답이 올 때까지 다음 줄로 넘어가지 말고 여기서 멈춰라"라는 뜻입니다.
   *    이게 없으면 데이터가 아직 안 왔는데 화면을 그리려고 해서 에러가 납니다.
   */

  /**
   * [업무 목록 조회]
   * 서버에서 모든 업무 데이터를 가져옵니다.
   */
  const fetchTasks = async () => {
    isLoading.value = true; // 1. 로딩 시작 (화면에 스피너가 돔)
    try {
      // 2. 서버에 "/tasks" 데이터를 달라고 요청(get)합니다.
      // await이 있으므로, 서버가 응답을 줄 때까지(예: 0.5초) 다음 줄로 넘어가지 않고 여기서 멈춰 기다립니다.
      const response = await apiClient.get('/tasks');
      
      // 3. 응답이 도착했습니다! 가져온 데이터를 tasks 변수에 저장합니다.
      // Vue가 이 변화를 감지하고 화면을 자동으로 새로 그립니다.
      tasks.value = response.data;
    } catch (error) {
      // 만약 통신 중 에러가 나면(인터넷 끊김 등) 여기가 실행됩니다.
      console.error('Failed to fetch tasks:', error);
    } finally {
      // 4. 성공하든 실패하든 무조건 실행됩니다. 로딩 표시를 끕니다.
      isLoading.value = false;
    }
  };

  /**
   * [활동 로그 조회]
   * 서버에서 활동 내역을 최신순으로 가져옵니다.
   */
  const fetchActivities = async () => {
    try {
      // 서버 요청: 활동 로그를 가져와라. (기다림...)
      const response = await apiClient.get('/activities?_sort=timestamp&_order=desc');
      // 응답 도착: 데이터를 변수에 담음.
      if (Array.isArray(response.data) && response.data.length > 0) {
        activities.value = response.data;
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  // 앱이 처음 실행될 때 데이터가 없으면 자동으로 불러옵니다.
  if (tasks.value.length === 0 && !isLoading.value) {
      fetchTasks();
      fetchActivities();
  }

  /**
   * [활동 로그 기록]
   * 사용자의 중요한 행동(생성, 이동, 삭제 등)을 서버에 기록합니다.
   * @param {string} action - 행동 유형 (created, updated, moved, deleted)
   * @param {string} details - 로그에 표시할 상세 설명
   */
  const logActivity = async (action, details) => {
      try {
          const newActivity = {
              action,
              details,
              timestamp: new Date().toISOString() // 현재 시간 저장
          };
          // 1. 서버에 로그 저장 요청 (기다림...)
          const response = await apiClient.post('/activities', newActivity);
          const saved = response?.data || newActivity;
          // 화면 즉시 반영 (서버 동기화는 백그라운드에서)
          activities.value = [saved, ...activities.value.filter(a => a.id !== saved.id)];
          // 서버 응답이 비어있거나 늦어도 UI가 사라지지 않도록
          // 여기서는 즉시 반영만 하고 재조회는 생략합니다.
      } catch (error) {
          console.error("Failed to log activity:", error);
      }
  };

  /**
   * [새 업무 추가]
   * @param {Object} taskData - 입력받은 새 업무 데이터 (제목, 담당자 등)
   */
  const addTask = async (taskData) => {
    try {
      // 생성 시간과 수정 시간을 현재 시간으로 설정
      const taskWithDates = {
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
      };
      
      // 1. 서버에 새 업무 데이터 저장 요청 (기다림...)
      const response = await apiClient.post('/tasks', taskWithDates);
      
      // 2. 서버 저장이 성공하면, 응답받은 데이터(ID 포함)를 우리 목록에 추가합니다.
      // 화면에도 새 업무가 짠 하고 나타납니다.
      tasks.value.push(response.data);
      
      // 3. 마지막으로 "업무가 생성되었습니다" 라는 로그를 서버에 기록합니다. (기다림...)
      await logActivity('created', `"${response.data.title}" 업무가 생성되었습니다.`);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  /**
   * [업무 수정]
   * @param {string} id - 수정할 업무의 ID
   * @param {Object} updates - 변경할 데이터들을 담은 객체
   */
  const updateTask = async (id, updates) => {
    try {
      // 수정 전 상태를 기억해둠 (로그 메시지 생성용)
      const oldTask = tasks.value.find(t => t.id === id);
      if (!oldTask) return;

      // 1. 서버에 수정 요청 (PATCH: 바뀐 부분만 수정) (기다림...)
      const response = await apiClient.patch(`/tasks/${id}`, { 
          ...updates,
          updatedAt: new Date().toISOString() // 수정 시간 갱신
      });
      
      const updatedTask = response.data;
      
      // 2. 로컬 목록에서도 내용을 최신으로 바꿉니다.
      const index = tasks.value.findIndex(t => t.id === id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }

      // 3. 상태(Status)가 바뀌었는지 확인하여 적절한 로그 기록 (기다림...)
      if (oldTask.status !== updatedTask.status) {
          await logActivity('moved', `"${updatedTask.title}" 업무 상태가 ${oldTask.status}에서 ${updatedTask.status}(으)로 변경되었습니다.`);
      } else {
          await logActivity('updated', `"${updatedTask.title}" 업무 정보가 수정되었습니다.`);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  /**
   * [업무 삭제]
   * @param {string} id - 삭제할 업무의 ID
   */
  const deleteTask = async (id) => {
    try {
      const task = tasks.value.find(t => t.id === id);
      // 1. 서버에 삭제 요청 (기다림...)
      await apiClient.delete(`/tasks/${id}`);
      
      // 2. 삭제가 성공하면, 우리 목록에서도 그 아이디를 가진 업무를 뺍니다.
      tasks.value = tasks.value.filter(t => t.id !== id);
      
      // 3. 로그 기록 (기다림...)
      if (task) {
          await logActivity('deleted', `"${task.title}" 업무가 삭제되었습니다.`);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  /**
   * [업무 이동]
   * Drag & Drop 등으로 업무의 상태(컬럼)를 변경할 때 사용
   */
  const moveTask = async (id, newStatus) => {
      const task = tasks.value.find(t => t.id === id);
      // 상태가 실제로 다를 때만 업데이트 실행
      if (task && task.status !== newStatus) {
          // 내부적으로 updateTask를 호출하므로, 거기서 await을 하게 됩니다.
          await updateTask(id, { status: newStatus });
      }
  };

  // 뷰 컴포넌트에서 사용할 변수와 함수들을 내보냄
  return {
    tasks,
    activities,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    fetchTasks 
  };
}
