import React, {forwardRef} from 'react';
import Bubble from './bubble.jsx'
import styles from '../../styles/chatting/chatbubble.module.css'

const BubbleContainer = forwardRef(({onAnnouncementChange, onReport, option, messages, onScroll}, ref)=>{

    return (
        <div ref={ref} className={styles.bubbleContainer} onScroll={onScroll}>
            {
                messages.map((message, index) => (
                    <Bubble
                        key={message.messageId}
                        index={index}
                        message={message}
                        option={option}
                        onAnnouncementChange={onAnnouncementChange}
                        onReport={onReport}
                    />
                ))
            }
        </div>
    );
});

export default BubbleContainer;