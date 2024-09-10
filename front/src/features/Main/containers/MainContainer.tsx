import type React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from 'features/Auth/contexts/AuthContext';
import ClassroomCreateForm from 'features/Classroom/components/ClassroomCreateForm';
import ClassroomListContainer from 'features/Classroom/containers/ClassroomListContainer';
import useWebSocket from 'features/Common/hooks/useWebSocket';
import { useNavigate } from 'react-router-dom';
import type { Classroom } from 'features/Classroom/ClassroomInterfaces';
import { getClassrooms, joinClassroom } from 'features/Main/MainService';

const MainContainer: React.FC = () => {
  const { user, handleLogout } = useAuth();
  const { lastMessage } = useWebSocket('/classrooms');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (lastMessage) {
      setNotifications((prev) => [...prev, lastMessage.data]);
    }
  }, [lastMessage]);

  useEffect(() => {
    console.log('useEffect 실행됨');

    const fetchData = async () => {
      console.log('getClassrooms 호출 직전');
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No access token found');
        }
        const data = await getClassrooms(token);
        console.log('getClassrooms 완료, 받은 데이터:', data);
        setClassrooms(data);
      } catch (err) {
        console.error('getClassrooms 에러 발생:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLoginClick = () => navigate('/login');
  const handleRegisterClick = () => navigate('/register');
  const handleCreateClassroomClick = () => setShowCreateForm(!showCreateForm);
  const handleJoinClassroom = async (classroomId: string) => {
    if (!user) {
      alert('You must be logged in to join a classroom');
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }
      await joinClassroom(classroomId, token);
      alert('Classroom joined successfully!');
    } catch (err) {
      alert('Failed to join classroom');
    }
  };
  const handleViewClassroom = (classroomId: string) => {
    navigate(`/classrooms/${classroomId}`);
  };

  return (
    <div className="container">
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">MACE</span>
        <div>
          {user ? (
            <>
              <span className="navbar-text">
                {user.username} ({user.role})
              </span>
              <button
                type="button"
                className="btn btn-outline-danger ml-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-outline-primary mr-2"
                onClick={handleLoginClick}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleRegisterClick}
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      <h1>Main Page</h1>
      {user ? (
        <>
          <h2>
            Welcome, {user.username} ({user.role})
          </h2>
          {user.role === 'teacher' && (
            <>
              <button
                type="button"
                className="btn btn-primary mb-3"
                onClick={handleCreateClassroomClick}
              >
                {showCreateForm ? 'Cancel' : 'Create Classroom'}
              </button>
              {showCreateForm && <ClassroomCreateForm />}
            </>
          )}
        </>
      ) : (
        <h2>Please log in or register to join a classroom</h2>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <ClassroomListContainer
            classrooms={classrooms}
            user={user}
            onJoinClassroom={handleJoinClassroom}
            onViewClassroom={handleViewClassroom}
          />
          {classrooms.length === 0 && <p>No classrooms available.</p>}
        </>
      )}

      {notifications.length > 0 && (
        <div className="notifications">
          <h2>Notifications</h2>
          <ul>
            {notifications.map((note, index) => (
              <li key={`${note}-${index}`}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MainContainer;