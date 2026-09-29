import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MeetingForm.css';
import './MeetingDropdown.css';

const MeetingDropdown = ({ onClose, onCreateMeeting, chatID }) => {
    const [meetings, setMeetings] = useState([]);
    const dropdownRef = useRef(null);

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            onClose();
        }
    };

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/users/get/meetings/${chatID}`,{
                    method:'GET',
                });
                if (!response.ok) {
                    throw new Error('HTTP error, staus: ${response.status)');
                }
                const data = await response.json();
                setMeetings(data);
            } catch (error) {
                console.error("Error fetching meetings:", error);
            }
        };
        fetchMeetings();

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatStartDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatEndDate = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };

    return (
        <div ref={dropdownRef} className="dropdown-container">
            <div className="dropdown-header">
                Meetings
                <button onClick={onCreateMeeting} className="messages-header-button"><img src={"/images/add.svg"} alt="add" className="messages-header-button" draggable="false"/></button>
                </div>
            <div className="dropdown-scroll-container"> {/* New scroll container */}
                {meetings.length > 0 ? (
                    <ul className="meeting-list">
                        {meetings.map((meeting, index) => (
                            <li key={index} className="meeting-item">
                                <div className="meeting-title">{meeting.meetingTopic}</div>
                                <div className="align-right">
                                    <Link to={meeting.meetingUrl} className="join-button">Join</Link>
                                </div>
                                <div className="meeting-time">{formatStartDate(meeting.meetingStartTime)} - {formatEndDate(meeting.meetingEndTime)}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="empty-dropdown">No meetings scheduled.</div>
                )}
            </div>
        </div>
    );
};

export default MeetingDropdown;
