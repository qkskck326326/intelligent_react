import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/admin/Sidebar';
import { axiosClient } from "../../axiosApi/axiosClient";
import Link from 'next/link';
import styles from '../../styles/admin/reportList.module.css';

const ReportList = () => {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [currentReportId, setCurrentReportId] = useState(null);
    const [currentNickname, setCurrentNickname] = useState(null);
    const [selectedReportType, setSelectedReportType] = useState("all");

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axiosClient.get('/reports');
                setReports(response.data);
                setFilteredReports(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);


    useEffect(() => {
        filterReports();
    }, [selectedReportType, reports]);
    const filterReports = () => {
        if (selectedReportType === "all") {
            setFilteredReports(reports);
        } else {
            setFilteredReports(reports.filter(
                report => report.reportType === parseInt(selectedReportType)));
        }
    };

    const getReportType = (type) => {
        switch(type) {
            case 0: return '공유게시판';
            case 1: return '공유 댓글';
            case 2: return '채팅';
            case 3: return '강의';
            case 4: return '강의 댓글';
            default: return '신고 컨텐츠 타입이 아닙니다.';
        }
    };

    const handleApprove = async () => {
        if (currentReportId !== null && currentNickname !== null) {
            try {
                await axiosClient.post(`/reports/increment`, null, {
                    params: {
                        nickname: currentNickname,
                        reportId: currentReportId
                    }
                });
                setReports(reports.filter(report => report.reportId !== currentReportId));
            } catch (error) {
                alert('승인에 실패했습니다.');
                console.error(error);
            } finally {
                closeModal();
            }
        }
    };

    const handleDelete = async () => {
        if (currentReportId !== null) {
            try {
                await axiosClient.delete('/reports', { params: { reportId: currentReportId } });
                setReports(reports.filter(report => report.reportId !== currentReportId));
            } catch (error) {
                alert('삭제에 실패했습니다.');
                console.error(error);
            } finally {
                closeModal();
            }
        }
    };

    const openModal = (type, reportId, nickname = null) => {
        setCurrentReportId(reportId);
        setCurrentNickname(nickname);
        setModalType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentReportId(null);
        setCurrentNickname(null);
        setModalType(null);
    };

    const confirmAction = () => {
        if (modalType === 'approve') {
            handleApprove();
        } else if (modalType === 'delete') {
            handleDelete();
        }
    };

    const handleLectureList = (lectureId) => {
        router.push({
            pathname: '/lecture/detail',
            query: { lectureId }
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.container}>

            <div className={styles.mainContent}>
                <select
                    className={styles.filterDropdown}
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value)}
                >
                    <option className={styles.drop} value="all">컨텐츠 종류</option>
                    <option className={styles.drop} value="0">공유게시판</option>
                    <option className={styles.drop} value="1">공유 댓글</option>
                    <option className={styles.drop} value="2">채팅</option>
                    <option className={styles.drop} value="3">강의</option>
                    <option className={styles.drop} value="4">강의 댓글</option>
                </select>

                <div className={styles.tableContent}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>신고인</th>
                            <th>피신고인</th>
                            <th>신고 내용</th>
                            <th>신고 날짜</th>
                            <th>종류</th>
                            <th>승인 여부</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredReports.map(report => (
                            <tr key={report.reportId}>
                                <td>{report.doNickname}</td>
                                <td>{report.receiveNickname}</td>
                                <td>
                                    {(report.reportType === 0 || report.reportType === 1) ? (
                                        <Link href={`/post/${report.contentId}`}>
                                            <span className={styles.customLink}>{report.content}</span>
                                        </Link>
                                    ) : (report.reportType === 3 || report.reportType === 4) ? (
                                        <span className={styles.customLink} onClick={() => handleLectureList(report.contentId)}>{report.content}</span>
                                    ) : (
                                        report.content
                                    )}
                                </td>
                                <td>{new Date(report.reportDate).toLocaleString()}</td>
                                <td>{getReportType(report.reportType)}</td>
                                <td>
                                    <button className={styles.approveButton}
                                            onClick={() => openModal('approve', report.reportId, report.receiveNickname)}>승인
                                    </button>
                                    <button className={styles.deleteButton}
                                            onClick={() => openModal('delete', report.reportId)}>삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <p>{modalType === 'approve' ? '승인처리를 하시겠습니까?' : '정말로 삭제하시겠습니까?'}</p>
                        <button onClick={confirmAction} className={styles.confirmButton}>확인</button>
                        <button onClick={closeModal} className={styles.cancelButton}>취소</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportList;