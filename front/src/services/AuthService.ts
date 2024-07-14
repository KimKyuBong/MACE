import fastapi from '../utils/fastapi';
import { User, RegisterFormData } from 'interfaces/AuthInterfaces';

export const login = async (username: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    fastapi("post", "/api/user/login", { username, password }, (json: User) => {
      resolve(json);
    }, (error: any) => {
      reject(error);
    });
  });
};


export const register = async (formData: RegisterFormData): Promise<User> => {
  return new Promise((resolve, reject) => {
    fastapi("post", "/api/user/register", formData, (json: User) => {
      resolve(json);
    }, (error: any) => {
      reject(error);
    });
  });
};