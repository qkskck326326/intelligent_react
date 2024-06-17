import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import AuthStore from "../../stores/authStore";
import styles from '../../styles/chatting/chatbubble.module.css'

const Bubble = observer(({index, onAnnouncementChange, onReport})=>{

    const [isMe, setIsMe] = useState(true) //여기에 조건 바로 넣어서 쓰면 될 듯
    const [isThereMedia, setIsThereMedia] = useState(false)
    const [isEachSettingOn, setIsEachSettingOn] = useState(false)
    const textRef = useRef();

    function handleAnnouncement(){
        //TODO 실제보낼 정보를 여기 담음
        const text = textRef.current.textContent;
        onAnnouncementChange(text);
    }

    const handleEachReport = () => {

        onReport(index, isMe)
    }

    return (
        <div className={`${styles.bubbleWrapper} ${ isMe && styles.reverseBubbleWrapper}`}>
            <div className={`${styles.eachBubble} ${ isMe && styles.reverseEachBubble}`}>
                {/* TODO 강사일 경우 강사의 페이지 이동기능도 필요할듯? */}
                { !isMe ?
                    <div className={styles.profile}>
                        {/* TODO 사진인데 옵셔널체이닝으로 에러방지해야할듯*/}
                        사진
                    </div>
                    :
                    <></>
                }

                <div className={styles.main}>

                    { !isMe ?
                        <div className={styles.nickname}>
                            닉네임(자기자신은 안보임)
                        </div>
                        :
                        <></>
                    }

                    <div className={styles.content} ref={textRef}>

                        {/*{*/}
                        {/*    isThereMedia && <Media 사진이있다면 들어옴 아직정의되지 않음/>*/}
                        {/*}*/}

                    {/*  TODO 이미지 조건 넣어서 이미지일시 조건 처리  */}
                        TODO 여기에 글을 쓸거고 오버래핑 처리 잘해야함{index}
                    </div>
                </div>
                <div className={`${styles.end} ${isMe ? styles.reverseEnd : ''}`}>
                    <div className={styles.howManyRead}>
                        1
                    </div>
                    <div className={styles.time}>
                        {/*TODO 시간을 넣어야함 */}
                        {`${new Date().toLocaleDateString('ko-KR').trim().split('.')[1]}.${new Date().toLocaleDateString('ko-KR').split('.')[2].trim()}`}
                    </div>
                </div>
                <div className={styles.eachSettings} onClick={() => setIsEachSettingOn(!isEachSettingOn)}>
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
            </div>
        </div>
    );
})

export default Bubble;