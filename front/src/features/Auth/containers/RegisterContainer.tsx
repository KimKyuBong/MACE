import React from 'react';
import { useAuth } from 'features/Auth/contexts/AuthContext';
import RegisterForm from 'features/Auth/components/RegisterForm';

const RegisterContainer: React.FC = () => {
  const { handleRegister, error } = useAuth();

  return <RegisterForm onRegister={handleRegister} error={error} />;
};

export default RegisterContainer;
