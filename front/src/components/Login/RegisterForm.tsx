import React, { useState } from 'react';
import { RegisterFormProps, RegisterFormData } from 'interfaces/AuthInterfaces';

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, error }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    school: '',
    studentId: '',
    subject: '',
    name: '',
    username: '',
    password: '',
    role: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert('Password must be at least 8 characters long and include at least one letter, one number, and one special character.');
      return;
    }
    onRegister(formData);
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="school" className="form-label">School</label>
          <input type="text" className="form-control" id="school" name="school" value={formData.school} onChange={handleChange} required />
        </div>
        {formData.role === 'student' && (
          <div className="mb-3">
            <label htmlFor="studentId" className="form-label">Student ID</label>
            <input type="text" className="form-control" id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required />
          </div>
        )}
        {formData.role === 'teacher' && (
          <div className="mb-3">
            <label htmlFor="subject" className="form-label">Subject</label>
            <input type="text" className="form-control" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="email" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select className="form-control" id="role" name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
