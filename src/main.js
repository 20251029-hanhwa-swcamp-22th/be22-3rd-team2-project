import { createApp } from 'vue'
import './style.css' // 전역 스타일(Tailwind 등) 불러오기
import App from './App.vue' // 최상위 컴포넌트 불러오기

// Vue 앱을 생성하고 index.html의 #app 태그 위치에 장착(Mount)시킵니다.
createApp(App).mount('#app')
