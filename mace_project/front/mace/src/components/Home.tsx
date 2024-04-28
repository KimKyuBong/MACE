import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fastapi from '../utils/fastapi';
import { IQuestion } from '../interface'

function QuestionList() {
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  useEffect(() => {
    fastapi(
      'get',
      "/api/question/list",
      {},
      (data: IQuestion[]) => {
        setQuestions(data);
      },
      (error: Error) => {
        console.error('Error fetching data:', error);
      }
    );
  }, []);

  return (
    <div className="container my-3">
      <table className="table">
        <thead>
          <tr className="table-dark">
            <th> 번 호 </th>
            <th> 제 목 </th>
            <th> 작 성 일 시 </th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, i) => (
            <tr key={question.id}>
              <td>{i + 1}</td>
              <td>
                <Link to={`/detail/${question.id}`}>{question.subject}</Link>
              </td>
              <td>{question.create_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to = {'/question-create'}> 질문 등록하기 </Link>
    </div>
  );
}

export default QuestionList;