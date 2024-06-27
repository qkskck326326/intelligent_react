import React from "react";
import styles from "./CartItem.module.css";

const CartItem = ({ item, onSelect, isSelected }) => {
  return (
    <div className={styles.cartItem}>
      <div className={styles.selectBox}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(item.lecturePackageId, e.target.checked)}
        />
      </div>
      <div className={styles.thumbnailBox}>
        <img
          src="/images/2.jpg"
          alt={item.title}
          className={styles.thumbnail}
        />
      </div>
      <div className={styles.details}>
        <h3>{item.title}</h3>
        <p>{item.content}</p>
        <p>{item.nickname}</p>
      </div>
      <div className={styles.price}>{item.price.toLocaleString()}원</div>
    </div>
  );
};

export default CartItem;
