import React, { useState, useEffect } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { getClassrooms, joinClassroom } from 'services/ClassroomService';
import ClassroomList from 'components/Classroom/ClassroomList';
import { Classroom } from 'interfaces/ClassroomInterfaces';

const ClassListContainer: React.FC = () => {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.token) {
        try {
          const data = await getClassrooms(user.token);
          setClassrooms(data);
        } catch (err) {
          setError('Failed to fetch classrooms');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleJoinClassroom = async (classroomId: string) => {
    if (!user) {
      alert('You must be logged in to join a classroom');
      return;
    }
    try {
      await joinClassroom(classroomId, user.token);
      alert('Classroom joined successfully!');
    } catch (err) {
      alert('Failed to join classroom');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ClassroomList
      classrooms={classrooms}
      onJoinClassroom={handleJoinClassroom}
    />
  );
};

export default ClassListContainer;
