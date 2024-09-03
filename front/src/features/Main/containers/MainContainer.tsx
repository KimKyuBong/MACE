import React, { useEffect, useState } from 'react';
import { useAuth } from 'features/Auth/contexts/AuthContext';
import ClassroomCreateForm from 'features/Classroom/components/ClassroomCreateForm';
import ClassroomListContainer from 'features/Classroom/containers/ClassroomListContainer';
import useWebSocket from 'features/Common/hooks/useWebSocket';
import { Link, useNavigate } from 'react-router-dom';
import { Classroom } from 'features/Classroom/ClassroomInterfaces';
import { getClassrooms, joinClassroom } from 'features/Main/MainService';

const MainContainer: React.FC = () => {
  const { user, handleLogout } = useAuth();
  const { lastMessage, isConnected } = useWebSocket('/classrooms');
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
    const fetchData = async () => {
      if (user?.token) {
        try {
          const data = await getClassrooms(user.token);
          setClassrooms(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message); // 에러 메시지를 설정
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLoginClick = () => navigate('/login');
  const handleRegisterClick = () => navigate('/register');
  const handleCreateClassroomClick = () => setShowCreateForm(!showCreateForm);
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
  const handleViewClassroom = (classroomId: string) => {
    navigate(`/classrooms/${classroomId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
                className="btn btn-outline-danger ml-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-outline-primary mr-2"
                onClick={handleLoginClick}
              >
                Login
              </button>
              <button
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
                className="btn btn-primary mb-3"
                onClick={handleCreateClassroomClick}
              >
                {showCreateForm ? 'Cancel' : 'Create Classroom'}
              </button>
              {showCreateForm && <ClassroomCreateForm />}
            </>
          )}
          {error ? (
            <div>{error}</div>
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
        </>
      ) : (
        <>
          <h2>Please log in or register to join a classroom</h2>
          {error ? (
            <div>{error}</div>
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
        </>
      )}
      {notifications.length > 0 && (
        <div className="notifications">
          <h2>Notifications</h2>
          <ul>
            {notifications.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MainContainer;
