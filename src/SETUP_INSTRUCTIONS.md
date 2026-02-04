# Kanban-Flow Vue 3 - 설치 및 실행 가이드

## 📋 프로젝트 개요

Vue 3 기반 협업형 업무 관리 칸반 보드입니다. (Pinia + Axios + JSON Server)

## ✅ 완료된 작업

### 변환된 모든 컴포넌트 (13개)
1. ✅ App.vue
2. ✅ Sidebar.vue
3. ✅ LoginPage.vue
4. ✅ ProfileModal.vue
5. ✅ BoardModal.vue
6. ✅ DashboardView.vue
7. ✅ BoardCard.vue
8. ✅ KanbanBoardView.vue
9. ✅ KanbanColumn.vue
10. ✅ TaskCard.vue
11. ✅ TaskModal.vue
12. ✅ FilterBar.vue
13. ✅ ActivityTimeline.vue

### 설정 파일
- ✅ package.json
- ✅ vite.config.js
- ✅ tailwind.config.js
- ✅ postcss.config.js
- ✅ main.js
- ✅ index.html

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

필요한 패키지:
- `vue@^3.4.0`
- `pinia@^2.2.2`
- `axios@^1.7.7`
- `json-server@^1.0.0-beta.3`
- `lucide-vue-next@^0.400.0`
- `@vitejs/plugin-vue@^5.0.0`
- `vite@^5.4.6`
- `tailwindcss@^3.4.10`

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 3. Mock API 실행

```bash
npm run mock
```

또는 프론트와 함께:

```bash
npm run dev:full
```

Mock 데이터는 루트 `db.json`에 있습니다.

### 4. 프로덕션 빌드

```bash
npm run build
```

### 5. 빌드 미리보기

```bash
npm run preview
```

## 🎯 주요 기능

### ✨ 완전히 구현된 기능들

1. **인증 시스템**
   - ✅ 로그인/로그아웃
   - ✅ 회원가입
   - ✅ 프로필 관리 (DiceBear 아바타)
   - ✅ 로컬 스토리지 기반 인증

2. **보드 관리**
   - ✅ 보드 생성/수정/삭제
   - ✅ 보드 색상 선택
   - ✅ 팀원 초대 기능
   - ✅ 보드 생성자 자동 참여
   - ✅ 접근 권한 제어

3. **작업 관리**
   - ✅ 작업 CRUD (생성, 조회, 수정, 삭제)
   - ✅ 드래그 앤 드롭으로 상태 변경
   - ✅ 다중 담당자 할당
   - ✅ 우선순위 설정 (High/Medium/Low)
   - ✅ 즐겨찾기 기능

4. **필터링 & 검색**
   - ✅ 담당자별 필터
   - ✅ 우선순위별 필터
   - ✅ 검색 기능
   - ✅ 필터 초기화

5. **뷰 관리**
   - ✅ 대시보드 (모든 보드)
   - ✅ 나에게 할당된 업무
   - ✅ 즐겨찾기 업무

6. **활동 로그**
   - ✅ 모든 작업 변경 이력 추적
   - ✅ 실시간 로그 업데이트
   - ✅ 타임스탬프 표시

## 🎨 데모 계정

```
이메일: user@naver.com
비밀번호: demo123
```

또는

```
이메일: admin@naver.com
비밀번호: admin123
```

## 📁 프로젝트 구조

