import React, { useState } from "react";
import styles from "../../styles/addModal.module.css";

const CertificateAddModal = ({ onSave, onClose }) => {
  const [form, setForm] = useState({
    pdfFile: "",
    kind: "",
    passDate: "",
    issuePlace: "",
    certificateNumber: ""
  });
//ㅎ
  const handleChange = (e) => { //입력필드의 값이 변경될때 호출됨.
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({
      ...form,
      pdfFile: file ? URL.createObjectURL(file) : "",
    });
  };
//ㅎ
  const handleSave = () => {
    onSave(form);  // 부모에게 props로 받은 onSave를 이용하여 저장함.
  };

  return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalHeader}>자격증 추가</h2>
            <div className={styles.pdfPreview}>
              {form.pdfFile ? (
                  <iframe
                      src={form.pdfFile}
                      title="PDF Preview"
                      className={styles.pdfIframe}
                  />
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
              <button onClick={handleSave} className={styles.saveButton}>등록</button>
              <button onClick={onClose} className={styles.cancelButton}>취소</button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CertificateAddModal;