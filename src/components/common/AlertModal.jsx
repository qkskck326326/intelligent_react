// AlertModal.js
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AlertModal = ({ show, handleClose, title, message, onConfirm }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                {onConfirm ? (
                    <>
                        <Button variant="primary" onClick={onConfirm}>
                            예
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            아니오
                        </Button>
                    </>
                ) : (
                    <Button variant="secondary" onClick={handleClose}>
                        확인
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default AlertModal;
