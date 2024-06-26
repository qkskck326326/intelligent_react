// import { getSession } from "next-session";

// export default async function handler(req, res) {
//   const {
//     orderId,
//     lecturePackageId,
//     paymentMethod,
//     selectedCoupon,
//     finalPrice,
//     priceKind,
//     userEmail,
//   } = req.body;

//   const session = await getSession(req, res);

//   // 디버깅 로그 추가
//   console.log("Received request body:", req.body);

//   // 필수 파라미터 체크
//   if (
//     !orderId ||
//     !lecturePackageId ||
//     !paymentMethod ||
//     !finalPrice ||
//     !priceKind ||
//     !userEmail
//   ) {
//     console.error("필수 파라미터가 누락되었습니다.");
//     return res.status(400).json({ error: "필수 파라미터가 누락되었습니다." });
//   }

//   // 세션 데이터 초기화 및 저장
//   if (!session.paymentData) {
//     session.paymentData = {};
//   }
//   session.paymentData[orderId] = {
//     orderId,
//     lecturePackageId,
//     paymentMethod,
//     selectedCoupon,
//     finalPrice,
//     priceKind,
//     userEmail,
//   };

//   console.log("Saved data to session:", session.paymentData[orderId]);

//   res.status(200).send("Payment data saved to session.");
// }
