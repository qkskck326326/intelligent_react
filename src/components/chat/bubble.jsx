import React, {useState, useRef, useEffect} from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import AuthStore from "../../stores/authStore";
import styles from '../../styles/chatting/chatbubble.module.css'
import {axiosClient} from "../../axiosApi/axiosClient";

const Bubble = observer(({index, onAnnouncementChange, onReport, option, message, onUpdateMessage})=>{

    const [isMe, setIsMe] = useState(AuthStore.getNickname() === message.senderId) //여기에 조건 바로 넣어서 쓰면 될 듯
    const [isThereMedia, setIsThereMedia] = useState(false)
    const [isEachSettingOn, setIsEachSettingOn] = useState(false);
    const [deletion, setDeletion] = useState(false);
    const eachSettingsRef = useRef();
    const textRef = useRef();

    //모달용
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);
    const [images, setImages] = useState([]);

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

    const handleImageClick = (imgIndex) => {
        setImages(message.files.map(file => `http://localhost:8080${file.fileURL}`));
        setSlideIndex(imgIndex);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const plusSlides = (n) => {
        let newIndex = slideIndex + n;
        if (newIndex >= images.length) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = images.length - 1;
        }
        setSlideIndex(newIndex);
    };


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

    const handleDelete = async () => {
        console.log(message.messageId)
        try{
            const response = await axiosClient.put(`/chat/delete/${message.messageId}`)
            const updatedMessage = await response.data;
            console.log('Updated message from backend:', updatedMessage);
            onUpdateMessage(updatedMessage);
            setDeletion(true)
        } catch(error){
            console.error(error)
        }
    }

    return (
        <>
            <div className={`${commonStyles.actionModalContainer} ${!isModalOpen && commonStyles.hidden}`}>
                {isModalOpen && (
                    <>
                        <span className={styles.close} onClick={closeModal}>&times;</span>
                        {images.length > 1 && <a className={styles.prev} onClick={() => plusSlides(-1)}>&#10094;</a>}
                        {images.length > 1 && <a className={styles.next} onClick={() => plusSlides(1)}>&#10095;</a>}
                        {images.map((src, index) => (
                            <img
                                key={index}
                                className="modal-content"
                                src={src}
                                style={{ display: index === slideIndex ? 'block' : 'none' }}
                            />
                        ))}
                    </>
                )}
            </div>
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
                            {  ! deletion ?
                                message.messageContent ?
                                 message.messageContent
                                :
                                <div className={styles.imgContainer}>
                            {message.files.map((file, imgIndex) => (
                                //TODO 그냥 땜빵만 해둠

                                message.messageType === 1 ?
                                    <img
                                        key={imgIndex}
                                        className={styles.img}
                                        onClick={() => handleImageClick(imgIndex)}
                                        src={`http://localhost:8080${file.fileURL}`}
                                        alt={file.originalName}
                                    />
                                    : message.messageType === 2 ?
                                        <img
                                            key={imgIndex}
                                            className={styles.img}
                                            src={`/images/defaultvideoicon.png`}
                                            alt={file.originalName}
                                        />
                                        :
                                        <img
                                            key={imgIndex}
                                            className={styles.img}
                                            src={`/images/defaultfileicon.png`}
                                            alt={file.originalName}
                                        />
                            ))}
                        </div>
                        : '삭제된 메시지입니다.'
                            }
                        </div>
                    </div>
                    <div className={`${styles.end} ${isMe ? styles.reverseEnd : ''}`}>
                        <div className={styles.howManyRead}>
                            {message.messageContent !== '삭제된 메시지입니다․' &&
                                message.readCount
                            }
                        </div>
                        <div className={styles.time}>
                            {new Date(message.dateSent).toLocaleTimeString('ko-KR').slice(0, -3)}
                        </div>
                    </div>
                    { (option !== 'gpt') && (message.messageContent !== '삭제된 메시지입니다․') &&

                        <div
                            className={styles.eachSettings}
                            onClick={() => setIsEachSettingOn(!isEachSettingOn)}
                            ref={eachSettingsRef} >

                            { !deletion &&
                                <svg xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 448 512">
                                <path
                                    d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/>
                                </svg>
                            }

                                <ul
                                className={`${styles.settingDropdown} ${!isEachSettingOn && commonStyles.hidden} ${isMe && styles.settingDropDown2}`}>
                                {!isMe &&
                                    <li onClick={handleEachReport}>신고하기</li>
                                }
                                {message.messageContent &&
                                    <li onClick={handleAnnouncement}>공지등록</li>
                                }
                                {isMe &&
                                    <li onClick={handleDelete}>삭제하기</li>
                                }
                            </ul>

                        </div>

                    }
                </div>
            </div>
        </>
    );
})

export default Bubble;