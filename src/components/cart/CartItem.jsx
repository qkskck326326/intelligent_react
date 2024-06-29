import React from "react";
import Link from "next/link";
import styles from "./CartItem.module.css";

const CartItem = ({ item, onSelect, isSelected }) => {
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
        <p>{item.content}</p>
        <p>{item.nickname}</p>
      </div>
      <div className={styles.price}>{item.price.toLocaleString()}원</div>
    </div>
  );
};

export default CartItem;
