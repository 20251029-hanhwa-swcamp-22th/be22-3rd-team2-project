
  # Kanban-Flow (Vue.js Refactor Project)

  Kanban-Flow는 팀의 업무 흐름을 시각적으로 관리하고 협업 효율성을 극대화하기 위해 개발된 웹 애플리케이션입니다.
  기존 React 기반 프로젝트를 Vue 3 (Composition API) + Tailwind CSS 환경으로 리팩토링했으며, JSON Server를 도입해 REST API 통신 환경을 구성했습니다.

## 1. 프로젝트 개요 (Project Overview)
- 프로젝트 기간: 2024.02.01 (리팩토링 기준)
- 개발 인원: 4명
- 기술 스택
  - Frontend: Vue.js 3, JavaScript (ESM + Vanilla JS), Vite
  - Styles: Tailwind CSS v3
  - State Management: Pinia
  - Backend (Mock): JSON Server, Axios

## 2. 주요 기능 (Key Features)
- 업무 관리 (Task Management)
  - CRUD 기능: 모달을 통해 업무 생성/조회/수정/삭제
  - 상태 관리: Todo / In Progress / Done 3단계
- Drag & Drop 워크플로우
  - 칸반 보드: 드래그로 컬럼 이동
  - 실시간 상태 반영 + 활동 로그 기록
- 필터링 및 검색
  - 담당자/중요도 기반 필터
- 활동 로그 (Activity Logs)
  - 생성/수정/이동/삭제 이력 자동 기록
  - 액션별 색상 코드로 가독성 강화

## 3. 주요 성과 및 성공 사례 (Key Achievements)
- 성공적인 마이그레이션 (React → Vue 3)
  - 상태 관리 구조를 Pinia 중심으로 재설계해 복잡도 감소
  - TypeScript 제거 및 Vanilla JS 전환으로 진입 장벽 완화
- 성능 최적화 및 최신 기술 도입
  - localStorage 기반 데이터를 JSON Server로 분리해 FE/BE 협업 구조 모사

## 4. 트러블 슈팅 (Troubleshooting)
### 이슈 1) 컬럼 간 드래그 오류 (Cannot read properties of null) / 드롭 후 원위치 복귀
- 증상: 컬럼 이동 실패, 카드 원위치 복귀, 콘솔에 index/element null 에러
- 원인: 드래그 컨텍스트 DOM 매핑 불안정 + 드래그 중 재분배 로직이 결과 덮어씀
- 해결
  - Column 컴포넌트: tasks 기본값 추가, group 명시, item 슬롯 DOM 래핑
  - Board 로직: 드래그 중 재분배 방지, drag start/end 이벤트 연결
- 결과: 컬럼 이동 정상화, 컨텍스트 오류 제거

### 이슈 2) 드래그 후 활동 로그가 사라짐
- 증상: 드래그 직후 로그가 표시되나 1~2초 후 사라짐
- 원인: json-server가 db.json 갱신 → Vite가 감지 → 자동 리로드로 상태 초기화
- 해결: `vite.config.js`에서 `server.watch.ignored: ['**/db.json']` 설정
- 결과: 로그 유지

### 이슈 3) 로그가 서버엔 저장되는데 UI에 안 뜸
- 증상: POST 성공 후 UI 미표시/간헐적 사라짐
- 원인: POST 이후 UI 반영 타이밍 문제 + fetch 결과가 빈 배열로 덮어씀
- 해결: POST 성공 시 즉시 prepend + 빈 배열일 때 덮어쓰기 방지
- 결과: 서버 저장과 UI 동기 반영

## 5. 팀 회고 (Retrospective)
| 이름 | 역할 (Role) | KPT 회고 (Keep / Problem / Try) | 한 줄 소감 |
| --- | --- | --- | --- |
| 팀원 1 | FE 리드 / 구조 설계 | [Keep] [Problem] [Try] | (작성해주세요) |
| 팀원 2 | UI 구현 / 스타일링 | [Keep] [Problem] [Try] | (작성해주세요) |
| 팀원 3 | 기능 구현 (DnD) | [Keep] [Problem] [Try] | (작성해주세요) |
| 팀원 4 | API 연동 / 테스트 | [Keep] [Problem] [Try] | (작성해주세요) |

## 6. 실행 방법 (How to Run)
서버와 클라이언트를 동시에 실행해야 합니다.

### Mock Server 실행 (터미널 1)
```
npm run server
```

### Client 실행 (터미널 2)
```
npm run dev
```

### 동시에 실행
```
npm run dev:full
```

## Reference
Original design: https://www.figma.com/design/eOhfJi47MlLhdUl8joHW8J/kaban_v2
