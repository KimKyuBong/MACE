import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import fastapi from '../utils/fastapi';
import { Answer, Question } from '../types'


function QuestionDetail() {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | undefined>(); // undefined로 초기화
  const [answer, setAnswer] = useState<string>('');

  useEffect(() => {
    getQuestion();
  }, [id]);

  const getQuestion = () => {
    fastapi("get", `/api/question/detail/${id}`, {}, (json: Question) => {
      setQuestion(json);
    });
  };

  const handleAnswerChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fastapi("post", `/api/answer/create/${id}`, { content: answer }, (json: Question) => {
      console.log("답변 등록 성공:", json);
      setAnswer('');
      getQuestion();
    });
  };

  return (
    <div>
      {question ? ( // optional chaining 사용
        <>
          <h1>{question.subject}</h1>
          <div>
            {question.content}
            <p>Created: {question.create_date}</p>
          </div>
          <ul>
            {question.answers.map((answer: Answer) => (
              <li key={answer.id}>{answer.content} ({answer.create_date})</li>
            ))}
          </ul>
          <div>
            <form onSubmit={handleSubmit}>
              <textarea rows={5} value={answer} onChange={handleAnswerChange}></textarea>
              <input type="submit" value="답 변 등 록" />
            </form>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default QuestionDetail;
