import React from "react";
import Link from "next/link";
import styles from "./CartItem.module.css";

const extractTextFromHTML = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const elementsToRemove = doc.querySelectorAll("oembed, figure, img");
    elementsToRemove.forEach((element) => element.remove());
    let text = doc.body.innerText.trim();
    let truncatedText = text.length > 80 ? text.slice(0, 80) + '...' : text;
    return truncatedText;
};

const CartItem = ({ item, onSelect, isSelected, coupons, onCouponSelect, selectedCouponId, usedCoupons, finalPrice }) => {
    const textContent = extractTextFromHTML(item.content);
    const availableCoupons = coupons.filter(coupon => !usedCoupons.includes(coupon.id.toString()) || coupon.id.toString() === selectedCouponId);

    return (
        <div className={styles.cartItem}>
            <div className={styles.selectBox} onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelect(item.lecturePackageId, e.target.checked)}
                />
            </div>

            <div className={styles.thumbnailBox}>
                <Link href={`/lecturePackage/${item.lecturePackageId}`}>
                    <img
                        src={item.thumbnail}
                        alt={item.title}
                        className={styles.thumbnail}
                    />
                </Link>
            </div>
            <div className={styles.details}>
                <h3>{item.title}</h3>
                <div className={styles.couponSelect}>
                    <select
                        value={selectedCouponId}
                        onChange={(e) => onCouponSelect(item.lecturePackageId, e.target.value)}
                    >
                        <option value="">쿠폰 선택</option>
                        {availableCoupons.map((coupon) => (
                            <option key={coupon.id} value={coupon.id}>
                                {coupon.description} - {coupon.discountAmount}% 할인
                            </option>
                        ))}
                    </select>
                </div>
                <p>{textContent}</p>
                <p>{item.nickname}</p>
            </div>
            <div className={styles.price}>
                {finalPrice !== item.price ? (
                    <>
                        <div className={styles.originalPrice}>{item.price.toLocaleString()}원</div>
                        <div className={styles.discountedPrice}>{finalPrice.toLocaleString()}원</div>
                    </>
                ) : (
                    <div>{item.price.toLocaleString()}원</div>
                )}
            </div>
        </div>
    );
};

export default CartItem;
