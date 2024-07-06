import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import styles from "./Success.module.css";
import axios  from "axios";

const Success = () => {
  const router = useRouter();
  const { paymentKey, amount, orderId } = router.query;
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(paymentKey);
    const approvePayment = async () => {
      try {
        // 세션에서 임시 결제 정보 가져오기
        const sessionResponse = await axiosClient.get("/payment/session-info", {
          withCredentials: true,
        });
        const sessionInfo = sessionResponse.data;
        console.log("세션에서 가져온 오더아이디" + sessionInfo.orderId);
        console.log("세션에서 가져온 amount" + sessionInfo.amount);
        console.log("토스에서 받아온 orderId:" + orderId);
        console.log("토스에서 받아온 amount:" + amount);
        console.log("페이먼트키 : " + paymentKey);

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
          await savePaymentInfo(
            sessionInfo.items,
            sessionInfo.userEmail,
            sessionInfo.provider,
            orderId,
            response.data.paymentStatus.method,
            sessionInfo.couponId // 쿠폰 ID 추가
          );

          // 사용한 쿠폰과 장바구니 아이템 삭제
          await clearUsedCouponsAndCartItems(
            sessionInfo.couponId,
            sessionInfo.items
          );

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

    const savePaymentInfo = async (
      items,
      userEmail,
      provider,
      orderId,
      paymentType,
    ) => {
      console.log(paymentKey);
      try {
        for (const item of items) {
          const paymentInfo = {
            userEmail,
            provider,
            lecturePackageId: item.lecturePackageId,
            paymentType,
            couponId: item.couponId || null, // 각 아이템의 쿠폰 ID를 할당
            finalPrice: item.price,
            orderId,
            paymentConfirmation: "Y",
            paymentKey,
          };
          console.log(paymentInfo);
          await axiosClient.post("/payment/savePayment", paymentInfo);
        }
        console.log("Payment information saved successfully");
      } catch (error) {
        console.error("Error saving payment information:", error);
      }
    };

    const clearUsedCouponsAndCartItems = async (couponId, items) => {
      try {
        const ids = items.map((item) => item.lecturePackageId);
        const userEmail = authStore.getUserEmail();
        const provider = authStore.getProvider();
        console.log("삭제할 패키지 아이디:", ids); // 디버깅 로그
        const response = await axiosClient.post("/cart/delete", {
          userEmail: userEmail,
          ids: ids,
          provider: provider,
        });
        console.log("Cart items deleted successfully", response); // 디버깅 로그
      } catch (error) {
        console.error("Error clearing used coupons and cart items:", error);
      }
    };

    if (paymentKey && amount && orderId) {
      approvePayment();
    }
  }, [paymentKey, amount, orderId]);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>결제 성공</h1>
      {orderInfo && orderInfo.paymentStatus.status === "DONE" && (
        <>
          <p>결제가 성공적으로 처리되었습니다. 감사합니다.</p>
          <div>
            <h2>주문 정보</h2>
            <p>주문 번호: {orderInfo.orderId}</p>
            <p>결제 금액: {parseFloat(orderInfo.amount).toLocaleString()} 원</p>
            <p>결제 상태: 완료 </p>
            <button
              className={styles.button}
              onClick={() => router.push("/user/mypage?component=myLecture")}
            >
              내 수강 목록으로 이동
            </button>
            <button
              className={styles.button}
              onClick={() => router.push("/lecturePackage")}
            >
              패키지 목록으로 이동
            </button>
          </div>
        </>
      )}
      {orderInfo && orderInfo.paymentStatus.status !== "DONE" && <p>{error}</p>}
    </div>
  );
};

export default Success;
