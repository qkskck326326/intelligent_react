import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./PaymentHistoryManagement.module.css";
import Link from "next/link";
import axios from "axios";

const PaymentHistoryManagement = observer(() => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const userEmail = authStore.getUserEmail();
      try {
        const response = await axiosClient.get(
            `/payment/paymentHistory/${userEmail}`
        );
        setPaymentHistory(response.data);
        console.log("결제내역정보", response.data);
        console.log("페이먼츠키:", response.data.paymentKey);
      } catch (error) {
        setError("결제 내역을 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  const handleRefund = async (paymentKey, refundAmount, transactionId) => {
    const userConfirmed = window.confirm("정말로 이 항목을 환불하시겠습니까?");

    if (!userConfirmed) {
      return; // 사용자가 취소를 선택한 경우 함수 종료
    }
    try {
      console.log("Refund Request:", { method: "refund", paymentKey, refundAmount }); // 로그 추가
      const response = await axios.post("/api/payment", {
        method: "refund",
        paymentKey: paymentKey,
        refundAmount: refundAmount,
      });

      if (response.status === 200) {
        alert("환불이 처리되었습니다.");

        // 환불 성공 후 컬럼 값을 N으로 업데이트하는 PUT 요청
        await axiosClient.put(`/payment/updateConfirmation/${transactionId}`, {
          paymentConfirmation: 'N'
        });

        // 환불 후 결제 내역을 다시 불러옵니다.
        const userEmail = authStore.getUserEmail();
        const updatedResponse = await axiosClient.get(
            `/payment/paymentHistory/${userEmail}`
        );
        setPaymentHistory(updatedResponse.data);
      } else {
        alert("환불 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("환불 중 오류가 발생했습니다:", error);
      alert("환불 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
      <div className={styles.container}>
        <h1>결제 내역 관리</h1>
        {paymentHistory.length === 0 ? (
            <p>결제 내역이 없습니다.</p>
        ) : (
            <table className={styles.table}>
              <thead>
              <tr>
                <th>상품명</th>
                <th>결제 상태</th>
                <th>결제 유형</th>
                <th>거래 일시</th>
                <th>쿠폰</th>
                <th>결제 금액</th>
                <th>환불</th>
              </tr>
              </thead>
              <tbody>
              {paymentHistory.map((history) => {
                const transactionDate = new Date(history.transactionDate);
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate - transactionDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return (
                    <tr key={history.transactionId}>
                      <td>
                        <Link
                            href={`/lecture/list?lecturePackageId=${history.lecturePackageId}`}
                            passHref
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <img
                              src={history.thumbnail}
                              alt={history.title}
                              className={styles.thumbnail}
                          />
                          {history.title}
                        </Link>
                      </td>
                      <td>
                        {history.paymentConfirmation === "Y"
                            ? "결제완료"
                            : "환불완료"}
                      </td>
                      <td>{history.paymentType}</td>
                      <td>{transactionDate.toLocaleString()}</td>
                      <td>{history.couponId ? "사용" : "없음"}</td>
                      <td>{history.finalPrice.toLocaleString()} 원</td>
                      <td>
                        {history.paymentConfirmation === "Y" &&
                            diffDays <= 7 &&
                            history.lectureRead == null && ( // lectureRead가 1인 경우 환불 버튼 숨기기
                                <button
                                    onClick={() =>
                                        handleRefund(history.paymentKey, history.finalPrice, history.transactionId)
                                    }
                                    className={styles.refundButton}
                                >
                                  환불
                                </button>
                            )}
                      </td>
                    </tr>
                );
              })}
              </tbody>
            </table>
        )}
      </div>
  );
});

export default PaymentHistoryManagement;
