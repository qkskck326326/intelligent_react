import CartPage from "../../components/cart/CartPage";
import styles from "../../components/cart/CartIndex.module.css";

const Index = () => {
  return (
    <div>
      <div className={styles.header}>
        <h1>IntelliClass 에서 강의를 구매해보세요!</h1>
      </div>
      <div className={styles.pageContainer}>
        <CartPage />
      </div>
    </div>
  );
};

export default Index;
