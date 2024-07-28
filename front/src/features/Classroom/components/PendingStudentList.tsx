import React from 'react';

interface PendingStudentListProps {
  pendingStudents: string[];
}

const PendingStudentList: React.FC<PendingStudentListProps> = ({ pendingStudents }) => {
  return (
    <div>
      <h3>Pending Students</h3>
      <ul>
        {pendingStudents.map((student) => (
          <li key={student}>{student}</li>
        ))}
      </ul>
    </div>
  );
};

export default PendingStudentList;
