import React, { useState, useEffect, useRef } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import { observer } from "mobx-react";
import styles from '../../styles/user/mypage/complete.module.css';

const Completion = observer(() => {
    const [completes, setCompletes] = useState([]);
    const [packageInfo, setPackageInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const canvasRef = useRef(null);

    const nickname = authStore.getNickname();

    useEffect(() => {
        const fetchCompletes = async (nickname) => {
            try {
                const responseUser = await axiosClient.get(`/completes/user/${nickname}`);
                setUser(responseUser.data);
                console.log("responseUser.data : ", responseUser.data);

                const response = await axiosClient.get(`/completes/${nickname}`);
                setCompletes(response.data);
                response.data.forEach(async (complete) => {
                    const packageResponse = await axiosClient.get('/packages/detail', {
                        params: {
                            lecturePackageId: complete.lecturePackageId
                        }
                    });
                    setPackageInfo(prevState => ({
                        ...prevState,
                        [complete.lecturePackageId]: packageResponse.data
                    }));
                });
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompletes(nickname);
    }, [nickname]);

    const handleDownload = (complete) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.src = '/images/complete_base.jpg'; // Next.js public 폴더의 이미지 경로
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // 데이터가 로드된 후에만 텍스트 추가
            if (user && packageInfo[complete.lecturePackageId]) {
                ctx.font = 'bold 50px Arial';
                ctx.fillStyle = 'black';
                ctx.fillText('수료증', canvas.width / 2 - 80, 330);

                ctx.font = 'bold 20px Arial';
                ctx.fillText('Certificate of Appreciation', canvas.width / 2 - 130, 395);

                ctx.font = 'normal 20px Arial'; // 텍스트 크기 조정
                ctx.fillText(`성명: ${user.userName}`, 150, 500); // 텍스트 위치 조정
                ctx.fillText(`이메일: ${user.userId.userEmail}`, 150, 550); // 텍스트 위치 조정
                ctx.fillText(`과정명: ${packageInfo[complete.lecturePackageId]?.title}`, 150, 600); // 텍스트 위치 조정

                ctx.font = 'bold 20px Arial'; // 텍스트 크기 조정
                ctx.fillText('위 사람은 IntelliClass에서 해당 교육 과정을', 185, 680);
                ctx.fillText('성실히 수행하였기에 이 수료증을 수여합니다.', 185, 710);

                const registerDate = new Date(packageInfo[complete.lecturePackageId]?.registerDate);
                const formattedDate = `${registerDate.getFullYear()}년 ${registerDate.getMonth() + 1}월 ${registerDate.getDate()}일`;
                ctx.fillText(`발급일: ${formattedDate}`, canvas.width - 500, canvas.height - 330); // 텍스트 위치 조정
                ctx.fillText('(주) IntelliClass', canvas.width - 470, canvas.height - 300); // 텍스트 위치 조정

                const link = document.createElement('a');
                link.download = 'certificate.jpg';
                link.href = canvas.toDataURL();
                link.click();
            }
        };
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.completionContainer}>
            <h1>수료증 목록</h1>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            {completes.length > 0 ? (
                <table className={styles.completionTable}>
                    <thead>
                    <tr>
                        <th>썸네일</th>
                        <th>패키지 제목</th>
                        <th>수료증</th>
                    </tr>
                    </thead>
                    <tbody>
                    {completes.map(complete => (
                        <tr key={complete.completeId}>
                            <td><img src={packageInfo[complete.lecturePackageId]?.thumbnail} alt="Thumbnail" className={styles.completionThumbnail} /></td>
                            <td>{packageInfo[complete.lecturePackageId]?.title}</td>
                            <td className={styles.completionDownload}>
                                <button onClick={() => handleDownload(complete)}>다운로드</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>수료증이 없습니다.</p>
            )}
        </div>
    );
});

export default Completion;