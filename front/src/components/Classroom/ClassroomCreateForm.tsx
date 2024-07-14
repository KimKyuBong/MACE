import React, { useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import { createClassroom } from 'services/ClassroomService';

const ClassroomCreateForm: React.FC = () => {
  const { user } = useAuth();
  const [classroomData, setClassroomData] = useState({ name: '', description: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setClassroomData({
      ...classroomData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to create a classroom');
      return;
    }

    try {
      await createClassroom(classroomData, user.token);
      alert('Classroom created successfully!');
      setClassroomData({ name: '', description: '' });
      setError(null);
    } catch (error) {
      setError('Failed to create classroom');
    }
  };

  if (!user) {
    return <div>You must be logged in to create a classroom</div>;
  }

  return (
    <div className="container">
      <h2>Create Classroom</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Classroom Name</label>
          <input type="text" className="form-control" id="name" name="name" value={classroomData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea className="form-control" id="description" name="description" value={classroomData.description} onChange={handleChange} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Create Classroom</button>
      </form>
    </div>
  );
};

export default ClassroomCreateForm;
