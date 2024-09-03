import React from 'react';
import { QuestionListProps } from '../QuestionInterfaces';
import QuestionItem from './QuestionItem';

const QuestionList: React.FC<QuestionListProps> = ({ questions }) => (
  <table className="table">
    <thead>
      <tr className="table-dark">
        <th> 번호 </th>
        <th> 제목 </th>
        <th> 작성 일시 </th>
      </tr>
    </thead>
    <tbody>
      {questions.map((question, index) => (
        <QuestionItem key={question.id} question={question} index={index} />
      ))}
    </tbody>
  </table>
);

export default QuestionList;
