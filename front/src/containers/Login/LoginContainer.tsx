import React from 'react';
import { useAuth } from 'contexts/AuthContext';
import LoginForm from 'components/Login/LoginForm';

const LoginContainer: React.FC = () => {
  const { handleLogin, error } = useAuth();

  return <LoginForm onLogin={handleLogin} error={error} />;
};

export default LoginContainer;
