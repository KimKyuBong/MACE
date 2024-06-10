import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 'root' 엘리먼트를 찾고 그에 대한 타입을 명시
const rootElement = document.getElementById('root') as HTMLElement;

// ReactDOM.createRoot를 사용하여 루트 엘리먼트에 대한 React 루트를 생성
const root = ReactDOM.createRoot(rootElement);

// React.StrictMode를 사용하여 App 컴포넌트 렌더링
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 웹 바이탈즈 성능 측정을 위한 함수 호출
// 결과를 콘솔에 기록하거나 분석 엔드포인트로 보낼 수 있음
reportWebVitals();
