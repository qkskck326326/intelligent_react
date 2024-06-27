import React, { useState, useEffect } from "react";
import styles from "../../styles/user/mypage/addModal.module.css";
import { UploadCertificatePDF } from "../lecturePackage/uploadCertificatePDF";
import axios from 'axios';

const CertificateAddModal = ({ onSave, onClose, editData }) => {
  const [form, setForm] = useState({
    pdfFile: "",
    kind: "",
    passDate: "",
    issuePlace: "",
    certificateNumber: "",
  });

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        pdfFile: "",
        kind: "",
        passDate: "",
        issuePlace: "",
        certificateNumber: "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };



  const handleFileChange = async (e) => {

    const file = e.target.files[0];
    setForm({
      ...form,
      pdfFile: file,
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { data } = response.data;
      if (data && data.length > 0) {
        const certificateData = data[0];
        setForm({
          ...form,
          kind: certificateData.KIND,
          passDate: certificateData.PASSDATE,
          issuePlace: certificateData.ISSUE_PLACE,
          certificateNumber: certificateData.MY_CERTIFICATE_NUMBER,
        });
      }
    } catch (error) {
      console.error("PDF 내용 추출 중 오류 발생:", error);
    }
  };


  const handleSave = async () => {
    if (form.pdfFile && typeof form.pdfFile === "object") {
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
              <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className={styles.fileInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                  type="text"
                  name="kind"
                  value={form.kind}
                  onChange={handleChange}
                  placeholder="자격증명"
                  className={styles.inputField}
              />
              <input
                  type="date"
                  name="passDate"
                  value={form.passDate}
                  onChange={handleChange}
                  placeholder="합격일자"
                  className={styles.inputField}
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
                  readOnly={!!editData}
              />
              <input
                  type="text"
                  name="issuePlace"
                  value={form.issuePlace}
                  onChange={handleChange}
                  placeholder="발행처"
                  className={styles.inputField}
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
