import Announcement from '../../components/announcement/announcement'
import CSSideBar from "../../components/announcement/cssidebar";
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