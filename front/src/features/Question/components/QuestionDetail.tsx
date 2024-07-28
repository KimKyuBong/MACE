import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import { QuestionDetailProps } from '../QuestionInterfaces';
import ErrorComponent from 'features/Common/components/ErrorComponent';
import AnswerItem from './AnswerItem';

window.katex = require('katex');


const QuestionDetail: React.FC<QuestionDetailProps> = ({ question, error, answer, setAnswer, handleSubmit }) => (
  <div className="container my-3">
    {question ? (
      <>
        <h2 className="border-bottom py-2">{question.subject}</h2>
        <ReactQuill value={question.content} readOnly={true} theme={"snow"} modules={{ toolbar: false }} />
        <h5 className="border-bottom my-3 py-2">
          {question.answers.length} 개의 답변이 있습니다.
        </h5>
        {question.answers.map((answer) => (
          <AnswerItem key={answer._id} answer={answer} />
        ))}
        <ErrorComponent error={error} />
        <form method="post" className="my-3" onSubmit={handleSubmit}>
          <div className="mb-3">
            <ReactQuill value={answer} onChange={setAnswer} theme={"snow"} modules={{ toolbar: ['bold', 'italic', 'underline', 'strike', 'formula'] }} />
          </div>
          <input type="submit" value="답변 등록" className="btn btn-primary" />
        </form>
      </>
    ) : (
      <p>Loading...</p>
    )}
  </div>
);

export default QuestionDetail;
