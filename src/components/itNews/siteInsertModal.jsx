import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SiteInsertModal = ({ show, handleClose, handleSave, initialData }) => {
    const [formData, setFormData] = useState({
        siteUrl: '',
        latestBoardUrl: '',
        siteName: '',
        videoElement: '',
        titleElement: '',
        contextElement: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }else{
            setFormData({
                siteUrl: '',
                latestBoardUrl: '',
                siteName: '',
                videoElement: '',
                titleElement: '',
                contextElement: ''
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
        setFormData({
            siteUrl: '',
            latestBoardUrl: '',
            siteName: '',
            videoElement: '',
            titleElement: '',
            contextElement: ''
        });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? '사이트 수정' : '새로운 사이트 등록'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Site URL</Form.Label>
                        <Form.Control
                            type="text"
                            name="siteUrl"
                            value={formData.siteUrl}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Latest Board URL</Form.Label>
                        <Form.Control
                            type="text"
                            name="latestBoardUrl"
                            value={formData.latestBoardUrl}
                            onChange={handleChange}
                            required
                        />
                        <button>테스트</button>
                    </Form.Group>
                    <button>테스트</button>
                    <Form.Group>
                        <Form.Label>Site Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="siteName"
                            value={formData.siteName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Video Element</Form.Label>
                        <Form.Control
                            type="text"
                            name="videoElement"
                            value={formData.videoElement}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Title Element</Form.Label>
                        <Form.Control
                            type="text"
                            name="titleElement"
                            value={formData.titleElement}
                            onChange={handleChange}
                            required
                        />
                        <button>테스트</button>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Context Element</Form.Label>
                        <Form.Control
                            type="text"
                            name="contextElement"
                            value={formData.contextElement}
                            onChange={handleChange}
                            required
                        />
                        <button>테스트</button>
                        <br/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        저장
                    </Button>
                </Form>
                <div>


                </div>
            </Modal.Body>
        </Modal>
    );
};

export default SiteInsertModal;
