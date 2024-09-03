import React from 'react';
import { StudentDetail } from 'features/Classroom/ClassroomInterfaces';

interface PendingStudentListProps {
  pendingStudents: StudentDetail[];
}

const PendingStudentList: React.FC<PendingStudentListProps> = ({
  pendingStudents,
}) => {
  return (
    <div>
      <h3>Pending Students</h3>
      <ul>
        {pendingStudents.map((student) => (
          <li key={student.id}>
            {student.name} ({student.studentId})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingStudentList;
