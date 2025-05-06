import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import '../App.css';

const Messages = ({ sessionId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      transports : ['websocket'],
      auth: {
        token: localStorage.getItem('token')
      },
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    setSocket(newSocket);

    // Join session room
    newSocket.emit('joinSession', sessionId);

    // Listen for new messages
    newSocket.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Cleanup on unmount
    return () => {
      newSocket.emit('leaveSession', sessionId);
      newSocket.disconnect();
    };
  }, [sessionId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit('sendMessage', {
      content: newMessage,
      sessionId: sessionId,
      userId: user.id
    });

    setNewMessage('');
  };

  return (
    <div className="messages-container">
      <div className="messages-list">
        {messages.map((message, index) => (
          <div
            key={index}
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