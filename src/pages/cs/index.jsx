import Announcement from '../../components/announcement/announcement'
import CSSideBar from "../../components/announcement/cssidebar";
import Chaticon from "../../components/chat/chaticon";
import ChatContainer from '../chatting/index';

const Index = () => {
    return (
        <div style={{display: 'flex'}}>
            <CSSideBar />
            <Announcement />
            <ChatContainer />
        </div>
    );
};

export default Index;