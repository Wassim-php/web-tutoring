import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import '../App.css';

const BACKEND_URL = 'http://localhost:3000';

const Messages = ({ chatId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      if(!chatId) {
        console.error('Chat ID is not available');
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/messages/chat/${chatId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  // Socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    // Clean token - remove any 'Bearer ' prefix if it exists
    const cleanToken = token.replace('Bearer ', '');

    const socket = io('http://localhost:3000/chat', {
      transports: ['websocket', 'polling'],
      auth: {
        token: cleanToken  // Send clean token
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 60000
    });

    // Debug socket events
    socket.on('connect', () => {
      console.log('Socket connected successfully');
      if (chatId) {
        socket.emit('joinSession', chatId);
      }
    });

    // Add listener for new messages
    socket.on('newMessage', (message) => {
      console.log('Received new message:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      // If token is invalid, try to refresh or redirect to login
      if (error.message === 'Authentication failed') {
        // Handle authentication failure
        console.log('Authentication failed, redirecting to login...');
        // Add your auth failure handling here
      }
    });

    setSocket(socket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [chatId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    try {
      // Send message through socket
      socket.emit('sendMessage', {
        content: newMessage,
        chat_id: parseInt(chatId),
        user_id: user.id
      });
      
      
      
      // Clear input
      setNewMessage('');

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="messages-container">
    {loading ? (
      <div>Loading messages...</div>
    ) : (
      <div className="messages-list">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.user_id === user.id ? 'sent' : 'received'}`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-time">
              {new Date(message.sent_at).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    )}
      
      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Messages;