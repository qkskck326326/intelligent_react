import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/user/mypage/educationExperience.module.css";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import { observer } from "mobx-react";

const EducationExperience = observer(() => {
    const [showEducationForm, setShowEducationForm] = useState(false);
    const [showCareerForm, setShowCareerForm] = useState(false);
    const [educationLevel, setEducationLevel] = useState("");
    const [homeAndtransfer, setHomeAndtransfer] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [major, setMajor] = useState("");
    const [educationStatus, setEducationStatus] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [graduationDate, setGraduationDate] = useState("");
    const [passDate, setPassDate] = useState("");
    const [institutionName, setInstitutionName] = useState("");
    const [department, setDepartment] = useState("");
    const [position, setPosition] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [duty, setDuty] = useState("");
    const [educations, setEducations] = useState([]);
    const [careers, setCareers] = useState([]);
    const dateInputRef = useRef(null);
    const nickname = authStore.getNickname();

    useEffect(() => {
        // 서버에서 학력 정보를 가져오는 함수
        const fetchEducationData = async () => {
            try {
                const response = await axiosClient.get('/educations', {params : {nickname : nickname}});
                setEducations(response.data);
            } catch (error) {
                console.error("Error fetching education data:", error);
            }
        };
        // 서버에서 경력 정보를 가져오는 함수
        const fetchCareerData = async () => {
            try {
                const response = await axiosClient.get('/careers', { params: { nickname: nickname } });
                setCareers(response.data);
            } catch (error) {
                console.error("Error fetching career data:", error);
            }
        };

        fetchEducationData();
        fetchCareerData();
    }, [nickname]);

    const toggleEducationForm = () =>{
        //폼내용 초기화
        setEducationLevel("");
        setHomeAndtransfer("");
        setSchoolName("");
        setMajor("");
        setEducationStatus("");
        setEntryDate("");
        setGraduationDate("");
        setPassDate("");
        //폼 닫기
        setShowEducationForm(!showEducationForm)
    };


    const toggleCareerForm = () => {
        //폼내용 초기화
        setInstitutionName("");
        setDepartment("");
        setPosition("");
        setStartDate("");
        setEndDate("");
        setDuty("");
        //폼 닫기
        setShowCareerForm(!showCareerForm)
    };

    const handleEducationLevelChange = (event) => {
        setEducationLevel(event.target.value);
    };

    const handleHomeAndTransferChange = (event) => {
        setHomeAndtransfer(event.target.value);
    };

    const handleDateFocus = (e) => {
        e.currentTarget.type = "month";
        e.currentTarget.showPicker(); // 달력 표시
    };

    const handleDateBlur = (e) => {
        if (!e.currentTarget.value) {
            e.currentTarget.type = "text";
        }
    };

    //학력 insert
    const handleEducationSubmit = async (e) => {
        e.preventDefault();
        const data = {
            nickname,
            educationLevel,
            schoolName,
            major,
            educationStatus,
            entryDate,
            graduationDate,
            homeAndtransfer,
            passDate
        };
        console.log("data : ", data);

        try {
            await axiosClient.post('/educations', data);
            setShowEducationForm(false);
            // 학력 데이터 다시 가져오기
            const response = await axiosClient.get('/educations', { params: { nickname: nickname } });
            setEducations(response.data);
        } catch (error) {
            console.error("Error saving education data:", error);
        }
    };

    //경력 insert
    const handleCareerSubmit = async (e) => {
        e.preventDefault();
        const data = {
            nickname,
            institutionName,
            department,
            position,
            startDate,
            endDate,
            duty
        };

        try {
            await axiosClient.post('/careers', data);
            setShowCareerForm(false);
            // 경력 데이터 다시 가져오기
            const response = await axiosClient.get('/careers', { params: { nickname: nickname } });
            setCareers(response.data);
        } catch (error) {
            console.error("Error saving career data:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h3>학력 {!showEducationForm &&
                    <button className={styles.addButton} onClick={toggleEducationForm}>+ 추가</button>}</h3>
                {!showEducationForm && (
                    <div className={styles.educationList}>
                        {educations.map((education) => (
                            <div key={education.id} className={styles.educationItem}>
                                <div className={styles.educationHeader}>
                                    <span>{education.schoolName}</span>
                                    <span className={styles.wall}>|</span>
                                    <span className={styles.educationDates}>
                                        {education.entryDate} ~ {education.graduationDate}
                                    </span>
                                    <span className={styles.educationLevel}>{education.educationLevel}</span>
                                </div>
                                <div className={styles.educationDetails}>
                                    <span>{education.major}</span>
                                    <span>{education.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {showEducationForm && (
                    <div className={styles.formContainer}>
                        <form onSubmit={handleEducationSubmit}>
                            <div className={styles.formRow}>
                                <select className={styles.formSelect} value={educationLevel}
                                        onChange={handleEducationLevelChange}>
                                    <option value="">학력 구분 선택 *</option>
                                    <option value="highSchool">고등학교 졸업</option>
                                    <option value="university">대학 ◎ 대학원이상 졸업</option>
                                </select>
                                {educationLevel === "highSchool" && (
                                    <>
                                        <select className={styles.formSelect} value={homeAndtransfer}
                                                onChange={handleHomeAndTransferChange}>
                                            <option value="">다른 유형 *</option>
                                            <option value="homeSchool">대입 검정고시</option>
                                            <option value="transfer">편입</option>
                                        </select>
                                        {homeAndtransfer === "homeSchool" && (
                                            <div className={styles.formPassDate}>
                                                <label className={styles.formLabel}></label>
                                                <input
                                                    type="text"
                                                    className={styles.formInput}
                                                    placeholder="합격년월 *"
                                                    onFocus={handleDateFocus}
                                                    onBlur={handleDateBlur}
                                                    value={passDate}
                                                    onChange={(e) => setPassDate(e.target.value)}
                                                    ref={dateInputRef}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {educationLevel === "highSchool" && homeAndtransfer !== "homeSchool" && (
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="학교명 입력 *"
                                            value={schoolName}
                                            onChange={(e) => setSchoolName(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="학과계열 입력 *"
                                            value={major}
                                            onChange={(e) => setMajor(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <select
                                            className={styles.formSelect}
                                            value={educationStatus}
                                            onChange={(e) => setEducationStatus(e.target.value)}
                                        >
                                            <option value="">졸업여부 *</option>
                                            <option value="graduated">졸업</option>
                                            <option value="graduatedExpected">졸업예정</option>
                                            <option value="notGraduated">중퇴</option>
                                            <option value="attending">재학중</option>
                                            <option value="onLeaveOfAbsence">휴학중</option>
                                            <option value="completion">수료</option>
                                            <option value="dropOut">자퇴</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="입학년월 *"
                                            onFocus={handleDateFocus}
                                            onBlur={handleDateBlur}
                                            value={entryDate}
                                            onChange={(e) => setEntryDate(e.target.value)}
                                            ref={dateInputRef}
                                        />
                                    </div>
                                    <span className={styles.periods}> ~ </span>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="졸업년월 *"
                                            onFocus={handleDateFocus}
                                            onBlur={handleDateBlur}
                                            value={graduationDate}
                                            onChange={(e) => setGraduationDate(e.target.value)}
                                            ref={dateInputRef}
                                        />
                                    </div>
                                </div>
                            )}

                            {educationLevel === "university" && (
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>대학 구분 *</label>
                                        <select
                                            className={styles.formSelect}
                                            value={educationLevel}
                                            onChange={(e) => setEducationLevel(e.target.value)}
                                        >
                                            <option value="undergraduate">학사</option>
                                            <option value="graduate">석사</option>
                                            <option value="phd">박사</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>학교명 *</label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="학교명 입력"
                                            value={schoolName}
                                            onChange={(e) => setSchoolName(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>전공 *</label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="전공 입력"
                                            value={major}
                                            onChange={(e) => setMajor(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>졸업여부 *</label>
                                        <select
                                            className={styles.formSelect}
                                            value={educationStatus}
                                            onChange={(e) => setEducationStatus(e.target.value)}
                                        >
                                            <option value="graduated">졸업</option>
                                            <option value="notGraduated">미졸업</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="입학년월"
                                            onFocus={handleDateFocus}
                                            onBlur={handleDateBlur}
                                            value={entryDate}
                                            onChange={(e) => setEntryDate(e.target.value)}
                                            ref={dateInputRef}
                                        />
                                    </div>
                                    <span className={styles.periods}> ~ </span>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="졸업년월"
                                            onFocus={handleDateFocus}
                                            onBlur={handleDateBlur}
                                            value={graduationDate}
                                            onChange={(e) => setGraduationDate(e.target.value)}
                                            ref={dateInputRef}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className={styles.bottonGroup}>
                                <button type="button" className={styles.cancelBtn} onClick={toggleEducationForm}>취소
                                </button>
                                <button type="submit" className={styles.saveBtn} onClick={handleEducationSubmit}> 저장</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            <div className={styles.section}>
                <h3>경력 {!showCareerForm &&
                    <button className={styles.addButton} onClick={toggleCareerForm}>+ 추가</button>}</h3>
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
                                    <span className={styles.careerDuration}>{career.duration}</span>
                                </div>
                                <div className={styles.careerDetails}>
                                    <span>{career.department}</span>
                                    <span>{career.position}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {showCareerForm && (
                    <div className={styles.formContainer}>
                        <form onSubmit={handleCareerSubmit}>

                            <div className={styles.careerFormRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}></label>
                                    <input
                                        type="text"
                                        placeholder="회사명 *"
                                        className={styles.careerFormInput}
                                        value={institutionName}
                                        onChange={(e) => setInstitutionName(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}></label>
                                    <input
                                        type="text"
                                        placeholder="근무부서 *"
                                        className={styles.careerFormInput}
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}></label>
                                    <input
                                        type="text"
                                        placeholder="직위/직책 *"
                                        className={styles.careerFormInput}
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
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
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
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
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
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
                                        value={duty}
                                        onChange={(e) => setDuty(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            <div className={styles.bottonGroup}>
                                <button type="button" className={styles.cancelBtn} onClick={toggleCareerForm}>취소
                                </button>
                                <button type="submit" className={styles.saveBtn}>저장</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
});

export default EducationExperience;