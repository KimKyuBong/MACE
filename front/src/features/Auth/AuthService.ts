import fastapi from 'features/Common/utils/fastapi';
import { User, RegisterFormData } from 'features/Auth/AuthInterfaces';

interface AuthResponse {
  token: {
    access_token: string;
    token_type: string;
  };
  user: User;
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
): Promise<User> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'post',
      '/user/login',
      { username, password },
      undefined,
      (response: AuthResponse) => {
        // 토큰을 파싱하여 로컬 스토리지에 저장
        const { access_token } = response.token;
        storeToken(access_token);

        // 사용자 정보를 반환
        resolve(response.user);
      },
      (error: any) => {
        reject(new Error(error?.message || 'Invalid username or password.'));
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
        // 토큰을 파싱하여 로컬 스토리지에 저장
        const { access_token } = response.token;
        storeToken(access_token);

        // 사용자 정보를 반환
        resolve(response.user);
      },
      (error: any) => {
        reject(
          new Error(error?.message || 'Registration failed. Please try again.')
        );
      }
    );
  });
};

// Get User Info function
export const getUserInfo = async (): Promise<User | null> => {
  const token = getStoredToken(); // Retrieve the stored token
  if (!token) {
    console.warn('No token found');
    return null; // Return null instead of throwing an error
  }

  return new Promise<User | null>((resolve, reject) => {
    fastapi(
      'get',
      '/user/me',
      {},
      token,
      (json: User) => {
        resolve(json); // Resolve with the user data
      },
      (error: any) => {
        console.error('Failed to fetch user information:', error);
        resolve(null); // Return null if fetching fails
      }
    );
  });
};
