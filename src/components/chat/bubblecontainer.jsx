import React, {forwardRef} from 'react';
import Bubble from './bubble.jsx'
import styles from '../../styles/chatting/chatbubble.module.css'

const BubbleContainer = forwardRef(({onAnnouncementChange, onReport, option, messages, onScroll, onUpdateMessage, isThereAdmin}, ref)=>{

    return (
        <div ref={ref} className={styles.bubbleContainer} onScroll={onScroll}>
            {
                messages.map((message, idx) => (
                    <Bubble
                        key={message.messageId}
                        index={idx}
                        message={message}
                        option={option}
                        onAnnouncementChange={onAnnouncementChange}
                        isThereAdmin={isThereAdmin}
                    />
                ))
            }
        </div>
    );
});

export default BubbleContainer;