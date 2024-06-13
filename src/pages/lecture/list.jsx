import React, { useState } from 'react';
import Link from 'next/link';
import LectureList from "../../components/lecture/lectureList";
import LecturePreview from "../../components/lecture/lecturePreview";
import LectureAvgRating from "../../components/lecture/lectureAvgRating";

const containerStyle = {
    display: 'flex',
    justifyContent: 'center', // 가로 방향 중앙 정렬
    height: '100vh', // 전체 높이
    width: '100vw', // 전체 너비
    padding: '20px' // 여백 추가
};

const verticalLineStyle = {
    borderLeft: '2px solid #19CA83', // 선의 두께와 색상
    height: '70vh', // 선의 높이
    margin: '0 20px',
    width: '10%'
};

const listStyle = {
    width: '120%', // 컴포넌트의 너비
    display: 'flex',
    justifyContent: 'flex-start'
};

const componentStyle = {
    display: 'flex',
    flexDirection: 'column', // 세로 방향 정렬
    alignItems: 'flex-start', // 왼쪽 정렬
    width: '50%' // 컴포넌트의 너비
};

const ratingStyle = {
    width: '100%', // 별점 컴포넌트의 너비
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
};

const previewStyle = {
    width: '100%', // 미리보기 컴포넌트의 너비
    marginTop: '20px' // 별점 컴포넌트와의 간격
};

const LecturePage = () => {
    const [selectedLectureId, setSelectedLectureId] = useState(null);

    return (
        <div style={containerStyle}>
            <div style={listStyle}>
                <LectureList onSelectLecture={setSelectedLectureId} />
            </div>
            <div style={verticalLineStyle}></div>
            <div style={componentStyle}>
                <div style={ratingStyle}>
                    <LectureAvgRating />
                </div>
                <div style={previewStyle}>
                    {selectedLectureId && <LecturePreview lectureId={selectedLectureId} />}
                </div>
            </div>
        </div>
    );
};

export default LecturePage;
