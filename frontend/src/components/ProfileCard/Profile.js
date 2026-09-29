import React from 'react'
import { Link } from 'react-router-dom'
import './Profile.css'

function Profile( userData ) {
    console.log(userData.userData.User.Skills.teaching_skills)

    const profilePictureUrl = userData.userData.User.Personal_info.profilePicture   
        ? `http://localhost:4000${userData.userData.User.Personal_info.profilePicture}` 
        : '/images/user.svg'


    function calculateAverageRating(skills) {
        if (skills.length === 0) return 0;    
        const totalRating = skills.reduce((acc, skill) => acc + skill.Rating_score, 0);
        const averageRating = totalRating / skills.length;   
        return averageRating;
    }

    function createSkillString(skills) {
        if (skills.length === 0) {
            return "";
        }
    
        const skillString = skills.map(skill => skill.Name).join(', ');
    
        return skillString; 
    }
    
    const average = calculateAverageRating(userData.userData.User.Skills.teaching_skills);
    const teaching_skills = createSkillString(userData.userData.User.Skills.teaching_skills);
    const learning_skills = createSkillString(userData.userData.User.Skills.learning_skills);
    const username = userData.userData.User.Personal_info.Username;

    return (
        <Link to={`/user/${username}`} >                
            <div className="profile animate__fadeIn animate__animated fade c">
                <div className="banner"><img src={profilePictureUrl} alt="banner" className="banner" draggable="false"/></div>
                <Link to="/messages" className="message-button"><img src={"/images/message.svg"} alt="message" className="message-icon" draggable="false"/></Link>
                <div className="body">
                    <div className="name">{userData.userData.User.Personal_info.Fname} {userData.userData.User.Personal_info.Lname}</div>

                    <div className="teaching">
                        <img src={"/images/book.svg"} alt="book" className="trade-icon" draggable="false"/>
                        Teaching
                        </div>
                    <div className="teaching-rating">
                        <img src={"/images/star_blue.svg"} alt="star" className="star-icon" draggable="false"/>
                        {average}
                        </div>
                    <div className="teaching-subjects">{teaching_skills}</div>

                    <div className="learning">
                        <img src={"/images/cap.svg"} alt="book" className="trade-icon" draggable="false"/>
                        Learning
                        </div>
                    <div className="learning-subjects">{learning_skills}</div>


                    <div className="location">
                        <img src={"/images/pin.svg"} alt="pin" className="pin-icon" draggable="false"/>
                        {userData.userData.User.Personal_info.location}
                        </div>
                </div>
            </div>
        </Link>
    )
}

export default Profile

