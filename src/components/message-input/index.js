import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MessageInput = props => {
  const {user, roomName, sendMessage, sendTyping} = props;
  const [messageValue, setMessageValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleChange = event => {
    if (!isTyping) {
      setIsTyping(true);
      sendTyping({chatName: roomName, userName: user.name, isTyping: true});
    } else if ( isTyping && event.target.value === '') {
      setIsTyping(false);
      sendTyping({chatName: roomName, userName: user.name, isTyping: false});
    }
    setMessageValue(event.target.value);
  }

  const handleSubmit = event => {
    event.preventDefault();
    sendMessage({chatName: roomName, message: messageValue, from: user.name} );
    sendTyping({chatName: roomName, userName: user.name, isTyping: false});
    setMessageValue('');
    setIsTyping(false);
  }

  return (
    <form onSubmit={handleSubmit} className="chat-message clearfix">
      <input autoFocus autoComplete="off" value={messageValue} onChange={handleChange} name="message-to-send" id="message-to-send" placeholder ="Type your message here..." rows="3"/>
      <button disabled={messageValue === ''} type="submit">Send</button>
    </form>

  )
}

MessageInput.propTypes = {
  roomName: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  sendTyping: PropTypes.func,
  sendMessage: PropTypes.func
}


export default MessageInput;