import { ClassroomCreate, Classroom, Activity } from 'features/Classroom/ClassroomInterfaces';
import fastapi from 'features/Common/utils/fastapi';

export const createClassroom = async (
  classroomData: ClassroomCreate,
  token: string
): Promise<Classroom> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'post',
      '/classrooms/create',
      classroomData,
      token,
      (data: Classroom) => resolve(data),
      (error: any) => reject(error)
    );
  });
};

export const getClassrooms = async (token: string): Promise<Classroom[]> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'get',
      '/classrooms/',
      {},
      token,
      (data: Classroom[]) => resolve(data),
      (error: any) => reject(error)
    );
  });
};

export const getClassroom = async (classroomId: string, token: string): Promise<Classroom> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'get',
      `/classrooms/${classroomId}`,
      {},
      token,
      (data: Classroom) => resolve(data),
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
      `/classrooms/join/${classroomId}`,
      {},
      token,
      () => resolve(),
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
      `/classrooms/approve_join/${classroomId}`,
      { studentId },
      token,
      () => resolve(),
      (error: any) => reject(error)
    );
  });
};

export const getActivities = async (classroomId: string, token: string): Promise<Activity[]> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'get',
      `/classrooms/${classroomId}/activities`,
      {},
      token,
      (data: Activity[]) => resolve(data),
      (error: any) => reject(error)
    );
  });
};
