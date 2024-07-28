import React from 'react';

interface StudentListProps {
  students: string[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  return (
    <div>
      <h3>Students</h3>
      <ul>
        {students.map((student) => (
          <li key={student}>{student}</li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
