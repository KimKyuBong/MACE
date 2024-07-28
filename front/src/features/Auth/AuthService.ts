import fastapi from 'features/Common/utils/fastapi';
import { User, RegisterFormData } from 'features/Auth/AuthInterfaces';

export const login = async (
  username: string,
  password: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'post',
      '/user/login',
      { username, password },
      undefined, // 로그인 요청 시 토큰 없음
      (json: User) => {
        resolve(json);
      },
      (error: any) => {
        reject(error);
      }
    );
  });
};

export const register = async (formData: RegisterFormData): Promise<User> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'post',
      '/user/register',
      formData,
      undefined, // 회원가입 요청 시 토큰 없음
      (json: User) => {
        resolve(json);
      },
      (error: any) => {
        reject(error);
      }
    );
  });
};
