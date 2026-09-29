import React, {useState} from 'react'
import { Link } from 'react-router-dom'

const ProfileDetails = ({ user }) => {
    //console.log(user)
    const profileBannerUrl = user.profileBanner
        ? `http://localhost:4000${user.profileBanner}` 
        : '/images/defaultBanner.svg'
    const profilePictureUrl = user.profilePicture   
        ? `http://localhost:4000${user.profilePicture}` 
        : '/images/user.svg'
    console.log(user.profileBanner)
    return (
        <div>
            <div className='border c'>
            <img 
                src={profileBannerUrl}
                    className='bannerPicture c'
                    alt="Profile Banner"
                    />
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
                        <Link to="/profile/edit" className="edit c">
                            Edit
                        </Link>
                    </div>
                </div>
                
            </div>
            <div className='border aboutMe c'>
                <p className='h2c profileTextHeader c'>About Me</p>
                <p className="pc">{user.aboutMe}</p>
            </div>
        </div>
    )
}

export default ProfileDetails