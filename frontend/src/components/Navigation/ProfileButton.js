import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';
import * as spotActions from '../../store/spots';
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

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {sessionUser ? (
          <>
            <li>{sessionUser.username}</li>
            <li>{sessionUser.firstName} {sessionUser.lastName}</li>
            <li>{sessionUser.email}</li>
            <li>
              <button onClick={(e) => createSpot(e)}> Create spot </button>
            </li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>


          </>
        ) : (
          <>
            <li>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li>
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>
            <li>
              <OpenModalMenuItem
                itemText="Demo User Login"
                onItemClick={closeMenu}
                modalComponent={<DemoUserLogin />}
              />
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