//            <div className="profile">
/* <div className="banner"><img src={"/images/user.png"} alt="banner" className="banner" draggable="false"/></div>
<Link to="/messages" className="message-button"><img src={"/images/message.svg"} alt="message" className="message-icon" draggable="false"/></Link>
<div className="body">
    <div className="name">Steve Jones</div>
    <div className="learning">
        <img src={"/images/cap.svg"} alt="cap" className="trade-icon" draggable="false"/>
        Learning
        </div>
    <div className="learning-rating">
        <img src={"/images/star_green.svg"} alt="star" className="star-icon" draggable="false"/>
        0.0 (0)
        </div>
    <div className="learning-subjects">2D Art, Piano, Baking, Guitar, Badminton</div>
    <div className="location">
        <img src={"/images/pin.svg"} alt="pin" className="pin-icon" draggable="false"/>
        Texas A&M University
        </div>
</div>
</div>
<div className="profile">
<div className="banner"><img src={"/images/user.png"} alt="banner" className="banner" draggable="false"/></div>
<Link to="/messages" className="message-button"><img src={"/images/message.svg"} alt="message" className="message-icon" draggable="false"/></Link>
<div className="body">
    <div className="name">Bob Robertson</div>
    <div className="teaching">
        <img src={"/images/book.svg"} alt="book" className="trade-icon" draggable="false"/>
        Teaching
        </div>
    <div className="teaching-rating">
        <img src={"/images/star_blue.svg"} alt="star" className="star-icon" draggable="false"/>
        2.0 (5)
        </div>
    <div className="teaching-subjects">Statistics, Cooking</div>
    <div className="learning">
        <img src={"/images/cap.svg"} alt="cap" className="trade-icon" draggable="false"/>
        Learning
        </div>
    <div className="learning-rating">
        <img src={"/images/star_green.svg"} alt="star" className="star-icon" draggable="false"/>
        2.0 (25)
        </div>
    <div className="learning-subjects">Basketball, 3D Modeling</div>
    <div className="location">
        <img src={"/images/pin.svg"} alt="pin" className="pin-icon" draggable="false"/>
        University of Houston
        </div>
</div>
</div>
<div className="profile">
<div className="banner"><img src={"/images/user.png"} alt="banner" className="banner" draggable="false"/></div>
<Link to="/messages" className="message-button"><img src={"/images/message.svg"} alt="message" className="message-icon" draggable="false"/></Link>
<div className="body">
    <div className="name">Cryan Creynolds</div>
    <div className="teaching">
        <img src={"/images/book.svg"} alt="book" className="trade-icon" draggable="false"/>
        Teaching
        </div>
    <div className="teaching-rating">
        <img src={"/images/star_blue.svg"} alt="star" className="star-icon" draggable="false"/>
        5.0 (1)
        </div>
    <div className="teaching-subjects">Acting, Comedy</div>
    <div className="learning">
        <img src={"/images/cap.svg"} alt="cap" className="trade-icon" draggable="false"/>
        Learning
        </div>
    <div className="learning-rating">
        <img src={"/images/star_green.svg"} alt="star" className="star-icon" draggable="false"/>
        1.0 (2)
        </div>
    <div className="learning-subjects">Boxing</div>
    <div className="location">
        <img src={"/images/pin.svg"} alt="pin" className="pin-icon" draggable="false"/>
        The University of Texas at Dallas
        </div>
</div>
</div>
<div className="profile">
<div className="banner"><img src={"/images/user.png"} alt="banner" className="banner" draggable="false"/></div>
<Link to="/messages" className="message-button"><img src={"/images/message.svg"} alt="message" className="message-icon" draggable="false"/></Link>
<div className="body">
    <div className="name">Adrian Tran</div>
    <div className="teaching">
        <img src={"/images/book.svg"} alt="book" className="trade-icon" draggable="false"/>
        Teaching
        </div>
    <div className="teaching-rating">
        <img src={"/images/star_blue.svg"} alt="star" className="star-icon" draggable="false"/>
        3.0 (2)
        </div>
    <div className="teaching-subjects">2D Art, Algebra</div>
    <div className="learning">
        <img src={"/images/cap.svg"} alt="cap" className="trade-icon" draggable="false"/>
        Learning
        </div>
    <div className="learning-rating">
        <img src={"/images/star_green.svg"} alt="star" className="star-icon" draggable="false"/>
        1.0 (2)
        </div>
    <div className="learning-subjects">Volleyball, UX Design</div>
    <div className="location">
        <img src={"/images/pin.svg"} alt="pin" className="pin-icon" draggable="false"/>
        The University of Texas at Dallas
        </div>
</div>
</div>
<div className="profile">
<div className="banner"><img src={"/images/user.png"} alt="banner" className="banner" draggable="false"/></div>
<Link to="/messages" className="message-button"><img src={"/images/message.svg"} alt="message" className="message-icon" draggable="false"/></Link>
<div className="body">
    <div className="name">Notta Scammer</div>
    <div className="teaching">
        <img src={"/images/book.svg"} alt="book" className="trade-icon" draggable="false"/>
        Teaching
        </div>
    <div className="teaching-rating">
        <img src={"/images/star_blue.svg"} alt="star" className="star-icon" draggable="false"/>
        1.0 (3)
        </div>
    <div className="teaching-subjects">Python, Linear Algebra</div>
    <div className="learning">
        <img src={"/images/cap.svg"} alt="cap" className="trade-icon" draggable="false"/>
        Learning
        </div>
    <div className="learning-rating">
        <img src={"/images/star_green.svg"} alt="star" className="star-icon" draggable="false"/>
        0.8 (58)
        </div>
    <div className="learning-subjects">Java, Calculus, Quantum Physics, Literary Analysis</div>
    <div className="location">
        <img src={"/images/pin.svg"} alt="pin" className="pin-icon" draggable="false"/>
        The University of Texas at Dallas
        </div>
</div>
</div>
</div> */
