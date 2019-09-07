import React from 'react';
import PropTypes from 'prop-types';

const SignInForm = ({userName, setUserName, onSubmit, error}) => {
  const notice = "It's too long:( Try something shorter than 15 symbols";
  return (
    <form onSubmit={onSubmit} className="sign-in-form container">
      <label>Enter your name to start</label>
      <input autoFocus type="text" placeholder="Name" value={userName} onChange={event => setUserName(event.target.value)}/>
      <output>{userName.length > 15 ? notice : error}</output>
      <button disabled={userName === ''} type="submit">Start Chatting</button>
    </form>
  )
}

SignInForm.propTypes = {
  userName: PropTypes.string,
  setUserName: PropTypes.func,
  onSubmit: PropTypes.func,
  error: PropTypes.string
}

export default SignInForm;