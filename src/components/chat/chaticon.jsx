import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import styles from '../../styles/chatting/chaticon.module.css'
import commonStyles from '../../styles/chatting/chatcommon.module.css';

const ChatIcon = observer(({ isHidden, isExpanding, onNavigate, onCountTotal, userId, userType }) => {

    const [totalCount, setTotalCount] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNavigate(userId, userType);
            setIsAnimating(false);
        }, 500);
    };

    useEffect(() => {

        onCountTotal().then(data => setTotalCount(data))
        console.log(totalCount)

    }, []);

    return (
        <div className={`${styles.chaticonContainer} ${isAnimating && commonStyles.animateCollapse} ${isHidden && commonStyles.hidden} ${isExpanding && commonStyles.animateExpand}`} onClick={handleClick}>
            <svg className={styles.chaticon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z"/>
            </svg>
            {totalCount > 0 && <div className={styles.chaticonNotification}>{totalCount}</div>}
        </div>
    );
});

export default ChatIcon;