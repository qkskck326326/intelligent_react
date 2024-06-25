import React, {forwardRef, useEffect} from 'react';
import Bubble from './bubble.jsx'
import styles from '../../styles/chatting/chatbubble.module.css'

const BubbleContainer = forwardRef(({onAnnouncementChange, onReport, option, messages, onScroll, onUpdateMessage}, ref)=>{

    useEffect(()=>{
        console.log(messages)
    },[])
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
                        onReport={onReport}
                    />
                ))
            }
        </div>
    );
});

export default BubbleContainer;