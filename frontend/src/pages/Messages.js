import React, { useEffect, useState, useCallback, useRef } from "react";
import "./Messages.css";
import NavBarPost from "../components/NavBarPost/NavBar";
import Contact from "../components/MessageBoxes/Contact";
import Chat from "../components/MessageBoxes/Chat";
// import MeetingForm from '../components/MessagePopups/MeetingForm'
// import MeetingDropdown from '../components/MessagePopups/MeetingDropdown';
import { FaSearch } from 'react-icons/fa';
import { ChatState } from "../context/ChatProvider";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:4000";
const TYPING_TIMEOUT = 2000;

const Messages = () => {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [currentUserMongoId, setCurrentUserMongoId] = useState(null);
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [chatPartner, setChatPartner] = useState(null);
    const [socket, setSocket] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const openDropdown = () => setIsDropdownOpen(true);
    const closeDropdown = () => setIsDropdownOpen(false);

    const meetings = [
        { title: 'Piano Lesson', startTime: '5:00 PM', endTime: '6:30 PM' },
        { title: 'Guitar Lesson', startTime: '7:00 PM', endTime: '8:00 PM'},
        { title: 'Piano Lesson', startTime: '5:00 PM', endTime: '6:30 PM' },
        { title: 'Guitar Lesson', startTime: '7:00 PM', endTime: '8:00 PM'},
        { title: 'Piano Lesson', startTime: '5:00 PM', endTime: '6:30 PM' },
        { title: 'Guitar Lesson', startTime: '7:00 PM', endTime: '8:00 PM'},
        { title: 'Piano Lesson', startTime: '5:00 PM', endTime: '6:30 PM' },
        { title: 'Guitar Lesson', startTime: '7:00 PM', endTime: '8:00 PM'},
    ];

    const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const auth = getAuth();

    const makeAuthenticatedRequest = useCallback(async (endpoint, options = {}) => {
        const token = await auth.currentUser.getIdToken(true);
        const response = await fetch(`http://localhost:4000/api/${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
        return response.json();
    }, [auth]);

    const handleMarkAsRead = useCallback(async (chatId) => {
        if (!chatId || !currentUserMongoId) return;
        
        try {
            const updatedChat = await makeAuthenticatedRequest(`chats/${chatId}/read`, {
                method: 'POST'
            });
            
            setChats(prevChats => 
                prevChats.map(chat => 
                    chat._id === chatId ? { ...chat, readBy: updatedChat.readBy } : chat
                )
            );
        } catch (error) {
            console.error('Error marking chat as read:', error);
        }
    }, [makeAuthenticatedRequest, currentUserMongoId]);

    const fetchCurrentUserMongoId = useCallback(async () => {
        try {
            const userData = await makeAuthenticatedRequest('users/current');
            setCurrentUserMongoId(userData._id);
            setCurrentUserInfo(userData);
            setInitialLoading(false);
        } catch (error) {
            console.error('Error fetching user ID:', error);
            setInitialLoading(false);
        }
    }, [makeAuthenticatedRequest]);

    const processChat = useCallback((chat) => {
        if (!chat || !chat.users) return null;
        
        const otherUser = chat.users.find(u => u._id !== currentUserMongoId);
        const lastReadTime = chat.readBy?.find(read => read === currentUserMongoId);
        
        const isUnread = chat.latestMessage && (
            !lastReadTime ||
            new Date(chat.latestMessage.createdAt) > new Date(lastReadTime)
        );

        return {
            ...chat,
            otherUser,
            latestMessage: chat.latestMessage || null,
            displayName: otherUser?.User?.Personal_info?.Username || 
                        otherUser?.User?.Personal_info?.Email || 
                        "Unknown User",
            isUnread
        };
    }, [currentUserMongoId]);

    const fetchChats = useCallback(async () => {
        if (!currentUserMongoId) return;

        try {
            const chatsData = await makeAuthenticatedRequest('chats');
            const processedChats = chatsData
                .filter(chat => chat.users?.length > 1)
                .map(processChat)
                .filter(chat => chat.otherUser)
                .sort((a, b) => {
                    if (!a.latestMessage || !b.latestMessage) return 0;
                    return new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt);
                });

            setChats(processedChats);
        } catch (error) {
            console.error("Chats fetch error:", error);
        }
    }, [currentUserMongoId, makeAuthenticatedRequest, processChat]);

    const handleSearch = useCallback(async () => {
        if (!search) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        try {
            setSearchLoading(true);
            const results = await makeAuthenticatedRequest(`users?search=${search}`);
            setSearchResults(results);
            setShowDropdown(true);
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, [search, makeAuthenticatedRequest]);

    const accessChat = useCallback(async (userId) => {
        try {
            const chatData = await makeAuthenticatedRequest('chats', {
                method: 'POST',
                body: JSON.stringify({ userId })
            });

            if (!chats.find((c) => c._id === chatData._id)) {
                setChats(prev => [processChat(chatData), ...prev]);
            }
            setSelectedChat(chatData);
            setShowDropdown(false);
        } catch (error) {
            console.error("Chat access error:", error);
        }
    }, [chats, makeAuthenticatedRequest, setChats, setSelectedChat, processChat]);

    const handleTyping = useCallback(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        socket?.emit('typing', selectedChat._id);
        setIsTyping(true);

        typingTimeoutRef.current = setTimeout(() => {
            socket?.emit('stop typing', selectedChat._id);
            setIsTyping(false);
        }, TYPING_TIMEOUT);
    }, [socket, selectedChat]);

    const handleMessageReceived = useCallback((newMessage) => {
        if (selectedChat?._id === newMessage.chat._id) {
            setChats(prevChats => 
                prevChats.map(chat =>
                    chat._id === newMessage.chat._id
                        ? {
                            ...chat,
                            messages: chat.messages ? [...chat.messages, newMessage] : [newMessage],
                            latestMessage: newMessage,
                            readBy: chat.readBy?.filter(id => id !== currentUserMongoId) || []
                        }
                        : chat
                )
            );
        } else {
            setChats(prevChats =>
                prevChats.map(chat =>
                    chat._id === newMessage.chat._id
                        ? {
                            ...chat,
                            latestMessage: newMessage,
                            readBy: chat.readBy?.filter(id => id !== currentUserMongoId) || []
                        }
                        : chat
                )
            );
        }
    }, [selectedChat, currentUserMongoId]);

    useEffect(() => {
        if (!currentUserMongoId) return;

        const newSocket = io(ENDPOINT);
        setSocket(newSocket);
        newSocket.emit("setup", currentUserMongoId);

        newSocket.on("message received", handleMessageReceived);
        newSocket.on('typing', () => setIsTyping(true));
        newSocket.on('stop typing', () => setIsTyping(false));

        return () => newSocket.disconnect();
    }, [currentUserMongoId, handleMessageReceived]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) fetchCurrentUserMongoId();
        });
        return () => unsubscribe();
    }, [fetchCurrentUserMongoId]);

    useEffect(() => {
        if (currentUserMongoId) fetchChats();
    }, [currentUserMongoId, fetchChats]);

    useEffect(() => {
        if (selectedChat && currentUserMongoId) {
            handleMarkAsRead(selectedChat._id);
            setChatPartner(selectedChat.users.find(u => u._id !== currentUserMongoId));
        }
    }, [selectedChat, currentUserMongoId, handleMarkAsRead]);

    const getChatPartnerName = useCallback(() => 
        chatPartner?.User?.Personal_info?.Username || 
        chatPartner?.User?.Personal_info?.Email,
    [chatPartner]);

    const getCurrentUserName = useCallback(() => {
        if (initialLoading) {
            return "Loading...";
        }
        return currentUserInfo?.username || "No username set";
    }, [currentUserInfo, initialLoading]);

    //user pfps
    const [profile, setProfile] = useState(null);
    const [email, setEmail] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null)
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

    console.log("selected chat")
    console.log(selectedChat)

    useEffect(() => {
        console.log(email)
        if (email) {
            const fetchUser = async () => {
                try {
                    console.log('/api/users/' + email)
                    const response = await fetch('http://localhost:4000/api/users/' + encodeURIComponent(email));

                    console.log('Response status:', response.status);
                    console.log('Response content-type:', response.headers.get('content-type'));

                    if (response.ok) {
                        console.log(response)
                        const json = await response.json();
                        setProfile(json);
                        console.log(profile)
                        setProfilePicture(json.User.Personal_info.profilePicture  
                                 ? `http://localhost:4000${json.User.Personal_info.profilePicture  }` 
                                 : '/images/user.svg')
                    } else {
                        console.error("Failed to fetch user data");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUser()
        }
    }, [email])  
    //console.log(profile)

    // setProfilePicture(profile.User.Personal_info.profilePicture  
    //     ? `http://localhost:4000${profile.User.Personal_info.profilePicture  }` 
    //     : '/images/user.svg')

    //sdfkjsdkhf
    return (
        <div className='animate__fadeIn animate__animated fade c'> 
            <NavBarPost />
            <div className="contacts-container d">
                <div className="self-contact d">
                    <img src={profilePicture} className="profile-picture d" alt="Profile" />
                    <h3>{getCurrentUserName()}</h3>
                </div>
                <div className="other-contact-containers d">
                    <h3>Messages</h3>
                    <div className="search-bar d">
                        <FaSearch className="search-icon d" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyUp={handleSearch}
                            placeholder="Search by username or email"
                        />
                        {!searchLoading && showDropdown && (
                            <div className="search-results-dropdown d">
                                {searchResults.map((user) => (
                                    <div 
                                        className="searched-user d" 
                                        key={user._id} 
                                        onClick={() => accessChat(user._id)}
                                    >
                                        {user.User.Personal_info.Username || user.User.Personal_info.Email}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {chats.map((chat) => (
                        <Contact 
                            key={chat._id} 
                            chat={chat} 
                            otherUser={chat.otherUser}
                            displayName={chat.displayName}
                            isSelected={selectedChat?._id === chat._id}
                            onClick={() => {
                                setSelectedChat(chat);
                                handleMarkAsRead(chat._id);
                            }}
                            currentUserId={currentUserMongoId}
                        />
                    ))}
                </div>
            </div>
            <div className="messages-container d">
                {/* <div className="messages-header d">
                    <div className="messages-header-section">
                        <img src="/images/user.png" className="profile-picture d" alt="User" />
                        {getChatPartnerName()}
                    </div>
                    <button onClick={openDropdown} className="messages-header-button">
                            <img src={"/images/meeting.svg"} alt="meeting" className="messages-header-button" draggable="false"/></button>
                        {isPopupOpen && <MeetingForm onClose={closePopup} />}
                        {isDropdownOpen && (
                            <MeetingDropdown
                                meetings={meetings}
                                onClose={closeDropdown}
                                onCreateMeeting={openPopup}
                            />
                        )}
                    {isTyping && <span className="typing-indicator d">Typing...</span>}
                </div> */}
                <Chat 
                    socket={socket} 
                    isTyping={isTyping} 
                    onTyping={handleTyping}
                    selectedChat={selectedChat}
                />
            </div>
        </div>
    );
};

export default Messages;