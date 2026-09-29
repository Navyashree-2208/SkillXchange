import { useState } from "react"
//import { useSkillContext } from '../../hooks/useLearningSkillContext';

const EditTeachingSkills = ({skills : initialSkills, email}) => {
    //const { dispatch } = useSkillContext();

    const [values, setValues] = useState({
        Name: '',
        Description: '',
        Rating_score: 0,
        Hours_taught: 0,
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
            Description: values.Description,
            Rating_score: 0,
            Hours_taught: 0
        };

        const updatedSkills = [...skills, newSkill];

        const User = {
            User: {
                Skills: {
                    teaching_skills: updatedSkills                    
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

            //dispatch({type: 'CREATE_SKILL', payload: json})

            console.log("new data added, json")
            console.log(json)
            setSkills(updatedSkills);
            setValues({ Name: '', Description: '' });
        }
    }

    return (
        <div>
             <div className="container c">
                <form className='form c' onSubmit={handleSubmit}>                    
                    <label className="edit-label" htmlFor="Name">Skill Name</label>
                    <input className="edit-input" type="text" placeholder='Enter skill' name="Name"
                    onChange={(e) => handleChange(e)}/>

                    <label className="edit-label" htmlFor="Description">Description</label>
                    <input className="edit-input" type="text" placeholder="Enter description" name="Description"
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

export default EditTeachingSkills