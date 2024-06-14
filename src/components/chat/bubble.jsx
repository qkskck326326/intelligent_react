import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import AuthStore from "../../stores/authStore";
import styles from '../../styles/chatting/chatbubble.module.css'

const Bubble = observer(()=>{

    const [isMe, setIsMe] = useState(false) //여기에 조건 바로 넣어서 쓰면 될 듯
    const [isThereMedia, setIsThereMedia] = useState(false)


    return (
        <div className={`${styles.bubbleWrapper} ${ isMe ? styles.reverseBubbleWrapper : ''}`}>
            <div className={`${styles.eachBubble} ${ isMe ? styles.reverseEachBubble : ''}`}>

                {/* TODO 강사일 경우 강사의 페이지 이동기능도 필요할듯? */}
                { !isMe ?
                    <div className={styles.profile}>
                        {/* TODO 사진인데 옵셔널체이닝으로 에러방지해야할듯*/}
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

                    <div className={styles.content}>

                        {
                            isThereMedia && <Media 사진이있다면 들어옴 아직정의되지 않음/>
                        }

                    {/*  TODO 이미지 조건 넣어서 이미지일시 조건 처리  */}
                        TODO 여기에 글을 쓸거고 오버래핑 처리 잘해야함
                    </div>
                </div>
                <div className={`${styles.end} ${isMe ? styles.reverseEnd : ''}`}>
                    <div className={styles.howManyRead}>
                        1
                    </div>
                    <div className={styles.time}>
                        {`${new Date().toLocaleDateString('ko-KR').trim().split('.')[1]}.${new Date().toLocaleDateString('ko-KR').split('.')[2].trim()}`}
                    </div>
                </div>
            </div>
        </div>
    );
})

export default Bubble;