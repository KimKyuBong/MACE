import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuestionListContainter from '../containers/Question/QuestionListContainer'; 
import About from 'components/Common/About'; // 
import NotFound from 'components/Common/NotFound'; 
import QuestionDetailContainer from 'containers/Question/QuestionDetailContainer'; 
import QuestionCreateContatiner from 'containers/Question/QuestionCreateContainer'; 
import MainContainer from 'containers/Main/MainContainer';
import LoginContainer from 'containers/Login/LoginContainer';
import RegisterContainer from 'containers/Login/RegisterContainer';

const AppRoutes = (): JSX.Element => { // 반환 타입을 JSX.Element로 명시
  return (
    <Routes>
      <Route path="/" element={<MainContainer />} />
      <Route path="/login" element={<LoginContainer />} />
      <Route path="/register" element={<RegisterContainer />} />
      <Route path="/questionlist" element={<QuestionListContainter />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/detail/:id" element={<QuestionDetailContainer />} />
      <Route path="/question-create" element={<QuestionCreateContatiner />} />
    </Routes>
  );
}

export default AppRoutes;
