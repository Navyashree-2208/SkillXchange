import { createContext, useReducer } from 'react';


export const SkillContext = createContext();


export const skillReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SKILLS':
            return {
                skill: action.payload 
            };
        case 'ADD_SKILL':
            return {
                skill: [...state.skill, action.payload] 
            };
        case 'DELETE_SKILL':
            return {
                skill: state.skill.filter(s => s._id !== action.payload._id) 
            };
        default:
            return state; 
    }
};


export const SkillContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(skillReducer, { skill: [] }); 

    return (
        <SkillContext.Provider value={{ ...state, dispatch }}>
            {children}
        </SkillContext.Provider>
    );
};
