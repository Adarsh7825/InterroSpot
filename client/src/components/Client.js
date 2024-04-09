import React from 'react';
import Avatar from 'react-avatar';

function Client({ username, incomingTime, outgoingTime }) {
  return (
    <div className="client-container d-flex align-items-center mb-3">
      <Avatar name={username} size={40} round="14px" className="text-sm" />
      <div className='client-info'>
        <span className='username'>{username}</span>
        {incomingTime && <span className='time-info'>Incoming: {incomingTime}</span>}
        {outgoingTime && <span className='time-info'>Outgoing: {outgoingTime}</span>}
      </div>
    </div>
  );
}

export default Client;
