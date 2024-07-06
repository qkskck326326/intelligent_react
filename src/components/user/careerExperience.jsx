import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/user/mypage/educationExperience.module.css";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore"
import { observer } from "mobx-react";
import { LuPencilLine } from "react-icons/lu";
import { differenceInMonths, parseISO } from 'date-fns';

const CareerExperience = observer(() => {
    const [showCareerForm, setShowCareerForm] = useState(false);
    const [careerForm, setCareerForm] = useState({
        institutionName: "",
        department: "",
        position: "",
        startDate: "",
        endDate: "",
        responsibilities: ""
    });
    const [careers, setCareers] = useState([]);
    const [editCareerId, setEditCareerId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [totalCareer, setTotalCareer] = useState("");
    const dateInputRef = useRef(null);
    const nickname = authStore.getNickname();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchCareerData = async () => {
            try {
                const response = await axiosClient.get('/careers', { params: { nickname: nickname } });
                setCareers(response.data);
                console.log("career : ", response.data);

                const totalMonths = response.data.reduce((total, career) => {
                    const start = parseISO(career.startDate);
                    const end = parseISO(career.endDate);
                    return total + differenceInMonths(end, start);
                }, 0);

                setTotalCareer(totalMonths);
            } catch (error) {
                console.error("Error fetching career data:", error);
            }
        };

        fetchCareerData();
    }, [nickname]);

    const handleCareerSubmit = async (e) => {
        e.preventDefault();
        const { institutionName, department, position, startDate, endDate, responsibilities } = careerForm;

        if (!institutionName || !department || !position || !startDate || !endDate || !responsibilities) {
            setErrorMessage("모든 필수 입력 값을 입력해 주세요.");
            return;
        }
        setErrorMessage("");
        try {
            if (isEditing) {
                const data = { nickname, ...careerForm, careerId: editCareerId };
                await axiosClient.put('/careers', data);
            } else {
                const data = { nickname, ...careerForm };
                await axiosClient.post('/careers', data);
            }
            setShowCareerForm(false);
            const response = await axiosClient.get('/careers', { params: { nickname: nickname } });
            setCareers(response.data);

            const totalMonths = response.data.reduce((total, career) => {
                const start = parseISO(career.startDate);
                const end = parseISO(career.endDate);
                return total + differenceInMonths(end, start);
            }, 0);
            setTotalCareer(totalMonths);

            setEditCareerId(null);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving career data:", error);
        }
    };

    const handleEditCareer = (career) => {
        setCareerForm({
            institutionName: career.institutionName,
            department: career.department,
            position: career.position,
            startDate: career.startDate,
            endDate: career.endDate,
            responsibilities: career.responsibilities
        });
        setShowCareerForm(true);
        setEditCareerId(career.careerId);
        setIsEditing(true);
    };

    const handleDeleteCareer = async (careerId) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                console.log("careerId : ", careerId);
                await axiosClient.delete(`/careers/${careerId}`);
                const updatedCareers = careers.filter(career => career.careerId !== careerId);
                setCareers(updatedCareers);

                const totalMonths = updatedCareers.reduce((total, career) => {
                    const start = parseISO(career.startDate);
                    const end = parseISO(career.endDate);
                    return total + differenceInMonths(end, start);
                }, 0);
                setTotalCareer(totalMonths);
            } catch (error) {
                console.error("Error deleting career:", error);
            }
        }
    };

    const toggleCareerForm = () => {
        setCareerForm({
            institutionName: "",
            department: "",
            position: "",
            startDate: "",
            endDate: "",
            responsibilities: ""
        });
        setShowCareerForm(!showCareerForm);
        setEditCareerId(null);
        setIsEditing(false);
        setErrorMessage("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCareerForm(prevState => ({ ...prevState, [name]: value }));
    };

    const handleDateFocus = (e) => {
        e.currentTarget.type = "month";
        e.currentTarget.showPicker();
    };

    const handleDateBlur = (e) => {
        if (!e.currentTarget.value) {
            e.currentTarget.type = "text";
        }
    };

    return (
        <div className={styles.section}>
            <h3 className={styles.h3Font}>
                <div className={styles.headerRight}>
                    <span>경력</span>
                    {!showCareerForm && (
                        <>
                            <button className={styles.addButton2} onClick={toggleCareerForm}>+ 추가</button>
                            <span className={styles.totalCareer}>경력 총계: {totalCareer}개월</span>
                        </>
                    )}
                </div>
            </h3>

            <div className={styles.horizontalLine}></div>

            {!showCareerForm && (
                <div className={styles.careerList}>

                    {careers.map((career) => (

                        <div key={career.id} className={styles.careerItem}>
                            <div className={styles.careerHeader}>
                                <span>{career.institutionName}</span>
                                <span className={styles.wall}>|</span>
                                <span className={styles.careerDates}>
                                    {career.startDate} ~ {career.endDate}
                                </span>
                                <span className={styles.position}>({career.position})</span>
                                <span className={styles.icons}>
                                    <LuPencilLine onClick={() => handleEditCareer(career)}/>
                                    <span role="img" aria-label="delete"
                                          onClick={() => handleDeleteCareer(career.careerId)}>🗑️</span>
                                </span>
                            </div>
                            <div className={styles.careerDetails}>
                                <span>{career.department}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showCareerForm && (
                <div className={styles.formContainer}>
                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                    <form onSubmit={handleCareerSubmit}>
                        <div className={styles.careerFormRow}>
                            <div>
                                <label className={styles.formLabel}></label>
                                <input
                                    type="text"
                                    placeholder="회사명 *"
                                    className={styles.careerFormInput}
                                    name="institutionName"
                                    value={careerForm.institutionName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className={styles.formLabel}></label>
                                <input
                                    type="text"
                                    placeholder="근무부서 *"
                                    className={styles.careerFormInput}
                                    name="department"
                                    value={careerForm.department}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className={styles.formLabel}></label>
                                <input
                                    type="text"
                                    placeholder="직위/직책 *"
                                    className={styles.careerFormInput}
                                    name="position"
                                    value={careerForm.position}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className={styles.careerFormRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}></label>
                                <input
                                    type="text"
                                    className={styles.careerFormInput}
                                    placeholder="입사년월 *"
                                    onFocus={handleDateFocus}
                                    onBlur={handleDateBlur}
                                    name="startDate"
                                    value={careerForm.startDate}
                                    onChange={handleInputChange}
                                    ref={dateInputRef}
                                />
                            </div>
                            <span className={styles.period}> ~ </span>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}></label>
                                <input
                                    type="text"
                                    className={styles.careerFormInput}
                                    placeholder="퇴사년월 *"
                                    onFocus={handleDateFocus}
                                    onBlur={handleDateBlur}
                                    name="endDate"
                                    value={careerForm.endDate}
                                    onChange={handleInputChange}
                                    ref={dateInputRef}
                                />
                            </div>
                        </div>

                        <div className={styles.careerFormRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>직무 *</label>
                                <textarea
                                    placeholder="직무 입력"
                                    className={styles.workFormInput}
                                    name="responsibilities"
                                    value={careerForm.responsibilities}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>

                        <div className={styles.bottonGroup}>
                            <button type="button" className={styles.cancelBtn} onClick={toggleCareerForm}>취소</button>
                            <button type="submit" className={styles.saveBtn}>{isEditing ? "수정" : "저장"}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
});

export default CareerExperience;