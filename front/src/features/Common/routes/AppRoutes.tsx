import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuestionListContainter from 'features/Question/containers/QuestionListContainer';
import About from 'features/Common/components/About';
import NotFound from 'features/Common/components/NotFound';
import QuestionDetailContainer from 'features/Question/containers/QuestionDetailContainer';
import QuestionCreateContatiner from 'features/Question/containers/QuestionCreateContainer';
import MainContainer from 'features/Main/containers/MainContainer';
import LoginContainer from 'features/Auth/containers/LoginContainer';
import RegisterContainer from 'features/Auth/containers/RegisterContainer';
import ClassroomMainContainer from 'features/Classroom/containers/ClassroomMainContainer';
import ActivityListContainer from 'features/Classroom/containers/ActivityListContainer';

const AppRoutes = (): JSX.Element => {
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
      
      {/* Classroom routes */}
      <Route path="/classrooms/:id" element={<ClassroomMainContainer />} />
      <Route path="/classrooms/:classroomId/activities" element={<ActivityListContainer />} />
    </Routes>
  );
};

export default AppRoutes;
