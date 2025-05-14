import React from 'react';
import { useParams } from 'react-router-dom';
import Messages from '../components/Messages';

const MessagesPage = () => {
  const { id } = useParams();

  if (!id) {
    return <div>No chat selected</div>;
  }

  return (
    <div className="messages-page">
      <Messages chatId={parseInt(id, 10)} />
    </div>
  );
};

export default MessagesPage;