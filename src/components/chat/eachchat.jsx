import React from 'react'
import {observer} from "mobx-react";
import styles from '../../styles/chatting/eachchat.module.css';
import TimeAgo from '../../axiosApi/timeDifference.js'

const EachChat = observer(({chat, onClick}) => {

    return(
        <div className={styles.eachChatContainer} onClick={onClick}>
            <div className={styles.pictureFrame}>
                <div className={styles.eachPicture}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 650 ">
                        <path
                            d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"/>
                    </svg>
                </div>

                {chat.chatUser.isPinned === 1 &&
                    <svg className={styles.pin} xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 384 512">
                        <path
                            d="M32 32C32 14.3 46.3 0 64 0H320c17.7 0 32 14.3 32 32s-14.3 32-32 32H290.5l11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3H32c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64H64C46.3 64 32 49.7 32 32zM160 384h64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z"/>
                    </svg>
                }

            </div>
            <div className={styles.middle}>
                <div className={styles.content}>
                <div className={styles.name}>
                        {chat.chatroom.roomName}
                    </div>
                    {
                        chat.unreadMessageCount > 0 &&
                        <div className={styles.notread}>
                            {chat.unreadMessageCount}
                        </div>
                    }
                    <div className={styles.people}>
                    {chat.totalPeople}
                    </div>
                </div>
                {/*칸 맞추기위해서 빈브레일 들어가있음 */}
                <div className={styles.message}>
                    {   chat.latestMessage?.messageContent ?
                        chat.latestMessage?.messageContent
                        :
                        `미디어`
                    }⠀
                </div>
            </div>
            {chat.latestMessageTimestamp !== null ?
                <div className={styles.time}>
                    {TimeAgo(chat.latestMessageTimestamp)}
                </div>
                :
                <div className={styles.time}> {/* 칸 맞추기용 더미 데이터 */}
                </div>
            }
        </div>
    );
})

export default EachChat;