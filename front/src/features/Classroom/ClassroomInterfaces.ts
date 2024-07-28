import { User } from 'features/Auth/AuthInterfaces';

export interface ClassroomCreate {
  name: string;
  description: string;
}


export interface Activity {
  _id: string; // MongoDB ObjectId를 문자열로 처리
  title: string;
  description: string;
  created_at: string;
}

export interface Classroom {
  _id: string; // MongoDB ObjectId를 문자열로 처리
  name: string;
  description: string;
  teacher_id: string;
  students: string[];
  pending_students: string[];
  activities: Activity[];
  created_at: string;
  updated_at: string;
}

export interface ClassroomListProps {
  classrooms: Classroom[];
  user: User | null;
  onJoinClassroom: (classroomId: string) => void;
  onViewClassroom: (classroomId: string) => void;
}

