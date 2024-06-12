import React, { useState }from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import styles from '../../styles/chatting/chatlist.module.css'
import EachChat from '../../components/chat/eachchat.jsx';
const ChatList = observer(({isExpanding, onNavigateToFriends, onNavigateToIcon, onNavigateToChat }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPlusClicked, setIsPlusClicked] = useState(false);

    const handleClickBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNavigateToIcon();
            setIsAnimating(false);
        }, 500);
    };

    const handleTurning = () => {
        (isPlusClicked) ? setIsPlusClicked(true) : setIsPlusClicked(false)
    }
    return (
        <div
            className={`${commonStyles.chatServiceContainer} ${isAnimating ? commonStyles.animateCollapse : ''} ${isExpanding ? commonStyles.animateExpand : ''}`}>
            <div className={styles.chatlistTop}>
                <button className={styles.topButtons} onClick={handleClickBack}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                    </svg>
                </button>
                <button className={styles.topButtons} onClick={onNavigateToFriends}>
                    <svg onClick={handleTurning} xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path
                            d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                    </svg>
                </button>
            </div>
            <div className={commonStyles.chatServiceMain}>
                <EachChat />
                <EachChat />
                <EachChat />
                <EachChat />
                <EachChat />
                <EachChat />
                <EachChat />
                <EachChat />
                <EachChat />
                <EachChat />
            </div>



            {/*<button onClick={() => onNavigateToChat('Chat 1')}>Go to Chat 1</button>*/}
            {/*<button onClick={() => onNavigateToChat('Chat 2')}>Go to Chat 2</button>*/}
            {/*<button onClick={() => onNavigateToChat('Chat 3')}>Go to Chat 3</button>*/}
        </div>
    );
});

export default ChatList;
