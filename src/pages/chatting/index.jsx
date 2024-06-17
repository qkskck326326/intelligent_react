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
    const [option, setOption] = useState('')
    const [roomType, setRoomType] = useState('')
    const [totalCount, setTotalCount] = useState(0);
    const userType = authStore.checkIsAdmin() ? 2 : authStore.checkIsTeacher() ? 1 : 0
    const userId = authStore.getNickname();
    const axios = new Axios


    const countTotal = () => {
        //로직-> 내 아이디로 채팅방 모조리 확인 => 방아이디로 메시지
        return axios.get('/chat/countunreadall', `?userId=${userId}`)
    }

    const handleNavigation = (component, option ='', roomType='') => {

        console.log(option)

        if (component === 'ChatIcon') {
            setIsIconHidden(false);
            setIsExpanding(true);
        } else {
            setIsIconHidden(true);
            setIsExpanding(true);
        }

        setActiveComponent(component);
        setOption(option)
        setRoomType(roomType);
        console.log(`roomType: ${roomType}`)

        setTimeout(() => setIsExpanding(false), 500);
    };

    return (
        <>
            <ChatIcon
                isHidden={isIconHidden}
                isExpanding={isExpanding}
                onNavigate={() => handleNavigation('ChatList')}
                onCountTotal={() => countTotal()}
                userId={userId}
                userType={userType}
            />
            {activeComponent === 'ChatList' && (
                <ChatList
                    isExpanding={isExpanding}
                    onNavigateToFriends={(option) => handleNavigation('AddingFriends', option)}
                    onNavigateToIcon={() => handleNavigation('ChatIcon')}
                    onNavigateToChat={(option) => handleNavigation('Chat', option)}
                    userId={userId}
                    userType={userType}
                />
            )}
            {activeComponent === 'AddingFriends' && (
                <AddingFriends
                    option={option}
                    isExpanding={isExpanding}
                    onNavigateToList={() => handleNavigation('ChatList')}
                    onNavigateToModal={(option, roomType) => handleNavigation('ActionModal', option, roomType)}
                    onNavigateToChat={() => handleNavigation('Chat')}
                    userId={userId}
                    userType={userType}
                />
            )}
            {activeComponent === 'ActionModal' && (
                <ActionModal
                    option={option}
                    roomType={roomType}
                    isExpanding={isExpanding}
                    onNavigateToList={() => handleNavigation('ChatList')}
                    onNavigateToChat={() => handleNavigation('Chat')}
                />
            )}
            {activeComponent === 'Chat' && (
                <Chat
                    option={option}
                    isExpanding={isExpanding}
                    onNavigateToIcon={() => handleNavigation('ChatIcon')}
                    userId={userId}
                    userType={userType}
                />
            )}
        </>
    );
});

export default ChatContainer;

