import React from 'react';
import { Activity } from 'features/Classroom/ClassroomInterfaces';

interface ActivityListProps {
  activities: Activity[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <div>
      <h3>Activities</h3>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            <h4>{activity.name}</h4>
            <p>{activity.description}</p>
            <p>{activity.created_at}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityList;
