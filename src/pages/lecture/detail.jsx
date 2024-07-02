import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LectureDetail from '../../components/lecture/lectureDetail';
import LectureComment from '../../components/lecture/lectureComment';
import Transportext from '../../components/lecture/transportext';
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

    const [hasTransaction, setHasTransaction] = useState(false);
    const [authNickname, setAuthNickname] = useState('');
    const [packageOwnerNickname, setPackageOwnerNickname] = useState('');

    const checkTransactionHistory = async (email, provider) => {
        try {
            const response = await axiosClient.post(`/payment/confirmation`, {
                userEmail: email,
                provider: provider,
                lecturePackageId: lectureId
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
    };

    useEffect(() => {
        if (lectureId) {
            const currentUserEmail = localStorage.getItem("userEmail");
            const currentProvider = localStorage.getItem("provider");
            const currentNickname = localStorage.getItem("nickname");

            setAuthNickname(currentNickname);

            const fetchLecturePackageOwner = async () => {
                try {
                    const response = await axiosClient.get(`/lecture/owner/${lectureId}`);
                    const ownerNickname = response.data.nickname;
                    setPackageOwnerNickname(ownerNickname);

                    if (currentNickname === ownerNickname) {
                        setHasTransaction(true);
                    } else {
                        checkTransactionHistory(currentUserEmail, currentProvider);
                    }
                } catch (error) {
                    console.error('Error fetching lecture package owner:', error);
                }
            };

            fetchLecturePackageOwner();
        }
    }, [lectureId]);

    if (!hasTransaction) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>잘못된 접근입니다.</p>
            <p>결제 후 이용해주세요.</p>
        </div>;
    }

    return (
        <div style={containerStyle}>
            <div style={leftSideStyle}>
                {lectureId ? <LectureDetail lectureId={lectureId} /> : <p>Loading...</p>}
                {lectureId ? <LectureComment lectureId={lectureId} /> : <p>Loading...</p>}
            </div>
            <div style={verticalLineStyle}></div>
            <div style={rightSideStyle}>
                {lectureId && <Transportext lectureId={lectureId} />}
            </div>
        </div>
    );
};

export default LectureDetailPage;
