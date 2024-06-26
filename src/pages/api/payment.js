import axios from "axios";

export default async function handler(req, res) {
  const { method, amount, orderId, orderName, successUrl, failUrl } = req.body;
  const apiKey = process.env.TOSS_API_KEY; // 실제 API 키를 사용합니다.
  const encodedApiKey = Buffer.from(`${apiKey}:`).toString("base64");
  console.log("Request received:", req.body); // 요청 로깅
  try {
    const response = await axios.post(
      "https://api.tosspayments.com/v1/payments",
      {
        method: "카드",
        amount,
        orderId,
        orderName,
        successUrl,
        failUrl,
        easyPay: "NAVERPAY", // 네이버페이 추가
        // flowMode: "DIRECT",
        // easyPay: "KAKAOPAY", // 카카오페이 추가
      },
      {
        headers: {
          Authorization: `Basic ${encodedApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response from Toss Payments:", response.data); // 응답 로깅
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
