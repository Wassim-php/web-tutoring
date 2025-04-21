// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import '../App.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [hasUnreadRequests, setHasUnreadRequests] = useState(false);
  const location = useLocation();
  
  //Periodically checks for unread session requests for tutors
  //* Updates notification dot visibility based on pending requests
  useEffect(() => {
    const checkUnreadRequests = async () => {
      if (user?.userType === 'Tutor') {
        try {
          const response = await axios.get(`http://localhost:3000/sessions/tutor/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const hasPending = location.pathname !== '/requests' && 
            response.data.some(session => session.status === 'pending');
          setHasUnreadRequests(hasPending);
        } catch (error) {
          console.error('Error fetching requests:', error);
        }
      }
    };

    checkUnreadRequests();
    const interval = setInterval(checkUnreadRequests, 60000); // Changed to 1 minute
    return () => clearInterval(interval);
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
            
            <li className="sidebar-item">Messages</li>
            
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