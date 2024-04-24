import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import fastapi from '../utils/fastapi';

function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState({});
  const [answer, setAnswer] = useState(''); // 답변 텍스트를 저장할 상태

  useEffect(() => {
    // 컴포넌트 마운트 시 단 한 번만 실행되도록
    const get_question = (id) => {
      fastapi("get", `/api/question/detail/${id}`, {}, (json) => {
        setQuestion(json); // 상태 업데이트
      });
    };

    if (id) get_question(id);
  }, [id]);

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // 폼 기본 제출 동작 방지
    fastapi("post", `/api/answer/create/${id}`, { content: answer}, (json) => {
      console.log("답변 등록 성공:", json);
      // 추가적인 상태 업데이트나 리다이렉션 처리
    });
  };

  return (
    <div>
      <h1>{question.subject}</h1>
      <div>
        {question.content}
        <p>Created: {question.create_date}</p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <textarea rows="5" value={answer} onChange={handleAnswerChange}></textarea>
          <input type="submit" value="답 변 등 록" />
        </form>
      </div>
    </div>
  );
}

export default QuestionDetail;
