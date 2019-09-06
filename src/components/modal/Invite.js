import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';

const Invite = props => {
  const { id, close } = props;
  const urlRef = useRef(null);
  const link = id ? id : 'https://serene-tor-99089.herokuapp.com/';
  const copy = event => {
    navigator.clipboard.writeText(link);
    close();
  }
  useEffect(() => {
    urlRef.current.focus();
    urlRef.current.setSelectionRange(0, link.length);
  });
  return (
    <div className="invite-modal">
      <h4>Copy and send this {id ? 'invite code' : 'link' } to your friends to this room</h4>
      <input ref={urlRef} value={link} autoFocus readOnly/>
      <button className="action-button" onClick={copy} type="button">Copy</button>
    </div>
  );
};

Invite.propTypes = {
  id: PropTypes.string,
  close: PropTypes.func,
}

export default Invite;