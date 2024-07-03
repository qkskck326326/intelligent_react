import React from 'react';
import { useRouter } from 'next/router';
import LecturePackageDetail from "../../components/lecturePackage/lecturePackageDetail";

const LecturePackageDetailPage = () => {
    const router = useRouter();
    const {lecturePackageId} = router.query;
    console.log(router.query);
    console.log(parseInt(lecturePackageId, 10));
    // no가 존재하는 경우에만 BoardDetail 컴포넌트를 렌더링합니다.
    return lecturePackageId ? <LecturePackageDetail lecturePackageId={parseInt(lecturePackageId, 10)} /> : <div>Loading...</div>;
};

export default LecturePackageDetailPage;