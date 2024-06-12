import React, { useState } from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';

const Chat = observer(({ chatOption, isExpanding, onNavigateToIcon }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClickBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNavigateToIcon();
            setIsAnimating(false);
        }, 500);
    };

    return (
        <div
            className={`${commonStyles.chatContainer} ${isAnimating ? commonStyles.animateCollapse : ''} ${isExpanding ? commonStyles.animateExpand : ''}`}>
            <button onClick={handleClickBack}>Back to Chat Icon</button>
            <button>{chatOption}</button>
        </div>
    );
});

export default Chat;
