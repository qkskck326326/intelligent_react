import Announcement from '../../components/announcement/announcement'
import CSSideBar from "../../components/announcement/cssidebar";

const Index = () => {
    return (
        <div style={{display: 'flex'}}>
            <CSSideBar />
            <Announcement />
        </div>
    );
};

export default Index;