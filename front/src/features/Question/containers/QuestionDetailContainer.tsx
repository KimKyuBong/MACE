import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Answer, Question } from '../QuestionInterfaces';
import { ErrorDetail } from 'features/Common/CommonInterfaces';
import { getQuestionDetail, postAnswer } from '../QuestionService';
import useWebSocket from 'features/Common/hooks/useWebSocket';
import QuestionDetail from 'features/Question/components/QuestionDetail';
import { useAuth } from 'features/Auth/contexts/AuthContext';

function QuestionDetailContainer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | undefined>();
  const [answer, setAnswer] = useState<string>('');
  const [error, setError] = useState<ErrorDetail>({ detail: { msg: '' } });
  const { lastMessage, isConnected } = useWebSocket(`/question_${id}`);
  const { user } = useAuth(); // 수정된 부분

  useEffect(() => {
    if (id) {
      console.log('Connecting to WebSocket');
      fetchQuestionDetail(id);
    } else {
      console.error('Invalid question ID');
      navigate('/'); // 유효하지 않은 ID인 경우 홈으로 이동
    }
  }, [id]);

  useEffect(() => {
    if (lastMessage) {
      const { type, data } = lastMessage;
      const messageData = typeof data === 'string' ? JSON.parse(data) : data;
      console.log('Received WebSocket message:', messageData);
      switch (type) {
        case 'new_answer':
          addNewAnswer(messageData);
          break;
        case 'delete_answer':
          deleteAnswer(messageData.id);
          break;
        case 'update_answer':
          updateAnswer(messageData);
          break;
        default:
          break;
      }
    }
  }, [lastMessage]);

  const fetchQuestionDetail = async (questionId: string) => {
    try {
      if (!user || !user.token) {
        throw new Error('User not authenticated');
      }
      const data = await getQuestionDetail(questionId, user.token);
      setQuestion(data);
    } catch (error) {
      console.error('Failed to fetch question detail:', error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (answer.trim() === '') {
      setError({ detail: { msg: 'Answer cannot be blank' } });
    } else {
      try {
        if (id) {
          if (!user || !user.token) {
            throw new Error('User not authenticated');
          }
          const newAnswer = await postAnswer(id, answer, user.token);
          addNewAnswer(newAnswer);
          setAnswer('');
        } else {
          console.error('Invalid question ID');
        }
      } catch (error) {
        setError({ detail: { msg: 'An unexpected error occurred' } });
        console.error('Failed to post answer:', error);
      }
    }
  };

  const addNewAnswer = (newAnswer: Answer) => {
    setQuestion((prevQuestion) => {
      if (prevQuestion) {
        // 중복 답변 추가 방지
        if (prevQuestion.answers.some((answer) => answer.id === newAnswer.id)) {
          return prevQuestion;
        }
        const updatedQuestion = {
          ...prevQuestion,
          answers: [...prevQuestion.answers, newAnswer],
        };
        console.log('Updated Question:', updatedQuestion);
        return updatedQuestion;
      }
      return prevQuestion;
    });
  };

  const deleteAnswer = (id: string) => {
    setQuestion((prevQuestion) => {
      if (prevQuestion) {
        const updatedQuestion = {
          ...prevQuestion,
          answers: prevQuestion.answers.filter((answer) => answer.id !== id),
        };
        console.log('deleteAnswer:', updatedQuestion);
        return updatedQuestion;
      }
      return prevQuestion;
    });
  };

  const updateAnswer = (updatedAnswer: Answer) => {
    setQuestion((prevQuestion) => {
      if (prevQuestion) {
        const updatedQuestion = {
          ...prevQuestion,
          answers: prevQuestion.answers.map((answer) =>
            answer.id === updatedAnswer.id ? updatedAnswer : answer
          ),
        };
        console.log('Updated Answer:', updatedQuestion);
        return updatedQuestion;
      }
      return prevQuestion;
    });
  };

  return (
    <QuestionDetail
      question={question}
      error={error}
      answer={answer}
      setAnswer={setAnswer}
      handleSubmit={handleSubmit}
    />
  );
}

export default QuestionDetailContainer;
