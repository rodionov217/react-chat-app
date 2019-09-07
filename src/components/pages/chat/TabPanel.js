import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';

const TabPanel = props => {
  const { value, index } = props;

  return (
    <Box 
      className={props.className}
      role="tabpanel" 
      hidden={value !== index} 
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
    >
      {props.children}
    </Box>
  );
}

TabPanel.propTypes = {
  value: PropTypes.number,
  index: PropTypes.number,
  className: PropTypes.string
}

export default TabPanel;