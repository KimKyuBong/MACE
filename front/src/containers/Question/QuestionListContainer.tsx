import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Question } from 'interfaces/QuestionInterfaces';
import QuestionList from 'components/Question/QuestionList';
import { fetchQuestions } from 'services/QuestionService';
import useWebSocket from 'hooks/useWebSocket';

const QuestionListContainer: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { lastMessage, isConnected } = useWebSocket('/question');

  useEffect(() => {
    fetchQuestions()
      .then(data => setQuestions(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (lastMessage) {
      const messageData = lastMessage.data;
      const message = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
      console.log(message);
      switch (lastMessage.type) {
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
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prevQuestions => prevQuestions.filter(question => question._id !== id));
  };

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(prevQuestions => prevQuestions.map(question => question._id === updatedQuestion._id ? updatedQuestion : question));
  };

  return (
    <div className="container my-3">
      <QuestionList questions={questions} />
      <Link to={'/question-create'}>질문 등록하기</Link>
    </div>
  );
};

export default QuestionListContainer;
