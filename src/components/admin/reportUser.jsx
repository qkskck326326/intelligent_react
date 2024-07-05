import React, { useEffect, useState } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "../../styles/admin/reportUser.module.css";
import Pagination from "../../components/common/pagination";

const ReportUser = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [page, setPage] = useState(1);
    const size = 10;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [filter, setFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentNickname, setCurrentNickname] = useState('');
    const [currentLoginOk, setCurrentLoginOk] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async (size, page) => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosClient.get('/users/all', {
                    params: {
                        size: size,
                        page: page
                    }
                });
                const responseData = response.data;
                setUsers(responseData.content);
                setFilteredUsers(responseData.content);
                setTotalPages(responseData.totalPages);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers(size, page);
    }, [page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleLoginRestriction = async (nickname) => {
        try {
            const response = await axiosClient.put(`/users/restrictlogin`, nickname, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
            const updatedUser = response.data;
            setUsers(prevUsers =>
                prevUsers.map(user => user.nickname === updatedUser.nickname ? updatedUser : user)
            );
            setFilteredUsers(prevUsers =>
                prevUsers.map(user => user.nickname === updatedUser.nickname ? updatedUser : user)
            );
        } catch (err) {
            setError(err);
        }
    };

    const handleFilterChange = (event) => {
        const filterValue = event.target.value;
        setFilter(filterValue);
        if (filterValue === '로그인 제한') {
            setFilteredUsers(users.filter(user => user.loginOk === 'N'));
        } else if (filterValue === '로그인 가능') {
            setFilteredUsers(users.filter(user => user.loginOk === 'Y'));
        } else {
            setFilteredUsers(users);
        }
    };

    const openModal = (nickname, loginOk) => {
        setCurrentNickname(nickname);
        setCurrentLoginOk(loginOk);
        setModalMessage(loginOk === 'Y' ? '해당 유저의 로그인을 제한하시겠습니까?' : '해당 유저의 로그인을 허용하시겠습니까?');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const confirmRestriction = () => {
        handleLoginRestriction(currentNickname);
        closeModal();
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.filterContainer}>
                    <label htmlFor="filter" className={styles.filterLabel}></label>
                    <select
                        id="filter"
                        value={filter}
                        onChange={handleFilterChange}
                        className={styles.select}
                    >
                        <option value="">전체</option>
                        <option value="로그인 제한">로그인 제한</option>
                        <option value="로그인 가능">로그인 가능</option>
                    </select>
                </div>
                {loading ? (
                    <p className={styles.loading}>Loading...</p>
                ) : error ? (
                    <p className={styles.error}>Error: {error.message}</p>
                ) : (
                    <>
                        <table className={styles.table}>
                            <thead className={styles.tableHeader}>
                            <tr>
                                <th>사용자</th>
                                <th>신고 수</th>
                                <th>로그인 상태</th>
                                <th>로그인 제한 여부</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.nickname}</td>
                                    <td>{user.reportCount}</td>
                                    <td>{user.loginOk === 'Y' ? '로그인 가능' : '로그인 제한'}</td>
                                    <td>
                                        <button
                                            onClick={() => openModal(user.nickname, user.loginOk)}
                                            className={styles.restrictButton}
                                        >
                                            {user.loginOk === 'Y' ? '제한하기' : '허용하기'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className={styles.pagination}>
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <p>{modalMessage}</p>
                        <div className={styles.buttons}>
                            <button className={styles.confirmButton} onClick={confirmRestriction}>확인</button>
                            <button className={styles.cancelButton} onClick={closeModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportUser;