import React from "react";
import { Modal, Button } from "react-bootstrap";

const LoginPopup = ({ show, handleClose }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>로그인 필요</Modal.Title>
    </Modal.Header>
    <Modal.Body>이 내용을 보려면 로그인해야 합니다.</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        닫기
      </Button>
    </Modal.Footer>
  </Modal>
);

export default LoginPopup;
