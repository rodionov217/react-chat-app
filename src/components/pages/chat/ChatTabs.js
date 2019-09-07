import React from 'react';
import PropTypes from 'prop-types'
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const useStyles = makeStyles(() => ({
  tabs: {
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    boxShadow: 'none',
  },
  icon: {
    cursor: 'pointer',
    color: '#86BB71',
    alignSelf: 'center',
    transition: 'all ease-out 0.5s',
    '&:hover': {
      color: 'red'
    }
  }
}));
const ChatTabs = props => {
  const {currentRoom, setCurrentRoom, chats, openModal} = props;
  const classes = useStyles();
  return (
    <AppBar className={classes.tabs} position="static" color="default">
      <Tabs 
        value={currentRoom}
        onChange={(event, newValue) => setCurrentRoom(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example">
        {
          chats.map((room, i) => <Tab key={i} label={room.name} id={`scrollable-auto-tab-${i}`}  aria-controls={`scrollable-auto-tabpanel-${i}`}/>)
        }
        <AddCircleIcon className={classes.icon} onClick={openModal}/>
      </Tabs>
    </AppBar>
  );
};

ChatTabs.propTypes = {
  currentRoom: PropTypes.number.isRequired,
  setCurrentRoom: PropTypes.func,
  chats: PropTypes.array.isRequired,
  openModal: PropTypes.func,
}

export default ChatTabs;