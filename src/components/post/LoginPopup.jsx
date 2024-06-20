import React from "react";
import "./LoginPopup.module.css";

const LoginPopup = ({ show, handleClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h2>로그인 필요</h2>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="popup-body">이 내용을 보려면 로그인해야 합니다.</div>
        <div className="popup-footer">
          <button className="close-button" onClick={handleClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
