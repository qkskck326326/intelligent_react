import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import styles from '../../styles/chatting/chatbubble.module.css';

const BotBubble = observer(({ message }) => {

    const [isMe, setIsMe] = useState(message.userId === 'user');
    const textRef = useRef();

    const sanitizeHTML = (input) => {
        const element = document.createElement('div');
        element.innerText = input;
        return element.innerHTML;
    };

    const isHTML = (str) => /<\/?[a-z][\s\S]*>/i.test(str);
    const containsHTML = isHTML(message.message);

    const getMessageContent = () => {
        if (isMe && containsHTML) {
            return sanitizeHTML(message.message);
        }
        return message.message;
    };

    const messageContent = getMessageContent();

    return (
        <>
            <div className={`${styles.bubbleWrapper} ${isMe && styles.reverseBubbleWrapper}`}>
                <div className={`${styles.eachBubble} ${isMe && styles.reverseEachBubble}`}>

                    {!isMe &&
                        <div className={styles.profile}>
                            <img src="/images/logo.png" alt="Profile" />
                        </div>
                    }

                    <div className={styles.main}>

                        {!isMe &&
                            <div className={styles.nickname}>
                                인텔리봇
                            </div>
                        }

                        <div className={styles.content} ref={textRef}>
                            {containsHTML ? (
                                <div dangerouslySetInnerHTML={{ __html: messageContent }} />
                            ) : (
                                messageContent
                            )}
                        </div>
                    </div>
                    <div className={`${styles.end} ${isMe && styles.reverseEnd}`}>
                        <div className={styles.time}>
                            {new Date().toLocaleTimeString('ko-KR').slice(0, -3)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default BotBubble;
