import React from 'react';
import { StudentDetail } from 'features/Classroom/ClassroomInterfaces';

interface StudentListProps {
  students: StudentDetail[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  return (
    <div>
      <h3>Students</h3>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} ({student.studentId})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
