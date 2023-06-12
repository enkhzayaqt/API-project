import Header from "../Header";
import SearchBar from "../SearchBar";
import Dropdown from "../Dropdown";

const HeaderBar = () => {
    return (
        <div id="header-bar">
            <Header />
            <SearchBar />
            <Dropdown />
        </div>
    )
}

export default HeaderBar
