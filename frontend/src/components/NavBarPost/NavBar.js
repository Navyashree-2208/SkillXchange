import React from 'react'
import { Link } from 'react-router-dom'
import '../NavBarPre/NavBar.css'
import SearchBar from '../searchBar/SearchBar'


function NavBarPost() {
    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/home">
                        <img src={"/images/logo.svg"} alt="logo" className="logo" draggable="false"/>
                    </Link>
                </div>
                <SearchBar/>
                <div className='navbar-right'>
                    <Link to="/browse" className="nav-string">
                        Browse
                    </Link>
                    <Link to="/FAQ" className="nav-string">
                        FAQ
                    </Link>
                    <Link to="/profile/edit">
                    <img src={"/images/settings.svg"} alt="settings" className="navbar-icon-m" draggable="false"/>
                    </Link>
                    <Link to="/messages">
                        <img src={"/images/message.svg"} alt="message" className="navbar-icon-m" draggable="false"/>
                    </Link>
                    <Link to="/profile">
                        <img src={"/images/user.svg"} alt="user" className="navbar-icon-l" draggable="false"/>
                    </Link>
                </div>
            </nav>
        </>
    )
}

export default NavBarPost