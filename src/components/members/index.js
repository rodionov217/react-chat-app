import React from 'react';
import PropTypes from 'prop-types';

const Members = ({list}) => {
  return (
    <ul className="list">
      {list.map((user, i) => {
        return (
          <li key={i} className="member">
            <div className="avatar">{user.name.split(' ').map(part => part[0]).join('').toUpperCase()}</div>
            <div className="about">
              <div className="name">
                {user.name}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  )
}

Members.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  })).isRequired
}


export default Members;