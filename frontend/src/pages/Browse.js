import './Browse.css';
import NavBarPost from '../components/NavBarPost/NavBar'
import Profile from '../components/ProfileCard/Profile'
import { useState, useEffect, useMemo } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../components/ProfileCard/Profile.css'

const Browse = () => {
    //get current user's email
    const [email, setEmail] = useState(null);
    const auth = getAuth()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setEmail(currentUser.email)
            } else {
                console.log("No user is signed in");
            }
        });
        return () => unsubscribe();
    }, [auth]);

    //all users
    const [users, setUsers] = useState([])
    const userEmail = useMemo(() => ({
        email: email
    }), [email]);
    console.log(JSON.stringify(userEmail))

    //get all users with search algorithm
    useEffect( () => {
        const fetchUsers = async () => {
            console.log(JSON.stringify(userEmail))
            const response = await fetch('https://skillxchange-backend-ih1t.onrender.com/api/users/recommendations', {
                method: 'POST',
                body: JSON.stringify(userEmail),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json();

console.log("API RESPONSE:", json);
console.log("IS ARRAY:", Array.isArray(json));

setUsers(json);
        }
        if (userEmail.email)
            {
                fetchUsers();
            }

    }, [userEmail])


    //get all users
    // useEffect( () => {
    //     const fetchUsers = async () => {
    //         try {
    //             const response = await fetch('https://skillxchange-backend-ih1t.onrender.com/api/users'); 
    //             const data = await response.json();
        
    //             setUsers(data);
    //           } 
    //         catch (error) {
    //             console.error('Error fetching users:', error);
    //         }
    //     }

    //     fetchUsers();
    // }, [])

    console.log(users)


    return (
        <div className='animate__fadeIn animate__animated fade c'>
            <NavBarPost />
                <div className="page-header">
                    <div className="filter">
                        Sort By
                        <select className="filter-dropdown">
                            <option value="rating">Highest Rating</option>
                            <option value="alphabetical">Alphabetical</option>
                        </select>
                    </div>                    
                </div>
                <div>
                        
                </div>
                <div className="profile-grid">
                    {users.map((user) => (
                        <Profile key={user._id} userData={user}/>
                    ))}
                </div>
        </div>
    )
}

export default Browse