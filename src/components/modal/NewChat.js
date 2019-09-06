import React, {useState} from 'react';
import PropTypes from 'prop-types';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const NewChat = ({createNewChat, joinChat, error}) => {
  const [showJoinForm, setShowJoinForm] = useState(true);
  const [newChatName, setNewChatName] = useState('');
  const [inviteValue, setInviteValue] = useState('');
  const incorrectMessage = "Too long for a chat name. Try something shorter than 10 symbols.";

  const handleJoin = event => {
    event.preventDefault();
    joinChat(inviteValue);
    setInviteValue('');
  }

  const handleCreate = event => {
    event.preventDefault();
    createNewChat(newChatName);
    setNewChatName('');
  }
  
  return (
    <div className="new-chat-modal">
      <form onSubmit={handleJoin} className="new-chat-form" style={{display: showJoinForm ? 'flex' : 'none'}}>
        <label>
          Do you have an invite code?
          <br/>
          Paste it in here to join the room
        </label>
        <input autoFocus value={inviteValue} onChange={e => setInviteValue(e.target.value)} type="text" placeholder="e.g. 1111-a22222-c333333"/>
        <output>{inviteValue === '' ? '' : error}</output>
        <button disabled={inviteValue === ''} type="submit" className="action-button">Join</button>
        or
        <button className="switch-button" type="button" onClick={() => setShowJoinForm(false)}>Create New Room</button>
      </form>

      <form style={{display: showJoinForm ? 'none' : 'flex'}} className="new-chat-form" onSubmit={handleCreate} >
        <label>Enter the new chat name:</label>
        <input value={newChatName} onChange={e => setNewChatName(e.target.value)} type="text" placeholder="chat name"/>
        <output>{newChatName.length > 10 ? incorrectMessage : ''}</output>
        <button disabled={newChatName === ''} type="submit" className="action-button">Create</button>
        or
        <button className="switch-button" type="button" onClick={() => setShowJoinForm(true)}>
          <span><ArrowBackIcon fontSize="large"/></span>
          Go back to join existing room
          </button>
      </form>
    </div>
  )
};

NewChat.propTypes = {
  joinChat: PropTypes.func,
  createNewChat: PropTypes.func,
  error: PropTypes.string
}

export default NewChat;