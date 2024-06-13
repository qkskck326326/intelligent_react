import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import styles from '../../styles/chatting/chat.module.css'
import BubbleContainer from "./bubblecontainer.jsx";
import AuthStore from "../../stores/authStore";
import MediaFile from "./mediafiles.jsx";

const Chat = observer(({ chatOption, isExpanding, onNavigateToIcon }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
    const [announceExpand, setAnnounceExpand] = useState(false);
    const [isMenuClicked, setIsMenuClicked] = useState(false);
    const [items, setItems] = useState([])

    const handleClickBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNavigateToIcon();
            setIsAnimating(false);
            setIsSearchButtonClicked(false);
            setAnnounceExpand(false);
            setIsMenuClicked(false);
        }, 500);
    };

    const handleSearchButtonClick = () => {
        setIsSearchButtonClicked(!isSearchButtonClicked)
    }

    const handleAnnounce = () => {
        console.log(announceExpand)
        setAnnounceExpand(!announceExpand);
    }

    const handleSearch = (event) => {
        event.preventDefault();
    }

    const handleMenuClick = () => {
        setIsMenuClicked(!isMenuClicked)
    }


    return (
        <div
            className={`${styles.chatContainer} ${isAnimating ? commonStyles.animateCollapse : ''} ${isExpanding ? commonStyles.animateExpand : ''}`}>
            <div className={styles.chatTop}>
                <button className={`${styles.topButtons} ${styles.back}`} onClick={handleClickBack}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                    </svg>
                </button>
                <div className={styles.title}>
                    {
                        (chatOption !== 'gpt') ? `채팅방제목` : `인텔리봇`
                        
                    }
                </div>
                <div className={styles.chatSubTop}>
                    {/*챗지피티면 검색버튼만 */}
                    { (chatOption !== 'gpt') ?
                        <>
                            <button className={`${styles.topButtons} ${styles.search}`} onClick={handleSearchButtonClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                            </button>
                            <button className={styles.topButtons} onClick={handleMenuClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
                            </button>
                        {/*  메뉴 구성  */}
                            { (isMenuClicked)?
                                <ul className={styles.menuItems}>
                                    <li>1번메뉴</li>
                                    <li>2번메뉴</li>
                                </ul>
                                :
                                <></>

                        }
                        </>
                        :
                        <div className={styles.dummy}>abc</div>
                    }

                </div>
            </div>
            { (isSearchButtonClicked) ?
                <form className={`${styles.searchBar}`} onSubmit={handleSearch}>
                    <input className={styles.searchBox} type="text"/>
                    <button className={styles.resetButton} type='reset'>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 384 512">
                            <path
                                d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
                        </svg>
                    </button>
                </form>
                : <div></div>
            }

            {/*챗지피티의 경우 이거 안뜸 시작 */}
            { (chatOption !== 'gpt') ?
                <div className={`${styles.announceContainer} ${isSearchButtonClicked ? styles.pushed: ''}`}>
                    <span className={styles.horn}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 512 512">
                            <path
                                d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H192 160 64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352l8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.4c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4V32zm-64 76.7V240 371.3C357.2 317.8 280.5 288 200.7 288H192V192h8.7c79.8 0 156.5-29.8 215.3-83.3z"/>
                        </svg>
                    </span>
                    <span className={`${styles.announce} ${announceExpand ? styles.expanded : ''}`}>d런거 assdfgsdfgdfa sdfasd kfhasdkfjahskdjfhaksdjfhaksjdfk를 저장해볼rmfjasdfsdfasldkfjalsdkf까요 zzzzzadsfasdfa</span>
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
                <></>
            }

            {/*챗지피티의 경우 이거 안뜸  끝 */}

            <div className={`${styles.chatMain} ${(items.length === 0) ? styles.fileAttached : ''}`}>
                <BubbleContainer />
            </div>
            { items.length === 0 ?

                    <MediaFile />

                : <></>
            }
            <div className={styles.chatBottom}>
                {
                    <>
                        <div>+</div>
                        <div></div>
                        <div>전송</div>
                    </>
                }
            </div>

            {/*<button>{chatOption}</button>*/}
        </div>
    );
});

export default Chat;
