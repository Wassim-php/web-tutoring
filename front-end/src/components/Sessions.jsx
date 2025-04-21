import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SessionService from '../services/SessionService';

const Sessions = () => {
    const [sessions, setSessions] = useState(null); 
    const { user } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    //* Fetches sessions based on user type
    //* Handles loading states and error cases
    useEffect(() => {
        const getSessions = async () => {
            if(!user) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                let response;
                if (user?.userType === 'Tutor') {
                    response = await SessionService.getAcceptedTutorSessions(user.id);
                    
                } else if (user?.userType === 'Student') {
                    response = await SessionService.getAcceptedStudentSessions(user.id);
                }
                
                
                setSessions(response?.data);
            } catch (error) {
                console.error('Error fetching sessions: ', error);
                setError('Failed to load sessions');
                setSessions([]);
            } finally {
                setLoading(false);
            }
        };
        getSessions();
    }, [user]);

        //* Determines the name of the session partner based on user type
    const getSessionPartnerName = (session) => {
        if (user?.userType === 'Tutor') {
            return session?.student?.name || 'Unknown Student';
        }
        return session?.tutor?.user?.name || 'Unknown Tutor';
    };
    if (loading) return <div>Loading sessions...</div>;
    if (error) return <div className='text-black'>{error}</div>;
    if (!sessions) return <div>No sessions data available</div>;

    return (
        <div className="sessions-container">
            <h2>My Sessions</h2>
            {sessions.length === 0 ? (
                <p>No sessions found.</p>
            ) : (
                <ul className="sessions-list">
                    {sessions.map(session => (
                        <li key={session.id} className="session-item">
                            <h3>Session with {getSessionPartnerName(session)}</h3>
                            <p>Topic: {session?.topic?.name || 'Unknown Topic'}</p>
                            <p>Date: {new Date(session.startTime).toLocaleDateString()}</p>
                            <p>Duration: {session.duration_minutes} minutes</p>
                            <p>Status: {session.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Sessions;