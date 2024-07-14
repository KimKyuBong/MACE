import React from 'react';
import { Classroom } from 'interfaces/ClassroomInterfaces';

interface ClassroomListProps {
  classrooms: Classroom[];
  onJoinClassroom: (classroomId: string) => void;
}

const ClassroomList: React.FC<ClassroomListProps> = ({ classrooms, onJoinClassroom }) => {
  return (
    <div>
      <h2>Classrooms</h2>
      <ul>
        {classrooms.map((classroom) => (
          <li key={classroom._id.toString()}>
            {classroom.name}: {classroom.description}
            <button onClick={() => onJoinClassroom(classroom._id.toString())}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassroomList;
