import React from 'react';
import PropTypes from 'prop-types'
import { AppBar, Tabs, Tab } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const ChatTabs = props => {
  const {currentRoom, setCurrentRoom, chats, openModal, icon, className} = props;
  return (
    <AppBar className={className} position="static" color="default">
      <Tabs 
        value={currentRoom}
        onChange={(event, newValue) => setCurrentRoom(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example">
        {
          chats.map((room, i) => <Tab key={i} label={room.name} id={`scrollable-auto-tab-${i}`}  aria-controls={`scrollable-auto-tabpanel-${i}`}/>)
        }
        <AddCircleIcon className={icon} onClick={openModal} />
      </Tabs>
    </AppBar>
  );
};

ChatTabs.propTypes = {
  currentRoom: PropTypes.string.isRequired,
  setCurrentRoom: PropTypes.func,
  chats: PropTypes.array.isRequired,
  openModal: PropTypes.func,
  icon: PropTypes.string,
  className: PropTypes.string
}

export default ChatTabs;