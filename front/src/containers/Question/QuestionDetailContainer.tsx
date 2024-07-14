import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Answer, Question } from 'interfaces/QuestionInterfaces';
import { ErrorDetail } from 'interfaces/CommonInterfaces';
import { getQuestionDetail, postAnswer } from '../../services/QuestionService';
import useWebSocket from 'hooks/useWebSocket';
import QuestionDetail from 'components/Question/QuestionDetail';

function QuestionDetailContainer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | undefined>();
  const [answer, setAnswer] = useState<string>('');
  const [error, setError] = useState<ErrorDetail>({ detail: { msg: '' } });
  const { lastMessage, isConnected } = useWebSocket(`/question_${id}`);

  useEffect(() => {
    if (id) {
      console.log('Connecting to WebSocket');
      fetchQuestionDetail(id);
    } else {
      console.error("Invalid question ID");
      navigate("/"); // 유효하지 않은 ID인 경우 홈으로 이동
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
          deleteAnswer(messageData._id);
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
      const data = await getQuestionDetail(questionId);
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
          const newAnswer = await postAnswer(id, answer);
          addNewAnswer(newAnswer);
          setAnswer('');
        } else {
          console.error("Invalid question ID");
        }
      } catch (error) {
        setError({ detail: { msg: 'An unexpected error occurred' } });
        console.error('Failed to post answer:', error);
      }
    }
  };

  const addNewAnswer = (newAnswer: Answer) => {
    setQuestion(prevQuestion => {
      if (prevQuestion) {
        // 중복 답변 추가 방지
        if (prevQuestion.answers.some(answer => answer._id === newAnswer._id)) {
          return prevQuestion;
        }
        const updatedQuestion = {
          ...prevQuestion,
          answers: [...prevQuestion.answers, newAnswer]
        };
        console.log('Updated Question:', updatedQuestion);
        return updatedQuestion;
      }
      return prevQuestion;
    });
  };

  const deleteAnswer = (id: string) => {
    setQuestion(prevQuestion => {
      if (prevQuestion) {
        const updatedQuestion = {
          ...prevQuestion,
          answers: prevQuestion.answers.filter(answer => answer._id !== id)
        };
        console.log('deleteAnswer:', updatedQuestion);
        return updatedQuestion;
      }
      return prevQuestion;
    });
  };

  const updateAnswer = (updatedAnswer: Answer) => {
    setQuestion(prevQuestion => {
      if (prevQuestion) {
        const updatedQuestion = {
          ...prevQuestion,
          answers: prevQuestion.answers.map(answer => answer._id === updatedAnswer._id ? updatedAnswer : answer)
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
