import { Classroom } from 'features/Classroom/ClassroomInterfaces';
import fastapi from 'features/Common/utils/fastapi'; // 유틸리티 함수 임포트

export const getClassrooms = async (token: string): Promise<Classroom[]> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'get',
      '/classrooms/',
      {},
      token,
      (data) => {
        resolve(data);
      },
      (error) => {
        reject(new Error('Failed to fetch classrooms'));
      }
    );
  });
};

export const joinClassroom = async (classroomId: string, token: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'post',
      `/classrooms/${classroomId}/join`,
      {},
      token,
      () => {
        resolve();
      },
      (error) => {
        reject(new Error('Failed to join classroom'));
      }
    );
  });
};
