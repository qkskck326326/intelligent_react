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
    // couponId,
    // priceKind,
    // userEmail,
    // lecturePackageId,
  } = router.query;
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const approvePayment = async () => {
      try {
        // 세션에서 임시 결제 정보 가져오기
        const Sesstionresponse = await axiosClient.get(
          "/payment/session-info",
          {
            withCredentials: true,
          }
        );
        const sessionInfo = Sesstionresponse.data;
        console.log("세션에서 가져온 오더아이디" + sessionInfo.orderId);
        console.log("세션에서 가져온 amount" + sessionInfo.amount);
        console.log("토스에서 받아온 orderId:" + orderId);
        console.log("토스에서 받아온 amount:" + amount);
        // 세션 정보와 리다이렉트 URL 정보 비교
        if (
          sessionInfo.orderId !== orderId ||
          parseFloat(sessionInfo.amount) !== parseFloat(amount)
        ) {
          setError("결제 정보가 일치하지 않습니다.");
          return;
        }

        // 결제 승인 API 호출
        const response = await axios.post("/api/ApprovePayment", {
          paymentKey,
          amount,
          orderId,
        });

        console.log("Payment approved successfully:", response.data);
        setOrderInfo(response.data);

        if (response.data.paymentStatus.status === "DONE") {
          // DB 저장 API 호출
          await savePaymentInfo({
            userEmail: sessionInfo.userEmail,
            provider: authStore.getProvider(),
            lecturePackageId: sessionInfo.lecturePackageId,
            paymentType: response.data.paymentStatus.method,
            couponId: sessionInfo.couponId || null,
            finalPrice: amount,
            lecturePackageKindPrice: sessionInfo.priceKind,
            paymentConfirmation: "Y",
          });

          // 세션 정보 제거
          await axiosClient.post("/payment/clear-session", {
            withCredentials: true,
          });
        } else {
          if (response.data.paymentStatus.status === "WAITING_FOR_DEPOSIT") {
            setError(
              "결제가 대기 중입니다. 입금이 완료되면 결제가 승인됩니다."
            );
          } else {
            setError("결제 실패: " + response.data.paymentStatus.status);
          }
        }
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
    if (paymentKey && amount && orderId) {
      approvePayment();
    }
  }, [paymentKey, amount, orderId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>결제 성공</h1>
      {orderInfo && orderInfo.paymentStatus.status === "DONE" && (
        <>
          <p>결제가 성공적으로 처리되었습니다. 감사합니다.</p>
          <div>
            <h2>주문 정보</h2>
            <p>주문 번호: {orderInfo.orderId}</p>
            <p>결제 금액: {parseFloat(orderInfo.amount).toLocaleString()} 원</p>
            <p>결제 상태: {orderInfo.paymentStatus.status}</p>
          </div>
        </>
      )}
      {orderInfo && orderInfo.paymentStatus.status !== "DONE" && <p>{error}</p>}
    </div>
  );
};

export default Success;
