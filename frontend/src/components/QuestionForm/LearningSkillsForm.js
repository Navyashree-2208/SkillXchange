import { useState, useRef, useEffect } from "react"
import "animate.css"

const LearningSkillsForm = ({ email, skillType }) => {

    console.log(email)
    console.log(skillType)

    //tabs
    const [Tab, setTab] = useState("browse")
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef(null);

    const handleTab = (tab) => {
        setTab(tab);
    }

    //animations
    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.clientHeight + 75); 
        }
    }, [Tab]);

    //all the skills and categories for the array
    const categoriesAndSkills = {
        "Technical": ["Coding/Programming", "Data Analysis", "Engineering", "IT/Networking", "Software Development", "3D Printing", "Building PCs"],
        "Communication": ["Public Speaking", "Writing", "Negotiation", "Active Listening", "Presentation"],
        "Artistic": ["Painting/Drawing", "Photography", "Crafting", "Creative Writing", "Graphic Design"],
        "Physical": ["Sports (e.g., basketball, soccer, tennis)", "Yoga/Pilates", "Hiking/Running", "Martial Arts", "Dance"],
        "Musical": ["Playing Instruments (e.g., guitar, piano, drums)", "Singing/Vocal Training", "Songwriting/Composing", "Music Production", "DJing"],
        "Outdoors": ["Gardening", "Camping/Backpacking", "Birdwatching", "Fishing", "Foraging"],
        "Culinary": ["Cooking/Baking", "Mixology", "Food Preservation (e.g., canning, fermenting)", "Cake Decorating", "Grilling/BBQ"],
        "Craftsmanship": ["Woodworking", "Sewing/Knitting", "Home Improvement/Repairs", "Pottery/Ceramics", "Metalworking"],
        "Language and Cultural": ["Learning New Languages", "Cultural Exploration/Traveling", "Language Exchange", "Translating/Subtitling", "Calligraphy"],
        "Mindfulness": ["Meditation", "Journaling", "Mindfulness Practices", "Puzzles and Brain Teasers", "Tai Chi"]
    };

    //code to handle dropdown menu changes
    const [currentCategory, setCurrentCategory] = useState('');
    const [currentSkill, setCurrentSkill] = useState('');
    const [description, setDescription] = useState(''); 

    const handleCategoryChange = (event) => {
        setCurrentCategory(event.target.value)
        setCurrentSkill('')
    }

    const handleSkillChange = (event) => {
        setCurrentSkill(event.target.value)
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }

    //handle submit
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit =  async () => {
        if(currentSkill !== "" && description!=="" ) {
            const newSkill = {
                Name: currentSkill,
                Description: description
            };
    
            const User = {
                User: {
                    Skills: {
                        [skillType]: newSkill            
                    }
                }
            }
    
            console.log(User)
    
            const response = await fetch('http://localhost:4000/api/users/add/' + email, {
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
                }, 800)
    
                //console.log("new data added, json")
                console.log("sucessful")
                console.log(json)
    
    
                setCurrentCategory("")
                setCurrentSkill("")
                setDescription("")
            }
        }
    }

    return(
        <div className="questionaireCard c" style={{ height: contentHeight }}>
            <div className="tabs c">
                <div className={`tab c left ${Tab === "browse" ? 'active' : ''}`}>
                    <button className="" onClick={()=>handleTab("browse")}>
                        <p className="tabTitle c">Add by Category</p>
                    </button>
                </div>
                <div className={`tab c right ${Tab === "custom" ? 'active' : ''}`}>
                    <button className={Tab==="custom" ? 'active' : ''} onClick={()=>handleTab("custom")}>
                        <p className="tabTitle c">Add Custom skill</p>
                    </button>
                </div>   
            </div>

            <div className="tabContent c " ref={contentRef}>
            {Tab === 'browse' && (
                <form  onSubmit={(e) => {
                    e.preventDefault(); 
                    handleSubmit(); 
                }}>
                    <div className="animate__animated animate__fadeIn animate__delay-2s c">
                        <div className="dropdownTitle c">
                            <p className="dropdownText c">By Category</p>
                            <select className="dropdown c" value={currentCategory} onChange={handleCategoryChange}required >
                                <option value="" disabled className="dropdownValue c" >Select Category</option>
                                    {Object.keys(categoriesAndSkills).map((category, index) => (
                                    <option key={index} value={category}>
                                    {category}
                                    </option>
                                     ))}
                            </select>
                        </div>
                        <div className="dropdownTitle c">
                            <p className="dropdownText c" >By Name</p>
                            <select value={currentSkill} onChange={handleSkillChange} disabled={!currentCategory} className="dropdown dropdownValue c" required>
                                <option className="c" value="" disabled>Select skill</option>
                                {currentCategory && categoriesAndSkills[currentCategory].map((skill, index) => (
                                    <option key={index} value={skill}>
                                    {skill}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="dropdownTitle c">
                            <label className="c dropdownText" htmlFor="Description">Skill Description</label>
                            <input className="c dropdown" type="text" value={description} placeholder='enter description' name="Description" required
                            onChange={(e) => handleDescriptionChange(e)}/>
                        </div>
                        <div className="container noPaddingBottom c">
                            <button className="addSkillButton hoverEnlarge2 c" 
                            type="submit"
                            >
                                Add Skill
                            </button>  
                        </div>
                        <div className="container c submittedForm">
                            {formSubmitted && <span className="form-submitted c" draggable="false">Sucessfully Updated!</span>}
                        </div>
                    </div>
                    </form>
                )}
            {Tab === 'custom' && (
                <form  onSubmit={(e) => {
                    e.preventDefault(); 
                    handleSubmit(); 
                }}>
                    <div className="animate__animated animate__fadeIn animate__delay-2s c">
                        <div className="dropdownTitle c">
                        <label className="c dropdownText" htmlFor="Name">Skill Name</label>
                        <input className="c dropdown" type="text" 
                            value={currentSkill} placeholder='enter skill' name="Name"
                            onChange={(e) => handleSkillChange(e)} required
                            />
                        </div>
                        <div className="dropdownTitle c">
                            <label className="c dropdownText" htmlFor="Name">Skill Description</label>
                            <input className="c dropdown" type="text" 
                            value={description} placeholder='enter description' name="Description" 
                            onChange={(e) => handleDescriptionChange(e)} required/>
                        </div>
                        <div className="container c">
                            <button className="addSkillButton hoverEnlarge2 c" 
                            type="submit"
                            >
                                Add Skill
                            </button>  
                        </div>
                        <div className="container c submittedForm">
                            {formSubmitted && <span className="form-submitted c" draggable="false">Sucessfully Updated!</span>}
                        </div>
                    </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default LearningSkillsForm