import { Classroom } from 'features/Classroom/ClassroomInterfaces';
import fastapi from 'features/Common/utils/fastapi';

export const getClassrooms = async (token: string): Promise<Classroom[]> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'get',
      '/classrooms/',
      {},
      token,
      (data) => {
        console.log('Fetched classrooms:', data); // 콘솔에 성공 로그 출력
        resolve(data);
      },
      (error) => {
        console.error('Error fetching classrooms:', error); // 콘솔에 에러 로그 출력
        reject(new Error('Failed to fetch classrooms'));
      }
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
      `/classrooms/join/${classroomId}`,
      {},
      token,
      () => {
        console.log(`Successfully joined classroom ${classroomId}`); // 콘솔에 성공 로그 출력
        resolve();
      },
      (error) => {
        console.error(`Error joining classroom ${classroomId}:`, error); // 콘솔에 에러 로그 출력
        reject(new Error('Failed to join classroom'));
      }
    );
  });
};
