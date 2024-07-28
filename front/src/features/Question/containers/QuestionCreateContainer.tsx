import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorDetail } from 'features/Common/CommonInterfaces';
import { postQuestion } from '../QuestionService';
import QuestionForm from '../components/QuestionForm';
import { useAuth } from 'features/Auth/contexts/AuthContext';

const QuestionCreateContainer: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorDetail>({ detail: { msg: '' } });
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user){
      alert('You must be loged in to join a classroom')
      return;
    }
    try {
      await postQuestion({ subject, content }, user.token);
      navigate("/questionlist");
    } catch (json_error) {
      setError({ detail: { msg: "An unexpected error occurred" } });
    }
  };

  return (
    <QuestionForm
      subject={subject}
      content={content}
      error={error}
      setSubject={setSubject}
      setContent={setContent}
      handleSubmit={handleSubmit}
    />
  );
};

export default QuestionCreateContainer;
