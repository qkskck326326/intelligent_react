import React, { useEffect, useState } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/admin/UserManagement.module.css';
import Sidebar from "../../components/admin/Sidebar";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10); // 페이지당 항목 수
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [userType, setUserType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]); // 선택된 사용자들

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosClient.get('/admins/users', {
                    params: {
                        page,
                        size,
                        searchQuery,
                        searchValue,
                        userType,
                        startDate,
                        endDate
                    }
                });
                console.log(response.data); // API 응답 데이터 로그 출력
                setUsers(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [page, size, searchQuery, searchValue, userType, startDate, endDate]);

    const handleSearch = () => {
        setPage(0);
    };

    const handleReset = () => {
        setSearchQuery('');
        setSearchValue('');
        setUserType('');
        setStartDate('');
        setEndDate('');
        setPage(0);
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUsers((prevSelected) => {
            if (prevSelected.includes(user)) {
                return prevSelected.filter((selected) => selected !== user);
            } else {
                return [...prevSelected, user];
            }
        });
    };

    const handleDeleteSelected = async () => {
        try {
            const reason = prompt('삭제 이유를 입력하세요.');  // 삭제 이유를 입력받습니다.
            if (reason) {
                const payload = selectedUsers.map(user => ({
                    email: user.userEmail,
                    provider: user.provider,
                    reason
                }));
                await axiosClient.post('/admins/delete-users', payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user)));
                setSelectedUsers([]);
            }
        } catch (error) {
            console.error('Error deleting users:', error);
        }
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.content}>
                <h1 className={styles.title}>전체 회원 리스트</h1>
                <div className={styles.filterSection}>
                    <div className={styles.filterRow}>
                        <label>조건 검색</label>
                        <select
                            className={styles.filterSelect}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="name">사용자명</option>
                            <option value="id">아이디</option>
                            <option value="phone">전화번호</option>
                            <option value="email">이메일</option>
                        </select>
                        {searchQuery && (
                            <input
                                type="text"
                                className={styles.filterInput}
                                placeholder={`검색할 ${searchQuery} 입력`}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        )}
                        <label>회원 구분</label>
                        <select
                            className={styles.filterSelect}
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="0">학생</option>
                            <option value="1">강사</option>
                        </select>
                    </div>
                    <div className={styles.filterRow}>
                        <label>날짜</label>
                        <input
                            type="date"
                            className={styles.filterInput}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <span> - </span>
                        <input
                            type="date"
                            className={styles.filterInput}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <button className={styles.filterButton} onClick={handleSearch}>조회</button>
                        <button className={styles.filterButton} onClick={handleReset}>초기화</button>
                    </div>
                </div>
                <br/>
                <button className={styles.filterButton} onClick={handleDeleteSelected}>삭제</button>
                <br/>
                <br/>
                <div className={styles.tableSection}>
                    <table className={styles.userTable}>
                        <thead>
                        <tr>
                            <th>선택</th>
                            <th>번호</th>
                            <th>이름</th>
                            <th>아이디</th>
                            <th>이메일</th>
                            <th>연락처</th>
                            <th>가입 날짜</th>
                            <th>직급</th>
                            <th>비고</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={`${user.userEmail}-${user.provider}`}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user)}
                                            onChange={() => handleSelectUser(user)}
                                        />
                                    </td>
                                    <td>{page * size + index + 1}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.userEmail}</td>
                                    <td>{user.userEmail}</td>
                                    <td>{user.phone}</td>
                                    <td>{new Date(user.registerTime).toLocaleDateString()}</td>
                                    <td>{user.userType === 0 ? '학생' : user.userType === 1 ? '강사' : '관리자'}</td>
                                    <td></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">데이터가 없습니다</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        <button onClick={handlePreviousPage} disabled={page === 0}>
                            이전
                        </button>
                        <span>{page + 1} / {totalPages}</span>
                        <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                            다음
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
