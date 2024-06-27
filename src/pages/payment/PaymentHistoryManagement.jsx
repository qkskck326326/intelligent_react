import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./PaymentHistoryManagement.module.css";

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
      } catch (error) {
        setError("결제 내역을 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

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
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((history) => (
              <tr key={history.transactionId}>
                <td>
                  <img
                    src={history.thumbnail}
                    alt={history.title}
                    className={styles.thumbnail}
                  />
                  {history.title}
                </td>

                <td>
                  {history.paymentConfirmation === "Y"
                    ? "결제완료"
                    : "결제대기"}
                </td>
                <td>{history.paymentType}</td>
                <td>{new Date(history.transactionDate).toLocaleString()}</td>
                <td>{history.couponId ? "사용" : "없음"}</td>
                <td>{history.finalPrice.toLocaleString()} 원</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
});

export default PaymentHistoryManagement;
