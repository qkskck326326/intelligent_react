import React, {useState, useRef, useEffect} from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import AuthStore from "../../stores/authStore";
import styles from '../../styles/chatting/chatbubble.module.css'
import {axiosClient} from "../../axiosApi/axiosClient";

const Bubble = observer(({index, onAnnouncementChange, option, message, isThereAdmin})=>{

    const [isMe] = useState(AuthStore.getNickname() === message.senderId)
    const [isEachSettingOn, setIsEachSettingOn] = useState(false);
    const eachSettingsRef = useRef();
    const textRef = useRef();

    //모달용
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);
    const [images, setImages] = useState([]);

    //isEachSettingOn 설정 모달창이 켜져있을 때 다른 클릭을 잡아내는 글로벌 클릭 핸들러 추가
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
            //마지막 이미지에서 다음버튼 누르면 처음 이미지로 돌아감
            newIndex = 0;
        } else if (newIndex < 0) {
            //처음 이미지에서 이전버튼 누르면 제일 마지막 이미지로 감
            newIndex = images.length - 1;
        }
        setSlideIndex(newIndex);
    };

    const downloadFile = async (fileURL) => {
        try {
            const response = await axiosClient.get(fileURL, {
                responseType: 'blob' //이진 데이터 전용
            });
            const filename = fileURL.substring(fileURL.lastIndexOf('/') + 1);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link =
                document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(`파일 다운로드에 실패하였습니다. ${fileURL}:`, error);
        }
    };

    function handleAnnouncement(){
        onAnnouncementChange(message.messageId, message.roomId);
    }

    const handleEachReport = async () => {

        const reportItem = {
            receiveNickname: message.senderId,
            doNickname: AuthStore.getNickname(),
            content: message.messageContent ? message.messageContent : message.files,
            reportDate: new Date(),
            reportType: 2,
            contentId: message.roomId
        }

        try{
            await axiosClient.post('/reports', reportItem)
        } catch(error){
            console.error(error)
        }

    }

    //이벤트를 확인 해 눌린버튼을 감지해 모달을 지울지 아닐 지 결정
    const handleClickOutside = (event) => {
        if (eachSettingsRef.current && !eachSettingsRef.current.contains(event.target)) {
            setIsEachSettingOn(false);
        }
    };

    const handleDelete = async () => {
        try{
            await axiosClient.put(`/chat/delete/${message.messageId}`)
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
                        {images.length > 1 && <div className={styles.prev} onClick={() => plusSlides(-1)}>&#10094;</div>}
                        {images.length > 1 && <div className={styles.next} onClick={() => plusSlides(1)}>&#10095;</div>}
                        {images.map((image, index) => (
                            <div key={index} style={{ display: index === slideIndex ? 'block' : 'none' }}>
                                <img src={image} alt='' />
                                {index === slideIndex && (
                                    <button className={styles.downloadButton} onClick={() => downloadFile(image)}>
                                        <svg className={styles.downloadIcon} xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 512 512">
                                            <path
                                                d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
                                                fill='white'/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </>
                )}

            </div>
            <div className={`${styles.bubbleWrapper} ${isMe && styles.reverseBubbleWrapper}`}>
                <div className={`${styles.eachBubble} ${isMe && styles.reverseEachBubble}`}>
                    {!isMe &&
                        <div className={styles.profile}>
                            <img src={message.senderProfileImageUrl || ''} alt="Profile"/>
                        </div>
                    }

                    <div className={styles.main}>

                        {!isMe &&
                            <div className={styles.nickname}>
                                {message.senderId}
                            </div>
                        }

                        <div className={styles.content} ref={textRef}>
                            {
                                message.messageContent ?
                                    message.messageContent
                                    :
                                    <div className={styles.imgContainer}>
                                        {message.files.map((file, imgIndex) => (
                                            message.messageType === 1 ?
                                                //TODO 주소 변경시 여기도 변경해야함
                                                <img
                                                    key={imgIndex}
                                                    className={styles.img}
                                                    onClick={() => handleImageClick(imgIndex)}
                                                    src={`http://localhost:8080${file.fileURL}`}
                                                    alt={file.originalName}
                                                />
                                                : message.messageType === 2 ?
                                                    <div className={styles.fileContainer}>
                                                        <img
                                                            key={imgIndex}
                                                            className={styles.img}
                                                            src={`/images/defaultvideoicon.png`}
                                                            alt={file.originalName}
                                                            onClick={() => downloadFile(file.fileURL)}
                                                        />
                                                        <div className={styles.fileDetail}>
                                                            <div className={styles.fileName}>{file.originalName}</div>
                                                            {(file.fileSize / 1048576.0).toFixed(2)} MB
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className={styles.fileContainer}>
                                                        <img
                                                            key={imgIndex}
                                                            className={styles.img}
                                                            src={`/images/defaultfileicon.png`}
                                                            alt={file.originalName}
                                                            onClick={() => downloadFile(file.fileURL)}
                                                        />
                                                        <div className={styles.fileDetail}>
                                                            <div className={styles.fileName}>{file.originalName}</div>
                                                            {(file.fileSize / 1048576.0).toFixed(2)} MB
                                                        </div>
                                                    </div>
                                        ))}
                                    </div>
                            }
                        </div>
                    </div>
                    <div className={`${styles.end} ${isMe ? styles.reverseEnd : ''}`}>
                        <div className={styles.time}>
                            {new Date(message.dateSent).toLocaleTimeString('ko-KR').slice(0, -3)}
                        </div>
                    </div>
                    {message.messageContent !== '삭제된 메시지입니다․' &&

                        <div
                            className={styles.eachSettings}
                            onClick={() => setIsEachSettingOn(!isEachSettingOn)}
                            ref={eachSettingsRef}>

                            {!isThereAdmin &&
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