import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ListGroup, Button, Badge } from 'react-bootstrap';
import SessionService from '../services/SessionService';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  //Fetches session requests when component mounts or user changes
  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      const data = await SessionService.getTutorSessions(user.id);
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  };
// Updates the status of a session request
  const handleStatusUpdate = async (sessionId, newStatus) => {
    try {
      await SessionService.updateSessionStatus(sessionId, newStatus);
      // Refresh requests after update
      fetchRequests();
    } catch (error) {
      console.error('Error updating session status:', error);
    }
  };

  if (loading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div className="requests-container">
      <h2>Session Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ListGroup>
          {requests.map((request) => (
            <ListGroup.Item 
              key={request.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>Student: {request.student.name}</h5>
                <p>Topic: {request.topic.name}</p>
                <p>Date: {new Date(request.startTime).toLocaleDateString()}</p>
                <p>Duration: {request.duration_minutes} minutes</p>
                <p>Notes: {request.notes}</p>
                <Badge bg={request.status === 'pending' ? 'warning' : 
                         request.status === 'accepted' ? 'success' : 'danger'}>
                  {request.status}
                </Badge>
              </div>
              {request.status === 'pending' && (
                <div className="d-flex gap-2">
                  <Button 
                    variant="success" 
                    onClick={() => handleStatusUpdate(request.id, 'accepted')}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleStatusUpdate(request.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Requests;