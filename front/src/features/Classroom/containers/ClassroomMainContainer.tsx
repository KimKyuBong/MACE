import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Classroom } from 'features/Classroom/ClassroomInterfaces';
import ActivityList from '../components/ActivitiyList';
import StudentList from '../components/StudentList';
import PendingStudentList from '../components/PendingStudentList';


// Mock API calls for demonstration purposes
const fetchClassroom = (id: string): Promise<Classroom> => {
  return Promise.resolve({
    _id: id,
    name: 'Sample Classroom',
    description: 'This is a sample classroom.',
    teacher_id: 'teacher123',
    students: ['student1', 'student2'],
    pending_students: ['student3'],
    activities: [
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
    ], // 추가된 부분
    created_at: '2023-01-01',
    updated_at: '2023-01-02',
  });
};

const ClassroomMainContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState<Classroom | null>(null);

  useEffect(() => {
    if (id) {
      fetchClassroom(id).then((data) => setClassroom(data));
    } else {
      console.error("Invalid classroom ID");
      navigate("/"); // 유효하지 않은 ID인 경우 홈으로 이동
    }
  }, [id, navigate]);

  if (!classroom) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <h2>{classroom.name}</h2>
      <p>{classroom.description}</p>
      <ActivityList classroomId={classroom._id} />
      <StudentList students={classroom.students} />
      <PendingStudentList pendingStudents={classroom.pending_students} />
    </div>
  );
};

export default ClassroomMainContainer;