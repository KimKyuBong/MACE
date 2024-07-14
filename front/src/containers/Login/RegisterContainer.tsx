import React from 'react';
import {useAuth} from '../../hooks/useAuth';
import RegisterForm from '../../components/Login/RegisterForm';

const RegisterContainer: React.FC = () => {
  const { error, handleRegister } = useAuth();

  return <RegisterForm onRegister={handleRegister} error={error} />;
};

export default RegisterContainer;