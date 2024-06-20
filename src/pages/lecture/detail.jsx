import React from 'react';
import { useRouter } from 'next/router';
import LectureDetail from '../../components/lecture/lectureDetail';
import LectureComment from '../../components/lecture/lectureComment';
import Transportext from '../../components/lecture/transportext'; // 추가

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px'
};

const verticalLineStyle = {
    borderLeft: '2px solid #19CA83',
    height: '70vh',
    margin: '0 20px'
};

const leftSideStyle = {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingRight: '20px'
};

const rightSideStyle = {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
};

const LectureDetailPage = () => {
    const router = useRouter();
    const { lectureId } = router.query;

    return (
        <div style={containerStyle}>
            <div style={leftSideStyle}>
                {lectureId ? <LectureDetail lectureId={lectureId} /> : <p>Loading...</p>}
                {/* {lectureId ? <LectureComment lectureId={lectureId} /> : <p>Loading...</p>} */}
            </div>
            <div style={verticalLineStyle}></div>
            <div style={rightSideStyle}>
                {lectureId && <Transportext lectureId={lectureId} />}
            </div>
        </div>
    );
};

export default LectureDetailPage;
