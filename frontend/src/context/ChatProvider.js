import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUser(userInfo);
        console.log(window.location.pathname)
        //const protectedRoutes = ['/home', '/profile', '/messages', '/profile/edit']; // define routes that require authentication
        // const nonProtectedRoutes = ['/sigin', '/signup', '/faq']; // define routes that do not require authentication
        if (window.location.pathname != "/signin" && !userInfo) { // && protectedRoutes.includes(window.location.pathname){
            navigate('/');
        }
    }, [navigate]);


    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;