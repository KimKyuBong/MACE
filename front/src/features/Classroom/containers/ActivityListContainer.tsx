import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ActivityList from 'features/Classroom/components/ActivityList';
import { getActivities } from 'features/Classroom/ClassroomService';
import { Activity } from 'features/Classroom/ClassroomInterfaces';
import { useAuth } from 'features/Auth/contexts/AuthContext';

const ActivityListContainer: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (classroomId && user?.token) {
        try {
          const data = await getActivities(classroomId, user.token);
          setActivities(data);
        } catch (err) {
          setError('Failed to fetch activities');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [classroomId, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <ActivityList activities={activities} />;
};

export default ActivityListContainer;
