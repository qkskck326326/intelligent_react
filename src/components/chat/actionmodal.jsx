import React, { useState } from 'react';
import { observer } from 'mobx-react';
import modalStyles from "../../styles/common/modal.module.css";
import Axios from '../../axiosApi/Axios.js'
import authStore from "../../stores/authStore";

const ActionModal = observer(({ isExpanding, onNavigateToList, option, onNavigateToChat, roomType }) => {

    const [isAnimating, setIsAnimating] = useState(false);
    const [people, setPeople] = useState(option.split(', '))
    const axios = new Axios();

    const handleClickBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNavigateToList();
            setIsAnimating(false);
            setPeople([]);
        }, 500);
    };


    const handleMakeChat = () => {
        const names = [authStore.getNickname(), ...people]
        axios.post(`/chat/makechat/${roomType}`, {
            ...names
        }).then(data => {
            onNavigateToChat(data)
        })
    }
    return (
        <div className={modalStyles.modalBackground}>
            <div
                className={`${modalStyles.modalContainer} ${isAnimating ? modalStyles.shrinkIn : modalStyles.popOut}`}
            >
                <div className={modalStyles.modalDialog}>{option}(와)과 채팅하시겠습니까?</div>
                <div className={modalStyles.buttonContainer}>
                    <button className={modalStyles.buttons} onClick={handleMakeChat}>확인</button>
                    <button className={modalStyles.buttons} onClick={handleClickBack}>취소</button>
                </div>
            </div>
        </div>
    );
});

export default ActionModal;
