import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

// App 컴포넌트 정의
function App(): JSX.Element { // 반환 타입을 JSX.Element로 명시
  return (
    <Router>
      <div>
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