```
/
├── components/              # Vue 컴포넌트
│   ├── ActivityTimeline.vue
│   ├── BoardCard.vue
│   ├── BoardModal.vue
│   ├── DashboardView.vue
│   ├── FilterBar.vue
│   ├── KanbanBoardView.vue
│   ├── KanbanColumn.vue
│   ├── LoginPage.vue
│   ├── ProfileModal.vue
│   ├── Sidebar.vue
│   ├── TaskCard.vue
│   └── TaskModal.vue
├── utils/                   # 유틸리티
│   └── auth.js
├── services/                # Axios API
│   ├── api.js
│   └── kanbanApi.js
├── stores/                  # Pinia 스토어
│   └── kanbanStore.js
├── styles/                  # 스타일
│   └── globals.css
├── App.vue                  # 메인 앱
├── main.js                  # 진입점
├── index.html               # HTML 템플릿
├── vite.config.js           # Vite 설정
├── tailwind.config.js       # Tailwind 설정
├── postcss.config.js        # PostCSS 설정
├── package.json             # 패키지 정보
└── README.md                # 프로젝트 문서
```

## 🔧 기술 스택

- **Framework**: Vue 3 (Composition API + `<script setup>`)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide Vue Next
- **Build Tool**: Vite
- **State**: Pinia
- **HTTP**: Axios
- **Mock API**: JSON Server
- **Storage**: Local Storage

## 💡 사용 방법

### 1. 로그인
- 데모 계정 사용 또는 새 계정 생성

### 2. 보드 생성
- "새 보드" 버튼 클릭
- 제목, 설명, 색상 선택
- 팀원 초대 (선택사항)

### 3. 작업 추가
- 보드 클릭하여 들어가기
- "새 작업 추가" 버튼
- 제목, 설명, 담당자, 우선순위 입력

### 4. 작업 관리
- 드래그 앤 드롭으로 상태 변경
- 작업 카드 클릭하여 수정
- 별 아이콘으로 즐겨찾기 추가/제거

### 5. 필터링
- 담당자/우선순위별 필터 적용
- 검색으로 빠른 찾기

### 6. 활동 확인
- 페이지 하단에서 모든 활동 로그 확인

## ⚠️ 주의사항

1. **로컬 스토리지**
   - 모든 데이터는 브라우저 로컬 스토리지에 저장됩니다
   - 브라우저 데이터를 지우면 모든 데이터가 삭제됩니다

2. **브라우저 호환성**
   - 최신 Chrome, Firefox, Safari, Edge 권장
   - IE는 지원하지 않습니다

3. **Node.js 버전**
   - Node.js v18 이상 권장

## 🐛 문제 해결

### 의존성 설치 오류
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### 빌드 오류
```bash
# 빌드 확인
npm run build

# 개발 모드로 상세 오류 확인
npm run dev
```

### 스타일 미적용
- Tailwind CSS 설정 확인
- `postcss.config.js` 확인
- 개발 서버 재시작

### 아이콘 표시 안 됨
```bash
npm install lucide-vue-next
```

## 📝 추가 문서

- `README.md` - 프로젝트 개요

## 🎉 완성도

- ✅ 모든 컴포넌트 Vue 3로 변환 완료
- ✅ 드래그 앤 드롭 기능 작동
- ✅ 모든 CRUD 기능 구현
- ✅ 필터링 및 검색 구현
- ✅ 활동 로그 구현
- ✅ 인증 시스템 구현
- ✅ 프로필 관리 구현
- ✅ 즐겨찾기 기능 구현
- ✅ Pinia 기반 상태 관리
- ✅ Axios 연동 구조
- ✅ JSON Server Mock API
- ✅ 반응형 디자인 적용

## 🚀 다음 단계 (선택사항)

프로젝트를 더욱 발전시키고 싶다면:

1. **Vue Router 추가** - 페이지 라우팅
2. **백엔드 연동** - 실제 API와 연동
3. **PWA 지원** - 오프라인 작동
4. **테스트 추가** - Vitest로 단위 테스트
5. **CI/CD 구축** - 자동 배포 파이프라인

## 📄 라이선스

MIT License

## 💬 지원

문제가 발생하면:
1. `MIGRATION_GUIDE.md` 확인
2. 브라우저 콘솔 확인
3. 개발 도구 네트워크 탭 확인

---

**🎊 Vue 3 마이그레이션 완료!** 모든 기능이 정상 작동합니다.
