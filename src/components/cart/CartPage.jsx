import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import styles from "./CartPage.module.css";
import { axiosClient } from "../../axiosApi/axiosClient";
import axios from "axios";
import authStore from "../../stores/authStore";
import { useRouter } from "next/router"; // Import useRouter

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [agreement, setAgreement] = useState(false);
  const router = useRouter(); // Define router

  useEffect(() => {
    const isLoggedIn = authStore.checkIsLoggedIn();

    if (!isLoggedIn) {
      const userConfirmed = window.confirm(
        "로그인이 필요한 콘텐츠입니다. 로그인하시겠습니까?"
      );

      if (userConfirmed) {
        router.push("/user/login");
      } else {
        router.push("/");
      }
    }
    const userEmail = localStorage.getItem("userEmail");
    const provider = localStorage.getItem("provider");
    console.log(
      `Fetching cart items for user: ${userEmail}, provider: ${provider}`
    );

    const fetchCartItems = async () => {
      try {
        const response = await axiosClient.get(
          `/cart/${userEmail}/${provider}`
        );
        setCartItems(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchCoupons = async () => {
      try {
        const response = await axiosClient.get(`/payment/coupons/${userEmail}`);
        setCoupons(response.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCartItems();
    fetchCoupons();
  }, []);

  const handleSelect = (id, isSelected) => {
    setSelectedItems((prev) => {
      const newSelectedItems = new Set(prev);
      if (isSelected) {
        newSelectedItems.add(id);
      } else {
        newSelectedItems.delete(id);
      }
      return newSelectedItems;
    });
  };

  const handleDeleteSelected = async () => {
    try {
      const idsArray = Array.from(selectedItems);
      const userEmail = authStore.getUserEmail();
      const provider = authStore.getProvider();
      console.log("삭제할 패키지아이디", idsArray); // 디버깅 로그
      const response = await axiosClient.post("/cart/delete", {
        ids: idsArray,
        userEmail: userEmail,
        provider: provider,
      });
      console.log("Delete response:", response); // 디버깅 로그
      setCartItems((prev) =>
        prev.filter((item) => !selectedItems.has(item.lecturePackageId))
      );
      setSelectedItems(new Set());
    } catch (error) {
      console.error("Error deleting items:", error); // 디버깅 로그
      setError(error.message);
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allItemIds = cartItems.map((item) => item.lecturePackageId);
      setSelectedItems(new Set(allItemIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const getDiscountAmount = () => {
    const totalPrice = cartItems
      .filter((item) => selectedItems.has(item.lecturePackageId))
      .reduce((total, item) => total + item.price, 0);

    if (selectedCoupon) {
      return (totalPrice * selectedCoupon.discountAmount) / 100;
    }

    return 0;
  };

  const getTotalPrice = () => {
    const totalPrice = cartItems
      .filter((item) => selectedItems.has(item.lecturePackageId))
      .reduce((total, item) => total + item.price, 0);

    const discount = getDiscountAmount();
    return totalPrice - discount;
  };

  const handlePayment = async () => {
    const userEmail = authStore.getUserEmail();
    const provider = authStore.getProvider();
    if (!agreement) {
      alert("결제사 정보 제공에 동의해야 합니다.");
      return;
    }
    try {
      const orderId = `order_${Date.now()}`;
      const selectedCartItems = cartItems.filter((item) =>
        selectedItems.has(item.lecturePackageId)
      );
      const totalAmount = getTotalPrice();

      const paymentRequest = {
        orderId: orderId,
        amount: totalAmount,
        userEmail: userEmail,
        provider: provider,
        items: selectedCartItems.map((item) => ({
          lecturePackageId: item.lecturePackageId,
          price: item.price,
        })),
        couponId: selectedCoupon ? selectedCoupon.id : null,
      };

      await axiosClient.post("/payment/request", paymentRequest, {
        withCredentials: true,
      });

      const paymentData = {
        amount: totalAmount,
        orderId: orderId,
        orderName: "Cart Payment",
        successUrl: "http://localhost:3000/payment/success",
        failUrl: "http://localhost:3000/payment/fail",
      };

      const response = await axios.post("/api/payment", paymentData, {
        withCredentials: true,
      });

      const { checkout } = response.data;
      window.location.href = checkout.url;
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("결제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const allSelected = selectedItems.size === cartItems.length;

  return (
    <div className={styles.cartPage}>
      <div className={styles.cartContainer}>
        <div className={styles.cartItems}>
          <h2>{authStore.getNickname()}님의 장바구니 목록</h2>
          <div className={styles.cartHeader}>
            <br />
            <div>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => handleSelectAll(!allSelected)}
              />
              전체선택 {selectedItems.size}/{cartItems.length}
            </div>
            {/* <div>상품명</div>
            <div>가격</div> */}
          </div>
          <div className={styles.cartBody}>
            {cartItems.length === 0 ? (
              <div className={styles.emptyCart}>
                아직 장바구니에 추가한 패키지가 없습니다.
                <div className={styles.movePackageBtn}>
                  <button onClick={() => router.push("/lecturePackage")}>
                    패키지 둘러보기
                  </button>
                </div>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.lecturePackageId}
                  item={item}
                  onSelect={handleSelect}
                  isSelected={selectedItems.has(item.lecturePackageId)}
                />
              ))
            )}
          </div>
          <button
            className={styles.deleteButton}
            onClick={handleDeleteSelected}
            disabled={selectedItems.size === 0}
          >
            선택삭제
          </button>
        </div>
        <div className={styles.paymentBox}>
          <h3>결제 정보</h3>
          <div className={styles.userInformation}>
            <p>
              닉네임 : {authStore.getNickname()}
              <br />
              이메일 : {authStore.getUserEmail()}
            </p>
          </div>
          <div className={styles.couponSelection}>
            <label>
              <span>쿠폰</span>
              <select
                onChange={(e) => {
                  const couponId = e.target.value;
                  const coupon = coupons.find(
                    (coupon) => coupon.id.toString() === couponId
                  );
                  setSelectedCoupon(coupon);
                }}
              >
                <option value="">쿠폰 선택</option>
                {coupons.map((coupon) => (
                  <option key={coupon.id} value={coupon.id}>
                    {coupon.description} - {coupon.discountAmount}% 할인
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p>할인 금액: {getDiscountAmount().toLocaleString()}원</p>
          <p>총 결제 금액: {getTotalPrice().toLocaleString()}원</p>
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
          <button onClick={handlePayment} disabled={selectedItems.size === 0}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
