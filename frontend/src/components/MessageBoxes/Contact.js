import React, { useEffect, useState } from 'react';
import { format, differenceInDays, set } from 'date-fns';
import './Contact.css';

const Contact = ({ chat, otherUser, displayName, isSelected, onClick, currentUserId }) => {
    //console.log(otherUser)
    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const daysDifference = differenceInDays(now, date);

            if (daysDifference === 0) {
                return format(date, 'h:mm a');
            } else if (daysDifference === 1) {
                return 'Yesterday';
            } else if (daysDifference < 7) {
                return format(date, 'EEEE');
            } else {
                return format(date, 'MM/dd/yyyy');
            }
        } catch (error) {
            console.error('Error formatting time:', error);
            return '';
        }
    };

    const isUnread = () => {
        if (!chat?.latestMessage) return false;

        const hasRead = chat.readBy?.includes(currentUserId);
        return !hasRead;
    };

    const name = displayName || 
                 otherUser?.User?.Personal_info?.Username || 
                 otherUser?.User?.Personal_info?.Email || 
                 "Unknown User";

    const messagePreview = chat?.latestMessage?.content || '';
    const messageTime = chat?.latestMessage?.createdAt 
        ? formatMessageTime(chat.latestMessage.createdAt)
        : '';

    const [profilePictureUrl, setProfilePictureUrl] = useState(null)

    useEffect(() => {
        if (otherUser && otherUser.User?.Personal_info?.profilePicture) {
            setProfilePictureUrl(`http://localhost:4000${otherUser.User.Personal_info.profilePicture}`);
        } else {
            setProfilePictureUrl('/images/user.svg'); 
        }
    }, [otherUser]);

    console.log(otherUser.User?.Personal_info?.profilePicture)

    return (
        <div className={isSelected ? "selected-contact" : "contact"} onClick={onClick}>
            <div className="contact-left">
                <img 
                    src={profilePictureUrl} 
                    className="small-profile-picture" 
                    alt={name} 
                />
            </div>
            <div className="contact-center">
                <h3 className="contact-name">{name}</h3>
                {messagePreview && (
                    <p className="message-preview">
                        {messagePreview.length > 30 
                            ? messagePreview.substring(0, 30) + '...' 
                            : messagePreview}
                    </p>
                )}
            </div>
            <div className="contact-right">
                {messageTime && (
                    <span className="message-time">{messageTime}</span>
                )}
            </div>
            {!isSelected && isUnread() && (
                <div className="unread-indicator"></div>
            )}
        </div>
    );
};

export default Contact;