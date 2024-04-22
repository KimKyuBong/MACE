import React, { useState, useEffect } from 'react';
import fastapi from '../utils/fastapi';  // fastapi 유틸리티를 임포트합니다.

function QuestionList() {
  const [questions, setQuestions] = useState([]); // 질문 목록 상태 초기화
  const [loading, setLoading] = useState(true);  // 로딩 상태 초기화
  const [error, setError] = useState(null);  // 에러 상태 초기화

  useEffect(() => {
    setLoading(true);  // 로딩 시작
    setError(null);  // 에러 상태 초기화

    fastapi(
      'get',
      "/api/question/list",
      {},
      (data) => {
        setQuestions(data); // 데이터 로드 성공
        setLoading(false);  // 로딩 상태 업데이트
      },
      (error) => {
        console.error('Error fetching data:', error);
        setError('Failed to load data');  // 에러 메시지 설정
        setLoading(false);  // 로딩 상태 업데이트
      }
    );
  }, []);

  if (loading) return <div>Loading...</div>;  // 로딩 중인 경우
  if (error) return <div>Error: {error}</div>;  // 에러가 발생한 경우

  return (
    <ul>
      {questions.map((question) => (
        <li key={question.id}>
          {question.subject} 
        </li>
      ))}
    </ul>
  );
}

export default QuestionList;
