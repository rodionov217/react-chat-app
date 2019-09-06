import React from 'react';
import PropTypes from 'prop-types';

const Message = props => {
  const { from, message, time, response, user} = props;
  return (
    <li className="message-container">
      <div className={`message-data ${response && 'align-right'}`}>
        <span className="message-data-name">{from === user.name ? 'Me' : from}</span>
        <span className="message-data-time">{time}</span>
      </div>
      <div className={`message ${!response ? "my-message" : "other-message float-right"}`}>
        {message}
      </div>
    </li>
  );
}

Message.propTypes = {
  from: PropTypes.string,
  message: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  response: PropTypes.bool,
  time: PropTypes.string
}


export default Message;