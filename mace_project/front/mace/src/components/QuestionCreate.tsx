import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fastapi from "../utils/fastapi";
import ErrorComponent from "../components/ErrorComponent";
import { IErrorDetail } from '../interface';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';
window.katex = katex;


function QuestionCreate() {
  const navigate = useNavigate();
  const [error, setError] = useState<IErrorDetail>({detail: {msg: ''}});
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['formula'], // Add formula to the toolbar
      ['image', 'code-block']
    ],
    formula: true, // Enable the formula module
  }

  const postQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    const url = "/api/question/create";
    const params = {
      subject: subject,
      content: content,
    };

    try {
      await fastapi("post", url, params);
      navigate("/");
    } catch (json_error) {
      setError({ detail: { msg: "An unexpected error occurred" } });
    }
  };

  return (
    <div className="container">
      <h5 className="my-3 border-bottom pb-2">질문 등록</h5>
      <ErrorComponent error={error} />
      <form className="my-3" onSubmit={postQuestion}>
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
}

export default QuestionCreate;