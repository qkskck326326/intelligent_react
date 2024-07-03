import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/user/enroll/enrollEducationExperience.module.css";
import { LuPencilLine } from "react-icons/lu";
import { differenceInMonths, parseISO } from 'date-fns';

const EnrollEducationExperience = ({ nextPage, prevPage, educationExperience, careerExperience, setEducationExperience, setCareerExperience }) => {
    const [showEducationForm, setShowEducationForm] = useState(false);
    const [showCareerForm, setShowCareerForm] = useState(false);
    const [educationForm, setEducationForm] = useState({
        educationLevel: "",
        universityLevel: "",
        homeAndTransfer: "",
        schoolName: "",
        major: "",
        educationStatus: "",
        entryDate: "",
        graduationDate: "",
        passDate: ""
    });
    const [careerForm, setCareerForm] = useState({
        institutionName: "",
        department: "",
        position: "",
        startDate: "",
        endDate: "",
        responsibilities: ""
    });
    const [educations, setEducations] = useState([]);
    const [careers, setCareers] = useState([]);
    const [editEducationId, setEditEducationId] = useState(null);
    const [editCareerId, setEditCareerId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [careerErrorMessage, setCareerErrorMessage] = useState(""); // New state for career form error message
    const [totalCareer, setTotalCareer] = useState("");
    const dateInputRef = useRef(null);

    useEffect(() => {
        setEducations(educationExperience);
        setCareers(careerExperience);
    }, [educationExperience, careerExperience]);

    useEffect(() => {
        // 경력 총계 재계산
        const totalMonths = careers.reduce((total, career) => {
            const start = parseISO(career.startDate);
            const end = parseISO(career.endDate);
            return total + differenceInMonths(end, start);
        }, 0);
        setTotalCareer(totalMonths);
    }, [careers]);

    const handleEducationSubmit = (e) => {
        e.preventDefault();

        const { educationLevel, universityLevel, homeAndTransfer, schoolName, major, educationStatus, entryDate, graduationDate, passDate } = educationForm;

        if (!educationLevel) {
            setErrorMessage("학력 구분을 선택해 주세요.");
            return;
        }

        if ((educationLevel === "highSchool" || educationLevel === "middleSchool") && !homeAndTransfer && (!schoolName || !major || !educationStatus || !entryDate || !graduationDate)) {
            setErrorMessage("모든 필수 입력 값을 입력해 주세요.");
            return;
        }

        if ((educationLevel === "highSchool" || educationLevel === "middleSchool") && homeAndTransfer === "homeSchool" && !passDate) {
            setErrorMessage("합격년월을 입력해 주세요.");
            return;
        }

        if (educationLevel === "university" && (!universityLevel || !schoolName || !major || !educationStatus || !entryDate || !graduationDate)) {
            setErrorMessage("모든 필수 입력 값을 입력해 주세요.");
            return;
        }

        setErrorMessage("");

        if (isEditing) {
            const updatedEducations = educations.map(edu => edu.id === editEducationId ? { id: editEducationId, ...educationForm } : edu);
            setEducations(updatedEducations);
        } else {
            setEducations([...educations, { id: Date.now(), ...educationForm }]);
        }

        setShowEducationForm(false);
        setIsEditing(false);
        setEditEducationId(null);
        setEducationForm({
            educationLevel: "",
            universityLevel: "",
            homeAndTransfer: "",
            schoolName: "",
            major: "",
            educationStatus: "",
            entryDate: "",
            graduationDate: "",
            passDate: ""
        });
    };

    const handleCareerSubmit = (e) => {
        e.preventDefault();

        const { institutionName, department, position, startDate, endDate, responsibilities } = careerForm;

        if (!institutionName || !department || !position || !startDate || !endDate || !responsibilities) {
            setCareerErrorMessage("모든 필수 입력 값을 입력해 주세요.");
            return;
        }

        setCareerErrorMessage("");

        if (isEditing) {
            const updatedCareers = careers.map(car => car.id === editCareerId ? { id: editCareerId, ...careerForm } : car);
            setCareers(updatedCareers);
        } else {
            setCareers([...careers, { id: Date.now(), ...careerForm }]);
        }

        setShowCareerForm(false);
        setIsEditing(false);
        setEditCareerId(null);
        setCareerForm({
            institutionName: "",
            department: "",
            position: "",
            startDate: "",
            endDate: "",
            responsibilities: ""
        });

        // 경력 총계 재계산
        const totalMonths = careers.reduce((total, career) => {
            const start = parseISO(career.startDate);
            const end = parseISO(career.endDate);
            return total + differenceInMonths(end, start);
        }, 0);
        setTotalCareer(totalMonths);
    };

    const handleEditEducation = (education) => {
        setEducationForm({
            educationLevel: education.educationLevel,
            universityLevel: education.universityLevel,
            homeAndTransfer: education.homeAndTransfer,
            schoolName: education.schoolName,
            major: education.major,
            educationStatus: education.educationStatus,
            entryDate: education.entryDate,
            graduationDate: education.graduationDate,
            passDate: education.passDate
        });
        setShowEducationForm(true);
        setEditEducationId(education.id);
        setIsEditing(true);
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
        setEditCareerId(career.id);
        setIsEditing(true);
    };

    const handleDeleteEducation = (educationId) => {
        const updatedEducations = educations.filter(education => education.id !== educationId);
        setEducations(updatedEducations);
    };

    const handleDeleteCareer = (careerId) => {
        const updatedCareers = careers.filter(career => career.id !== careerId);
        setCareers(updatedCareers);

        // 경력 총계 재계산
        const totalMonths = updatedCareers.reduce((total, career) => {
            const start = parseISO(career.startDate);
            const end = parseISO(career.endDate);
            return total + differenceInMonths(end, start);
        }, 0);
        setTotalCareer(totalMonths);
    };

    const toggleEducationForm = () => {
        setEducationForm({
            educationLevel: "",
            universityLevel: "",
            homeAndTransfer: "",
            schoolName: "",
            major: "",
            educationStatus: "",
            entryDate: "",
            graduationDate: "",
            passDate: ""
        });
        setShowEducationForm(!showEducationForm);
        setEditEducationId(null);
        setIsEditing(false);
        setErrorMessage("");
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
        setCareerErrorMessage(""); // Reset career error message
    };

    const handleInputChange = (e, formSetter) => {
        const { name, value } = e.target;
        formSetter(prevState => ({ ...prevState, [name]: value }));
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
        <div className={styles.container}>
            <span className={styles.spanAlert}>※ 미 입력시 강사 승인이 되지 않을 수 있습니다.</span>
            <div className={styles.section}>
                <h3 className={styles.h3Font}>
                    학력 {!showEducationForm &&
                    <button className={styles.addButton1} onClick={toggleEducationForm}>+ 추가</button>}
                </h3>
                <div className={styles.horizontalLine}></div>
                {!showEducationForm && (
                    <div className={styles.educationList}>
                        {educations.map((education) => (
                            <div key={education.id} className={styles.educationItem}>
                                <div className={styles.educationHeader}>
                                    <span>
                                        {education.homeAndTransfer === "homeSchool" ? "대입 검정고시" : education.schoolName}
                                    </span>
                                    <span className={styles.wall}>|</span>
                                    <span className={styles.educationDates}>
                                        {education.homeAndTransfer === "homeSchool" ? education.passDate : `${education.entryDate} ~ ${education.graduationDate}`}
                                    </span>
                                    <span className={styles.educationLevel}>{education.educationLevel}</span>
                                    <span className={styles.icons}>
                                        <LuPencilLine onClick={() => handleEditEducation(education)}/>
                                        <span role="img" aria-label="delete"
                                              onClick={() => handleDeleteEducation(education.id)}>🗑️</span>
                                    </span>
                                </div>
                                <div className={styles.educationDetails}>
                                    {education.homeAndTransfer !== "homeSchool" && (
                                        <>
                                            <span>{education.major}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {showEducationForm && (
                    <div className={styles.formContainer}>
                        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                        <form onSubmit={handleEducationSubmit}>
                            <div className={styles.formRow}>
                                <select className={styles.formSelect} name="educationLevel"
                                        value={educationForm.educationLevel}
                                        onChange={(e) => handleInputChange(e, setEducationForm)}>
                                    <option value="">학력 구분 선택 *</option>
                                    <option value="middleSchool">중학교 졸업</option>
                                    <option value="highSchool">고등학교 졸업</option>
                                    <option value="university">대학 ◎ 대학원이상 졸업</option>
                                </select>
                                {(educationForm.educationLevel === "highSchool" || educationForm.educationLevel === "middleSchool") && (
                                    <>
                                        <select className={styles.formSelect} name="homeAndTransfer"
                                                value={educationForm.homeAndTransfer}
                                                onChange={(e) => handleInputChange(e, setEducationForm)}>
                                            <option value="">다른 유형 *</option>
                                            <option value="homeSchool">검정고시</option>
                                            <option value="transfer">편입</option>
                                        </select>
                                        {educationForm.homeAndTransfer === "homeSchool" && (
                                            <div className={styles.formPassDate}>
                                                <label className={styles.formLabel}></label>
                                                <input
                                                    type="text"
                                                    className={styles.formInput}
                                                    placeholder="합격년월 *"
                                                    onFocus={handleDateFocus}
                                                    onBlur={handleDateBlur}
                                                    name="passDate"
                                                    value={educationForm.passDate}
                                                    onChange={(e) => handleInputChange(e, setEducationForm)}
                                                    ref={dateInputRef}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {(educationForm.educationLevel === "highSchool" || educationForm.educationLevel === "middleSchool") && educationForm.homeAndTransfer !== "homeSchool" && (
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="학교명 입력 *"
                                            name="schoolName"
                                            value={educationForm.schoolName}
                                            onChange={(e) => handleInputChange(e, setEducationForm)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="학과계열 입력 *"
                                            name="major"
                                            value={educationForm.major}
                                            onChange={(e) => handleInputChange(e, setEducationForm)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <select
                                            className={styles.formSelect}
                                            name="educationStatus"
                                            value={educationForm.educationStatus}
                                            onChange={(e) => handleInputChange(e, setEducationForm)}
                                        >
                                            <option value="">졸업여부 *</option>
                                            <option value="졸업">졸업</option>
                                            <option value="졸업예정">졸업예정</option>
                                            <option value="중퇴">중퇴</option>
                                            <option value="재학중">재학중</option>
                                            <option value="휴학중">휴학중</option>
                                            <option value="수료">수료</option>
                                            <option value="자퇴">자퇴</option>
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
                                            name="entryDate"
                                            value={educationForm.entryDate}
                                            onChange={(e) => handleInputChange(e, setEducationForm)}
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
                                            name="graduationDate"
                                            value={educationForm.graduationDate}
                                            onChange={(e) => handleInputChange(e, setEducationForm)}
                                            ref={dateInputRef}
                                        />
                                    </div>
                                </div>
                            )}

                            {educationForm.educationLevel === "university" && (
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <select
                                            className={styles.formSelect}
                                            name="universityLevel"
                                            value={educationForm.universityLevel}
                                            onChange={(e) => handleInputChange(e, setEducationForm)}
                                        >
                                            <option value="">대학 구분 *</option>
                                            <option value="학사">학사</option>
                                            <option value="석사">석사</option>
                                            <option value="박사">박사</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="학교명 *"
                                            name="schoolName"
                                            value={educationForm.schoolName}
                                            onChange={(e) => handleInputChange(e, setEducationForm)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="전공 *"
                                            name="major"
                                            value={educationForm.major}
                                            onChange={(e) => handleInputChange(e, setEducationForm)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}></label>
                                        <select
                                            className={styles.formSelect}
                                            name="educationStatus"
                                            value={educationForm.educationStatus}
                                            onChange={(e) => handleInputChange(e, setEducationForm)}
                                        >
                                            <option value="">졸업여부 *</option>
                                            <option value="졸업">졸업</option>
                                            <option value="졸업예정">졸업예정</option>
                                            <option value="중퇴">중퇴</option>
                                            <option value="재학중">재학중</option>
                                            <option value="휴학중">휴학중</option>
                                            <option value="수료">수료</option>
                                            <option value="자퇴">자퇴</option>
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
                                            name="entryDate"
                                            value={educationForm.entryDate}
                                            onChange={(e) => handleInputChange(e, setEducationForm)}
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
                                            name="graduationDate"
                                            value={educationForm.graduationDate}
                                            onChange={(e) => handleInputChange(e, setEducationForm)}
                                            ref={dateInputRef}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className={styles.bottonGroup}>
                                <button type="button" className={styles.cancelBtn} onClick={toggleEducationForm}>취소</button>
                                <button type="submit" className={styles.saveBtn}>{isEditing ? "수정" : "저장"}</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
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
                                              onClick={() => handleDeleteCareer(career.id)}>🗑️</span>
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
                        {careerErrorMessage && <p className={styles.errorMessage}>{careerErrorMessage}</p>} {/* Display career error message */}
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
                                        onChange={(e) => handleInputChange(e, setCareerForm)}
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
                                        onChange={(e) => handleInputChange(e, setCareerForm)}
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
                                        onChange={(e) => handleInputChange(e, setCareerForm)}
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
                                        onChange={(e) => handleInputChange(e, setCareerForm)}
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
                                        onChange={(e) => handleInputChange(e, setCareerForm)}
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
                                        onChange={(e) => handleInputChange(e, setCareerForm)}
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
            <div className={styles.buttons}>
                <button onClick={prevPage} className={styles.prevButton}>이 전</button>
                <button onClick={() => {
                    setEducationExperience(educations);
                    setCareerExperience(careers);
                    nextPage();
                }} className={styles.navigationButton}>다 음</button>
            </div>
        </div>
    );
};

export default EnrollEducationExperience;
