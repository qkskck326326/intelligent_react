import {observer} from 'mobx-react'
import authStore from "../../stores/authStore";
import React, { useState } from 'react';
import ChatIcon from '../../components/chat/chaticon'
import ChatList from "../../components/chat/chatlist";
import AddingFriends from '../../components/chat/addingfriends';
import ActionModal from '../../components/chat/actionmodal';
import Chat from '../../components/chat/chat'
import Bot from "../../components/chat/chatbotcontainer";

const ChatContainer = observer(() => {

    const [activeComponent, setActiveComponent] = useState('ChatIcon');
    const [isIconHidden, setIsIconHidden] = useState(false);
    const [isExpanding, setIsExpanding] = useState(false);
    const [option, setOption] = useState('')
    const [roomType, setRoomType] = useState('')
    const [roomData, setRoomData] = useState({})
    const userType = authStore.checkIsAdmin() ? 2 : authStore.checkIsTeacher() ? 1 : 0
    const userId = authStore.getNickname();


    const handleNavigation = (component, option ='', roomType='', roomData={}) => {

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
        setRoomData(roomData);

        setTimeout(() => setIsExpanding(false), 500);
    };

    return (
        <>
            <ChatIcon
                isHidden={isIconHidden}
                isExpanding={isExpanding}
                onNavigate={() => handleNavigation('ChatList')}
                userId={userId}
                userType={userType}
            />
            {activeComponent === 'ChatList' && (
                <ChatList
                    isExpanding={isExpanding}
                    onNavigateToFriends={(option) => handleNavigation('AddingFriends', option)}
                    onNavigateToIcon={() => handleNavigation('ChatIcon')}
                    onNavigateToChat={(roomData) => handleNavigation('Chat', '', '', roomData)}
                    onNavigateToBot={() => handleNavigation('Bot')}
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
                    onNavigateToChat={(roomData) => handleNavigation('Chat', '', '', roomData)}
                />
            )}
            {activeComponent === 'Chat' && (
                <Chat
                    roomData={roomData}
                    option={option}
                    isExpanding={isExpanding}
                    onNavigateToList={() => handleNavigation('ChatList')}
                    userId={userId}
                    userType={userType}
                />
            )}
            {activeComponent === 'Bot' && (
                <Bot
                    isExpanding={isExpanding}
                    onNavigateToList={() => handleNavigation('ChatList')}
                />
            )}
        </>
    );
});

export default ChatContainer;

