import axios from "axios";

export default async function handler(req, res) {
  const { amount, orderId, orderName, successUrl, failUrl } = req.body;
  const apiKey = "test_ck_eqRGgYO1r5AOw9ZaQadarQnN2Eya"; // 실제 API 키를 사용하세요
  const encodedApiKey = Buffer.from(`${apiKey}:`).toString("base64");

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
      },
      {
        headers: {
          Authorization: `Basic ${encodedApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
