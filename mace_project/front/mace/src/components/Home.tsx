import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fastapi from '../utils/fastapi';
import { Answer, Question } from '../types'


function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fastapi(
      'get',
      "/api/question/list",
      {},
      (data: Question[]) => {
        setQuestions(data);
      },
      (error: Error) => {
        console.error('Error fetching data:', error);
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
