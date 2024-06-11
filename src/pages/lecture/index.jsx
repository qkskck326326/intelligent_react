import React from 'react';
import LectureList from "../../components/lecture/lectureList";
import LecturePreview from "../../components/lecture/lecturePreview";

const containerStyle = {
    display: 'flex',
    justifyContent: 'center', // 가로 방향 중앙 정렬
    height: '100vh', // 전체 높이
    width: '100vw', // 전체 너비
    padding: '20px', // 여백 추가
    boxSizing: 'border-box'
  };
  
  const leftContainerStyle = {
    flex: 1,
    maxWidth: '45%', // 최대 너비 설정
    paddingRight: '20px',
    boxSizing: 'border-box'
  };
  
  const verticalLineStyle = {
    borderLeft: '2px solid #19CA83', // 선의 두께와 색상
    height: '70vh', // 선의 높이
    margin: '0 20px'
  };
  
  const rightContainerStyle = {
    flex: 1,
    maxWidth: '45%', // 최대 너비 설정
    paddingLeft: '20px',
    boxSizing: 'border-box'
  };

const Index = () => {
  return (
    <div style={containerStyle}>
      <div style={leftContainerStyle}>
        <LectureList />
      </div>
      <div style={verticalLineStyle}></div>
      <div style={rightContainerStyle}>
        <LecturePreview />
      </div>
    </div>
  );
};

export default Index;
