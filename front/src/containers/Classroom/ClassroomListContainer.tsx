import React, { useState, useEffect } from 'react';
import { useAuth } from 'hooks/useAuth';
import { getClassrooms, joinClassroom } from 'services/ClassroomService';
import ClassroomList from 'components/Classroom/ClassroomList';
import { Classroom } from 'interfaces/ClassroomInterfaces';

const ClassListContainer: React.FC = () => {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getClassrooms(user?.token);
      setClassrooms(data);
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

  return <ClassroomList classrooms={classrooms} onJoinClassroom={handleJoinClassroom} />;
};

export default ClassListContainer;
