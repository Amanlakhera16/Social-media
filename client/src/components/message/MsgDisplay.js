import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '../Avatar';
import { imageShow, videoShow } from '../../utils/mediaShow'; 

const MsgDisplay = ({user, msg, theme, data}) => {
    const { auth } = useSelector(state => state);
    const [showTime, setShowTime] = useState(false);

    const handleToggleTime = (e) => {
        e.preventDefault();
        setShowTime(!showTime);
    }

    return (
      <div className="msg_display_container" 
      onClick={() => setShowTime(!showTime)}
      onContextMenu={handleToggleTime}
      style={{cursor: 'pointer'}}>
        
        {user._id !== auth.user._id && (
            <div className="chat_title">
                <Avatar src={user.avatar} size="small-avatar" />
                <span>{user.username}</span>
            </div>
        )}
        
        <div className="you_content">
            {msg.text && (
            <div
                className="chat_text"
                style={{ filter: theme ? "invert(1)" : "invert(0)" }}
            >
                {msg.text}
            </div>
            )}

            {msg.media &&
            msg.media.map((item, index) => (
                <div key={index} style={{maxWidth: '380px', maxHeight: '380px'}}>
                {item.url.match(/video/i)
                    ? videoShow(item.url, theme)
                    : imageShow(item.url, theme)}
                </div>
            ))}
        </div>

        {showTime && (
            <div className="chat_time">
                {new Date(msg.createdAt).toLocaleString()}
            </div>
        )}
      </div>
    );
}

export default MsgDisplay;
