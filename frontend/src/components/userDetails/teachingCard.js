import {useSkillContext} from "../../hooks/useSkillContext"
import { useState } from "react"

const TeachingCard = ({ teaching_skill, userID, self }) => {
    const [isDeleted, setIsDeleted] = useState(false)
    
    const { dispatch } = useSkillContext()

    //deleting a skill
    const handleClick = async () => {
        const skill = {
            "skillId": teaching_skill._id,
            "skillType": "teaching", 
        }
        const response = await fetch(`http://localhost:4000/api/users/${userID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(
                skill
              ),
        })
        const json = await response.json()
    
        if (response.ok) {
          dispatch({type: 'DELETE_SKILL', payload: json})
          setIsDeleted(true)
        }
      }

    return (
    <>
        {!isDeleted ? (
        <div className='teachingCard border teachingCardText c'>
            <div className='top c'>
                <div className='topleft c'><p className="profileTextHeader c">{teaching_skill.Name}</p></div>
                <div className='topright c'> <p className='pc'>{teaching_skill.Rating_score !== undefined ? teaching_skill.Rating_score : "N/A"}</p></div>
            </div>
            <div className='descriptionText c'> 
                <p className="pc">{teaching_skill.Description}</p>
            </div>
            <div className='bottom c'>
                <div>
                    <p className="pc bottomleft c">Hours Taught: {teaching_skill.Hours_taught !== undefined ? teaching_skill.Hours_taught : 0}</p>
                </div>
                {self==='true' && <div className="bottomright c"><span className="material-symbols-outlined" onClick={handleClick}>delete</span></div>}
            </div>  
        </div>
        ): null}
    </>
    )

}

export default TeachingCard