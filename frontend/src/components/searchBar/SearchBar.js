import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    //search terms is what the user is searching
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    const handleChange = (event) => {
        const term = event.target.value
        setSearchTerm(term);
    }

    const handleSearch = () => {
        const encodedQuery = encodeURIComponent(searchTerm)
        navigate(`/search?query=${encodedQuery}`)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch(e)
        }
    }

    return(
        <div className="search-bar-container c">
            <img src="/images/search.svg" className="search-icon" alt="search" />
            <input type="text" value={searchTerm} onChange={handleChange} placeholder="Search..." className="search-input c" onKeyDown={handleKeyDown}
            />
            {/* <button onClick={handleSearch} className="searchButton">Search</button> */}
        </div>
    )
}


export default SearchBar