import React, { useState } from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';

const ActionModal = observer(({ isExpanding, onNavigateToFriends, onNavigateToChat }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClickBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNavigateToFriends();
            setIsAnimating(false);
        }, 500);
    };

    return (
        <div className={`${commonStyles.actionModalContainer} ${isAnimating ? commonStyles.animateCollapse : ''} ${isExpanding ? commonStyles.animateExpand : ''}`}>
            <button onClick={handleClickBack}>Back to Add Friends</button>
            <button onClick={onNavigateToChat}>Proceed to Chat</button>
        </div>
    );
});

export default ActionModal;
