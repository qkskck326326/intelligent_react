import axios from "axios";

export default async function handler(req, res) {
  const { paymentKey, amount, orderId } = req.body;
  const apiKey = process.env.TOSS_API_KEY; // 실제 API 키를 사용합니다.
  const encodedApiKey = Buffer.from(`${apiKey}:`).toString("base64");

  try {
    const response = await axios.post(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        paymentKey,
        amount,
        orderId,
      },
      {
        headers: {
          Authorization: `Basic ${encodedApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Approval Response from Toss Payments:", response.data); // 응답 로깅
    res.status(200).json({
      paymentStatus: response.data,
      orderId: orderId,
      amount: amount,
    });
  } catch (error) {
    console.error("Error approving payment:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}
