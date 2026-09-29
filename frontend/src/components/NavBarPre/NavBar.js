import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'


function NavBarPre() {
    console.log("C2");
    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/">
                        <img src={"/images/logo.svg"} alt="logo" className="logo" draggable="false"/>
                    </Link>
                </div>
                <div className='navbar-right'>
                    <Link to="/FAQ" className="nav-string">FAQ</Link>
                    <Link to='/signin' state={{ isSigningIn: true }} className="nav-button-hollow">
                        Sign in
                    </Link>
                    <Link to='/signin' state={{ isSigningIn: false }} className="nav-button-solid">
                        Sign up
                    </Link>
                </div>
            </nav>
        </>
    )
    console.log("C3");
}

export default NavBarPre