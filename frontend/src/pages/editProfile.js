import NavBar from '../components/NavBarPost/NavBar';
import EditProfileForm from '../components/EditProfile/EditProfileForm'
import EditTeachingSkills from '../components/EditProfile/EditTeachingSkills';
import EditLearningSkills from '../components/EditProfile/EditLearningSkills'
import './cheryl.css'
import './editProfile.css'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const EditProfile = () => {

    const [profile, setProfile] = useState(null);
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


    useEffect(() => {
        if (email) {
            const fetchUser = async () => {
                try {
                    console.log('/api/users/' + email)
                    const response = await fetch('http://localhost:4000/api/users/' + encodeURIComponent(email));

                    console.log('Response status:', response.status);
                    console.log('Response content-type:', response.headers.get('content-type'));

                    if (response.ok) {
                        console.log(response)
                        const json = await response.json();
                        setProfile(json);
                    } else {
                        console.error("Failed to fetch user data");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUser()
        }
    }, [email])  

    if (!profile) {
        return <p>Loading profile...</p>;
    }

    console.log(profile)

    
    return (
        <div className='animate__fadeIn animate__animated fade c'>
            <NavBar/>
            <div className="edit-background">
                <div className='body-card'>
                    <h1 className='margin0px c'>Edit Profile</h1>
                    <EditProfileForm user = { profile.User.Personal_info }/>
                </div>
                <div className='body-card'>
                    <h1 className='margin0px c'>Add Skills</h1>
                    <div className="two-column-grid">
                        <div className='teaching-header'>
                            <img src={"/images/book.svg"} alt="book" className="skill-header-icon" draggable="false"/>
                            Teaching
                        </div>
                        <div className='learning-header'>
                            <img src={"/images/cap.svg"} alt="cap" className="skill-header-icon" draggable="false"/>
                            Learning
                        </div>
                        <EditTeachingSkills skills = { profile.User.Skills.teaching_skills } email = {profile.User.Personal_info.Email}/>
                        <EditLearningSkills skills = { profile.User.Skills.learning_skills} email = {profile.User.Personal_info.Email}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile