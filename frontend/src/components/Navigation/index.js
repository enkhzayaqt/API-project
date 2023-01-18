import React from 'react';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>

      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}

      {sessionUser && (
        <li>
          <button onClick={() => {
            window.location.href = "/spot/new"
          }}>
            Create spot
          </button>
        </li>
      )}
    </ul>
  );
}

export default Navigation;
