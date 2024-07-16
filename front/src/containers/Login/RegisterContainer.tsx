import React from 'react';
import { useAuth } from 'contexts/AuthContext';
import RegisterForm from 'components/Login/RegisterForm';

const RegisterContainer: React.FC = () => {
  const { handleRegister, error } = useAuth();

  return <RegisterForm onRegister={handleRegister} error={error} />;
};

export default RegisterContainer;
