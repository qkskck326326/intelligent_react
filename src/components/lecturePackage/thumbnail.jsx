import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from "../../styles/lecturePackage/thumbnailModal.module.css";

const Thumbnail = ({ isOpen, onClose }) => {
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onClose();
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
                <Form.Group>
                    <Form.File
                        id="thumbnailFile"
                        label="썸네일 이미지 첨부"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-3"
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    닫기
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    저장
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Thumbnail;