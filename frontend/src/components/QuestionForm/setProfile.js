import {  useState, useRef, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

const SetProfile = (email) => {
    //used to navigate between pages
    const navigate = useNavigate()

    const [values, setValues] = useState({
        Fname: "",
        Lname: "",
        year: "",
        location: "",
        aboutMe: "",
    })

    const handleChange = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const User = {
                User: {
                    Personal_info: values
                }
            }
        
        console.log(User)
        console.log(email.email)

        const response = await fetch('http://localhost:4000/api/users/' + email.email, {
            method: 'PATCH',
            body: JSON.stringify(User),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()
        
        if (response.ok){
            //dispatch({type: 'SET_USER', payload: json})

            console.log("new data added, json")
            console.log(json)
            navigate('/home');
        }

    }

    return(
        <div className="profileContainer c" >
                <form className='form c' onSubmit={handleSubmit}>
                    <div className="double-input-row">
                        <label className="setProfileTitle c" htmlFor="firstName" draggable="false">First Name</label>
                        <label className="setProfileTitle c" htmlFor="lastName" draggable="false">Last Name</label>

                        <input className="setProfileInput c" type="text" value={values.Fname} name="Fname"
                        onChange={(e) => handleChange(e)} required/>
                        <input className="setProfileInput c" type="text" value={values.Lname} name="Lname"
                        onChange={(e) => handleChange(e)} required/>
                    </div>
                        <label className="setProfileTitle c" htmlFor="location" draggable="false">University</label>
                        <input className="setProfileInput c" type="text" value={values.location} name="location"
                         onChange={(e) => handleChange(e) } required/>

                        <label className="setProfileTitle c" htmlFor="year" draggable="false">Year</label>

                        
                        <input className="setProfileInput c" type="text" value={values.year} name="year"
                        onChange={(e) => handleChange(e)} required/>

                    <label className="setProfileTitle c" htmlFor="aboutMe" draggable="false">About Me</label>
                    <textarea className="setProfileResize c" name="aboutMe" id="aboutMe" cols="30" rows="" value={values.aboutMe}
                    onChange={(e) => handleChange(e)} required></textarea>
                    
                    <div className="container c">
                     <button type='submit' className='addSkillButton hoverEnlarge2 c' draggable="false">Submit</button>
                    </div>
                </form>
        </div>
    )
}

export default SetProfile