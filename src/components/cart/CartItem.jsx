import React from "react";
import Link from "next/link";
import styles from "./CartItem.module.css";

const extractTextFromHTML = (htmlString) => {
  // DOMParser를 사용하여 HTML 문자열을 파싱
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // 비디오 및 이미지 태그를 제거
  const elementsToRemove = doc.querySelectorAll("oembed, figure, img");
  elementsToRemove.forEach((element) => element.remove());

  // 텍스트 콘텐츠 추출
    let text = doc.body.innerText.trim();
    let truncatedText = text.length > 80 ? text.slice(0, 80) + '...' : text;
    return truncatedText;
};

const CartItem = ({ item, onSelect, isSelected }) => {
  const textContent = extractTextFromHTML(item.content);
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
        <p>{textContent}</p>
        <p>{item.nickname}</p>
      </div>
      <div className={styles.price}>{item.price.toLocaleString()}원</div>
    </div>
  );
};

export default CartItem;
