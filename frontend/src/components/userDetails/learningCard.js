import {useSkillContext} from "../../hooks/useSkillContext"
import { useState } from "react"

const LearningCard = ({ learning_skill, userID, self}) => {
    const [isDeleted, setIsDeleted] = useState(false)

    const { dispatch } = useSkillContext()
    const handleClick = async () => {
        const skill = {
            "skillId": learning_skill._id,
            "skillType": "learning", 
        }
        console.log(skill)
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
        <div className='teachingCard border c' key={learning_skill._id}>
          <p className='profileTextHeader c textCenter topPadding'>{learning_skill.Name}</p>
          {learning_skill.Description && <span className="pc center padding10 c">{learning_skill.Description}</span>}
          {self === 'true' && (
            <div className="bottomright c">
              <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
            </div>
          )}
        </div>
      ) : null}
      </>
    )
}

export default LearningCard