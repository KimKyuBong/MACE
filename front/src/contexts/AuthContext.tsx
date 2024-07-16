import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { User, RegisterFormData } from 'interfaces/AuthInterfaces';
import { login, register } from 'services/AuthService';
import { useCookies } from 'react-cookie';

interface AuthContextType {
  user: User | null;
  error: string | null;
  handleLogin: (username: string, password: string) => Promise<void>;
  handleRegister: (formData: RegisterFormData) => Promise<void>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  useEffect(() => {
    const storedUser = cookies.user;
    if (storedUser) {
      setUser(storedUser);
    }
  }, [cookies]);

  const handleLogin = async (username: string, password: string) => {
    try {
      const loggedInUser = await login(username, password);
      setUser(loggedInUser);
      setCookie('user', loggedInUser, {
        path: '/',
        secure: true, // 배포 환경에서는 secure 설정
        sameSite: 'strict', // 쿠키의 SameSite 설정
      });
      setError(null);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (formData: RegisterFormData) => {
    try {
      const registeredUser = await register(formData);
      setUser(registeredUser);
      setCookie('user', registeredUser, {
        path: '/',
        secure: true, // 배포 환경에서는 secure 설정
        sameSite: 'strict', // 쿠키의 SameSite 설정
      });
      setError(null);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    removeCookie('user', { path: '/' });
  };

  return (
    <AuthContext.Provider
      value={{ user, error, handleLogin, handleRegister, handleLogout }}
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
