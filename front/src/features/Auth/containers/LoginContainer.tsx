import React from 'react';
import { useAuth } from 'features/Common/contexts/AuthContext';
import LoginForm from 'features/Auth/components/LoginForm';

const LoginContainer: React.FC = () => {
  const { handleLogin, error } = useAuth();

  return <LoginForm onLogin={handleLogin} error={error} />;
};

export default LoginContainer;
