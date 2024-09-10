import fastapi from 'features/Common/utils/fastapi';
import type { User, RegisterFormData, AuthResponse } from 'features/Auth/AuthInterfaces';

// ApiError 인터페이스 정의
interface ApiError {
  message: string;
  // 필요한 경우 다른 필드 추가
}

// Helper function to store token
const storeToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

// Helper function to retrieve token
const getStoredToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Login function
export const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'post',
      '/user/login',
      { username, password },
      undefined,
      (response: AuthResponse) => {
        const { access_token } = response.token;
        storeToken(access_token);
        resolve(response);
      },
      (error: ApiError) => {
        reject(new Error(error.message || '사용자 이름 또는 비밀번호가 잘못되었습니다.'));
      }
    );
  });
};

// Register function
export const register = async (formData: RegisterFormData): Promise<User> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'post',
      '/user/register',
      formData,
      undefined,
      (response: AuthResponse) => {
        const { access_token } = response.token;
        storeToken(access_token);
        resolve(response.user);
      },
      (error: ApiError) => {
        reject(new Error(error.message || '회원가입에 실패했습니다. 다시 시도해 주세요.'));
      }
    );
  });
};

// Get User Info function
export const getUserInfo = async (): Promise<User | null> => {
  const token = getStoredToken();
  if (!token) {
    console.warn('No token found');
    return null;
  }

  return new Promise<User | null>((resolve, reject) => {
    fastapi(
      'get',
      '/user/me',
      {},
      token,
      (json: User) => {
        resolve(json);
      },
      (error: ApiError) => {
        console.error('사용자 정보를 가져오는데 실패했습니다:', error.message);
        resolve(null);
      }
    );
  });
};
