import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MessageHistory from '../message-history';
import Members from '../members';
import Modal from '../modal';
import MessageInput from '../message-input';
import Invite from '../modal/Invite';
import PeopleIcon from '@material-ui/icons/People';
import CloseIcon from '@material-ui/icons/Close';

const ChatRoom = props => {
  const {room, user, sendMessage, sendTyping, typing} = props;
  const [showInviteModal, setShowInviteModal] = useState(true);
  const [showMembers, setShowMembers] = useState(true);

  return (
    <div className="chat-container">
      <Modal visible={showInviteModal} setVisible={value => setShowInviteModal(value)} >
        <Invite id={room.id} close={() => setShowInviteModal(false)}/>
      </Modal>

      <label htmlFor="users-switch" className="users-button">
        {showMembers ? 
          <CloseIcon fontSize="large"/> : 
          <PeopleIcon fontSize="large"/>}
      </label>
      <input defaultChecked={true} onChange={e => setShowMembers(e.currentTarget.checked)} className="users-switch" type="checkbox" id="users-switch"/>
        
      <div className="people-list" id="people-list">
        <button type="button" onClick={() => setShowInviteModal(true)}>Invite Friends</button>
        <Members visible={showMembers} list={Object.values(room.users)}/>
      </div>

      <div className="chat">
        <MessageHistory 
          list={room.messages} 
          user={user}
          typing={typing}
          chatName={room.name}
        />
        <MessageInput 
          user={user} 
          roomName={room.name} 
          sendMessage={sendMessage}
          sendTyping={sendTyping}
          />
      </div>

    </div>
  );
}

ChatRoom.propTypes = {
  room: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  sendMessage: PropTypes.func,
  sendtyping: PropTypes.func,
  typing: PropTypes.array.isRequired,
}

export default ChatRoom;