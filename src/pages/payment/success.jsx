import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";

const Success = () => {
  const router = useRouter();
  const {
    paymentKey,
    amount,
    orderId,
    couponId,
    priceKind,
    userEmail,
    lecturePackageId,
  } = router.query;
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const approvePayment = async () => {
      try {
        // 결제 승인 API 호출
        const response = await axios.post("/api/ApprovePayment", {
          paymentKey,
          amount,
          orderId,
        });

        console.log("Payment approved successfully:", response.data);
        setOrderInfo(response.data);

        // 패키지 정보 가져오기
        const packageResponse = await axiosClient.get(
          `/payment/packages/${lecturePackageId}`
        );
        const lecturePackage = packageResponse.data;

        // DB 저장 API 호출
        await savePaymentInfo({
          userEmail: userEmail,
          provider: authStore.getProvider(), // 실제 제공자의 이름으로 수정하세요.
          lecturePackageId: lecturePackageId,
          paymentType: response.data.paymentStatus.method,
          couponId: couponId || null,
          finalPrice: amount,
          lecturePackageKindPrice: priceKind,
          paymentConfirmation:
            response.data.status === "WAITING_FOR_DEPOSIT" ? "N" : "Y", // 예시로 결제 상태 사용
        });
      } catch (error) {
        console.error(
          "Error approving payment or saving payment information:",
          error
        );
        setError("결제 승인 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    const savePaymentInfo = async (paymentInfo) => {
      try {
        await axiosClient.post("/payment/savePayment", paymentInfo);
        console.log("Payment information saved successfully");
      } catch (error) {
        console.error("Error saving payment information:", error);
      }
    };
    if (paymentKey && amount && orderId && userEmail && lecturePackageId) {
      approvePayment();
    }
  }, [paymentKey, amount, orderId, userEmail, lecturePackageId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>결제 성공</h1>
      <p>결제가 성공적으로 처리되었습니다. 감사합니다.</p>
      {orderInfo && (
        <div>
          <h2>주문 정보</h2>
          <p>주문 번호: {orderInfo.orderId}</p>
          <p>결제 금액: {orderInfo.amount.toLocaleString()} 원</p>
          <p>결제 상태: {orderInfo.status}</p>
        </div>
      )}
    </div>
  );
};

export default Success;
