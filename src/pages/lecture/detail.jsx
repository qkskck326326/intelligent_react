import React from 'react';
import { useRouter } from 'next/router';
import LectureDetail from '../../components/lecture/lectureDetail';

const LectureDetailPage = () => {
    const router = useRouter();
    const { lectureId } = router.query;

    return (
        <>
            {lectureId ? <LectureDetail lectureId={lectureId} /> : <p>Loading...</p>}
        </>
    );
};

export default LectureDetailPage;
