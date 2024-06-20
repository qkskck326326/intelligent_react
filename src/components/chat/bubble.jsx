import React, {useState, useRef, useEffect} from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import AuthStore from "../../stores/authStore";
import styles from '../../styles/chatting/chatbubble.module.css'

const Bubble = observer(({index, onAnnouncementChange, onReport, option, message})=>{

    const [isMe, setIsMe] = useState(AuthStore.getNickname() === message.senderId) //여기에 조건 바로 넣어서 쓰면 될 듯
    const [isThereMedia, setIsThereMedia] = useState(false)
    const [isEachSettingOn, setIsEachSettingOn] = useState(false)
    const eachSettingsRef = useRef();
    const textRef = useRef();

    useEffect(() => {
        if (isEachSettingOn) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isEachSettingOn]);

    function handleAnnouncement(){
        onAnnouncementChange(message.messageId, message.roomId);
    }

    const handleEachReport = () => {
        onReport(index, isMe)
    }

    const handleClickOutside = (event) => {
        if (eachSettingsRef.current && !eachSettingsRef.current.contains(event.target)) {
            setIsEachSettingOn(false);
        }
    };

    return (
        <div className={`${styles.bubbleWrapper} ${ isMe && styles.reverseBubbleWrapper}`}>
            <div className={`${styles.eachBubble} ${ isMe && styles.reverseEachBubble}`}>
                {/* TODO 강사일 경우 강사의 페이지 이동기능도 필요할듯? */}
                { !isMe &&
                    <div className={styles.profile}>
                        <img src={message.senderProfileImageUrl || ''} alt="Profile" />
                    </div>

                }

                <div className={styles.main}>

                    { !isMe &&
                        <div className={styles.nickname}>
                            {
                                option === 'gpt' ? '인텔리봇' : message.senderId
                            }

                        </div>
                    }

                    <div className={styles.content} ref={textRef}>
                        {   message.messageContent !== null ?
                            message.messageContent
                            :
                            <div className={styles.imgContainer}>
                                {message.files.map((file, index) => (
                                    <img
                                        key={index}
                                        className={styles.img}
                                        src={`http://localhost:8080/${file.fileURL.replace(/\\/g, '/')}`}
                                        alt={file.originalName}
                                    />
                                ))}
                            </div>
                        }
                    </div>
                </div>
                <div className={`${styles.end} ${isMe ? styles.reverseEnd : ''}`}>
                    <div className={styles.howManyRead}>
                        {message.readCount}
                    </div>
                    <div className={styles.time}>
                        {new Date(message.dateSent).toLocaleTimeString('ko-KR').slice(0, -3)}
                    </div>
                </div>
                { option !== 'gpt' &&
                    <div
                        className={styles.eachSettings}
                        onClick={() => setIsEachSettingOn(!isEachSettingOn)}
                        ref={eachSettingsRef} >
                        <svg xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512">
                            <path
                                d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/>
                        </svg>
                        <ul className={`${styles.settingDropdown} ${!isEachSettingOn && commonStyles.hidden} ${isMe && styles.settingDropDown2}` }>
                            { !isMe &&
                                <li onClick={handleEachReport}>신고하기</li>
                            }
                            {/*TODO 온클릭을 위에서 내려줘야함*/}
                            <li onClick={handleAnnouncement}>공지등록</li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    );
})

export default Bubble;