const USERS_KEY = 'kanban_users';
const CURRENT_USER_KEY = 'kanban_current_user';

// 기본 사용자 데이터
const defaultUsers = [
  {
    email: 'user@naver.com',
    password: 'demo123',
    name: '홍길동',
  },
  {
    email: 'admin@naver.com',
    password: 'admin123',
    name: '관리자',
  },
];

// 로컬 스토리지 초기화
export function initializeAuth() {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
}

// 사용자 등록
export function register(name, email, password) {
  const usersJson = localStorage.getItem(USERS_KEY);
  const users = usersJson ? JSON.parse(usersJson) : defaultUsers;

  // 이미 존재하는 이메일 확인
  if (users.find((u) => u.email === email)) {
    return false;
  }

  // 새 사용자 추가
  users.push({ email, password, name });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
}

// 로그인
export function login(email, password) {
  const usersJson = localStorage.getItem(USERS_KEY);
  const users = usersJson ? JSON.parse(usersJson) : defaultUsers;

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const currentUser = {
      name: user.name,
      email: user.email,
      avatar: '',
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    return currentUser;
  }

  return null;
}

// 로그아웃
export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// 현재 사용자 가져오기
export function getCurrentUser() {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
}

// 로그인 상태 확인
export function isAuthenticated() {
  return getCurrentUser() !== null;
}

// 프로필 업데이트
export function updateProfile(name, avatar) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }

  // 현재 사용자 정보 업데이트
  const updatedUser = {
    ...currentUser,
    name,
    avatar,
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  // 사용자 목록에서도 업데이트
  const usersJson = localStorage.getItem(USERS_KEY);
  const users = usersJson ? JSON.parse(usersJson) : defaultUsers;
  const updatedUsers = users.map((u) =>
    u.email === currentUser.email ? { ...u, name, avatar } : u
  );
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

  return true;
}

// 모든 등록된 사용자 가져오기
export function getAllRegisteredUsers() {
  const usersJson = localStorage.getItem(USERS_KEY);
  const users = usersJson ? JSON.parse(usersJson) : defaultUsers;
  
  return users.map((u) => ({
    name: u.name,
    email: u.email,
    avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`,
  }));
}
