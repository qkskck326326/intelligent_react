import React from "react";
import styles from "../../styles/myCertificate.module.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className={styles.pagination}>
    <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
      처음으로 //disabled : 현재 페이지가 1이면 버튼 비활성화시킴. 처음으로
    </button>
    <button
      onClick={() => onPageChange(currentPage - 1)} // 이 버튼을 클릭하면 onPageChange 콜백 함수가 호출되어 현재 페이지에서 1을 뺀 페이지로 이동합
      disabled={currentPage === 1}
    >
      &lt;
    </button>
    // 페이지 번호 버튼들
    {[...Array(totalPages)].map((_, index) => (
      // Array(totalPages)는 totalPages 길이의 배열을 생성함. ex) totalPages = 5 라면, 5개로 된 배열이 생성됨.
      // [...Array(totalPages)] : 위에서 생성된 배열을 펼쳐서 복사함. -> 이는 새롱ㄴ 배열을 만들어 변경이 기존 배열에 영향을 미치지 않도록 함.
      // map 함수를 사용하여 배열의 각 요소를 반복함.
      // (_, index) : 배열의 각 요소와 해당 요소의 인덱스를 나타냄.

      //버튼
      <button
        key={index} //각 버튼에 고유한 키를 부여함. => React가 각 버튼을 식별하고 효율적으로 업데이트하기 위해 필요함.
        className={currentPage === index + 1 ? styles.active : ""}
        // 현재 페이지가 이 버튼의 페이지 번호와 같다면 'styles.active'클래스를 적용하여 활성화된 상태로 표시함.
        // 그렇지 않다면 빈 문자열을 적용하여 기본 상태로 둠.

        onClick={() => onPageChange(index + 1)}
        // 버튼을 클릭하면 'onPageChange' 함수가 호출되고, 'index + 1' 을 인수로 전달함. 이 인수는 페이지 번호를 나타냄.
      >
        {index + 1} //버튼의 텍스트로 표시되는 값임. //index는 0부터 시작하므로,
        1부턴 시작하는 페이지 번호를 표시하기위해 'index + 1' 로 함.
      </button>
    ))}
    //다음 페이지 버튼
    <button
      onClick={() => onPageChange(currentPage + 1)} // 이 버튼을 클릭하면 onPageChange 콜백 함수가 호출되어 현재 페이지에서 1을 더한 페이지로 이동함.
      disabled={currentPage === totalPages} // 현재 페이지가 마지막 페이지(totalPages)인 경우, disabled 속성이 적용되어 버튼이 비활성화됨
    >
      &gt;
    </button>
    <button
      onClick={() => onPageChange(totalPages)} // 이 버튼을 클릭하면 onPageChange 콜백 함수가 호출되어 마지막 페이지(totalPages)로 이동함.
      disabled={currentPage === totalPages} // 현재 페이지가 마지막 페이지(totalPages)인 경우, disabled 속성이 적용되어 버튼이 비활성화됨
    >
      마지막으로
    </button>
  </div>
);

export default Pagination;
