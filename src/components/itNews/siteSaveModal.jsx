import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import AlertModal from "../common/AlertModal";

const SiteSaveModal = ({ show, handleClose, handleSave, initialData }) => {
    const [formData, setFormData] = useState({
        siteUrl: '',
        latestBoardUrl: '',
        siteName: '',
        videoElement: '',
        titleElement: '',
        contextElement: ''
    });
    const [testUrlResult, setTestUrlResult] = useState(['', false]);
    const [testTitleResult, setTestTitleResult] = useState(['', false]);
    const [testContextResult, setTestContextResult] = useState(['', false]);

    const [message, setMessage] = useState('');
    const [showAlertModal, setShowAlertModal] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                siteUrl: '',
                latestBoardUrl: '',
                siteName: '',
                videoElement: '',
                titleElement: '',
                contextElement: ''
            });
        }
        setTestUrlResult(['', false]);
    }, [initialData]);

    useEffect(() => {
        setTestTitleResult(['', false]);
        setTestContextResult(['', false]);
    }, [testUrlResult[0]]);

    const handleShowAlert = () => setShowAlertModal(true);
    const handleCloseAlert = () => setShowAlertModal(false);

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

    const handleTestUrl = (url, boardSelector) => {
        axios.post("http://localhost:5000/crowling/test+url", {
            url: url,
            boardSelector: boardSelector
        })
            .then(response => {
                setTestUrlResult([response.data.message, true]);
            })
            .catch(() => {
                setTestUrlResult(["요청실패", false]);
            });
    };

    const handleTestTitle = (url, boardSelector, titleSelector) => {
        if (!testUrlResult[1]) {
            setMessage('URL을 먼저 확인해 주세요.');
            setShowAlertModal(true);
            return;
        }

        axios.post("http://localhost:5000/crowling/test+title", {
            url: url,
            boardSelector: boardSelector,
            titleSelector: titleSelector
        })
            .then(response => {
                setTestTitleResult([response.data.message, true]);
            })
            .catch(() => {
                setTestTitleResult(["요청실패", false]);
            });
    };

    const handleTestContext = (url, boardSelector, contextSelector) => {
        if (!testUrlResult[1]) {
            setMessage('URL을 먼저 확인해 주세요.');
            setShowAlertModal(true);
            return;
        }

        axios.post("http://localhost:5000/crowling/test+context", {
            url: url,
            boardSelector: boardSelector,
            contextSelector: contextSelector
        })
            .then(response => {
                setTestContextResult([response.data.message, true]);
            })
            .catch(() => {
                setTestContextResult(["요청실패", false]);
            });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <AlertModal
                show={showAlertModal}
                handleClose={handleCloseAlert}
                title="오류!"
                message={message}
                style={{width: '100px'}}
            />
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? '사이트 수정' : '새로운 사이트 등록'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="align-items-center">
                        <Form.Label column sm={3}>Site URL</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="siteUrl"
                                value={formData.siteUrl}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="align-items-center">
                        <Form.Label column sm={3}>Latest Board URL</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="latestBoardUrl"
                                value={formData.latestBoardUrl}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col sm={3}>
                            <Button variant="secondary" onClick={() => handleTestUrl(formData.siteUrl, formData.latestBoardUrl)}>
                                테스트
                            </Button>
                        </Col>
                        <Col sm={12}>
                            크롤링 링크: <a href={testUrlResult[0]} target="_blank" rel="noopener noreferrer">
                                {testUrlResult[0]}
                            </a>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="align-items-center">
                        <Form.Label column sm={3}>Site Name</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                type="text"
                                name="siteName"
                                value={formData.siteName}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="align-items-center">
                        <Form.Label column sm={3}>Video Element</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                type="text"
                                name="videoElement"
                                value={formData.videoElement}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="align-items-center">
                        <Form.Label column sm={3}>Title Element</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="titleElement"
                                value={formData.titleElement}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col sm={3}>
                            <Button variant="secondary" onClick={() => handleTestTitle(formData.siteUrl, formData.latestBoardUrl, formData.titleElement)}>
                                테스트
                            </Button>
                        </Col>
                        <Col sm={12}>
                            <Form.Text>크롤링 제목 : {testTitleResult[0]}</Form.Text>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="align-items-center">
                        <Form.Label column sm={3}>Context Element</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="contextElement"
                                value={formData.contextElement}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col sm={3}>
                            <Button variant="secondary" onClick={() => handleTestContext(formData.siteUrl, formData.latestBoardUrl, formData.contextElement)}>
                                테스트
                            </Button>
                        </Col>
                        <Col sm={12}>
                            <Form.Text>크롤링 원문 : {testContextResult[0]}</Form.Text>
                        </Col>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        저장
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SiteSaveModal;
