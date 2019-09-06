import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Message from './messages/Message';
import Typing from './messages/Typing';

const MessageHistory = props => {
  const {list, user, typing, chatName} = props;
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    container.scrollTop = container.scrollHeight;
  });
  
  return (
    <div ref={containerRef} className="chat-history">
      {list.length > 0 && 
        <ul>
          {list.map((msg, i) => {
            return <Message key={i} {...msg} response={msg.from !== user.name} user={user}/>
          })}
        </ul>}
      {typing.length > 0 && 
      typing.map((user, i) => user.name === props.user.name || user.chat !== chatName ? null : <Typing key={i} from={user} />)}
    </div>
  )
}

MessageHistory.propTypes = {
  list: PropTypes.array.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  typing: PropTypes.array.isRequired,
}


export default MessageHistory;