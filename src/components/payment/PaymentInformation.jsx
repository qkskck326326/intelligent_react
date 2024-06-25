import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./PaymentInformation.module.css";
import authStore from "../../stores/authStore";
import axios from "axios";

const PaymentInformation = ({ lecturePackageId }) => {
  const [lecturePackage, setLecturePackage] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [priceKind, setPriceKind] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!lecturePackageId) return;
      setLoading(true);
      setError(null);

      try {
        const packageResponse = await axiosClient.get(
          `/payment/packages/${lecturePackageId}`
        );
        setLecturePackage(packageResponse.data);
        setFinalPrice(packageResponse.data.priceMonth); // 기본 가격 설정
        const couponsResponse = await axiosClient.get(
          `/payment/coupons/${userEmail}`
        );
        setCoupons(couponsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lecturePackageId]);

  const handleCouponChange = (e) => {
    const selectedCouponId = e.target.value;
    const selected = coupons.find(
      (coupon) => coupon.id.toString() === selectedCouponId
    );
    setSelectedCoupon(selected);

    if (selected) {
      setFinalPrice(
        (priceKind === "0"
          ? lecturePackage.priceMonth
          : lecturePackage.priceForever) - selected.discountAmount
      );
    } else {
      setFinalPrice(
        priceKind === "0"
          ? lecturePackage.priceMonth
          : lecturePackage.priceForever
      );
    }
  };

  const handlePriceKindChange = (e) => {
    const selectedPriceKind = e.target.value;
    setPriceKind(selectedPriceKind);

    const basePrice =
      selectedPriceKind === "0"
        ? lecturePackage.priceMonth
        : lecturePackage.priceForever;
    setFinalPrice(
      basePrice - (selectedCoupon ? selectedCoupon.discountAmount : 0)
    );
  };

  const handlePayment = async () => {
    const userEmail = authStore.getUserEmail();
    if (!agreement) {
      setShowPopup(true);
      return;
    }
    try {
      const orderId = `order_${Date.now()}`;
      const paymentData = {
        amount: finalPrice,
        orderId: orderId,
        orderName: lecturePackage.title,
        successUrl: `http://localhost:3000/payment/success?couponId=${
          selectedCoupon ? selectedCoupon.id : ""
        }&priceKind=${priceKind}&userEmail=${userEmail}&lecturePackageId=${lecturePackageId}`,
        failUrl: "http://localhost:3000/payment/fail",
        method: paymentMethod,
      };

      console.log("Payment Data:", paymentData);

      const response = await axios.post("/api/payment", paymentData);
      console.log("Payment Response:", response.data);
      const { paymentKey, checkout } = response.data;

      // 결제 성공 페이지로 리디렉션
      window.location.href = checkout.url;
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("결제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.paymentContainer}>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading data</p>}
      {lecturePackage && (
        <>
          <h2>결제</h2>
          <div className={styles.packageInfo}>
            <img src={lecturePackage.THUMBNAIL} alt="패키지 썸네일" />
            <div>
              <h3>{lecturePackage.TITLE}</h3>
              <p>{lecturePackage.CONTENT}</p>
            </div>
          </div>
          <div className={styles.priceKindSelection}>
            <h4>결제 종류</h4>
            <select onChange={handlePriceKindChange}>
              <option value="">결제 종류 선택</option>
              <option value="0">
                월정액: {lecturePackage.priceMonth.toLocaleString()} 원
              </option>
              <option value="1">
                평생소장: {lecturePackage.priceForever.toLocaleString()} 원
              </option>
            </select>
          </div>
          <div className={styles.paymentMethod}>
            <h4>결제 수단</h4>
            <select onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="">결제 수단 선택</option>
              <option value="카드">카드 및 간편결제</option>
              <option value="계좌이체">계좌이체</option>
              <option value="가상계좌">가상계좌</option>
              <option value="휴대폰">휴대폰</option>
            </select>
          </div>
          <div className={styles.couponSelection}>
            <label>
              <span>쿠폰</span>
              <select onChange={handleCouponChange}>
                <option value="">쿠폰 선택</option>
                {coupons.map((coupon) => (
                  <option key={coupon.id} value={coupon.id}>
                    {coupon.couponDescription} -{" "}
                    {coupon.discountAmount.toLocaleString()} 원 할인
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.priceInfo}>
            <div>
              <span>기존 가격</span>
              <span>
                {(priceKind === "0"
                  ? lecturePackage.priceMonth
                  : lecturePackage.priceForever
                ).toLocaleString()}{" "}
                원
              </span>
            </div>
            <div>
              <span>할인 금액</span>
              <span>
                {selectedCoupon
                  ? selectedCoupon.discountAmount.toLocaleString()
                  : 0}{" "}
                원
              </span>
            </div>
            <div>
              <span>최종 금액</span>
              <span>{finalPrice.toLocaleString()} 원</span>
            </div>
          </div>
          <div className={styles.agreement}>
            <label>
              <input
                type="checkbox"
                checked={agreement}
                onChange={() => setAgreement(!agreement)}
              />
              결제사 정보 제공 동의
            </label>
          </div>
          <button className={styles.paymentButton} onClick={handlePayment}>
            결제하기
          </button>
          {showPopup && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <p>결제사 정보 제공에 동의해야 합니다.</p>
                <button onClick={() => setShowPopup(false)}>닫기</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentInformation;
