import React, {useEffect, useRef, useState} from 'react';
// import {stompClient} from './websocketService';
import webSocketService from "./WebSocketService";
import {observer} from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import styles from '../../styles/chatting/chat.module.css'
import BubbleContainer from "./bubblecontainer.jsx";
import AuthStore from "../../stores/authStore";
import MediaFile from "./mediafiles.jsx";
import AlertModal from "../common/Modal";
import {axiosClient} from "../../axiosApi/axiosClient";


const Chat = observer(({option, isExpanding, onNavigateToList, roomData}) => {

    const [isThereAdmin, setIsThereAdmin] = useState(roomData.roomType === 'inquiries');
    const [currentRoomData, setCurrentRoomData] = useState(roomData);
    const [people, setPeople] = useState({});
    const [isPeopleOn, setIsPeopleOn] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [announceExpand, setAnnounceExpand] = useState(false);
    const [isAnnounceHidden, setIsAnnounceHidden] = useState(false)
    const [isMenuClicked, setIsMenuClicked] = useState(false);
    const [items, setItems] = useState([])
    const [isAttachButtonClicked, setIsAttachButtonClicked] = useState(false);
    const [textContent, setTextContent] = useState('');
    const fileInputRef = useRef(null);
    const [modalOn, setModalOn] = useState(false);
    const [alertMessage, setAlertMessage] = useState('')
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [userData, setUserData] = useState({});
    const modal = new AlertModal();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [announce, setAnnounce] = useState('') //받아온 정보 넣어야함
    const [messages, setMessages] = useState([]);
    const bubbleContainerRef = useRef();
    const menuRef = useRef();
    // const isChatRoomActive = useRef(true);

//todo
    const fetchData = async () => {
        console.log(roomData.roomType)
        try {
            const response = await axiosClient.get('/chat/chatdata', {
                params: {
                    roomId: roomData.roomId,
                    page: page,
                    userId: AuthStore.getNickname()
                }
            });

            const data = response.data;

            if (data.messages) {
                setMessages((prevMessages) => [...data.messages.reverse(), ...prevMessages]);
                if (data.messages.length < 25) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }

            if (data.announcement) {
                setAnnounce(data.announcement.messageContent);
            }
        } catch (error) {
            console.error('An error occurred', error);
        }

        try{
            const response = await axiosClient.get(`/chat/people?roomId=${roomData.roomId}`)
            const data = response.data;

            setPeople(data);

        } catch(error){
            console.error('An error occurred!', error);
        }
    };

    useEffect(() => {
        document.addEventListener('keypress', handleKeyPress);

        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, []);

    useEffect(() => {

        fetchData();

        if (isAtBottom) {
            scrollToBottom();
        }

        // // isChatRoomActive.current = true;
        //
        // return () => {
        //     // Set the chat room as inactive when the component unmounts
        //     // isChatRoomActive.current = false;
        // };

    }, [page, roomData.roomId]);

    useEffect(() => {
        axiosClient.get('/chat/chatuserdetail', {
            params: {
                userId: AuthStore.getNickname(),
                roomId: roomData.roomId
            }
        })
            .then(response => {
                setUserData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('An error occurred!', error);
            });
    }, []);


    //웹소켓으로 추가
    //랜더링은 얘가 함
    useEffect(() => {
        const handleNewMessage = async (message) => {
            console.log('Received message from WebSocket:', message.body);
            const newMessage = JSON.parse(message.body);
            console.log(newMessage)

            if (newMessage.announcement) {
                setAnnounce(newMessage.messageContent);
                return;
            }

            if (newMessage.roomName) {
                setCurrentRoomData((prevState) => ({
                    ...prevState,
                    roomName: newMessage.roomName
                }));
            } else {
                if (newMessage.messageContent === '삭제된 메시지입니다․') {
                    setMessages(prevMessages => {
                        return prevMessages.map(
                            message => message.messageId === newMessage.messageId ? { ...message, ...newMessage } : message
                        );
                    });
                } else {
                    setMessages((prevMessages) => [...prevMessages, newMessage]);

                    // if (isChatRoomActive.current) {
                    //     await markMessageAsRead(AuthStore.getNickname(), newMessage.roomId, newMessage.messageId);
                    // }
                }
            }
        };

        const topic = `/topic/room/${roomData.roomId}`;
        webSocketService.connect();
        webSocketService.subscribe(topic, handleNewMessage);

        return () => {
            webSocketService.disconnect();
        };
    }, [roomData.roomId]);

    // const markMessageAsRead = async (senderId, roomId, messageId) => {
    //     try {
    //         const response = await axiosClient.post('/chat/markread', {
    //             senderId,
    //             roomId,
    //             messageId
    //         });
    //         console.log('Message marked as read:', response.data);
    //     } catch (error) {
    //         console.error('Error marking message as read:', error);
    //     }
    // };

    const handleScroll = () => {
        const scrollTop = bubbleContainerRef.current.scrollTop;
        const clientHeight = bubbleContainerRef.current.clientHeight;
        const scrollHeight = bubbleContainerRef.current.scrollHeight;

        if (scrollTop === 0) {
            //추가 로직
            if(hasMore){
                setPage((prevPage) => prevPage + 1);
            }
            //패치로직
        }

        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 1);
    };

    const scrollToBottom = () => {
        console.log('스크롤 최하단 작동')
        if (bubbleContainerRef.current) {
            bubbleContainerRef.current.scrollTop = bubbleContainerRef.current.scrollHeight;
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit(event);
    };



    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleFormSubmit(event);
        }
    };

    const handleClickBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNavigateToList();
            setIsAnimating(false);
            setAnnounceExpand(false);
            setIsMenuClicked(false);
            setIsAttachButtonClicked(false);
            setModalOn(false)
            // isChatRoomActive.current = false;

        }, 500);
    };


    const handleAnnounce = () => {
        setAnnounceExpand(!announceExpand);
    }


    const handleMenuClick = () => {
        setIsMenuClicked(!isMenuClicked)
    }

    useEffect(() => {
        if (isMenuClicked) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuClicked]);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuClicked(false);
        }
    };

    const handleAttachButtonClick = (event) => {
        event.preventDefault();
        setIsAttachButtonClicked(!isAttachButtonClicked);
    }

    const determineMessageType = (files) => {
        if (files.some(file => file.type.startsWith('video/'))) {
            return 2; // Video
        } else if (files.some(file => file.type.startsWith('image/'))) {
            return 1; // Image
        } else {
            return 3; // Other
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (items.length > 0) {
            const newMessage = {
                roomId: roomData.roomId,
                senderId: AuthStore.getNickname(),
                messageType: determineMessageType(items),
                dateSent: new Date().toISOString(),
                isAnnouncement: 0
            };

            const formData = new FormData();

            items.forEach((file) => {
                formData.append('files', file);
            });

            const url = `/chat/uploadfiles/${newMessage.roomId}/${newMessage.senderId}/${newMessage.messageType}/${newMessage.dateSent}/${newMessage.isAnnouncement}`;

            try {
                await axiosClient.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setItems([]);

            } catch (error) {
                console.error('Error uploading files:', error);
            }

        } else {
            if (textContent.trim() === '') {
                return window.alert('메시지를 작성해주세요.');
            }

            const newMessage = {
                roomId: roomData.roomId,
                senderId: AuthStore.getNickname(),
                messageContent: textContent,
                messageType: 0,
                dateSent: new Date(),
                isAnnouncement: 0
            };

            try {

                console.log(`submit에서 출발한 메시지 형태 확인`);
                console.log(newMessage);

                await axiosClient.post('/chat/sendmessage', newMessage);
                setTextContent('');
                setIsAtBottom(true);

            } catch (error) {
                console.error('Error sending message:', error);
            }


        }
    };

    const handleFileAttach = (event) => {
        event.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
        setTextContent('');
    };

    const handleModalOn = () => {
        setModalOn(!modalOn)
    }

    const handleAnnouncementChange = (messageId, roomId) => {
    //TODO 아래에서 받은 정보를 여기서 백엔드와 fetch 처리 하고 리랜더링 작업
        axiosClient.put('/chat/announce', {
            messageId: messageId,
            roomId: roomId
        })
            .then(() => {
                setAnnounceExpand(false)
                setIsAnnounceHidden(false)
            })
            .catch(error => {
                console.error('An error occurred!', error);
            });
    }

    const handleRoomTitleName = () => {
        const roomName = window.prompt('변경할 방 제목을 입력해주세요')
        if(roomName !== null){
            axiosClient.put('/chat/changeroomname', {
                roomId: userData.chatUserCompositeKey.roomId,
                roomName: roomName
            })
                .then(() => {})
                .catch(error => {
                    console.error('An error occurred!', error);
                });
        }

    }

    const handlePin = () => {
        const isPinned = (userData.isPinned === 0 ? 1 : 0)
        //TODO
        axiosClient.put('/chat/changepin', {
            userId: userData.chatUserCompositeKey.userId,
            roomId: userData.chatUserCompositeKey.roomId,
            isPinned: isPinned
        })
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('An error occurred!', error);
            });
    }

    const handleLeave = () => {
        window.confirm('혼또니 나가겠습니까?') &&
        axiosClient.delete('/chat/leaveroom', {
            data: {
                userId: userData.chatUserCompositeKey.userId,
                roomId: userData.chatUserCompositeKey.roomId
            }
        })
            .then(() => {
                onNavigateToList();
            })
            .catch(error => {
                console.error('An error occurred!', error);
            });

    }

    const handleReport = (index, isMe) => {
        console.log(index, isMe)
    }

    const handleFileChange = (event) => {

        const newFiles = Array.from(event.target.files);
        const AllFiles = [...items, ...newFiles]
        const images = AllFiles.filter(file => file.type.startsWith('image/'));
        const videos = AllFiles.filter(file => file.type.startsWith('video/'));
        const others = AllFiles.filter(file => !file.type.startsWith('image/') && !file.type.startsWith('video/'));

        if ((images.length > 0 && (videos.length > 0 || others.length > 0)) ||
            (videos.length > 0 && (images.length > 0 || others.length > 0)) ||
            (others.length > 0 && (images.length > 0 || videos.length > 0))) {

            setAlertMessage('사진은 8장까지 첨부가 가능하며 비디오는 1개 파일은 1개만 첨부가 가능합니다.')
            handleModalOn();
            return;
        }

        if (images.length > 8) {

            setAlertMessage('사진은 8장까지만 첨부 가능합니다.')
            handleModalOn();
            return;
        }

        if (videos.length > 1) {
            setAlertMessage('비디오는 하나만 첨부 가능합니다.')
            handleModalOn();
            return;
        }

        if (others.length > 1) {
            setAlertMessage('파일은 하나만 첨부 가능합니다.')
            handleModalOn();
            return;
        }

        setItems(AllFiles);
        setIsAttachButtonClicked(!isAttachButtonClicked);
    };


    return (
        <div
            className={`${styles.chatContainer} ${isAnimating ? commonStyles.animateCollapse : ''} ${isExpanding ? commonStyles.animateExpand : ''}`}
            onKeyDown={handleKeyPress}>
            <div className={styles.chatTop}>
                <button className={`${styles.topButtons} ${styles.back}`} onClick={handleClickBack}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                    </svg>
                </button>
                <div className={styles.title}>
                    {currentRoomData.roomName} { roomData.roomType !== 'inquiries' &&
                        people.length
                    }
                </div>
                <div className={styles.chatSubTop}>
                    <button
                        className={styles.topButtons}
                        onClick={handleMenuClick}
                        ref={menuRef} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
                    </button>

                    { isMenuClicked &&
                        <ul className={styles.menuItems}>
                            { roomData.roomType !== 'inquiries' &&
                                <>
                                    <li onClick={handlePin}>{userData.isPinned === 1 ? '핀해제' : '핀하기'}</li>
                                    <li onClick={handleRoomTitleName}>방제목변경</li>
                                    <li onClick={() => setIsPeopleOn(true)}>참가자확인</li>
                                </>
                            }
                            <li onClick={handleLeave}>채팅방나가기</li>
                        </ul>
                    }
                    { isPeopleOn &&
                        <ul className={styles.menuItems2}>
                        {people.map((person, index) => {

                            return<li key={index} className={styles.people}>
                                    <img className={styles.peopleImg} src={person.profileImageUrl} alt=""/>
                                {person.nickname}
                                </li>

                            })
                        }
                        <li onClick={() => setIsPeopleOn(false)}>닫기</li>
                    </ul>
                    }
                </div>
            </div>

            { (announce !== '' && !isAnnounceHidden) ?
                <div className={`${styles.announceContainer}`}>
                    <span className={styles.horn}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 512 512">
                            <path
                                d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H192 160 64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352l8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.4c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4V32zm-64 76.7V240 371.3C357.2 317.8 280.5 288 200.7 288H192V192h8.7c79.8 0 156.5-29.8 215.3-83.3z"/>
                        </svg>
                    </span>
                    <span className={`${styles.announce} ${announceExpand && styles.expanded}`}>{announce}
                        {   announceExpand &&
                            <div>
                                <button className={styles.hide} onClick={() => setIsAnnounceHidden(true)} >
                                    최소화
                                </button>
                            </div>
                        }</span>
                    <button className={`${styles.carot}`} onClick={handleAnnounce}>
                        <svg className={`${announceExpand ? commonStyles.rotate180 : commonStyles.rotate180Back}`}
                             xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512">
                            <path
                                d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                        </svg>

                    </button>
                </div>
                :
                announce !== '' && <div className={styles.announceContainerSmall} onClick={() => {
                    setIsAnnounceHidden(false)
                    setAnnounceExpand(false)
                }}>
                    <span className={styles.horn}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 512 512">
                            <path
                                d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H192 160 64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352l8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.4c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4V32zm-64 76.7V240 371.3C357.2 317.8 280.5 288 200.7 288H192V192h8.7c79.8 0 156.5-29.8 215.3-83.3z"/>
                        </svg>
                    </span>
                </div>

            }


            <div className={`${styles.chatMain} ${(items.length !== 0) && styles.fileAttached}`}>
                <BubbleContainer
                    option={option}
                    onAnnouncementChange={handleAnnouncementChange}
                    onReport={handleReport}
                    messages={messages}
                    ref={bubbleContainerRef}
                    onScroll={handleScroll}
                    isThereAdmin={isThereAdmin}
                />
            </div>

            {items.length !== 0 && <MediaFile items={items} setItems={setItems}/>}
            <form className={styles.chatBottom} onSubmit={handleSubmit}>
                {
                    <>

                        { (option !== 'gpt') &&
                            <button className={`${styles.attachButton}`} onClick={handleAttachButtonClick}>
                            <svg
                                className={isAttachButtonClicked ? commonStyles.animateRotate : commonStyles.animateBack}
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path
                                    d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                            </svg>
                        </button>
                        }


                        {
                            isAttachButtonClicked
                                ?
                                <div className={`${styles.attachContainer}`}>
                                    <button className={styles.attachmentIcon} onClick={handleFileAttach}>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 576 512">
                                            <path
                                                d="M160 80H512c8.8 0 16 7.2 16 16V320c0 8.8-7.2 16-16 16H490.8L388.1 178.9c-4.4-6.8-12-10.9-20.1-10.9s-15.7 4.1-20.1 10.9l-52.2 79.8-12.4-16.9c-4.5-6.2-11.7-9.8-19.4-9.8s-14.8 3.6-19.4 9.8L175.6 336H160c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16zM96 96V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160c-35.3 0-64 28.7-64 64zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120zm208 24a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
                                        </svg>
                                        파일 첨부
                                    </button>
                                </div>
                                :
                                items.length === 0 ?
                                    <textarea
                                        name="textContent"
                                        id="textContent"
                                        placeholder='텍스트를 입력해주세요'
                                        className={`${styles.textContent}`}
                                        value={textContent}
                                        onChange={(event)=> setTextContent(event.target.value)}></textarea>
                                    :
                                    <div className={styles.dummy}>사진 메시지 동시전송 불가로 만들어 둔 빈 박스입니다</div>

                        }

                        <button className={styles.send} type='submit'>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 512 512">
                                <path
                                    d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"/>
                            </svg>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            name="files"
                            multiple
                            accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                            onChange={handleFileChange}
                            style={{display: 'none'}}
                        />
                    </>
                }
            </form>
            {
                modalOn && modal.yesOnly(alertMessage, setModalOn, false)
            }
        </div>

    );
});

export default Chat;
