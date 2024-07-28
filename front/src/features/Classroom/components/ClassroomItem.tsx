import React from 'react';
import { Classroom } from 'features/Classroom/ClassroomInterfaces';

interface ClassItemProps {
  classItem: Classroom;
  onJoinClass: (classId: string) => void;
}

const ClassItem: React.FC<ClassItemProps> = ({ classItem, onJoinClass }) => (
  <div className="card my-3">
    <div className="card-body">
      <h5 className="card-title">{classItem.name}</h5>
      <p className="card-text">{classItem.description}</p>
      <button className="btn btn-primary" onClick={() => onJoinClass(classItem._id)}>Join Class</button>
    </div>
  </div>
);

export default ClassItem;
