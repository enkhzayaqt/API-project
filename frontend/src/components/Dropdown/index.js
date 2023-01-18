import { useState } from 'react';
import { useSelector } from 'react-redux';
import ProfileButton from '../Navigation/ProfileButton';
import "./DropDown.css";


function Dropdown() {
    const [display, setDisplay] = useState('none')
    const sessionUser = useSelector(state => state.session.user);
    function handleClick() {
        display === 'none' ? setDisplay('block') : setDisplay('none')
    }

    return (
        <div className='dropdown-menu'>
            <div className='dropdown-button' onClick={handleClick}>
                <img id='moreIcon' src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1024px-Hamburger_icon.svg.png" />
                <img id='dropdown-profile-pic' src={sessionUser ? sessionUser.profilePic : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'} />
            </div>
            <div className='dropdown-item' onClick={handleClick} style={{ display: display }}>
                <ProfileButton />
            </div>
        </div>

    )

}

export default Dropdown;
