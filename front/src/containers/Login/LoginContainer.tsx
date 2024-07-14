import React from 'react';
import {useAuth} from 'hooks/useAuth';
import LoginForm from 'components/Login/LoginForm';

const LoginContainer: React.FC = () => {
  const { error, handleLogin } = useAuth();

  return <LoginForm onLogin={handleLogin} error={error} />;
};

export default LoginContainer;
