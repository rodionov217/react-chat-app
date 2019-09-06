import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Modal = props => {
  const {visible, setVisible} = props;
  return (
    <div className="modal" style={{display: visible ? 'flex' : 'none'}}>
      <div onClick={() => setVisible(false)}  className="modal-overlay"></div>
      <div className="modal-notice">
        {props.children}
      </div>
    </div>
  )
}

Modal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
}

export default Modal;