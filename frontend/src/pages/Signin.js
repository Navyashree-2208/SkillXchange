import './Signin.css';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SigninForm from '../components/Form/SigninForm';
import NavBarPre from '../components/NavBarPre/NavBar';
import SignupForm from '../components/Form/SignupForm';
import "animate.css"

const Signin = () => {
    const location = useLocation();
    const [isSigningIn, setIsSigningIn] = useState(true);

    useEffect(() => {
        const signingInState = location.state?.isSigningIn ?? true;
        setIsSigningIn(signingInState);
    }, [location.state]);

    return (
                <div className='animate__fadeIn animate__animated fade c'>
                    <div className="background">
                        <img src={"/images/signinBG.svg"} className="background-img" alt="background" />
                    </div>
                    <div className="verticalcenter">
                        <div className="welcome">{isSigningIn ? 'Welcome back!' : 'Welcome!'}</div>
                        <div className="subtitle">
                            {isSigningIn
                                ? 'Sign in to connect and trade skills with students.'
                                : 'Sign up to connect and trade skills with students.'}
                        </div>
                    </div>
                    <div className="formcolumn">
                        {isSigningIn ? <SigninForm /> : <SignupForm />}
                    </div>
                    <NavBarPre />
                </div>
    )
}

export default Signin