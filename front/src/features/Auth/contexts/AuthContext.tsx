import type React from 'react';
import {
  createContext,
  useContext,
  useState,type 
  ReactNode,
  useEffect,
} from 'react'
import type { User, RegisterFormData, AuthContextType, AuthResponse } from 'features/Auth/AuthInterfaces';
import { login, register, getUserInfo } from 'features/Auth/AuthService';



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const userInfo = await getUserInfo();
      if (userInfo) {
        setUser(userInfo);
      } else {
        handleLogout();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const userInfo = await login(username, password);
      setUser(userInfo.user);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('로그인에 실패했습니다. 다시 시도해 주세요.');
      }
      throw err; // 에러를 다시 던져서 LoginForm에서 처리할 수 있게 합니다.
    }
  };

  const handleRegister = async (formData: RegisterFormData) => {
    try {
      const userInfo = await register(formData);
      setUser(userInfo);
      setError(null);
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
      }}
    >
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
