import React, { useState} from 'react';
//import { SkillContext } from "../../context/SkillContext";

const EditLearningSkills = ({skills : initialSkills, email}) => {

    //const { skill, dispatch } = useContext(SkillContext);
    
    // useEffect(() => {
    //     dispatch({type: 'SET_SKILLS', payload: learning_skills})
    // }, [dispatch, learning_skills]);

    const [values, setValues] = useState({
        Name: '',
        Description: ''
    })

    const [skills, setSkills] = useState(initialSkills || [])
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleChange = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        //console.log(values)

        const newSkill = {
            Name: values.Name,
            Description: values.Description
        };

        const updatedSkills = [...skills, newSkill];

        const User = {
            User: {
                Skills: {
                    learning_skills: updatedSkills                    
                }
            }
        }


        console.log(User)

        const response = await fetch('http://localhost:4000/api/users/' + email, {
            method: 'PATCH',
            body: JSON.stringify(User),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()
        
        if (response.ok){
            //sucess message
            setFormSubmitted(true)
            setTimeout(() => {
               setFormSubmitted(false)
            }, 3000)

            //console.log("new data added, json")
            console.log(json)
            //dispatch({ type: 'ADD_SKILL', payload: newSkill });
            //console.log("updated skills: ")
            setSkills(updatedSkills);
            

            setValues({ Name: '', Description: '' });
        }
    }

    return (
        <div>
             <div className="container c">
                <form className='form c' onSubmit={handleSubmit}>                    
                    <label className="edit-label" htmlFor="Name">Skill Name</label>
                    <input className="edit-input" type="text" placeholder='Enter skill' name="Name" required
                    onChange={(e) => handleChange(e)}/>

                    <label className="edit-label" htmlFor="Description">Description</label>
                    <input className="edit-input" type="text" placeholder='Enter description' name="Description" required
                    onChange={(e) => handleChange(e)}/>
                    
                    <button type='submit' className='edit-submit'>Add skill</button>
                    <div className="form-submitted">
                        {formSubmitted && <span className="form-submitted">Sucessfully added!</span>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditLearningSkills