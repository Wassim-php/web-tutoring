// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import '../App.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [hasUnreadRequests, setHasUnreadRequests] = useState(false);
  const location = useLocation();
  let socket = null; // Removed TypeScript annotation

  useEffect(() => {
    if (user?.userType === 'Tutor') {
      // Initial fetch of sessions
      const fetchSessions = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/sessions/tutor/${user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          const hasPending = location.pathname !== '/requests' && 
            response.data.some(session => session.status === 'pending');
          setHasUnreadRequests(hasPending);
        } catch (error) {
          console.error('Error fetching sessions:', error);
        }
      };

      // Initialize socket connection
      socket = io('http://localhost:3000', {
        transports: ['websocket', 'polling'],
        auth: {
          token: localStorage.getItem('token')
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false // Prevent auto-connection
      });

      // Connect manually after setup
      socket.connect();

      // Handle connection events
      socket.on('connect', () => {
        console.log('Connected to socket server');
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      // Listen for new session requests
      socket.on('newSessionRequest', async () => {
        await fetchSessions(); // Refetch sessions when new request comes in
      });

      // Listen for session status updates
      socket.on('sessionStatusUpdate', async () => {
        await fetchSessions(); // Refetch sessions when status changes
      });

      // Initial fetch
      fetchSessions();

      // Cleanup
      return () => {
        if (socket) {
          socket.disconnect();
          socket = null;
        }
      };
    }
  }, [user, location.pathname]);

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(false)} 
      />

      <button 
        className="hamburger-btn top-0" 
        style={{ marginTop: '6px' }} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`hamburger-line ${isOpen ? 'active' : ''}`} />
        <div className={`hamburger-line ${isOpen ? 'active' : ''}`} />
        <div className={`hamburger-line ${isOpen ? 'active' : ''}`} />
      </button>

      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <h3 className="sidebar-title">Menu</h3>
          <ul className="sidebar-list">
            <li className="sidebar-item">
              <Link to={'/'} className='text-white'>
                Home
              </Link>
            </li>
            
            { user && (
            <li className="sidebar-item position-relative">
              <Link to={'/messagesPick'} className='text-white position-relative'>
              Messages</Link>
            </li>
            )
            }
            
            {user?.userType === 'Tutor' && (
              <li className="sidebar-item position-relative">
                <Link to={'/requests'} className='text-white position-relative'>
                  Requests
                  {hasUnreadRequests && (
                    <span className="notification-dot" style={{ backgroundColor: '#ff0000' }} />
                  )}
                </Link>
              </li>
            )}


            {
              user && (
                <li className="sidebar-item">
                  <Link to={'/sessions'} className='text-white'>
                  Sessions
                  </Link>
                </li>
              )
            }

            
            {user?.userType === 'Tutor' && (
              <li className="sidebar-item">
                <Link to={'/profile'} className='text-white'>
                  Profile
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default SideBar;