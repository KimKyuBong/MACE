import React, { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import fastapi from '../utils/fastapi';
import { IAnswer, IQuestion, IErrorDetail } from '../interface';
import Error from './ErrorComponent';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import useWebSocket from '../hooks/useWebSocket'; // useWebSocket 훅 임포트

window.katex = require('katex');

function QuestionDetail() {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<IQuestion | undefined>();
  const [answer, setAnswer] = useState<string>('');
  const [error, setError] = useState<IErrorDetail>({ detail: { msg: '' } });
  const { lastMessage, isConnected } = useWebSocket(`wss://mace.kbnet.kr/ws/question_${id}`);

  useEffect(() => {
    console.log('Connecting to WebSocket');
    getQuestion();
  }, [id]);

  useEffect(() => {
    if (lastMessage) {
      const { type, data } = lastMessage;
      const messageData = typeof data === 'string' ? JSON.parse(data) : data;
      console.log('Received WebSocket message:', messageData);
      switch (type) {
        case 'new_answer':
          console.log("NewAnswer!");
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

  const getQuestion = () => {
    fastapi("get", `/api/question/detail/${id}`, {}, (json: IQuestion) => {
      setQuestion(json);
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (answer.trim() === '') {
      setError({ detail: { msg: 'Answer cannot be blank' } });
    } else {
      fastapi("post", `/api/answer/create/${id}`, { content: answer },
        (json: IAnswer) => {
          console.log("답변 등록 성공:", json);
          setAnswer('');
        }, (err_json: IErrorDetail) => {
          setError(err_json);
          console.log("답변 등록 실패:", err_json);
        });
    }
  };

  const addNewAnswer = (newAnswer: IAnswer) => {
    setQuestion(prevQuestion => {
      if (prevQuestion) {
        // 중복 답변 추가 방지
        if (prevQuestion.answers.some(answer => answer._id === newAnswer._id)) {
          return prevQuestion;
        }
        const updatedQuestion = {
          ...prevQuestion,
          answers: [...prevQuestion.answers, newAnswer] // 배열의 끝에 새 답변을 추가합니다.
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

  const updateAnswer = (updatedAnswer: IAnswer) => {
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
    <div className="container my-3">
      {question ? (
        <>
          <h2 className="border-bottom py-2">{question.subject}</h2>
          <ReactQuill value={question.content} readOnly={true} theme={"snow"} modules={{ toolbar: false }} />
          <h5 className="border-bottom my-3 py-2">
            {question.answers.length} 개의 답변이 있습니다.
          </h5>
          {question.answers.map((answer: IAnswer) => (
            <div key={answer._id} className="card my-3">
              <ReactQuill value={answer.content} readOnly={true} theme={"snow"} modules={{ toolbar: false }} />
            </div>
          ))}
          <Error error={error} />
          <form method="post" className="my-3" onSubmit={handleSubmit}>
            <div className="mb-3">
              <ReactQuill value={answer} onChange={setAnswer} theme={"snow"} modules={{ toolbar: ['bold', 'italic', 'underline', 'strike', 'formula'] }} />
            </div>
            <input type="submit" value="답변 등록" className="btn btn-primary" />
          </form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default QuestionDetail;
