import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClassroomDetail } from 'features/Classroom/ClassroomInterfaces';
import ActivityList from '../components/ActivityList';
import StudentList from '../components/StudentList';
import PendingStudentList from '../components/PendingStudentList';
import { getClassroom } from 'features/Classroom/ClassroomService';
import { useAuth } from 'features/Auth/contexts/AuthContext';

const ClassroomMainContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classroom, setClassroom] = useState<ClassroomDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id && user?.token) {
        try {
          const data = await getClassroom(id, user.token);
          setClassroom(data);
        } catch (err) {
          setError('Failed to fetch classroom data');
        } finally {
          setLoading(false);
        }
      } else {
        console.error('Invalid classroom ID or missing user token');
        navigate('/');
      }
    };

    fetchData();
  }, [id, user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!classroom) {
    return <div>No classroom data found</div>;
  }

  return (
    <div>
      <h2>{classroom.name}</h2>
      <p>{classroom.description}</p>
      <ActivityList activities={classroom.activities} />
      <StudentList students={classroom.students} />
      <PendingStudentList pendingStudents={classroom.pending_students} />
    </div>
  );
};

export default ClassroomMainContainer;
