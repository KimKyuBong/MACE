import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import About from '../components/About';
import NotFound from '../components/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;