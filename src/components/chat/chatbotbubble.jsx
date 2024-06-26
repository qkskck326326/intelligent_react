import React, {useState, useRef, useEffect} from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import AuthStore from "../../stores/authStore";
import styles from '../../styles/chatting/chatbubble.module.css'
import {axiosClient} from "../../axiosApi/axiosClient";

const BotBubble = observer(({message})=>{

    const [isMe, setIsMe] = useState(message.userId === 'user')
    const textRef = useRef();

    useEffect(()=>{
        console.log();
    },[])

    const containsHTML = /<\/?[a-z][\s\S]*>/i.test(message.message);

    return (
        <>
            <div className={`${styles.bubbleWrapper} ${isMe && styles.reverseBubbleWrapper}`}>
                <div className={`${styles.eachBubble} ${isMe && styles.reverseEachBubble}`}>

                    {!isMe &&
                        <div className={styles.profile}>
                            <img src="/images/logo.png" alt="Profile"/>
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
                                <div dangerouslySetInnerHTML={{ __html: message.message }} />
                            ) : (
                                message.message
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
})

export default BotBubble;