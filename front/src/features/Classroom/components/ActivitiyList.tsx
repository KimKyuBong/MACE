import React, { useEffect, useState } from 'react';

// Define the Activity interface
interface Activity {
  _id: string;
  title: string;
  description: string;
  created_at: string;
}

// Mock API call for demonstration purposes
const fetchActivities = (classroomId: string): Promise<Activity[]> => {
  return Promise.resolve([
    {
      _id: 'activity1',
      title: 'Activity 1',
      description: 'Description for Activity 1',
      created_at: '2023-01-01',
    },
    {
      _id: 'activity2',
      title: 'Activity 2',
      description: 'Description for Activity 2',
      created_at: '2023-01-02',
    },
  ]);
};

const ActivityList: React.FC<{ classroomId: string }> = ({ classroomId }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchActivities(classroomId).then((data) => setActivities(data));
  }, [classroomId]);

  return (
    <div>
      <h3>Activities</h3>
      <ul>
        {activities.map((activity) => (
          <li key={activity._id}>
            <h4>{activity.title}</h4>
            <p>{activity.description}</p>
            <p>{activity.created_at}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityList;
