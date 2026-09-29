import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/NavBarPost/NavBar'
import TeachingCard from "../components/userDetails/teachingCard"
import LearningCard from '../components/userDetails/learningCard';
import './cheryl.css'

const OtherUser = () => {
    let { username } = useParams();
    //username = username.substring(5)
    const [profile, setProfile] = useState(null);
    console.log(username)

    //get user info
    useEffect(() => {
        if (username) {
            const fetchUser = async () => {
                try {
                    console.log('/api/users/other/' + username)
                    const response = await fetch('http://localhost:4000/api/users/other/' + username);

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
    }, [username])  

    if (!profile) {
        return <p>Loading profile...</p>;
    }

    const user = profile.User.Personal_info

    const profileBannerUrl = user.profileBanner
        ? `http://localhost:4000${user.profileBanner}` 
        : '/images/defaultBanner.svg'
    const profilePictureUrl = user.profilePicture   
        ? `http://localhost:4000${user.profilePicture}` 
        : '/images/user.svg'

    return (
        <div className='animate__fadeIn animate__animated fade c'>
            <NavBar/>
            <div>
            <div>
            <div className='border c'>
                <img src={profileBannerUrl} className='bannerPicture c'/>
                <div className='top c'> 
                    <div className='topleft c'>
                        <img src={profilePictureUrl} className='pfp c'/>
                        <div className='profileText c'>
                            <p className='profileTextHeader c'>{user.Fname} {user.Lname}</p>
                            <p className='pc'>{user.location}</p>
                            <p className='pc'>{user.year}</p>
                        </div>
                    </div>
                    <div className='topright c'>
                        <Link to="/messages" className="edit c">
                            Message
                        </Link>
                    </div>
                </div>
                
            </div>
            <div className='border aboutMe c'>
                <p className='h2c profileTextHeader c'>About Me</p>
                <p className="pc">{user.aboutMe}</p>
            </div>
        </div>
            </div>
            <div>
                <h2 className='profileSkillHeader c'>Teaching</h2>
                <div className='container c'>

                {profile.User?.Skills?.teaching_skills?.length > 0 ? (
                    profile.User.Skills.teaching_skills.map((skill) => (
                        <TeachingCard key={skill._id} teaching_skill={skill} userID={profile._id}  self='false'/>
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
                            <LearningCard key={skill._id} learning_skill={skill} userID={profile._id} />
                        ))
                    ) : (
                        <p>No learning skills available</p>
                    )}


                </div>
            </div>
        
        </div>
    )
}

export default OtherUser