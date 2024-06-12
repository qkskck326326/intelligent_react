import React from 'react';
import LectureList from "../../components/lecture/lectureList";
import LecturePreview from "../../components/lecture/lecturePreview";
import LectureRating from "../../components/lecture/lectureRating";

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
    margin: '0 20px'
  };
  

const Index = () => {
  return (
    <div style={containerStyle}>
        <LectureList />
      <div style={verticalLineStyle}></div>
        {/* <LectureRating /> */}
        {/* <LecturePreview /> */}
    </div>
  );
};

export default Index;
