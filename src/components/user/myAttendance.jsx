import React, { useEffect, useState } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import styles from '../../styles/user/mypage/myAttendance.module.css';

const MyAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const email = authStore.email;
    const provider = authStore.provider;

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axiosClient.get(`/users/select-attendance/${authStore.getUserEmail()}/${authStore.getProvider()}`);
                console.log('Attendance data:', response.data);
                setAttendance(response.data);
            } catch (error) {
                console.error('Failed to fetch attendance data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [email, provider, currentDate]);

    const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
    const month = currentDate.getMonth() + 1; // JavaScript에서 월은 0부터 시작하므로 +1
    const year = currentDate.getFullYear();

    const handleMonthClick = () => {
        setShowMonthDropdown(!showMonthDropdown);
        setShowYearDropdown(false);
    };

    const handleYearClick = () => {
        setShowYearDropdown(!showYearDropdown);
        setShowMonthDropdown(false);
    };

    const handleMonthSelect = (month) => {
        setCurrentDate(new Date(year, month - 1));
        setShowMonthDropdown(false);
    };

    const handleYearSelect = (year) => {
        setCurrentDate(new Date(year, month - 1));
        setShowYearDropdown(false);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 2));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month));
    };

    const renderCalendar = () => {
        const firstDay = new Date(year, month - 1, 1).getDay();
        const days = daysInMonth(month, year);
        const weeks = [];
        let date = 1;

        // 요일 헤더
        const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

        weeks.push(
            <div key="daysOfWeek" className={styles.week}>
                {daysOfWeek.map(day => (
                    <div key={day} className={styles.dayOfWeek}>{day}</div>
                ))}
            </div>
        );

        for (let i = 0; i < 6; i++) {
            const week = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    week.push(<div key={`empty-${i}-${j}`} className={styles.day}></div>);
                } else if (date > days) {
                    week.push(<div key={`empty-${i}-${j}`} className={styles.day}></div>); // 빈 칸 추가
                } else {
                    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    const isPresent = attendance.some(record => record.attendanceTime === formattedDate);
                    week.push(
                        <div key={date} className={styles.day}>
                            <div className={isPresent ? styles.present : styles.absent}>
                                {date}
                            </div>
                        </div>
                    );
                    date++;
                }
            }
            weeks.push(<div key={i} className={styles.week}>{week}</div>);
        }
        return weeks;
    };

    const renderMonthDropdown = () => (
        <div className={styles.monthDropdown}>
            {Array.from({ length: 12 }, (_, i) => (
                <div
                    key={i + 1}
                    className={styles.monthOption}
                    onClick={() => handleMonthSelect(i + 1)}
                >
                    {i + 1}월
                </div>
            ))}
        </div>
    );

    const renderYearDropdown = () => {
        const startYear = Math.floor(year / 10) * 10;
        const years = Array.from({ length: 12 }, (_, i) => startYear + i);

        return (
            <div className={styles.yearDropdown}>
                {years.map(y => (
                    <div
                        key={y}
                        className={styles.yearOption}
                        onClick={() => handleYearSelect(y)}
                    >
                        {y}
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.attendanceContainer}>
            <div className={styles.couponBanner}>
                <div className={styles.couponItem}>1주 연속 출석시 <br></br><span>5%</span> 쿠폰 지급</div>
                <div className={styles.couponItem}>2주 연속 출석시 <br></br><span>12%</span> 쿠폰 지급</div>
                <div className={styles.couponItem}>3주 연속 출석시 <br></br><span>20%</span> 쿠폰 지급</div>
            </div>
            <div className={styles.calendar}>
                <div style={{ display: 'block', fontSize: '2rem', marginBlockStart: '0.83em', marginBlockEnd: '0.83em', marginInlineStart: '0px', marginInlineEnd: '0px', fontWeight: 'bold', textAlign: 'center' }}>
                    나의 출석 관리
                </div>
                <div className={styles.calendarHeader}>
                    <button className={styles.navButton} onClick={handlePrevMonth}>◀</button>
                    <span onClick={handleMonthClick}>
                        {year}년 {month}월
                        <span className={styles.dropdownArrow}></span>
                    </span>
                    <button className={styles.navButton} onClick={handleNextMonth}>▶</button>
                </div>
                {showMonthDropdown && renderMonthDropdown()}
                {showYearDropdown && renderYearDropdown()}
                {renderCalendar()}
            </div>
        </div>
    );
};

export default MyAttendance;
