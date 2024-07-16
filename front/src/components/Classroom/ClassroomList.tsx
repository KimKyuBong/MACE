import React from 'react';
import { ClassroomListProps } from 'interfaces/ClassroomInterfaces';

// 타입 가드 함수
const isMessageObject = (
  classrooms: any
): classrooms is { message: string } => {
  return (classrooms as { message: string }).message !== undefined;
};

const ClassroomList: React.FC<ClassroomListProps> = ({
  classrooms,
  onJoinClassroom,
}) => {
  if (isMessageObject(classrooms)) {
    return <div>{classrooms.message}</div>;
  }

  return (
    <div>
      <h2>Classrooms</h2>
      <ul>
        {classrooms.map((classroom) => (
          <li key={classroom._id.toString()}>
            {classroom.name}: {classroom.description}
            <button onClick={() => onJoinClassroom(classroom._id.toString())}>
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassroomList;
