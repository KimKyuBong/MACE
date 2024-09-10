import { Classroom } from 'features/Classroom/ClassroomInterfaces';
import fastapi from 'features/Common/utils/fastapi';

export const getClassrooms = (token: string): Promise<Classroom[]> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'get',
      '/classrooms/',
      {},
      token,
      (data) => {
        console.log('Fetched classrooms:', data);
        resolve(data);
      },
      (error) => {
        console.error('Error fetching classrooms:', error);
        reject(new Error('Failed to fetch classrooms'));
      }
    );
  });
};

export const joinClassroom = (classroomId: string, token: string): Promise<void> => {
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
        reject(error);
      }
    );
  });
};
