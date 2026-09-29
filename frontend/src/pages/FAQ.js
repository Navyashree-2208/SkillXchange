import './FAQ.css'
import NavBarPre from '../components/NavBarPre/NavBar'
import NavBarPost from '../components/NavBarPost/NavBar'
import Accordion from '../components/AccordionFAQ/Accordion'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from 'react'

const FAQ = () => {
    const auth = getAuth()
    const [loggedIn, setLoggedIn] = useState(Boolean)
    console.log(loggedIn)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setLoggedIn(true)
            } else {
                setLoggedIn(false)
            }
        });
        return () => unsubscribe();
    }, []);

//code for nav bar
{loggedIn && <NavBarPost /> }
{!loggedIn && <NavBarPre /> }


    return (
        <div className='animate__fadeIn animate__animated fade c'>
            <div className="background"><img src={"/images/faqBackground.svg"} class="background-img" /></div>
            {loggedIn && <NavBarPost /> }
            {!loggedIn && <NavBarPre /> }
                <div className="page-header-centered">
                    <div className="title">Frequently Asked Questions</div>
                </div>
                <Accordion />
        </div>
    )
}

export default FAQ