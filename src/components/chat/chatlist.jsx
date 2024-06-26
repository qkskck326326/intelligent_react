import React, {useEffect, useState} from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import styles from '../../styles/chatting/chatlist.module.css'
import EachChat from '../../components/chat/eachchat.jsx';
import {axiosClient} from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import AuthStore from "../../stores/authStore";

/*
* */
const ChatList = observer(({isExpanding, onNavigateToFriends, onNavigateToIcon, onNavigateToChat, onNavigateToBot, userId, userType }) => {

    const [chatOrInq, setChatOrInq] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPlusClicked, setIsPlusClicked] = useState(false);
    const [chatData, setChatData] = useState([])

    //TODO
    useEffect(() => {
        authStore.checkIsAdmin() && setChatOrInq(false);

        axiosClient.get('/chat/chatlist', {
            params: {
                userId: userId,
                isChats: chatOrInq
            }
        })
            .then(response => {
                console.log(response.data);
                setChatData(response.data);
            })
            .catch(error => {
                console.error('An error occurred!', error);
            });
    }, [userId, chatOrInq]);


    const handleClickBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNavigateToIcon();
            setIsAnimating(false);
            setIsPlusClicked(false);
        }, 500);
    };

    const handleTurning = () => {
        setIsPlusClicked(!isPlusClicked)
    }

    const handleEnteringChat = (roomData) => {

        setIsAnimating(true);
        setTimeout(() => {
            console.log(roomData);
            onNavigateToChat({...roomData})
            setIsAnimating(false);
            setIsPlusClicked(false);
        }, 500);
    }

    const getAdmins = async () => {
        try{
            const response = await axiosClient.get('/chat/admins')
            return [authStore.getNickname(), ...response.data]
        }
        catch(error){
            console.error(error);
        }
    }
    const handleOneonOne = async () => {
        try {
            const names = await getAdmins(); // Await the result of getAdmins

            console.log(names);

            const response = await axiosClient.post('/chat/makechat/inquiries', {
                names: names
            });
            onNavigateToChat(response.data);
        } catch (error) {
            console.error('An error occurred!', error);
        }
    }

    const handleCategory = (boolean) => {
        setChatOrInq(boolean)
        //boolean이 true면 채팅을 보는 것
        //boolean이 false면 문의를 보는 것

    }

    return (
        <div
            className={`${commonStyles.chatServiceContainer} ${isAnimating && commonStyles.animateCollapse} ${isExpanding && commonStyles.animateExpand}`}>
            <div className={styles.chatlistTop}>
                <button className={styles.topButtons} onClick={handleClickBack}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                    </svg>
                </button>
                {
                    userType !== 2 &&
                    <button className={styles.topButtons} onClick={handleTurning}>
                        <svg
                            className={isPlusClicked ? `${commonStyles.animateRotate}` : `${commonStyles.animateBack}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512">
                            <path
                                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                        </svg>
                    </button>
                }
            </div>

            { isPlusClicked &&


                <div className={styles.chatType}>

                    {userType === 0 ?
                        <div className={styles.chatTypeItem} onClick={()=>{onNavigateToFriends('teachers')}}>
                            <svg className={styles.chatTypeIcon} xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 640 512">
                                <path
                                    d="M160 64c0-35.3 28.7-64 64-64H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H336.8c-11.8-25.5-29.9-47.5-52.4-64H384V320c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v32h64V64L224 64v49.1C205.2 102.2 183.3 96 160 96V64zm0 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM133.3 352h53.3C260.3 352 320 411.7 320 485.3c0 14.7-11.9 26.7-26.7 26.7H26.7C11.9 512 0 500.1 0 485.3C0 411.7 59.7 352 133.3 352z"/>
                            </svg>
                            <p>강사문의</p>
                        </div>

                        : userType === 1 &&
                            <div className={styles.chatTypeItem} onClick={()=>{onNavigateToFriends('students')}}>
                                <svg className={styles.student} xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 512 512">
                                    <path
                                        d="M160 96a96 96 0 1 1 192 0A96 96 0 1 1 160 96zm80 152V512l-48.4-24.2c-20.9-10.4-43.5-17-66.8-19.3l-96-9.6C12.5 457.2 0 443.5 0 427V224c0-17.7 14.3-32 32-32H62.3c63.6 0 125.6 19.6 177.7 56zm32 264V248c52.1-36.4 114.1-56 177.7-56H480c17.7 0 32 14.3 32 32V427c0 16.4-12.5 30.2-28.8 31.8l-96 9.6c-23.2 2.3-45.9 8.9-66.8 19.3L272 512z"/>
                                </svg>
                                <p>학생문의</p>
                            </div>
                    }

                    { userType !== 2 &&

                        <>
                            <div className={styles.chatTypeItem} onClick={() => onNavigateToFriends("groups")}>
                                <svg className={styles.chatTypeIcon} xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 640 512">
                                    <path
                                        d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"/>
                                </svg>
                                <p>그룹채팅</p>
                            </div>

                            <div className={styles.chatTypeItem} onClick={handleOneonOne}>
                                <svg className={styles.oneOnOne} xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 384 512">
                                    <path
                                        d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM105.8 229.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L216 328.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V314.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H158.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM160 416a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                                </svg>
                                <p>1:1문의</p>
                            </div>

                            <div className={styles.chatTypeItem} onClick={onNavigateToBot}>
                                <svg className={styles.chatGPTIcon} xmlns="http://www.w3.org/2000/svg"
                                     viewBox="-0.17090198558635983 0.482230148717937 41.14235318283891 40.0339509076386">
                                    <path
                                        d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18z"/>
                                </svg>
                                <p>인텔리챗봇</p>
                            </div>

                        </>
                    }


                </div>

            }
            { !AuthStore.checkIsAdmin() &&
                <div className={commonStyles.category}>
                    <div className={`${commonStyles.subCategory} ${chatOrInq && commonStyles.active}`}
                         onClick={() => {
                             handleCategory(true)
                         }}>
                        채팅확인
                    </div>
                    <div className={`${commonStyles.subCategory} ${!chatOrInq && commonStyles.active}`}
                         onClick={() => {
                             handleCategory(false)
                         }}>
                        문의확인
                    </div>
                </div>
            }

            <div className={commonStyles.chatServiceMain}>
                { chatData.length > 0 ?
                    chatData.map((chatDatum) =>
                        <EachChat key={chatDatum.chatroom.roomId} chat={chatDatum} onClick={() => handleEnteringChat(chatDatum.chatroom)} isChat={chatOrInq} />
                    )
                    :
                    userType !== 2 ?
                    <div className={commonStyles.chatEmpty}><p>아직 채팅이 없어요.</p><p>오른쪽 위 + 아이콘을 눌러서</p><p>채팅을 시작해보세요</p></div>
                        :
                        <div className={commonStyles.chatEmpty}><p>현재 들어온 문의가 없음</p></div>
                }
            </div>


        </div>
    );
});

export default ChatList;
