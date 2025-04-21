import React, { useState } from 'react';
import TeacherList from '../components/TeacherList';
import { useAuth } from '../context/AuthContext';
import TutorCourse from '../components/TutorCourse';
import { useParams } from 'react-router-dom';
const TutorPage = ({ topics}) => {
  const { user } = useAuth();
  const { id } = useParams();
  const topic = topics.find((topic) => topic.id === Number(id));
  return (
    <>
    { user?.userType === 'Student' ?
      <TeacherList topic={topic}/>
    :  <TutorCourse topic={topic}/> }
    </>
  );
};

export default TutorPage;