import React from 'react';

const Typing = ({ from }) => {
  return (
      <div className="message-data">
        <span className="message-data-name">{from.name} is typing...</span>
      </div>
  );
}

export default Typing;