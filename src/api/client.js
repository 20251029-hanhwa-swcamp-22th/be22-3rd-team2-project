import axios from 'axios';

/**
 * [API 클라이언트 설정]
 * 백엔드 서버(json-server)와 통신하기 위한 Axios 인스턴스를 생성합니다.
 * 이 설정을 통해 매번 http://localhost:3000을 입력할 필요 없이
 * apiClient.get('/tasks') 처럼 편하게 사용할 수 있습니다.
 */

// Axios 인스턴스 생성
const apiClient = axios.create({
    // baseURL: API 요청을 보낼 기본 주소 (로컬 json-server 주소)
    baseURL: 'http://localhost:3000',
    
    // timeout: 요청 후 응답이 올 때까지 기다릴 최대 시간 (5초)
    // 5초가 지나도 응답이 없으면 에러로 간주합니다.
    timeout: 5000,
});

export default apiClient;
