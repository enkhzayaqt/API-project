import React from "react";

function SearchBar() {
    let cities = [
        'Chicago',
        'Florida',
        'New York',
        'Langley',
        'Nashville',
        'Burnet County',
        'Beverly Hills',
        'Malibu',
        'London',
        'Los Angeles'
    ];


    return (
        <div className="search-box">
            <button className="btn-search"><i className="fas fa-search"></i></button>
            <input type="text"
                className="input-search"
                placeholder="Type to Search..."

            />
            <div id="searchResults"></div>

        </div>
    )
}

export default SearchBar;
