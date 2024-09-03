export interface User {
  id: string;
  username: string;
  school: string;
  studentId?: string;
  subject?: string;
  name: string;
  role: string;
  token: string;
}

export interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  error: string | null;
}

export interface RegisterFormProps {
  onRegister: (formData: RegisterFormData) => void;
  error: string | null;
}

export interface RegisterFormData {
  school: string;
  studentId?: string;
  subject?: string;
  name: string;
  username: string;
  password: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  error: string | null;
  handleLogin: (username: string, password: string) => Promise<void>;
  handleRegister: (formData: RegisterFormData) => Promise<void>;
  handleLogout: () => void;
}
