import React, { useEffect, useState } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "../../styles/admin/reportUser.module.css";
import Pagination from "../../components/common/pagination";

const ReportUser = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const size = 10;

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

    const handleLoginRestriction = (userId) => {
        console.log(`User ${userId} login restricted`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                {loading ? (
                    <p className={styles.loading}>Loading...</p>
                ) : error ? (
                    <p className={styles.error}>Error: {error.message}</p>
                ) : (
                    <>
                        <table className={styles.table}>
                            <thead className={styles.tableHeader}>
                            <tr>
                                <th>Nickname</th>
                                <th>Report Count</th>
                                <th>Login Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.nickname}</td>
                                    <td>{user.reportCount}</td>
                                    <td>{user.loginOk === 'Y' ? '로그인 허용상태' : '로그인 불가상태'}</td>
                                    <td>
                                        <button
                                            onClick={() => handleLoginRestriction(user.id)}
                                            className={styles.restrictButton}
                                        >
                                            Restrict Login
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportUser;