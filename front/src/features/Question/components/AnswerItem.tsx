import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AnswerItemProps } from '../QuestionInterfaces'


const AnswerItem: React.FC<AnswerItemProps> = ({ answer }) => (
  <div className="card my-3">
    <ReactQuill value={answer.content} readOnly={true} theme={"snow"} modules={{ toolbar: false }} />
  </div>
);

export default AnswerItem;
