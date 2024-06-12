import React, { useState } from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';

const AddingFriends = observer(({ isExpanding, onNavigateToList, onNavigateToModal, onNavigateToChat }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClickBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNavigateToList();
            setIsAnimating(false);
        }, 500);
    };

    return (
        <div className={`${commonStyles.chatServiceContainer} ${isAnimating ? commonStyles.animateCollapse : ''} ${isExpanding ? commonStyles.animateExpand : ''}`}>
            <button onClick={handleClickBack}>채팅리스트로</button>
            <button onClick={onNavigateToModal}>모달창진입</button>
            <button onClick={onNavigateToChat}>인텔리챗봇</button>
        </div>
    );
});

export default AddingFriends;