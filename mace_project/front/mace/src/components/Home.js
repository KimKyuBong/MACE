import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fastapi from '../utils/fastapi';  // fastapi 유틸리티를 임포트합니다.

function QuestionList() {
  const [questions, setQuestions] = useState([]); // 질문 목록 상태 초기화

  useEffect(() => {
    // fastapi 함수를 사용하여 HTTP GET 요청을 실행합니다.
    fastapi(
      'get',
      "/api/question/list",
      {},
      (data) => {
        setQuestions(data); // 데이터 로드 성공
      },
      (error) => {
        console.error('Error fetching data:', error); // 에러 처리
      }
    );
  }, []);

  return (
    <ul>
      {questions.map((question) => (
        <li key={question.id}>
          <Link to={`/detail/${question.id}`}>{question.subject}</Link>
        </li>
      ))}
    </ul>
  );
}

export default QuestionList;
