import React from 'react';
import { useRouter } from 'next/router';
import LectureDetail from '../../components/lecture/lectureDetail';
import LectureComment from '../../components/lecture/lectureComment';
import TranscriptSummary from '../../components/lecture/transcriptSummary'; // 추가

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    padding: '20px'
};

const verticalLineStyle = {
    borderLeft: '2px solid #19CA83',
    height: '70vh',
    margin: '0 20px',
    width: '10%'
};

const leftSideStyle = {
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingRight: '20px'
};

const rightSideStyle = {
    width: '40%',
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
                {lectureId ? <LectureComment lectureId={lectureId} /> : <p>Loading...</p>}
            </div>
            <div style={verticalLineStyle}></div>
            <div style={rightSideStyle}>
                {lectureId && <TranscriptSummary streamUrl={`URL_OF_THE_VIDEO_FOR_${lectureId}`} />}
            </div>
        </div>
    );
};

export default LectureDetailPage;
