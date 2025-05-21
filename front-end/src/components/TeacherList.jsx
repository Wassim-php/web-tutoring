import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';
import { FaSadTear } from 'react-icons/fa';
import TutorTopicService from '../services/TutorTopicService';
import '../App.css';
import { Link } from 'react-router-dom';

/**
 * Component: TeacherList
 * Description: Displays a list of tutors associated with a given topic.
 * Allows a student to request a session with a tutor if no pending request exists.
 *
 * Props:
 * - topic: Object representing the topic for which tutors are listed.
 */
const TeacherList = ({ topic }) => {
  const [tutors, setTutors] = useState([]); // List of tutors for the topic
  const [pendingSessions, setPendingSessions] = useState([]); // Existing session requests
  const { user } = useAuth(); // Authenticated user from context

  // Fetch tutors and any pending session requests for the user
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tutors for the given topic
        const tutorsData = await TutorTopicService.getTutorsByTopic(topic.id);
        setTutors(tutorsData);

        // If a user is logged in, fetch their pending sessions
        if (user) {
          const sessionsData = await TutorTopicService.getStudentSessions(user.id);
          setPendingSessions(sessionsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchData();
  }, [topic, user]); // Refetch when topic or user changes

  /**
   * Handles booking a session with a tutor.
   * Prevents duplicate pending requests with the same tutor.
   */
  const handleBooking = async (tutorId) => {
    try {
      // Check if a session request is already pending with this tutor
      const existingSession = pendingSessions.find(
        session => session.tutorId === tutorId && session.status === 'pending'
      );

      if (existingSession) {
        alert('You already have a pending session request with this tutor');
        return;
      }

      // Prepare session data
      const sessionData = {
        studentId: Number(user.id),
        tutorId: Number(tutorId),
        topicId: Number(topic.id),
        startTime: new Date(),
        duration_minutes: 60,
        status: 'pending',
        notes: `Session request for ${topic.name}`
      };

      // Send request to create session
      const newSession = await TutorTopicService.createSession(sessionData);
      alert('Session request sent successfully!');
      setPendingSessions([...pendingSessions, newSession]); // Update state with new session
    } catch (error) {
      console.error('Error booking session:', error);
      alert('Failed to book session. Please try again.');
    }
  };

  /**
   * Checks if a pending session exists for the given tutor.
   */
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
          // Show message if no tutors are available
          <p className="no-tutors-message">
            <FaSadTear /> No tutors available for this course.
          </p>
        ) : (
          tutors.map((tutor) => (
            <ListGroup.Item key={tutor.id} className="tutor-card">
              <div className="tutor-info">
                <h3 className="tutor-name">{tutor.name}</h3>
                <p className="tutor-rate">${tutor.hourlyRate}/hour</p>
              </div>

              {/* Booking Button */}
              <Button 
                variant={isSessionPending(tutor.id) ? "secondary" : "primary"}
                className="book-button"
                onClick={() => handleBooking(tutor.id)}
                disabled={isSessionPending(tutor.id)}
              >
                {isSessionPending(tutor.id) ? 'Request Pending' : 'Book Now'}
              </Button>

              {/* Link to tutor profile */}
              <Link to={`/tutor-profile/${tutor.id}`}>
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
