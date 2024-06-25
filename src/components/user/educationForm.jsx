// import React, { useState } from "react";
// import styles from "../../styles/user/mypage/educationForm.module.css";
//
// const EducationForm = () => {
//     const [educationLevel, setEducationLevel] = useState("");
//
//     const handleEducationLevelChange = (event) => {
//         setEducationLevel(event.target.value);
//     };
//
//     return (
//         <div className={styles.formContainer}>
//             <h3 className={styles.formHeader}>학력</h3>
//             <form>
//                 <div className={styles.formGroup}>
//                     <label className={styles.formLabel}></label>
//                     <select className={styles.formSelect} value={educationLevel} onChange={handleEducationLevelChange}>
//                         <option value="">학력 구분 선택 *</option>
//                         <option value="highSchool">고등학교</option>
//                         <option value="university">대학교</option>
//                     </select>
//                 </div>
//
//                 {educationLevel === "highSchool" && (
//                     <>
//                         <div className={styles.formGroup}>
//                             <label className={styles.formLabel}>학교명 *</label>
//                             <input type="text" className={styles.formInput} placeholder="학교명 입력" />
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label className={styles.formLabel}>졸업여부 *</label>
//                             <select className={styles.formSelect}>
//                                 <option value="graduated">졸업</option>
//                                 <option value="notGraduated">미졸업</option>
//                             </select>
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label className={styles.formLabel}>입학년월</label>
//                             <input type="month" className={styles.formInput} />
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label className={styles.formLabel}>졸업년월</label>
//                             <input type="month" className={styles.formInput} />
//                         </div>
//                     </>
//                 )}
//
//                 {educationLevel === "university" && (
//                     <>
//                         <div className={styles.formGroup}>
//                             <label className={styles.formLabel}>대학 구분 *</label>
//                             <select className={styles.formSelect}>
//                                 <option value="undergraduate">학사</option>
//                                 <option value="graduate">석사</option>
//                                 <option value="phd">박사</option>
//                             </select>
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label className={styles.formLabel}>학교명 *</label>
//                             <input type="text" className={styles.formInput} placeholder="학교명 입력" />
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label className={styles.formLabel}>전공 *</label>
//                             <input type="text" className={styles.formInput} placeholder="전공 입력" />
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label className={styles.formLabel}>졸업여부 *</label>
//                             <select className={styles.formSelect}>
//                                 <option value="graduated">졸업</option>
//                                 <option value="notGraduated">미졸업</option>
//                             </select>
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label className={styles.formLabel}>입학년월</label>
//                             <input type="month" className={styles.formInput} />
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label className={styles.formLabel}>졸업년월</label>
//                             <input type="month" className={styles.formInput} />
//                         </div>
//                     </>
//                 )}
//
//                 <div className={styles.formGroup}>
//                     <button type="button" className={styles.formButton}>취소</button>
//                     <button type="submit" className={styles.formButton}>저장</button>
//                 </div>
//             </form>
//         </div>
//     );
// };
//
// export default EducationForm;