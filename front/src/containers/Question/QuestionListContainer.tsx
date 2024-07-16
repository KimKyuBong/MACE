import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Question } from 'interfaces/QuestionInterfaces';
import QuestionList from 'components/Question/QuestionList';
import { fetchQuestions } from 'services/QuestionService';
import useWebSocket from 'hooks/useWebSocket';
import { useAuth } from 'contexts/AuthContext';

const QuestionListContainer: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { lastMessage, isConnected } = useWebSocket('/question');

  useEffect(() => {
    const loadQuestions = async () => {
      if (user?.token) {
        try {
          const data = await fetchQuestions(user.token);
          setQuestions(data);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Failed to fetch questions');
        }
      } else {
        setError('You must be logged in to view questions');
      }
    };

    loadQuestions();
  }, [user]);

  useEffect(() => {
    if (lastMessage) {
      const messageData = lastMessage.data;
      const message =
        typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
      console.log(message);
      switch (message.type) {
        case 'new_question':
          addNewQuestion(message);
          break;
        case 'delete_question':
          deleteQuestion(message._id);
          break;
        case 'update_question':
          updateQuestion(message);
          break;
        default:
          break;
      }
    }
  }, [lastMessage]);

  const addNewQuestion = (newQuestion: Question) => {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question._id !== id)
    );
  };

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question._id === updatedQuestion._id ? updatedQuestion : question
      )
    );
  };

  return (
    <div className="container my-3">
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <QuestionList questions={questions} />
          <Link to={'/question-create'}>질문 등록하기</Link>
        </>
      )}
    </div>
  );
};

export default QuestionListContainer;
