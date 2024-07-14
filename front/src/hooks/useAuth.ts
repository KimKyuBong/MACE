import { useState } from 'react';
import { User, RegisterFormData } from 'interfaces/AuthInterfaces';
import { login, register } from 'services/AuthService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (username: string, password: string) => {
    try {
      const loggedInUser = await login(username, password);
      setUser(loggedInUser);
      setError(null);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (formData: RegisterFormData) => {
    try {
      const registeredUser = await register(formData);
      setUser(registeredUser);
      setError(null);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return {
    user,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};


