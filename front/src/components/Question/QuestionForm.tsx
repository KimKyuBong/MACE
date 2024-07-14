import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ErrorDetail } from 'interfaces/CommonInterfaces';
import ErrorComponent from 'components/Common/ErrorComponent';

window.katex = katex;

interface QuestionFormProps {
  subject: string;
  content: string;
  error: ErrorDetail;
  setSubject: (value: string) => void;
  setContent: (value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ subject, content, error, setSubject, setContent, handleSubmit }) => {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['formula'], // Add formula to the toolbar
      ['image', 'code-block']
    ],
    formula: true, // Enable the formula module
  };

  return (
    <div className="container">
      <h5 className="my-3 border-bottom pb-2">질문 등록</h5>
      <ErrorComponent error={error} />
      <form className="my-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="subject">제목</label>
          <input type="text" className="form-control" value={subject} onChange={e => setSubject(e.target.value)} id="subject" />
        </div>
        
        <div className="mb-3">
          <label htmlFor="content">내용 (LaTeX 예: x^2)</label>
          <ReactQuill value={content} onChange={setContent} modules={modules} />
        </div>
        <button type="submit" className="btn btn-primary">저장하기</button>
      </form>
    </div>
  );
};

export default QuestionForm;
