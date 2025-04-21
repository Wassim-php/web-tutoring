import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';
import { FaSadTear } from 'react-icons/fa';
import TutorTopicService from '../services/TutorTopicService';
import '../App.css';
import { Link } from 'react-router-dom';

const TeacherList = ({ topic }) => {
  const [tutors, setTutors] = useState([]);
  const [pendingSessions, setPendingSessions] = useState([]);
  const { user } = useAuth();

  // Fetch tutors and existing sessions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tutors
        const tutorsData = await TutorTopicService.getTutorsByTopic(topic.id);
        setTutors(tutorsData);

        // Fetch student's pending sessions
        if (user) {
          const sessionsData = await TutorTopicService.getStudentSessions(user.id);
          setPendingSessions(sessionsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchData();
  }, [topic, user]);

  const handleBooking = async (tutorId) => {
    try {
      // Check if there's already a pending session with this tutor
      const existingSession = pendingSessions.find(
        session => session.tutorId === tutorId && session.status === 'pending'
      );

      if (existingSession) {
        alert('You already have a pending session request with this tutor');
        return;
      }

      const sessionData = {
        studentId: user.id,
        tutorId: tutorId,
        topicId: topic.id,
        startTime: new Date(),
        duration_minutes: 60,
        status: 'pending',
        notes: `Session request for ${topic.name}`
      };

      const newSession = await TutorTopicService.createSession(sessionData);
      alert('Session request sent successfully!');
      setPendingSessions([...pendingSessions, newSession]);
    } catch (error) {
      console.error('Error booking session:', error);
      alert('Failed to book session. Please try again.');
    }
  };

  const isSessionPending = (tutorId) => {
    return pendingSessions.some(
      session => session.tutorId === tutorId && session.status === 'pending'
    );
  };

  return (
    <div className="tutor-list-container">
      <h2 className="tutor-list-title">Tutors Teaching {topic.name}</h2>
      <ListGroup horizontal="lg" className="tutor-list">
        {tutors.length === 0 ? (
          <p className="no-tutors-message"><FaSadTear/>No tutors available for this course.</p>
        ) : (
          tutors.map((tutor) => (
            <ListGroup.Item key={tutor.id} className="tutor-card">
              <div className="tutor-info">
                <h3 className="tutor-name">{tutor.name}</h3>
                <p className="tutor-rate">${tutor.hourlyRate}/hour</p>
              </div>
              <Button 
                variant={isSessionPending(tutor.id) ? "secondary" : "primary"}
                className="book-button"
                onClick={() => handleBooking(tutor.id)}
                disabled={isSessionPending(tutor.id)}
              >
                {isSessionPending(tutor.id) ? 'Request Pending' : 'Book Now'}
              </Button>
              <Link
                to={`/tutor-profile/${tutor.id}`}>
                View Profile
              </Link>
              
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </div>
  );
};

export default TeacherList;