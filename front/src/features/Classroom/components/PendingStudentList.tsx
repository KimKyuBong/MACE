import React from 'react';

// Define the PendingStudentList component
const PendingStudentList: React.FC<{ pendingStudents: string[] }> = ({ pendingStudents }) => {
  return (
    <div>
      <h3>Pending Students</h3>
      <ul>
        {pendingStudents.map((student, index) => (
          <li key={index}>{student}</li>
        ))}
      </ul>
    </div>
  );
};

export default PendingStudentList;
