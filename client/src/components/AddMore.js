import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { BASE_URL } from '../utils/config';

const CATEGORIES = [
    { label: "Memes", emoji: "😂", tag: "MEME" },
    { label: "News", emoji: "📰", tag: "NEWS" },
    { label: "Inspire", emoji: "✨", tag: "MOTIVATIONAL" },
    { label: "Sports", emoji: "🏀", tag: "SPORTS" },
    { label: "Jobs", emoji: "💼", tag: "JOBS" },
    { label: "Science", emoji: "🧪", tag: "Science" },
    { label: "Tech", emoji: "💻", tag: "Technology" },
    { label: "Health", emoji: "🏥", tag: "Health" },
    { label: "Travel", emoji: "✈️", tag: "Travel" },
    { label: "Music", emoji: "🎵", tag: "Music" }
];

const AddMore = () => {
    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if(auth.user.interests) {
            setSelected(auth.user.interests);
        }
    }, [auth.user.interests]);

    const handleToggle = async (tag) => {
        let newSelected = [...selected];
        if(newSelected.includes(tag)) {
            newSelected = newSelected.filter(i => i !== tag);
        } else {
            newSelected.push(tag);
        }
        
        setSelected(newSelected);

        try {
            await axios.patch(`${BASE_URL}/api/update_interests`, { interests: newSelected }, {
                headers: { Authorization: auth.token }
            });
            
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: {
                    ...auth,
                    user: {
                        ...auth.user,
                        interests: newSelected
                    }
                }
            });

            // Show success message if needed
            // dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: err.response.data.msg }
            });
        }
    };

    return (
        <div className="add_more_section" id="add_more_section">
            <h4 className="add_more_header">✨ Add More to Your Feed</h4>
            <p className="text-center text-muted mb-4" style={{fontSize: '0.9rem', marginTop: '-15px'}}>
                Select categories to customize your discovery experience
            </p>
            
            <div className="category_grid">
                {CATEGORIES.map((cat, index) => (
                    <div 
                        key={index} 
                        className={`category_card ${selected.includes(cat.tag) ? 'active' : ''}`}
                        onClick={() => handleToggle(cat.tag)}
                    >
                        <span className="category_icon">{cat.emoji}</span>
                        <span className="category_name">{cat.label}</span>
                        <button className={`add_btn ${selected.includes(cat.tag) ? 'active' : ''}`}>
                            {selected.includes(cat.tag) ? '✓ Added' : '+ Add'}
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="text-center mt-4">
                <button className="btn btn-sm text-muted" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    Back to top ↑
                </button>
            </div>
        </div>
    );
};

export default AddMore;
