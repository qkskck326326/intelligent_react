import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import "./PaymentInformation.module.css";
import authStore from "../../stores/authStore";
import axios from "axios";

const PaymentInformation = ({ lecturePackageId }) => {
  const [lecturePackage, setLecturePackage] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userEmail = authStore.getUserEmail();
      if (!lecturePackageId) return;
      setLoading(true);
      setError(null);

      try {
        const packageResponse = await axiosClient.get(
          `/payment/packages/${lecturePackageId}`
        );
        setLecturePackage(packageResponse.data);
        setFinalPrice(packageResponse.data.price);

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
    const selected = coupons.find((coupon) => coupon.id === e.target.value);
    setSelectedCoupon(selected);

    if (selected) {
      setFinalPrice(lecturePackage.price - selected.discountAmount);
    } else {
      setFinalPrice(lecturePackage.price);
    }
  };

  const handlePayment = async () => {
    const userEmail = authStore.getUserEmail();
    const provider = authStore.getProvider();
    if (!agreement) {
      setShowPopup(true);
      return;
    }
    const paymentData = {
      amount: finalPrice,
      orderId: `order_${Date.now()}`,
      orderName: lecturePackage.title,
      successUrl: "http://localhost:3000/payment/success",
      failUrl: "http://localhost:3000/payment/fail",
    };

    try {
      const response = await axios.post("/api/payment", paymentData);
      const { checkout } = response.data;
      window.location.href = checkout.url; // 결제 페이지로 리디렉션
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("결제 중 오류가 발생했습니다.");
    }

    console.log("결제 처리 로직 실행");
  };

  return (
    <div className="payment-container">
      {loading && <p>Loading...</p>}
      {error && <p>Error loading data</p>}
      {lecturePackage && (
        <>
          <h2>결제</h2>
          <div className="package-info">
            <img src={lecturePackage.thumbnail} alt="패키지 썸네일" />
            <div>
              <h3>{lecturePackage.title}</h3>
              <p>{lecturePackage.price.toLocaleString()} 원</p>
            </div>
          </div>
          <div className="payment-method">
            <h4>결제 수단</h4>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="toss"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <img src="toss-logo.png" alt="toss" />
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="npay"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <img src="npay-logo.png" alt="NPay" />
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="kakaopay"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <img src="kakaopay-logo.png" alt="KakaoPay" />
            </label>
          </div>
          <div className="coupon-selection">
            <label>
              <span>쿠폰</span>
              <select onChange={handleCouponChange}>
                <option value="">쿠폰 선택</option>
                {coupons.map((coupon) => (
                  <option key={coupon.id} value={coupon.id}>
                    {coupon.description} -{" "}
                    {coupon.discountAmount.toLocaleString()} 원 할인
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="price-info">
            <div>
              <span>기존 가격</span>
              <span>{lecturePackage.price.toLocaleString()} 원</span>
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
          <div className="agreement">
            <label>
              <input
                type="checkbox"
                checked={agreement}
                onChange={() => setAgreement(!agreement)}
              />
              결제사 정보 제공 동의
            </label>
          </div>
          <button className="payment-button" onClick={handlePayment}>
            결제하기
          </button>
          {showPopup && (
            <div className="popup">
              <div className="popup-content">
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
