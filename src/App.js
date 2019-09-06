import React, {useState, useEffect} from 'react';
import './App.css';
import Chat from './components/pages/chat';
import SignIn from './components/pages/sign-in';

import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT } from './actions/index';

const App = props => {
  const socketUrl = "/";
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);

  const initSocket = () => {
    const socket = io(socketUrl);
    socket.on('connect', () => console.log('connected!'));
    setSocket(socket);
  }

  /* @param user {id:number, name:string} */
  const setNewUser = user => {
    socket.emit(USER_CONNECTED, user);
    setUser(user);
  }

  const logout = () => {
    socket.emit(LOGOUT, user);
    setUser(null);
  }

  useEffect(() => {
    console.log('initSocket');
    initSocket();
    return () => {
      logout(user)
    }
  // eslint-disable-next-line
  }, []);

  useEffect(() => console.log('APP RENDER'));

  return !user ? 
    <SignIn setUser={setNewUser} socket={socket}/> : 
    <Chat user={user} socket={socket} logout={logout}/>
}

export default App;