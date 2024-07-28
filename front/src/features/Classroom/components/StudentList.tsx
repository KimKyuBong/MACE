import React from 'react';

// Define the StudentList component
const StudentList: React.FC<{ students: string[] }> = ({ students }) => {
  return (
    <div>
      <h3>Students</h3>
      <ul>
        {students.map((student, index) => (
          <li key={index}>{student}</li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
