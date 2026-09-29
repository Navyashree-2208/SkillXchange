import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch }) => {
    const [searchInput, setSearchInput] = useState('');

    const handleSearch = () => {
        if (!searchInput) {
            alert('Please enter a username or email to search.');
            return;
        }
        onSearch(searchInput);
    };

    return (
        <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by username or email"
            />
            <button className="search-button" onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;
