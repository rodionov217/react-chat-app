import React, {useState, useEffect} from 'react';
import './App.css';
import Chat from './components/pages/chat';
import SignIn from './components/pages/sign-in';
import { USER_CONNECTED, LOGOUT } from './actions/index';
import io from 'socket.io-client';

const socketUrl = "/";
//const socketUrl = "http://localhost:3001/";
const socket = io(socketUrl);
socket.on('connect', () => console.log('connected!'));

const App = () => {
  const [user, setUser] = useState(null);

  //Handles the SignIn form submit event. Sets up the new user object.
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
    return () => {
      logout(user)
    }
  // eslint-disable-next-line
  }, []);

  return !user ? 
    <SignIn setUser={setNewUser} socket={socket}/> : 
    <Chat user={user} socket={socket} logout={logout}/>
}

export default App;