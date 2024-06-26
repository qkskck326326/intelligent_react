import React, { useState, useEffect } from "react";
import styles from "../../styles/user/mypage/addModal.module.css";
import { UploadCertificatePDF } from "../lecturePackage/uploadCertificatePDF";
import axios from 'axios';


const CertificateAddModal = ({ onSave, onClose, editData }) => {

  const [confirmMessage, setConfirmMessage] =useState("")
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    pdfFile: null,
    kind: "",
    passDate: "",
    issuePlace: "",
    certificateNumber: "",
    name: "",
    managementNumber: ""
  });


  const [form2, setForm2] = useState({
    instruction: "intelliclass",
    manager: "김채림",
    managerPhoneNumber: "01034312554",
  });


  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        pdfFile: null,
        kind: "",
        passDate: "",
        issuePlace: "",
        certificateNumber: "",
        name: "",
        managementNumber: ""
      });
    }
  }, [editData]);

  useEffect(() => {
    console.log("Updated form: ", form);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };



  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setForm(prevForm => ({
      ...prevForm,
      pdfFile: file,
    }));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("response.data : ", response.data);

      // response.data.data가 배열임을 가정하고 첫 번째 요소를 가져옴
      const { data } = response.data;
      if (data && data.length > 0) {
        const certificateData = data[0];
        setForm(prevForm => ({
          ...prevForm,
          managementNumber: certificateData.managementNumber || '',
          kind: certificateData.kind || '',
          passDate: certificateData.passDate || '',
          issuePlace: certificateData.issuePlace || '',
          certificateNumber: certificateData.certificateNumber || '',
          name: certificateData.name || ''
        }));
      }
    } catch (error) {
      console.error("PDF 내용 추출 중 오류 발생:", error);
    }
  };



  const handleVerifyClick = async () => {


    setLoading(true);  // 로딩 상태 시작

    try {
      if(form.issuePlace === "한국산업인력공단") {
        const { name, managementNumber } = form;
        const response = await axios.post('http://localhost:5000/verify', {name, managementNumber});
        console.log(response.data);

        if(response.data.result === 'success' ) {
          alert("진위확인이 완료되었습니다.")
          const message = response.data.message
          setConfirmMessage(message);
          console.log("message : ", message);

        }else if(response.data.result === 'fail'){
          alert("성명또는 관리번호가 불일치하거나 유효기간이 지났을 경우 자격증을 다시 발급해 주세요.")
          setConfirmMessage(message);
        }

      }else if(form.issuePlace === "한국데이터산업진흥원장"){
        // const instruction = "intelliclass";
        // const manager = "김채림"; //담당자
        // const managerPhoneNumber = "01034312554"

        const { certificateNumber, name,  } = form;

        console.log("form : ",instruction, manager, managerPhoneNumber, certificateNumber, name );
        const response = await axios.post('http://localhost:5000/verify', {
            name : name,
            certificateNumber : certificateNumber,
            instruction : instruction,
            manager : manager,
            managerPhoneNumber : managerPhoneNumber
          });
        console.log("response.data : ", response.data)


        if(response.data.result === 'success' ) {
          alert("진위확인이 완료되었습니다.")
          const message = response.data.message
          setConfirmMessage(message);
          console.log("message : ", message);

        }else if(response.data.result === 'fail'){
          alert("성명또는 관리번호가 불일치하거나 유효기간이 지났을 경우 자격증을 다시 발급해 주세요.")
          setConfirmMessage(message);
        }
      }

    } catch (error) {
      console.error("진위확인 중 오류 발생:", error);
    }finally{
      setLoading(false);  // 로딩 상태 종료
    }
  };



  // const handleFileChange1 = async (e) => {
  //   const file = e.target.files[0];
  //   setForm(prevForm => ({
  //     ...prevForm,
  //     pdfFile: file,
  //   }));
  //
  //   const formData = new FormData();
  //   formData.append('file', file);
  //
  //   try {
  //     const response = await axios.post('http://localhost:5000/upload1', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     console.log("response.data : ", response.data);
  //     const { data } = response.data;
  //     if (data && data.length > 0) {
  //       const certificateData = data[0];
  //       setForm(prevForm => ({
  //         ...prevForm,
  //         kind: certificateData.kind,
  //         passDate: certificateData.passDate,
  //         issuePlace: certificateData.issuePlace,
  //         certificateNumber: certificateData.certificateNumber,
  //         name: certificateData.name
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("PDF 내용 추출 중 오류 발생:", error);
  //   }
  // };
  //
  //
  //
  //
  // const handleFileChange2 = async (e) => {
  //   const file = e.target.files[0];
  //   setForm(prevForm => ({
  //     ...prevForm,
  //     pdfFile: file,
  //   }));
  //
  //   const formData = new FormData();
  //   formData.append('file', file);
  //
  //   try {
  //     const response = await axios.post('http://localhost:5000/upload2', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     console.log("response.data : ", response.data);
  //     const { data } = response.data;
  //     if (data) {
  //       setForm(prevForm => ({
  //         ...prevForm,
  //         kind: data.kind,
  //         passDate: data.passDate,
  //         issuePlace: data.issuePlace,
  //         certificateNumber: data.certificateNumber,
  //         name: data.name
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("PDF 내용 추출 중 오류 발생:", error);
  //   }
  // };
  //
  //
  //
  // const handleFileChange3 = async (e) => {
  //   const file = e.target.files[0];
  //   setForm(prevForm => ({
  //     ...prevForm,
  //     pdfFile: file,
  //   }));
  //
  //   const formData = new FormData();
  //   formData.append('file', file);
  //
  //   try {
  //     const response = await axios.post('http://localhost:5000/upload3', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     console.log("response.data : ", response.data);
  //     const { data } = response.data;
  //     if (data && data.length > 0) {
  //       const certificateData = data[0]; // 리스트의 첫 번째 항목 사용
  //       setForm(prevForm => ({
  //         ...prevForm,
  //         kind: certificateData.kind,
  //         passDate: certificateData.passDate,
  //         issuePlace: certificateData.issuePlace,
  //         certificateNumber: certificateData.certificateNumber,
  //         name: certificateData.name,
  //         BIRTHDATE: certificateData.BIRTHDATE,
  //         VALIDITY_PERIOD: certificateData.VALIDITY_PERIOD,
  //         ISSUE_DATE: certificateData.ISSUE_DATE
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("PDF 내용 추출 중 오류 발생:", error);
  //   }
  // };




  const handleSave = async () => {
    if (form.pdfFile && typeof form.pdfFile === "object" && confirmMessage === "진위확인이 완료되었습니다.") {
      try {
        const uploadedFileURL = await UploadCertificatePDF(form.pdfFile);
        const newCertificate = {
          ...form,
          pdfFile: uploadedFileURL,
        };
        onSave(newCertificate);
      } catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
        alert("파일 업로드 실패");
      }
    } else {
      onSave(form);
    }
  };


  const handleDateFocus = (e) => {
    e.currentTarget.type = "date";
    e.currentTarget.showPicker();
  };

  const handleDateBlur = (e) => {
    if (!e.currentTarget.value) {
      e.currentTarget.type = "text";
    }
  };


  return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalHeader}>{editData ? "자격증 수정" : "자격증 추가"}</h2>
            <div className={styles.pdfPreview}>
              {form.pdfFile ? (
                  typeof form.pdfFile === "object" ? (
                      <iframe
                          src={URL.createObjectURL(form.pdfFile)}
                          title="PDF Preview"
                          className={styles.pdfIframe}
                      />
                  ) : (
                      <iframe
                          src={form.pdfFile}
                          title="PDF Preview"
                          className={styles.pdfIframe}
                      />
                  )
              ) : (
                  <div className={styles.pdfPlaceholder}>자격증을 PDF로 올려주세요!</div>
              )}
              <div className={styles.fileInputContainer}>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
                <button onClick={handleVerifyClick} className={styles.confirmButton}>자격증 진위확인</button>
              </div>
              {loading && <span>잠시만 기다려주세요</span>}
            </div>

            <div className={styles.inputGroup}>
              <input
                  type="text"
                  name="kind"
                  value={form.kind}
                  onChange={handleChange}
                  placeholder="자격증명"
                  className={styles.inputField}
                  readOnly={true}
              />
              <input
                  type="text"
                  name="passDate"
                  value={form.passDate}
                  onChange={handleChange}
                  onFocus={handleDateFocus}
                  onBlur={handleDateBlur}
                  placeholder="합격일자"
                  className={styles.formInput}
                  readOnly={true}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                  type="text"
                  name="certificateNumber"
                  value={form.certificateNumber}
                  onChange={handleChange}
                  placeholder="자격번호"
                  className={styles.inputField}
                  readOnly={true}
              />
              <input
                  type="text"
                  name="issuePlace"
                  value={form.issuePlace}
                  onChange={handleChange}
                  placeholder="발행처"
                  className={styles.inputField}
                  readOnly={true}
              />
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleSave} className={styles.saveButton}>{editData ? "수정" : "등록"}</button>
              <button onClick={onClose} className={styles.cancelButton}>취소</button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CertificateAddModal;