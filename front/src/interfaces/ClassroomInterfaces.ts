export interface ClassroomCreate {
  name: string;
  description: string;
}

export interface Classroom {
  _id: string; // MongoDB의 ObjectId를 문자열로 사용
  name: string;
  description: string;
  teacher_id: string;
  students: string[];
  pending_students: string[];
  created_at?: string; // Optional field for creation date
  updated_at?: string; // Optional field for last update date
}

export interface ClassroomListProps {
  classrooms: Classroom[];
  onJoinClassroom: (classroomId: string) => void;
}
