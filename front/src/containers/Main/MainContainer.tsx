import React, { useEffect, useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import ClassroomCreateForm from 'components/Classroom/ClassroomCreateForm';
import ClassroomListContainer from 'containers/Classroom/ClassroomListContainer';
import useWebSocket from 'hooks/useWebSocket';

const MainContainer: React.FC = () => {
  const { user, handleLogout } = useAuth();
  const { lastMessage, isConnected } = useWebSocket('/classrooms');
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (lastMessage) {
      setNotifications((prev) => [...prev, lastMessage.data]);
    }
  }, [lastMessage]);

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
              <button className="btn btn-outline-danger ml-2" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline-primary mr-2">Login</button>
              <button className="btn btn-outline-secondary">Register</button>
            </>
          )}
        </div>
      </nav>

      <h1>Main Page</h1>
      {user ? (
        <>
          <h2>Welcome, {user.username} ({user.role})</h2>
          {user.role === 'teacher' && <ClassroomCreateForm />}
          <ClassroomListContainer />
        </>
      ) : (
        <>
          <h2>Please log in or register to join a classroom</h2>
          <ClassroomListContainer /> {/* 로그인 전에도 클래스 목록 표시 */}
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
