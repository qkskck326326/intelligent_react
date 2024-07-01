import React, { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Fail = () => {
  const router = useRouter();
  const { orderId } = router.query;

  // useEffect(() => {
  //   const clearPaymentData = async () => {
  //     try {
  //       await axios.post("/api/clearPaymentData", { orderId });
  //       console.log("Payment data cleared from session");
  //     } catch (error) {
  //       console.error("Error clearing payment data from session:", error);
  //     }
  //   };

  //   if (orderId) {
  //     clearPaymentData();
  //   }
  // }, [orderId]);

  return (
    <div>
      <h1>결제 실패</h1>
      <p>결제가 실패하였습니다. 다시 시도해 주세요.</p>
    </div>
  );
};

export default Fail;
