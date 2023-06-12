import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import DemoUserLogin from '../DemoUserModal'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const sessionUser = useSelector(state => state.session.user);


  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const createSpot = (e) => {
    e.preventDefault();
    history.push("/spot/new");
  };

  return (
    <>
      <ul id="menu-dropdown" ref={ulRef}>
        {sessionUser ? (
          <>
            <li className="info-li"><i className="far fa-user" /> {sessionUser.username}</li>
            <li className="info-li"><i className="far fa-face-smile" /> {sessionUser.firstName} {sessionUser.lastName}</li>
            <li className="info-li"><i className="far fa-envelope" /> {sessionUser.email}</li>
            <li className="info-li section-li"></li>
            <li onClick={(e) => createSpot(e)}><i className="far fa-plus" /> Create spot</li>
            <li onClick={logout}><i className="fa-solid fa-right-from-bracket"></i> Log Out</li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            <OpenModalMenuItem
              itemText="Demo User Login"
              onItemClick={closeMenu}
              modalComponent={<DemoUserLogin />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
