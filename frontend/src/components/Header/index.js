import { Link } from "react-router-dom";
import "./Header.css";
import logo from './logo.png'


function Header() {
    return (
        <div id='header-container'>
            <Link id='logo' exact to='/'>
                <img id='logo-img' alt="BairBnB logo" src={logo} />
                <span id='span-logo'>BairBnB</span>
            </Link>
        </div>
    )
}

export default Header;
