import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SiteSaveModal = ({ show, handleClose, handleSave, initialData }) => {
    const [formData, setFormData] = useState({
        boardId: '',
        siteUrl: '',
        title: '',
        videoTextlizedContext: '',
        originalContext: '',
        registDate: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                boardId: '',
                siteUrl: '',
                title: '',
                videoTextlizedContext: '',
                originalContext: '',
                registDate: ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave(formData);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? '사이트 수정' : '새로운 사이트 등록'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>글번호</Form.Label>
                        <Form.Control
                            type="text"
                            name="siteUrl"
                            value={formData.boardId}
                            onChange={handleChange}
                            maxLength="300"
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>사이트 URL</Form.Label>
                        <Form.Control
                            type="text"
                            name="latestBoardUrl"
                            value={formData.siteUrl}
                            onChange={handleChange}
                            maxLength="300"
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>제목</Form.Label>
                        <Form.Control
                            type="text"
                            name="siteName"
                            value={formData.title}
                            onChange={handleChange}
                            maxLength="100"
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>영상 텍스트화</Form.Label>
                        <Form.Control
                            type="text"
                            name="videoElement"
                            value={formData.videoTextlizedContext}
                            onChange={handleChange}
                            maxLength="500"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>내용</Form.Label>
                        <Form.Control
                            type="text"
                            name="titleElement"
                            value={formData.originalContext}
                            onChange={handleChange}
                            maxLength="300"
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>등록일자</Form.Label>
                        <Form.Control
                            type="text"
                            name="contextElement"
                            value={formData.registDate}
                            onChange={handleChange}
                            maxLength="300"
                            required
                        />
                        <br/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        저장
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SiteSaveModal;