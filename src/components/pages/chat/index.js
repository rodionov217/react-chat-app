import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MESSAGE_SENT, MESSAGE_RECIEVED, TYPING, NEW_CHAT, USER_CONNECTED, USER_DISCONNECTED, JOIN_CHAT, JOINED_CHAT, USER_JOINED } from '../../../actions/index';

import ChatRoom from '../../chat-room';
import TabPanel from './TabPanel';
import ChatTabs from './ChatTabs';
import Modal from '../../modal';
import { Snackbar } from './Snackbar';
import NewChat from '../../modal/NewChat';
//import Video from '../../video';

const Chat = props => {
  const { user, socket } = props;

  //LOCAL STATE
  const [currentRoom, setCurrentRoom] = useState(0);
  const [chats, setChats] = useState([{name: 'General', users: {}, messages: []}]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewUserNotice, setShowNewUserNotice] = useState(false);
  const [showUserLeftNotice, setShowUserLeftLotice] = useState(false);
  const [userToNotice, setUserToNotice] = useState('');
  const [error, setError] = useState('');
  
  
  useEffect(() => {
    socket.removeAllListeners();

    socket.on(USER_CONNECTED, ({connectedUsers, user}) => {
      setShowNewUserNotice(true);
      setUserToNotice(user.name);
      updateConnectedUsers(connectedUsers);
    });

    socket.on(USER_DISCONNECTED, ({connectedUsers, user}) => {
      setShowUserLeftLotice(true);
      setUserToNotice(user);
      updateConnectedUsers(connectedUsers); 
    });

    socket.on(NEW_CHAT, chat => addChat(chat, false));

    socket.on(JOINED_CHAT, chat => hadleJoinedChat(chat));

    socket.on(MESSAGE_RECIEVED, msg => addMessage(msg));

    socket.on(USER_JOINED, (room, user) => updateUsersInPrivateChat(room, user));
    
  // eslint-disable-next-line
  }, [chats]);

  useEffect(() => {
    socket.on(TYPING, ({chatName, userName, isTyping}) =>  updateTypingUsers({name: userName, chat: chatName}, isTyping ));
  });

  //Adds chat to chat container. If reset is true, removes all chats and sets that chat to the main chat. Sets the message and typing socket events for the chat.
  //@param chat {Object} Chat object
  //@param reset {boolean} if true, will set the chat as the only chat
  const addChat = (chat) => {
    const newChats = [...chats, chat];
    setChats(newChats);
  }
    
//updateTypingUsers({name: userName, chat: chatName}, isTyping ));
//Updates the list of users typing at the moment in different chats
//@param typingUSer {Object} a user object with two properties: name and chat
//@param isTyping {bool} true is the user is typing
  const updateTypingUsers = (typingUser, isTyping) => {
    let list = typingUsers.slice();;
    if (isTyping) {
      if (!typingUsers.find(el => el.name === typingUser.name && el.chat === typingUser.chat)) {
      list.push(typingUser);
      setTypingUsers(list);
      }
    } else {
      list = list.filter(el => el.name !== typingUser.name && el.chat !== typingUser.chat) ;
      setTypingUsers(list);
    }
  }

  //Updates the list of all the users connected to the general chat
  //@param users {array} the list of connected users
  const updateConnectedUsers = users => {
    const general = chats.findIndex(el => el.name === 'General');
    const updatedChats = chats.slice();
    updatedChats[general].users = users;
    setChats(updatedChats);
  }

  //Updates the list of user in the chat passed in
  //@param room {Object} the chat to update
  //@param user {Object} the joined user
  const updateUsersInPrivateChat = (room, user) => {
    const updatedChats = chats.slice();
    const chat = updatedChats.findIndex(el => el.name === room.name);
    if (chat !== -1) {
      updatedChats[chat].users = room.users;
      setChats(updatedChats);
    }
  }

  //Adds the message passed in to chat with the name passed in
  //@param message {Object}
  const addMessage = message => {
    let newChats = chats.map(chat => {
      if (message.chatName === chat.name) {
        chat.messages.push(message);
        return chat;
      } 
      return chat;
    });
    setChats(newChats);
  }

  //Handles the 'Send' button submit event. Sends the new message to the server
  const sendMessage = ({chatName, message, from}) => socket.emit(MESSAGE_SENT, {chatName, message, from});

  //Handles the message input change event. Send message to the server that the user is typing or has stopped typing
  const sendTyping = ({chatName, userName, isTyping}) => socket.emit(TYPING, {chatName, userName, isTyping});

  //Creates a new chat room with the name passed in. Sends a message to the server with the information about the new chat room
  //@param chatName {String} the name of the new chat
  const createNewChat = chatName => {
    setShowNewChatModal(false);
    setCurrentRoom(currentRoom+1);
    socket.emit(NEW_CHAT, {chatName, createdBy: user});
  }

  //Handles the 'Join' button submit event. Sends a message to the server with the id of the chat which the user wants to join.
  //@param chatId {String} the id of the chat to join
  const joinChat = chatId => {
    socket.emit(JOIN_CHAT, {chatId, user});
  }

  //Handles the 'Joined Chat' server event. If param chat is not null, adds the chat to the list of chats. Closes the modals and opens the tab with the new chat.
  //@param chat {Object} the object of the chat. Null if the chat was not found.
  const hadleJoinedChat = chat => {
    if (chat) {
      addChat(chat, false);
      setShowNewChatModal(false);
      setCurrentRoom(currentRoom+1);
    } else {
      setError('Sorry, this chat does not exist :(');
    }
  } 

  return (
    <div className="wrapper">
      <Snackbar user={userToNotice} notice=" has connected" open={showNewUserNotice} setOpen={setShowNewUserNotice}/>
      <Snackbar user={userToNotice} notice=" has disconnected" open={showUserLeftNotice} setOpen={setShowUserLeftLotice}/>
      <Modal
        visible={showNewChatModal}
        setVisible={setShowNewChatModal}>
        <NewChat createNewChat={createNewChat} joinChat={joinChat} error={error}/>
      </Modal>
      <ChatTabs 
        currentRoom={currentRoom}
        setCurrentRoom={setCurrentRoom}
        chats={chats}
        openModal={() => setShowNewChatModal(true)}
      />
      {
        chats.map((room, i) => (
          <TabPanel key={i} value={currentRoom} index={i}>
            {/* <Video 
              room={room} 
              user={user}
              socket={socket}/> */}
            <ChatRoom 
              room={room} 
              user={user}
              sendMessage={sendMessage}
              sendTyping={sendTyping}
              typing={typingUsers}
            />
          </TabPanel>
          )
        )
      }
    </div>
  )
}

Chat.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }).isRequired,
  socket: PropTypes.object.isRequired
}

export default Chat;