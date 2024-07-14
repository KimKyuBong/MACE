export interface User {
  username: string;
  school: string;
  studentId?: string;
  subject?: string;
  name: string;
  token: string;
  role: string;
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
