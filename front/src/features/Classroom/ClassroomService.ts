import { ClassroomCreate, Classroom } from 'features/Classroom/ClassroomInterfaces';
import fastapi from 'features/Common/utils/fastapi';

export const createClassroom = async (
  classroomData: ClassroomCreate,
  token: string
): Promise<Classroom> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'post',
      '/classroom/create',
      classroomData,
      token, // 토큰 포함
      (data: Classroom) => resolve(data),
      (error: any) => reject(error)
    );
  });
};

export const getClassrooms = async (token: string): Promise<Classroom[]> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'get',
      '/classroom/',
      {},
      token, // 토큰 포함
      (data: Classroom[]) => resolve(data),
      (error: any) => reject(error)
    );
  });
};

export const joinClassroom = async (
  classroomId: string,
  token: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'post',
      `/classroom/join/${classroomId}`,
      {},
      token, // 토큰 포함
      (data: any) => resolve(data),
      (error: any) => reject(error)
    );
  });
};

export const approveJoinClassroom = async (
  classroomId: string,
  studentId: string,
  token: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'post',
      `/classroom/approve/${classroomId}/${studentId}`,
      {},
      token, // 토큰 포함
      (data: any) => resolve(data),
      (error: any) => reject(error)
    );
  });
};
