import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LectureList from "../../components/lecture/lectureList";
import LecturePreview from "../../components/lecture/lecturePreview";
import LectureAvgRating from "../../components/lecture/lectureAvgRating";
import InsertRating from "../../components/lecture/InsertRating";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px'
};

const verticalLineStyle = {
    borderLeft: '2px solid #19CA83',
    height: '70vh',
    margin: '0 20px',
    width: '10%'
};

const listStyle = {
    width: '120%',
    display: 'flex',
    justifyContent: 'flex-start'
};

const componentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '50%'
};

const ratingStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
};

const previewStyle = {
    width: '100%',
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: '-50px'
};

const buttonStyle = {
    marginLeft: '90px',
    padding: '10px',
    backgroundColor: '#19CA83',
    color: 'white',
    borderRadius: '5px',
    textDecoration: 'none',
    width: '120px',
    border: 'none',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    cursor: 'pointer',
    verticalAlign: 'middle',
    textAlign: 'center',
    lineHeight: '20px' 
};

const LecturePage = ({ lecturePackageId }) => {
    const [selectedLectureId, setSelectedLectureId] = useState(null);
    const [authNickname, setAuthNickname] = useState('');
    const [packageOwnerNickname, setPackageOwnerNickname] = useState('');
    const [deletingMode, setDeletingMode] = useState(false);
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = () => {
        axiosClient.get(`/lecture/list/${lecturePackageId}`)
            .then(response => {
                const responseData = response.data;
                const dataArray = Array.isArray(responseData) ? responseData : [responseData];
                setLectures(dataArray);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        // 현재 사용자의 닉네임 가져오기
        const currentNickname = localStorage.getItem("nickname");
        setAuthNickname(currentNickname);

        const fetchLecturePackageOwner = async () => {
            try {
                const response = await axiosClient.get(`/lecture/owner/${lecturePackageId}`);
                setPackageOwnerNickname(response.data.nickname);
            } catch (error) {
                console.error('Error fetching lecture package owner:', error);
            }
        };

        fetchLecturePackageOwner();
        fetchData(); // LecturePage에서 fetchData 호출 추가
    }, [lecturePackageId]);

    return (
        <div style={containerStyle}>
            <div style={listStyle}>
                <LectureList 
                    onSelectLecture={setSelectedLectureId} 
                    lecturePackageId={lecturePackageId} 
                    isOwner={authNickname === packageOwnerNickname} 
                    setDeletingMode={setDeletingMode}
                    fetchData={fetchData} // LectureList에 fetchData 전달
                    lectures={lectures}
                    loading={loading}
                    error={error}
                />
            </div>
            <div style={verticalLineStyle}></div>
            <div style={componentStyle}>
                <div style={ratingStyle}>
                    <LectureAvgRating lecturePackageId={lecturePackageId} />
                </div>
                <div>
                    {authNickname === packageOwnerNickname ?
                        <>
                            <Link href={`/lecture/addLecture?lecturePackageId=${lecturePackageId}&nickname=${authNickname}`} legacyBehavior>
                                <a style={buttonStyle}>강의 등록</a>
                            </Link>
                        </>
                        :
                        <InsertRating lecturePackageId={lecturePackageId} />
                    }
                </div>
                <div style={previewStyle}>
                    {selectedLectureId && <LecturePreview lectureId={selectedLectureId} />}
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = async (context) => {
    const lecturePackageId = context.query.lecturePackageId || 1; // URL에서 lecturePackageId를 가져오거나 기본값으로 1을 사용
    return {
        props: {
            lecturePackageId
        }
    };
};

export default LecturePage;
