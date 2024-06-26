import React from "react";
import styles from "./CartItem.module.css";

const CartItem = ({ item, onSelect, isSelected }) => {
  return (
    <tr className={styles.cartItem}>
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(item.lecturePackageId, e.target.checked)}
        />
      </td>
      <td>
        <img
          src="/images/2.jpg"
          alt={item.title}
          className={styles.thumbnail}
        />
        <div className={styles.details}>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
          <p>{item.nickname}</p>
        </div>
      </td>
      <td>{item.price.toLocaleString()}원</td>
      {/* <td>{item.discountRate}%</td>
      <td>{item.price.toLocaleString()}원</td> */}
    </tr>
  );
};

export default CartItem;
