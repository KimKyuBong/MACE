import React, { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import fastapi from '../utils/fastapi';
import { IAnswer, IQuestion, IErrorDetail } from '../interface'
import Error from './ErrorComponent'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';

window.katex = require('katex');

function QuestionDetail() {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<IQuestion | undefined>();
  const [answer, setAnswer] = useState<string>('');
  const [error, setError] = useState<IErrorDetail>({ detail: { msg: '' } });

  useEffect(() => {
    getQuestion();
  }, [id]);

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
          getQuestion();
        }, (err_json: IErrorDetail) => {
          setError(err_json);
          console.log("답변 등록 실패:", err_json);
        })
    }
  };

  return (
    <div className="container my-3">
      {question ? (
        <>
          <h2 className="border-bottom py-2">{question.subject}</h2>
          <ReactQuill value={question.content} readOnly={true} theme={"snow"} modules={{ toolbar: false }} />
          <h5 className="border-bottom my-3 py-2">
            {question.answers.length} 개 의 답 변 이 있 습 니 다 .
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
            <input type="submit" value=" 답 변 등 록 " className="btn btn-primary" />
          </form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default QuestionDetail;
