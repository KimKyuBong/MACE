import React from 'react';
import { Link } from 'react-router-dom';
import { QuestionItemProps } from '../QuestionInterfaces';

const QuestionItem: React.FC<QuestionItemProps> = ({ question, index }) => (
  <tr>
    <td>{index + 1}</td>
    <td>
      <Link to={`/detail/${question.id}`}>{question.subject}</Link>
    </td>
    <td>{new Date(question.create_date).toLocaleString()}</td>
  </tr>
);

export default QuestionItem;
