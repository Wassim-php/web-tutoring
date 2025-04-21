import React from 'react'
import '../App.css'
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TutorService from '../services/TutorService';
import TutorTopicService from '../services/TutorTopicService';

const TutorCourse = ({topic}) => {
  // Initialize isTeaching with false
  const [isTeaching, setIsTeaching] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkTeachingStatus = async () => {
      try {
        const response = await TutorService.getTutorById(user.id);

        // Debug logs
        console.log('Response data:', response.data);
        console.log('Topics array:', response.data.topics || []);
        console.log('Current topic:', {
          id: topic.id,
          type: typeof topic.id
        });

        // Default to empty array if topics is undefined
        const topics = response.data.topics || [];
        const isTeachingTopic = topics.some(t => Number(t.id) === Number(topic.id));
        
        console.log('isTeachingTopic:', isTeachingTopic);
        setIsTeaching(isTeachingTopic);
      } catch (error) {
        console.error('Error checking teaching status:', error);
        setIsTeaching(false);
      }
    };

    if (user?.id && topic?.id) {
      checkTeachingStatus();
    }
  }, [user, topic]);
  // Handle toggle for teaching status
  //* Uses async/await for cleaner error handling
  const handleTeachToggle = async () => {
    try {
      if (!isTeaching) {
        await TutorTopicService.addTopicToTutor(user.id, topic.id);
        setIsTeaching(true);
      } else {
        await TutorTopicService.removeTopicFromTutor(user.id, topic.id);
        setIsTeaching(false);
      }
    } catch (error) {
      console.error('Error updating topics:', error);
      // Don't toggle state if request fails
    }
  };

  // Add null check for topic
  if (!topic) {
    return <div>Loading...</div>;
  }

  return (
    <div className="topic-container">
      <h2 className="topic-title">{topic.name}</h2>
      <p className="topic-description">{topic.description}</p>

      <div className="teach-toggle">
        <label htmlFor="teach-toggle" className="toggle-label">
          Teach this topic
        </label>
        <input
          type="checkbox"
          id="teach-toggle"
          // Ensure checked is always boolean
          checked={Boolean(isTeaching)}
          onChange={handleTeachToggle}
          className="toggle-input"
        />
        <span className="toggle-slider"></span>
      </div>

      {isTeaching && (
        <div className="teaching-details">
          <h3>Teaching Details</h3>
          <p>You are now teaching this topic. Update your availability and hourly rate in your profile.</p>
        </div>
      )}
    </div>
  );
};

export default TutorCourse;