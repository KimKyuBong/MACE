import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { User, RegisterFormData } from 'features/Auth/AuthInterfaces';
import { login, register, getUserInfo } from 'features/Auth/AuthService';

interface AuthContextType {
  user: User | null;
  error: string | null;
  loading: boolean;
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
      setUser(userInfo);
      setError(null);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
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
