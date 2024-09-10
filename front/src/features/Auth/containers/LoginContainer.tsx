import type React from 'react';
import { useAuth } from 'features/Auth/contexts/AuthContext';
import LoginForm from 'features/Auth/components/LoginForm';

const LoginContainer: React.FC = () => {
  const { handleLogin, error } = useAuth();

  return <LoginForm onLogin={handleLogin} error={error} />;
};

export default LoginContainer;
