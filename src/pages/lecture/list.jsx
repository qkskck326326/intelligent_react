import React, { useState, useEffect, useCallback } from 'react';
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
    marginLeft: '-50px',
    position: 'sticky'
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
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasTransaction, setHasTransaction] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);  // isAdmin 상태 추가

    const fetchData = useCallback(() => {
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
    }, [lecturePackageId]);

    const checkTransactionHistory = useCallback(async (email, provider) => {
        try {
            const response = await axiosClient.post(`/payment/confirmation`, {
                userEmail: email,
                provider: provider,
                lecturePackageId: lecturePackageId
            });
            if (response.data.paymentConfirmation === 'Y') {
                setHasTransaction(true);
            } else {
                setHasTransaction(false);
            }
        } catch (err) {
            console.error("Error checking transaction history:", err);
            setHasTransaction(false);
        }
    }, [lecturePackageId]);

    useEffect(() => {
        const currentNickname = localStorage.getItem("nickname");
        const currentUserEmail = localStorage.getItem("userEmail");
        const currentProvider = localStorage.getItem("provider");
        const currentAdmin = localStorage.getItem("isAdmin") === 'true'; // isAdmin 값 확인

        setAuthNickname(currentNickname);
        setIsAdmin(currentAdmin);  // isAdmin 상태 설정

        const fetchLecturePackageOwner = async () => {
            try {
                const response = await axiosClient.get(`/lecture/owner/${lecturePackageId}`);
                const ownerNickname = response.data.nickname;
                setPackageOwnerNickname(ownerNickname);

                if (currentNickname === ownerNickname || currentAdmin) {
                    setHasTransaction(true);
                } else {
                    checkTransactionHistory(currentUserEmail, currentProvider);
                }
            } catch (error) {
                console.error('Error fetching lecture package owner:', error);
            }
        };

        fetchLecturePackageOwner();
        fetchData();
    }, [lecturePackageId, checkTransactionHistory, fetchData]);

    if (!hasTransaction) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>잘못된 접근입니다.</p>
            <p>결제 후 이용해주세요.</p>
        </div>;
    }    

    return (
        <div style={containerStyle}>
            <div style={listStyle}>
                <LectureList 
                    onSelectLecture={setSelectedLectureId} 
                    lecturePackageId={lecturePackageId} 
                    isOwner={authNickname === packageOwnerNickname || isAdmin} 
                    fetchData={fetchData} 
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
                    {authNickname === packageOwnerNickname && !isAdmin ?
                        <>
                            <Link href={`/lecture/addLecture?lecturePackageId=${lecturePackageId}&nickname=${authNickname}`} legacyBehavior>
                                <button style={buttonStyle}>강의 등록</button>
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
    const lecturePackageId = context.query.lecturePackageId || 1;
    return {
        props: {
            lecturePackageId
        }
    };
};

export default LecturePage;
