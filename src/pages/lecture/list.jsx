import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LectureList from "../../components/lecture/lectureList";
import LecturePreview from "../../components/lecture/lecturePreview";
import LectureAvgRating from "../../components/lecture/lectureAvgRating";
import InsertRating from "../../components/lecture/InsertRating";
import { axiosClient } from "../../axiosApi/axiosClient";

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
    marginTop: '20px'
};

const buttonStyle = {
    marginLeft: '10px',
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

const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ff4d4d',
    width: '88.45px',
    height: '37.78px'
};


const LecturePage = ({ lecturePackageId }) => {
    const [selectedLectureId, setSelectedLectureId] = useState(null);
    const [authNickname, setAuthNickname] = useState('');
    const [packageOwnerNickname, setPackageOwnerNickname] = useState('');
    const [deletingMode, setDeletingMode] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axiosClient.get('/auth/currentUser');
                setAuthNickname(response.data.nickname);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        const fetchLecturePackageOwner = async () => {
            try {
                const response = await axiosClient.get(`/lecturePackage/owner/${lecturePackageId}`);
                setPackageOwnerNickname(response.data.nickname);
            } catch (error) {
                console.error('Error fetching lecture package owner:', error);
            }
        };

        fetchCurrentUser();
        fetchLecturePackageOwner();
    }, [lecturePackageId]);

    return (
        <div style={containerStyle}>
            <div style={listStyle}>
                <LectureList 
                    onSelectLecture={setSelectedLectureId} 
                    lecturePackageId={lecturePackageId} 
                    isOwner={authNickname === packageOwnerNickname} 
                    setDeletingMode={setDeletingMode}
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
                            <Link href="/lecture/addLecture" legacyBehavior>
                                <a style={buttonStyle}>강의 등록</a>
                            </Link>
                            <button onClick={() => setDeletingMode(true)} style={deleteButtonStyle}>강의 삭제</button>
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

export default LecturePage;
