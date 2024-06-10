import AnnouncementWrite from '../../components/announcement/announcementwrite.jsx'
import Sidebar from '../../components/admin/Sidebar';

const Write = () => {

    return(
        <div style={{display:'flex'}}>
            <Sidebar />
            <AnnouncementWrite />
        </div>
    );
}

export default Write;