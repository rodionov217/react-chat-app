const io = require('./index.js').io;
const uuid = require('uuid');
const { 
  VERIFY_USER, 
  USER_CONNECTED, 
  USER_DISCONNECTED, 
  LOGOUT, 
  MESSAGE_RECIEVED, 
  MESSAGE_SENT, 
  TYPING, 
  NEW_CHAT, 
  JOIN_CHAT, 
  USER_JOINED, 
  JOINED_CHAT
} = require('../actions/index');

let connectedUsers = {};
let generalChat = {
  messages: [],
  name: 'General',
  users: connectedUsers
}
let openChats = {
  'General': generalChat
}
module.exports = socket => {
  console.log('Socket Id: ', socket.id);
  socket.join('general');

  socket.on(VERIFY_USER, (name, callback) => {
    if (isNameTaken(connectedUsers, name)) {
      callback({isTaken: true, user: null});
    } else {
      callback({isTaken: false, user: {name: name, id: Math.round(Math.random() * 1000)}})
    }
  })
  
  socket.on(USER_CONNECTED, (user) => {
    socket.join('General');
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;
    io.emit(USER_CONNECTED, {connectedUsers, user});
    console.log('Connected Users:', connectedUsers);
  });
  
  socket.on('disconnect', () => {
    if ("user" in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name);
      io.emit(USER_DISCONNECTED, {connectedUsers, user: socket.user.name});
      console.log(connectedUsers);
    } 
  });
  
  socket.on(LOGOUT, (user) => {
    connectedUsers = removeUser(connectedUsers, socket.user.name);
    io.emit(USER_DISCONNECTED, {connectedUsers, user: user});
  })

  socket.on(MESSAGE_SENT, ({chatName, message, from}) => {
    const msg = {
      time: (new Date()).toTimeString().substring(0, 5),
      message: message,
      chatName: chatName,
      from: from
    };
    io.to(chatName).emit(MESSAGE_RECIEVED, msg);
  })


  socket.on(TYPING, ({chatName, userName, isTyping} ) => {
    io.to(chatName).emit(TYPING, {chatName, userName, isTyping});
  })

  socket.on(NEW_CHAT, ({chatName, createdBy}) => {
    const chat = {
      name: chatName,
      users: {[createdBy.name]: createdBy},
      messages: [],
      id: uuid.v4().slice(0, 8),
      createdBy: createdBy
    }

    socket.join(chatName, () => io.to(chatName).emit(NEW_CHAT, chat));
    openChats[chatName] = chat;
  });

  socket.on(JOIN_CHAT, ({chatId, user}) => {
    const foundChat = (Object.values(openChats)).find(chat => chat.id === chatId);
    socket.emit(JOINED_CHAT, foundChat);
    if (foundChat) {
      socket.join(foundChat.name);
      foundChat.users[user.name] = user;
      io.to(foundChat.name).emit(USER_JOINED, foundChat, user);
    }
  });

/*   socket.on('STREAM', (data) => {
    console.log('STREAM', data.type);
    io.to(data.roomName).emit('STREAM', data);
  });

  socket.on('ICE_CANDIDATE', candidate => {
    io.to(candidate.room).emit('ICE_CANDIDATE', candidate)
  }) */
}


//Checks if the passed in name is already in the list of connected users
//@param userList {Object} object with key-value pairs of Users
//@param userName {String} 
//returns true if the name is found in the list and cannot be used again
const isNameTaken = (userList, userName) => {
  return userName in userList;
}


//Removes the passed in user from the passed in object of connected users
//@param userList {Object} object with key-value pairs of Users
//@param userName {String} 
//returns updated list of users
const removeUser = (userList, userName) => {
  let updatedList = Object.assign({}, userList);
  delete updatedList[userName];
  return updatedList;
}

//Adds the passed in user to the passed in object of connected users
//@param userList {Object} object with key-value pairs of Users
//@param user {Object} the user being added to the list
//returns updated list of users
const addUser = (userList, user) => {
  let updatedList = Object.assign({}, userList);
  updatedList[user.name] = user;
  return updatedList;
}