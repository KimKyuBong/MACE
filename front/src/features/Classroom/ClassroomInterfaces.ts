import { User } from 'features/Auth/AuthInterfaces';

export interface ClassroomCreate {
  name: string;
  description: string;
}

export interface Activity {
  id: string; // MongoDB ObjectId를 문자열로 처리
  name: string;
  description: string;
  created_at: string;
}

export interface StudentDetail {
  id: string;
  studentId: string;
  name: string;
}

export interface Classroom {
  id: string;
  name: string;
  description: string;
  teacher_id: string;
  students: StudentDetail[];
  pending_students: StudentDetail[];
  activities: Activity[];
  created_at: string;
  updated_at: string;
}

export interface ClassroomDetail extends Classroom {
  teacher_name?: string;
}

export interface ClassroomListProps {
  classrooms: Classroom[];
  user: User | null;
  onJoinClassroom: (classroomId: string) => void;
  onViewClassroom: (classroomId: string) => void;
}
