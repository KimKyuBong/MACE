import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from 'features/Common/routes/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { AuthProvider } from 'features/Auth/contexts/AuthContext';

// App 컴포넌트 정의
function App(): JSX.Element {
  // 반환 타입을 JSX.Element로 명시
  return (
    <AuthProvider>
      <Router>
        <div>
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
