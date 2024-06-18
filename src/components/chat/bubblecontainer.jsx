import React, {useEffect, useState} from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import AuthStore from "../../stores/authStore";
import Bubble from './bubble.jsx'
import styles from '../../styles/chatting/chatbubble.module.css'

const BubbleContainer = observer(({onAnnouncementChange, onReport, option, messages, bubbleContainerRef})=>{

    messages.map((message) => {
        console.log(message)
        console.log(message.messageId)
    })

    return (
        <div ref={bubbleContainerRef} className={styles.bubbleContainer}>
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