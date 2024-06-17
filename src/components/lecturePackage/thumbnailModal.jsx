import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { UploadThumbnail } from './uploadThumbnail'; // 경로를 확인하세요
import styles from "../../styles/lecturePackage/thumbnailModal.module.css";

const ThumbnailModal = ({ isOpen, onClose, onSave }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (file) {
            setIsUploading(true);
            try {
                const thumbnailUrl = await UploadThumbnail(file);
                onSave(thumbnailUrl); // URL을 저장합니다.
                onClose();
            } catch (error) {
                alert('파일 업로드 중 오류가 발생했습니다.');
            } finally {
                setIsUploading(false);
            }
        } else {
            alert('업로드할 파일을 선택하세요.');
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>썸네일 등록</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {preview ? (
                    <div className={styles.thumbnailPreview}>
                        <img src={preview} alt="썸네일 미리보기" className={styles.previewImage} />
                    </div>
                ) : (
                    <p>이미지를 선택하세요</p>
                )}
                <div className="mt-3">
                    <input
                        id="thumbnailFile"
                        type="file"
                        label="썸네일 이미지 첨부"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    닫기
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={isUploading}>
                    {isUploading ? '업로드 중...' : '저장'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ThumbnailModal;