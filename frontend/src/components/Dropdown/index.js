import { useState } from 'react';
import ProfileButton from '../Navigation/ProfileButton';

function Dropdown() {
    const [visible, setVisible] = useState('none');
    function handleClick() {
        visible === 'none' ? setVisible('block') : setVisible('none')
    }

    return (
        <div className='dropdown-menu'>
            <div className='dropdown-button' onClick={handleClick}>
                <img id='dropdownicon' src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1024px-Hamburger_icon.svg.png" />
                <img id='dropdown-profile-pic' src='https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' />
            </div>
            <div className='dropdown-item' onClick={handleClick} style={{ display: visible }}>
                <ProfileButton />
            </div>
        </div>
    )

}

export default Dropdown;
