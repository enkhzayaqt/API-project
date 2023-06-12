import Header from "../Header";
import Search from "../Search";
import Dropdown from "../Dropdown";
import './HeaderBar.css'

const HeaderBar = () => {
    return (
        <div id="header-bar">
            <Header />
            <Search />
            <Dropdown />
        </div>
    )
}

export default HeaderBar
