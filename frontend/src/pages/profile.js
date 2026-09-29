import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../components/NavBarPost/NavBar'
import ProfileDetails from "../components/userDetails/profileDetails"
import TeachingCard from "../components/userDetails/teachingCard"
import LearningCard from '../components/userDetails/learningCard';
import './cheryl.css'

const Profile = () => {
    
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

    //console.log(profile)

    useEffect(() => {
        if (email) {
            const fetchUser = async () => {
                try {
                    console.log('/api/users/' + email)
                    const response = await fetch('http://localhost:4000/api/users/' + encodeURIComponent(email));

                    //console.log('Response status:', response.status);
                    //console.log('Response content-type:', response.headers.get('content-type'));

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
        return <p className='loading c animate__fadeIn animate__animated'>Loading profile...</p>;
    }

    //handle clicking delete button


    return (
        <div className='animate__fadeIn animate__animated fade c'>
            <NavBar/>
            <div>
                <ProfileDetails user = {profile.User.Personal_info}/>
            </div>
            <div>
                <h2 className='profileSkillHeader c'>Teaching</h2>
                <div className='container c'>

                {profile.User?.Skills?.teaching_skills?.length > 0 ? (
                    profile.User.Skills.teaching_skills.map((skill) => (
                        <TeachingCard key={skill._id} teaching_skill={skill} userID={profile._id} self='true'/>
                    ))
                ) : (
                    <p>No teaching skills available</p>
                )}


                </div>
            </div>
            <div>
            <h2 className='profileSkillHeader c'>Learning</h2>
                <div className='container c'>

                    {profile.User.Skills?.learning_skills?.length > 0 ? (
                        profile.User.Skills.learning_skills.map((skill) => (
                            <LearningCard key={skill._id} learning_skill={skill} userID={profile._id} self='true' />
                        ))
                    ) : (
                        <p>No learning skills available</p>
                    )}


                </div>
            </div>
        
        </div>
    )
}

export default Profile