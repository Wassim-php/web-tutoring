import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, InputGroup, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';
import '../App.css';

const BACKEND_URL = 'http://localhost:3000';

const ChatPick = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch all users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getAllUsers();
        // Filter out current user from the list
        const otherUsers = response.filter(user => user.id !== currentUser?.id);
        setUsers(otherUsers);
        setFilteredUsers(otherUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Handle search input changes
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = users.filter(user => 
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  // Navigate to messages page with selected user
  const handleUserSelect = async (selectedUser) => {
    try {
      // First create or get existing chat between users
      const response = await axios.post(`${BACKEND_URL}/chats`, {
        user1_id: currentUser.id,  
        user2_id: selectedUser.id  
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Navigate with the chat ID
      navigate(`/messages/${response.data.id}`);
    } catch (error) {
      console.error('Error creating/getting chat:', error.response?.data || error);
    }
  };

  const getProfilePicture = (user) => {
    if (!user.profilePicture) {
      return '/default-avatar.png'; // Make sure you have this in your public folder
    }
    return `${BACKEND_URL}/uploads/images/${user.profilePicture}`;
  };

  return (
    <div className="chat-pick-container">
      <h2>Start a Conversation</h2>
      <InputGroup className="mb-3 search-bar">
        <Form.Control
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      <ListGroup className="users-list">
        {filteredUsers.map(user => (
          <ListGroup.Item 
            key={user.id}
            action
            onClick={() => handleUserSelect(user)}
            className="user-item"
          >
            <div className="user-info">
              <img 
                src={getProfilePicture(user)}
                alt={user.name || 'Profile'}
                className="profile-pic"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
              />
              <div className="user-details">
                <h5>{user.name}</h5>
                <p>{user.email}</p>
                <span className="user-type">{user.userType}</span>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ChatPick;