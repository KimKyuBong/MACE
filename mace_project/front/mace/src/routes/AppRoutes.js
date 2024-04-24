import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import About from '../components/About';
import NotFound from '../components/NotFound';
import QuestionDetail from '../components/QuestionDetail.js';

const AppRoutes = () => {
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