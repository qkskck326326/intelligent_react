import Announcement from '../../components/announcement/announcement'
import CSSideBar from "../../components/announcement/cssidebar";
import styles from "../../styles/cs.module.css"
const Index = () => {
    return (
        <div className={styles.csContainer}>
            <CSSideBar />
            <Announcement />
        </div>
    );
};

export default Index;