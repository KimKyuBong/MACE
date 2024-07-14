import axios from 'axios';
import { ClassroomCreate, Classroom } from 'interfaces/ClassroomInterfaces';

const API_BASE_URL = process.env.REACT_APP_API_SERVER_URL;

export const createClassroom = async (classroomData: ClassroomCreate, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/classroom`, classroomData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClassrooms = async (token?: string): Promise<Classroom[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/classroom`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (response.data.message) {
      alert(response.data.message);
      return [];
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const joinClassroom = async (classroomId: string, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/classroom/join/${classroomId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveJoinClassroom = async (classroomId: string, studentId: string, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/classroom/approve/${classroomId}/${studentId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
