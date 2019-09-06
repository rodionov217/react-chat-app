import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SignInForm from './SignInForm';
import { VERIFY_USER } from '../../../actions';

const SignIn = props => {
  const {setUser, socket} = props;
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    if (userName.length > 15) {
      return;
    }
    socket.emit(VERIFY_USER, userName, handleUser);
  }

  const handleUser = ({user, isTaken}) => {
    if (isTaken) {
      setError('Sorry, this name is taken :(');
    } else {
      setError('');
      setUser(user);
    }
  }
  return (
    <section>
      <SignInForm userName={userName} setUserName={setUserName} onSubmit={handleSubmit} error={error}/>
    </section>
  )
}

SignIn.propTypes = {
  setUser: PropTypes.func,
  socket: PropTypes.object.isRequired
}

export default SignIn;