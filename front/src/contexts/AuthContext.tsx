import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, RegisterFormData } from 'interfaces/AuthInterfaces';
import { login, register } from 'services/AuthService';
import { useCookies } from 'react-cookie';

interface AuthContextType {
  user: User | null;
  error: string | null;
  handleLogin: (username: string, password: string) => void;
  handleRegister: (formData: RegisterFormData) => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const loggedInUser = await login(username, password);
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser)); // 사용자 정보를 로컬 스토리지에 저장
      setCookie('token', loggedInUser.token, { path: '/' }); // 쿠키에 토큰 저장
      setError(null);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (formData: RegisterFormData) => {
    try {
      const registeredUser = await register(formData);
      setUser(registeredUser);
      localStorage.setItem('user', JSON.stringify(registeredUser)); // 사용자 정보를 로컬 스토리지에 저장
      setCookie('token', registeredUser.token, { path: '/' }); // 쿠키에 토큰 저장
      setError(null);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // 로컬 스토리지에서 사용자 정보 삭제
    removeCookie('token'); // 쿠키에서 토큰 삭제
  };

  return (
    <AuthContext.Provider value={{ user, error, handleLogin, handleRegister, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
