import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorDetail } from 'interfaces/CommonInterfaces';
import { postQuestion } from 'services/QuestionService';
import QuestionForm from 'components/Question/QuestionForm';

const QuestionCreateContainer: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorDetail>({ detail: { msg: '' } });
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await postQuestion({ subject, content });
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
