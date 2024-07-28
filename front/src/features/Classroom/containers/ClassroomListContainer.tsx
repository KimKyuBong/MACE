import React from 'react';
import ClassroomList from 'features/Classroom/components/ClassroomList';
import { Classroom } from 'features/Classroom/ClassroomInterfaces';
import { User } from 'features/Auth/AuthInterfaces';

interface ClassroomListContainerProps {
  classrooms: Classroom[];
  user: User | null;
  onJoinClassroom: (classroomId: string) => void;
  onViewClassroom: (classroomId: string) => void;
}

const ClassroomListContainer: React.FC<ClassroomListContainerProps> = ({ classrooms, user, onJoinClassroom, onViewClassroom }) => {
  return (
    <ClassroomList
      classrooms={classrooms}
      user={user}
      onJoinClassroom={onJoinClassroom}
      onViewClassroom={onViewClassroom}
    />
  );
};

export default ClassroomListContainer;
