import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Chat.css';
import MeetingForm from '../MessagePopups/MeetingForm'
import MeetingDropdown from '../MessagePopups/MeetingDropdown';
import { ChatState } from '../../context/ChatProvider';
import { getAuth } from 'firebase/auth';

function Chat({ socket, socketConnected, otherUser }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [chatPartner, setChatPartner] = useState(null);
    const [currentUserMongoId, setCurrentUserMongoId] = useState(null);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const messageWindowRef = useRef(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { selectedChat } = ChatState();

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const openDropdown = () => setIsDropdownOpen(true);
    const closeDropdown = () => setIsDropdownOpen(false);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const getChatPartnerName = useCallback(() => 
        chatPartner?.User?.Personal_info?.Username || 
        chatPartner?.User?.Personal_info?.Email
    [chatPartner]);

    const sendMessage = useCallback(async (event) => {
        if (event.key === 'Enter' && newMessage) {
            console.log(`Attempting to send message: ${newMessage}`);
            socket?.emit('stop typing', selectedChat._id);
            try {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken(true);

                setNewMessage('');
                const response = await fetch('http://localhost:4000/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content: newMessage, chatId: selectedChat._id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to send message');
                }

                const messageData = await response.json();
                console.log("Message sent successfully:", messageData);
                socket?.emit('new message', messageData);
                setMessages(prevMessages => [...prevMessages, messageData]);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    }, [newMessage, selectedChat, socket]);

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            console.log(`Emitting 'typing' event for chat: ${selectedChat._id}`);
            socket?.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        const timerLength = 3000;
        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                console.log(`Emitting 'stop typing' event for chat: ${selectedChat._id}`);
                socket?.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    const fetchMessages = useCallback(async () => {
        if (!selectedChat) return;
        try {
            setLoading(true);
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken(true);

            const response = await fetch(`http://localhost:4000/api/messages/${selectedChat._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }

            const messagesData = await response.json();
            console.log(`Fetched ${messagesData.length} messages for chat: ${selectedChat._id}`);
            setMessages(messagesData);
            setLoading(false);
            socket?.emit('join chat', selectedChat._id);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [selectedChat, socket]);

    useEffect(() => {
        if (socket) {
            socket.on('message received', (newMessageReceived) => {
                console.log("New message received:", newMessageReceived);
                if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
                    return;
                }
                setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
            });

            socket.on('typing', () => {
                console.log(`Typing event received for chat: ${selectedChat._id}`);
                setIsTyping(true);
            });
            socket.on('stop typing', () => {
                console.log(`Stop typing event received for chat: ${selectedChat._id}`);
                setIsTyping(false);
            });

            return () => {
                socket.off('message received');
                socket.off('typing');
                socket.off('stop typing');
            };
        }
    }, [socket, selectedChat]);

    const fetchCurrentUserMongoId = useCallback(async () => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken(true);

            const response = await fetch('http://localhost:4000/api/users/current', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch current user info');
            }

            const userData = await response.json();
            setCurrentUserMongoId(userData._id);
        } catch (error) {
            console.error('Error fetching current user MongoDB ID:', error);
        }
    }, []);

    useEffect(() => {
        if (selectedChat && currentUserMongoId) {
            setChatPartner(selectedChat.users.find(u => u._id !== currentUserMongoId));
        }
    }, [selectedChat, currentUserMongoId]);

    useEffect(() => {
        fetchCurrentUserMongoId();
        fetchMessages();
    }, [selectedChat, fetchCurrentUserMongoId, fetchMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const isCurrentUserMessage = useCallback((message) => {
        return message.sender?._id === currentUserMongoId;
    }, [currentUserMongoId]);

    // const meetings = [
    //     { title: 'Piano Lesson', startTime: '5:00 PM', endTime: '6:30 PM' },
    //     { title: 'Guitar Lesson', startTime: '7:00 PM', endTime: '8:00 PM'},
    //     { title: 'Piano Lesson', startTime: '5:00 PM', endTime: '6:30 PM' },
    //     { title: 'Guitar Lesson', startTime: '7:00 PM', endTime: '8:00 PM'},
    //     { title: 'Piano Lesson', startTime: '5:00 PM', endTime: '6:30 PM' },
    //     { title: 'Guitar Lesson', startTime: '7:00 PM', endTime: '8:00 PM'},
    //     { title: 'Piano Lesson', startTime: '5:00 PM', endTime: '6:30 PM' },
    //     { title: 'Guitar Lesson', startTime: '7:00 PM', endTime: '8:00 PM'},
    // ];

    const [profilePictureUrl, setProfilePictureUrl] = useState(null)
    useEffect(() => {
        if (chatPartner && chatPartner.User?.Personal_info?.profilePicture) {
            setProfilePictureUrl(`http://localhost:4000${chatPartner.User.Personal_info.profilePicture}`);
        } else {
            setProfilePictureUrl('/images/user.svg'); 
        }
    }, [chatPartner]);

    return (
        <div className="chat-container">
            <div className="messages-header d">
                    <div className="messages-header-section">
                        <img src={profilePictureUrl} className="profile-picture d" alt="User" />
                        {getChatPartnerName()}
                    </div>
                    <button onClick={openDropdown} className="messages-header-button">
                            <img src={"/images/meeting.svg"} alt="meeting" className="messages-header-button" draggable="false"/></button>
                        {isPopupOpen && <MeetingForm onClose={closePopup} chatID={selectedChat._id}/>}
                        {isDropdownOpen && (
                            <MeetingDropdown
                                // meetings={meetings}
                                onClose={closeDropdown}
                                onCreateMeeting={openPopup}
                                chatID={selectedChat._id}
                            />
                        )}
                    {isTyping && <span className="typing-indicator d">Typing...</span>}
                </div>
            <div className="message-window" ref={messageWindowRef}>
                <div className="visible-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message-row ${isCurrentUserMessage(message) ? "self-message-row" : "other-message-row"}`}>
                            <div className={`message-box ${isCurrentUserMessage(message) ? "self-message-box" : "other-message-box"}`}>
                                {message.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="chat-box">
                {isTyping && <div>Typing...</div>}
                <input
                    onKeyDown={sendMessage}
                    type="text"
                    id="text"
                    placeholder="Message..."
                    autoComplete="off"
                    onChange={typingHandler}
                    value={newMessage}
                />
            </div>
        </div>
    );
}

export default Chat;