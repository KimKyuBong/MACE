import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home'; // 확장자 .js를 .tsx로 변경
import About from '../components/About'; // 확장자 .js를 .tsx로 변경
import NotFound from '../components/NotFound'; // 확장자 .js를 .tsx로 변경
import QuestionDetail from '../components/QuestionDetail'; // 확장자 .js를 .tsx로 변경

const AppRoutes = (): JSX.Element => { // 반환 타입을 JSX.Element로 명시
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/detail/:id" element={<QuestionDetail />} />
    </Routes>
  );
}

export default AppRoutes;
