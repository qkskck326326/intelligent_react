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

    const [hasAccess, setHasAccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkTransactionHistory = async (email, provider, lecturePackageId) => {
        try {
            const response = await axiosClient.post(`/payment/confirmation`, {
                userEmail: email,
                provider: provider,
                lecturePackageId: lecturePackageId
            });
            console.log("Transaction History Response: ", response.data);
            return response.data.paymentConfirmation === 'Y';
        } catch (err) {
            console.error("Error checking transaction history:", err);
            return false;
        }
    };

    const checkPackageOwner = async (lecturePackageId) => {
        try {
            const response = await axiosClient.get(`/lecture/owner/${lecturePackageId}`);
            console.log("Package Owner Response: ", response.data);
            return response.data.nickname;
        } catch (err) {
            console.error('Error fetching lecture package owner:', err);
            return null;
        }
    };

    const getLectureDetail = async (lectureId) => {
        try {
            const response = await axiosClient.get(`/lecture/detail/${lectureId}`);
            return response.data;
        } catch (err) {
            console.error("Error fetching lecture detail:", err);
            return null;
        }
    };

    useEffect(() => {
        if (lectureId) {
            const currentUserEmail = localStorage.getItem("userEmail");
            const currentProvider = localStorage.getItem("provider");
            const currentNickname = localStorage.getItem("nickname");
            const currentAdmin = localStorage.getItem("isAdmin") === 'true'; // isAdmin 값 확인

            const fetchAccessInfo = async () => {
                const lectureDetail = await getLectureDetail(lectureId);
                if (lectureDetail) {
                    const ownerNickname = await checkPackageOwner(lectureDetail.lecturePackageId);
                    console.log("Owner Nickname: ", ownerNickname);
                    const isOwner = ownerNickname === currentNickname;
                    if (isOwner || currentAdmin) {
                        setHasAccess(true);
                    } else {
                        const hasTransaction = await checkTransactionHistory(currentUserEmail, currentProvider, lectureDetail.lecturePackageId);
                        console.log("Has Transaction: ", hasTransaction);
                        setHasAccess(hasTransaction);
                    }
                }
                setLoading(false);
            };

            fetchAccessInfo();
        }
    }, [lectureId]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</div>;
    }

    if (!hasAccess) {
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
