import React from 'react'
import {observer} from "mobx-react";
import styles from '../../styles/chatting/eachchat.module.css';

const EachChat = observer((props) => {


    return(
        <div className={styles.eachchatContainer}>
            <div className={styles.pictureFrame}>
                <div className={styles.eachPicture}>
                    <img
                        src="https://i.namu.wiki/i/fzYUOs5_DPeR_vLIWOokJIxZmU1E18nJqpGstH_ivHyPerrkoFoAjfeBP8gaIKUhqCTgfTOP257WDc3r_Yl9nC0fO7K0DBoV6pqkoPmJqSb8IBRbNE7UPbnOEPhfrya2JbP1VjhgMyxHKbImRVujPg.webp"
                        alt=""/>
                </div>
                {/* 핀임 조건에 따라 보이고 안보임 */}
                <svg className={styles.pin} xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 384 512">
                    <path
                        d="M32 32C32 14.3 46.3 0 64 0H320c17.7 0 32 14.3 32 32s-14.3 32-32 32H290.5l11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3H32c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64H64C46.3 64 32 49.7 32 32zM160 384h64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z"/>
                </svg>
            </div>
            <div className={styles.middle}>
                <div className={styles.content}>
                    <div className={styles.name}>
                        채팅방 이름
                    </div>
                    <div className={styles.notread}>
                        99
                    </div>
                    <div className={styles.bell}>
                        <svg className={styles.belliconon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path
                                d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"/>
                        </svg>

                        {/*<svg className={styles.belliconoff} xmlns="http://www.w3.org/2000/svg"*/}
                        {/*     viewBox="0 0 640 512">*/}
                        {/*    <path*/}
                        {/*        d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-90.2-70.7c.2-.4 .4-.9 .6-1.3c5.2-11.5 3.1-25-5.3-34.4l-7.4-8.3C497.3 319.2 480 273.9 480 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V51.2c-42.6 8.6-79 34.2-102 69.3L38.8 5.1zM406.2 416L160 222.1v4.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S115.4 416 128 416H406.2zm-40.9 77.3c12-12 18.7-28.3 18.7-45.3H320 256c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"/>*/}
                        {/*</svg>*/}


                    </div>
                </div>
                <div className={styles.message}>
                    마지막 메시지 없을 수도 있음
                </div>
            </div>
            <div className={styles.time}>
                어제
            </div>
        </div>
    );
})

export default EachChat;