import React, { useState, useEffect, useRef } from 'react';
import "./MeetingForm.css"

const MeetingForm = ({ onClose, chatID}) => {
    const [meetingDetails, setMeetingDetails] = useState({
        title: '',
        startTime: '',
        endTime: ''
        // chatID: ''   - implement later
    });

    const [isVisible, setIsVisible] = useState(true);
    const popupRef = useRef(null);
    
    const closeWithAnimation = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMeetingDetails((prev) => ({ ...prev, [name]: value }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Meeting created:', meetingDetails);
    console.log(meetingDetails.title, meetingDetails.startTime, meetingDetails.endTime);
    
    try {
        const response = await fetch('http://localhost:4000/api/users/createMeeting', {
            method: 'POST',
            body: JSON.stringify({
                chatID: chatID.toString(),  //i need chatID from thr specific chat
                meetingTopic: meetingDetails.title,
                meetingStartTime: meetingDetails.startTime.toString(),
                meetingEndTime: meetingDetails.endTime.toString()
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        onClose();
    } catch (error) {
        console.error('Error creating meeting:', error);
    }
};
    
    const handleOutsideClick = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
          closeWithAnimation(); // Close popup if clicked outside
        }
      };
    
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick); // Listen for clicks
    
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick); // Cleanup on unmount
        };
      }, []);

    return (
        <div className={`popup-full ${isVisible ? 'popup-enter' : 'popup-exit'}`}>
            <div className="popup-window" ref={popupRef}>
                <div className="popup-header">Schedule a meeting</div>
                <form onSubmit={handleSubmit}>
                    <input className="edit-input" 
                    type="text" 
                    name="title" 
                    value={meetingDetails.title}
                    onChange={handleChange}
                    placeholder='Title'
                    required
                    />
                    <input className="edit-input" 
                    type="datetime-local" 
                    name="startTime" 
                    value={meetingDetails.startTime}
                    onChange={handleChange}
                    required
                    />
                    <input className="edit-input" 
                    type="datetime-local" 
                    name="endTime" 
                    value={meetingDetails.endTime}
                    onChange={handleChange}
                    required
                    />
                    
                    <button type="submit" className="popup-submit-solid">Create meeting</button>
                    <button type="button" className="popup-submit-hollow" onClick={closeWithAnimation}>Cancel</button>
                </form>
            </div>
        </div>
    )
}

export default MeetingForm;