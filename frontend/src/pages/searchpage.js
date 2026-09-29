import NavBarPost from '../components/NavBarPost/NavBar'
import Profile from '../components/ProfileCard/Profile'
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SearchPage = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = decodeURIComponent(queryParams.get('query') || '')

    const input = {
        input: searchTerm
    }

    console.log(input);

    const [users, setUsers] = useState([])

    //get all users with search algorithm
    useEffect( () => {
        const fetchUsers = async () => {
            console.log(JSON.stringify(input))
            const response = await fetch('http://localhost:4000/api/users/search', {
                method: 'POST',
                body: JSON.stringify(input),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            setUsers(json)
        }
        fetchUsers();

    }, [searchTerm])

    console.log(users)

    return (
        <div className='animate__fadeIn animate__animated fade c'>
            <NavBarPost />
            {users && users.length > 0 ? (
                <>
                    <div className="page-header">
                        <div className="filter">
                            Sort By
                            <select className="filter-dropdown">
                                <option value="rating">Highest Rating</option>
                                <option value="alphabetical">Alphabetical</option>
                            </select>
                        </div>                    
                    </div>
                    <div className="profile-grid">
                        {users.map((user) => (
                            <Profile key={user._id} userData={user} />
                        ))}
                    </div>
                </>
            ) : (
                <h1>Loading Users...</h1>
            )}
        </div>
    );
};

export default SearchPage;
