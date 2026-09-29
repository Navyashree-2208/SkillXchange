import LearningSkillsForm from '../components/QuestionForm/LearningSkillsForm'
import SetProfile from '../components/QuestionForm/setProfile'
import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "animate.css"
const Questionaire = () => {
    //code for changing pages in questionaire
    const [currentPage, setCurrentPage] = useState(1)
    const handleBack = () => {
        setCurrentPage(currentPage-1)
    }
    const handleNext = () => {
        setCurrentPage(currentPage+1)
    }

    //code for getting user email
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

    

    return(
        <div className='qbody c animate__fadeIn animate__animated fade c questionaireBackground'>
            <div className='questionaireBackground c'>
                { currentPage===1 && (
                    <div>
                        <div className='animate__animated animate__backInDown c'>
                            <p className='QuestionHeader c'>Let’s learn about you!</p>
                            <p className='QuestionSubheader c'>We want to match you with others who have talents you want to learn and skills that you can teach!</p>
                        </div>
                        <div className='container c questionContainer'>
                            <button onClick={handleNext} className='questionButton c hoverEnlarge2'>Next</button>
                        </div>
                    </div>
                )}
                { currentPage===2 && (
                    <div>
                        <div className='animate__animated animate__fadeInDown c c'> 
                            <p className='QuestionHeader nextQuestionHeader c'>Let’s start with learning.</p>
                            <p className='QuestionSubheader c'>What areas are you interested in?</p>
                        </div>
                        <div className=' container c animate__animated animate__fadeIn'>
                            <LearningSkillsForm email={email} skillType="learning_skills"/>
                        </div>
                        <div className='container c '>
                            <button onClick={handleBack} className='questionButton c hoverEnlarge2'>Back</button>
                            <button onClick={handleNext} className='questionButton c hoverEnlarge2'>Next</button>
                        </div>
                    </div>
                )}
                { currentPage===3 && (
                    <div>
                        <div className='animate__animated animate__fadeInDown c c'> 
                            <p className='QuestionHeader nextQuestionHeader c'>How about teaching?</p>
                            <p className='QuestionSubheader c'>What areas do you feel comfortable in?</p>
                        </div>
                        <div className=' container c animate__animated animate__fadeIn'>
                            <LearningSkillsForm email={email} skillType="teaching_skills"/>
                        </div>
                        <div className='container c '>
                            <button onClick={handleBack} className='questionButton c hoverEnlarge2'>Back</button>
                            <button onClick={handleNext} className='questionButton c hoverEnlarge2'>Next</button>
                        </div>
                    </div>
                )}
                { currentPage===4 && (
                    <div>
                        <div className='animate__animated animate__fadeInDown c'> 
                            <p className='QuestionHeader nextQuestionHeader c'>Finalize your Profile</p>
                            <p className='QuestionSubheader c'>Let's get to know you more!</p>
                        </div>
                        <div>
                            
                        </div>
                        <div className=' container c animate__animated animate__fadeIn animate__duration-3s'>
                            <SetProfile email={email}/>
                        </div>
                        <div className='container c'>
                            <button onClick={handleBack} className='questionButton c hoverEnlarge2'>Back</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Questionaire