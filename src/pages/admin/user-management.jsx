import React from 'react';
import styles from '../../styles/admin/userManagement.module.css';
import Sidebar from "../../components/admin/Sidebar";

const UserManagement = () => {
    return (
        <div className={styles.container}>
           <Sidebar/>
            <div className={styles.content}>
                <h1 className={styles.title}>전체 회원 리스트</h1>
                <div className={styles.filterSection}>
                    <div className={styles.filterRow}>
                        <label>조건 검색</label>
                        <select className={styles.filterSelect}>
                            <option>사용자명</option>
                            <option>아이디</option>
                            <option>전화번호</option>
                            <option>이메일</option>
                        </select>
                        <label>회원 구분</label>
                        <select className={styles.filterSelect}>
                            <option>학생</option>
                            <option>강사</option>
                        </select>
                        <label>기타</label>
                        <select className={styles.filterSelect}>
                            <option>전체</option>
                            <option>진행중</option>
                            <option>종료</option>
                        </select>
                    </div>
                    <div className={styles.filterRow}>
                        <label>날짜</label>
                        <input type="date" className={styles.filterInput} />
                        <span> - </span>
                        <input type="date" className={styles.filterInput} />
                        <button className={styles.filterButton}>조회</button>
                        <button className={styles.filterButton}>초기화</button>
                    </div>
                </div>
                <div className={styles.tableSection}>
                    <table className={styles.userTable}>
                        <thead>
                        <tr>
                            <th>번호</th>
                            <th>이름</th>
                            <th>아이디</th>
                            <th>이메일</th>
                            <th>연락처</th>
                            <th>직급</th>
                            <th>비고</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>관리자</td>
                            <td>ADMIN</td>
                            <td>admin@example.com</td>
                            <td>010-0000-0000</td>
                            <td>관리자</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>김철수</td>
                            <td>USER01</td>
                            <td>test1@example.com</td>
                            <td>010-0000-0001</td>
                            <td>팀원</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>이영희</td>
                            <td>USER02</td>
                            <td>test2@example.com</td>
                            <td>010-0000-0002</td>
                            <td>팀장</td>
                            <td></td>
                        </tr>
                        {/* Add more rows as needed */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;

