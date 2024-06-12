import {observer} from 'mobx-react'
import authStore from "../../stores/authStore";
import React, { useState, useEffect } from 'react';
import ChatIcon from '../../components/chat/chaticon'
import ChatList from "../../components/chat/chatlist";
import AddingFriends from '../../components/chat/addingfriends';
import ActionModal from '../../components/chat/actionmodal';
import Chat from '../../components/chat/chat'
import Axios from '../../axiosApi/Axios'

const ChatContainer = observer(() => {

    const [activeComponent, setActiveComponent] = useState('ChatIcon');
    const [isIconHidden, setIsIconHidden] = useState(false);
    const [isExpanding, setIsExpanding] = useState(false);
    const [chatOption, setChatOption] = useState('');
    const [totalCount, setTotlaCount] = useState(0);
    const axios = new Axios

    const countTotal = () => {
        //로직-> 내 아이디로 채팅방 모조리 확인 => 방아이디로 메시지
        return axios.get('/chat/countunreadall', `?userId=${authStore.getNickname()}`)
    }

    const handleNavigation = (component, option ='') => {
        if (component === 'ChatIcon') {
            setIsIconHidden(false);
            setIsExpanding(true);
        } else {
            setIsIconHidden(true);
            setIsExpanding(true);
        }
        setActiveComponent(component);
        setChatOption(option);
        setTimeout(() => setIsExpanding(false), 500);
    };

    return (
        <>
            <ChatIcon
                isHidden={isIconHidden}
                isExpanding={isExpanding}
                onNavigate={() => handleNavigation('ChatList')}
                onCountTotal={() => countTotal()}
            />
            {activeComponent === 'ChatList' && (
                <ChatList
                    isExpanding={isExpanding}
                    onNavigateToFriends={() => handleNavigation('AddingFriends')}
                    onNavigateToIcon={() => handleNavigation('ChatIcon')}
                    onNavigateToChat={(option) => handleNavigation('Chat', option)}
                />
            )}
            {activeComponent === 'AddingFriends' && (
                <AddingFriends
                    isExpanding={isExpanding}
                    onNavigateToList={() => handleNavigation('ChatList')}
                    onNavigateToModal={() => handleNavigation('ActionModal')}
                    onNavigateToChat={() => handleNavigation('Chat')}
                />
            )}
            {activeComponent === 'ActionModal' && (
                <ActionModal
                    isExpanding={isExpanding}
                    onNavigateToFriends={() => handleNavigation('AddingFriends')}
                    onNavigateToChat={() => handleNavigation('Chat')}
                />
            )}
            {activeComponent === 'Chat' && (
                <Chat chatOption={chatOption} isExpanding={isExpanding} onNavigateToIcon={() => handleNavigation('ChatIcon')} />
            )}
        </>
    );
});

export default ChatContainer;

