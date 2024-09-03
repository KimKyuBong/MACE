import React from 'react';
import { ClassroomListProps } from 'features/Classroom/ClassroomInterfaces';

// 타입 가드 함수
const isMessageObject = (
  classrooms: any
): classrooms is { message: string } => {
  return (classrooms as { message: string }).message !== undefined;
};

const ClassroomList: React.FC<ClassroomListProps> = ({
  classrooms,
  user,
  onJoinClassroom,
  onViewClassroom,
}) => {
  if (isMessageObject(classrooms)) {
    return <div>{classrooms.message}</div>;
  }

  if (classrooms.length === 0) {
    return <div>No classrooms available.</div>;
  }

  return (
    <div>
      <h2>Classrooms</h2>
      <ul>
        {classrooms.map((classroom) => (
          <li key={classroom.id}>
            {classroom.name}: {classroom.description}
            {user?.role === 'student' ? (
              <button onClick={() => onJoinClassroom(classroom.id)}>
                Join
              </button>
            ) : user?.role === 'teacher' && classroom.teacher_id === user.id ? (
              <button onClick={() => onViewClassroom(classroom.id)}>
                View
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassroomList;
