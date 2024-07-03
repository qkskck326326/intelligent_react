import React, { useState } from 'react';
import modalStyles from '../../styles/common/modal.module.css';

class AlertModal {

    /**
     * yesOnly는 옵션이 예만 있는 모달입니다.
     * @Param(message):String
     * 첫번째 파라미터 message는 String을 받으며 모달창에 출력하고 싶은 내용을 입력해주시면 됩니다.
     * @Param(callback):function
     * 두번째 파라미터 callback은 함수입니다.
     * @Param(value)
     * 세번째 파라미터는 callback함수에 들어갈 값입니다.
     * 이 모달을 실행 후 확인 버튼을 눌렀을 때 콜백함수에 넣어야 할 값을 입력해주세용.
     * */
    yesOnly(message, callback, value) {

        const ModalComponent = () => {
            const [isAnimating, setIsAnimating] = useState(false);
            const [isVisible, setIsVisible] = useState(true);

            const handleButtonClick = () => {
                setIsAnimating(true);
                setTimeout(() => {
                    callback(value);
                    setIsVisible(false);
                }, 500);
            };

            if (!isVisible) return null;

            return (
                <div className={modalStyles.modalBackground}>
                    <div
                        className={`${modalStyles.modalContainer} ${isAnimating ? modalStyles.shrinkIn : modalStyles.popOut}`}
                    >
                        <div className={modalStyles.modalDialog}>{message}</div>
                        <div className={modalStyles.buttonContainer}>
                            <button className={modalStyles.buttons} onClick={handleButtonClick}>확인</button>
                        </div>
                    </div>
                </div>
            );
        };

        return <ModalComponent />;
    }

}

export default AlertModal;