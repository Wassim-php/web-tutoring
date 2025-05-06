/**
 * Main Application Component
 * 
 * Provides routing configuration and authentication protection.
 * Manages global topic state and protected route access.
 * 
 * Features:
 * - Route configuration
 * - Authentication protection
 * - Global topic state
 * - Navigation components
 * - Protected routes wrapper
 */

import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import TutorsPage from './pages/TutorsPage';
import TutorPage from './pages/TutorPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import TutorRegisterPage from './pages/TutorRegisterPage';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import SideBar from './components/SideBar';
import ProfilePage from './pages/ProfilePage';
import './index.css';
import RequestPage from './pages/RequestPage';
import NotFoundPage from './pages/NotFoundPage';
import SessionsPage from './pages/SessionsPage';
import ViewProfilePage from './pages/ViewProfilePage';
import TopicService from './services/TopicService';
import MessagesPage from './pages/MessagesPage';
import ChatPickPage from './pages/ChatPickPage';

function App() {
  const [topics, setTopics] = useState([]);

  /**
   * Fetches available topics on component mount
   */
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await TopicService.getAllTopics();
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
    fetchTopics();
  }, []);

  return (
    <AuthProvider>
      <NavBar />
      <SideBar />
      <Routes>
        <Route path="/" element={<HomePage topics={topics} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/tutors' element={<TutorsPage topics={topics} />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/tutors/:id' element={
          <ProtectedRoute>
            <TutorPage topics={topics} />
          </ProtectedRoute>} />

        <Route path='/student-registration' element={
          <ProtectedRoute>
            <StudentRegisterPage />
          </ProtectedRoute>} />

        <Route path='/tutor-registration' element={
          <ProtectedRoute>
            <TutorRegisterPage />
          </ProtectedRoute>} />

        <Route path='/profile' element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>} />

        <Route path='/requests' element={
          <ProtectedRoute>
            <RequestPage />
          </ProtectedRoute>} />

        <Route path='/sessions' element={
          <ProtectedRoute>
            <SessionsPage />
          </ProtectedRoute>} />

        <Route path='/tutor-profile/:tutorId' element={
          <ProtectedRoute>
            <ViewProfilePage />
          </ProtectedRoute>
        } />

          <Route path='/messagesPick' element={
          <ProtectedRoute>
            <ChatPickPage/>
          </ProtectedRoute>} />

        <Route path='/messages/:id' element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>} />
        </Routes>
        
    </AuthProvider>
  );
}

/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  return isAuthenticated ? children : null;
}

export default App;
