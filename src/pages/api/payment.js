import axios from "axios";

export default async function handler(req, res) {
    const { method, amount, orderId, orderName, successUrl, failUrl, paymentKey, refundAmount } = req.body;
    const apiKey = process.env.TOSS_API_KEY; // 실제 API 키를 사용합니다.
    const encodedApiKey = Buffer.from(`${apiKey}:`).toString("base64");

    console.log("Request received:", req.body); // 요청 로깅

    try {
        if (method === "refund") {
            console.log("Refund request received with transactionKey:", paymentKey); // 로그 추가
            console.log("Refund amount:", refundAmount); // 환불 금액 로그
            const response = await axios.post(
                `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
                {
                    cancelReason: "사용자 요청 환불",
                    cancelAmount: refundAmount,
                },
                {
                    headers: {
                        Authorization: `Basic ${encodedApiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Refund response:", response.data); // 응답 로깅
            return res.status(200).json(response.data);
        }

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
        console.error("Error during payment/refund process:", error); // 에러 로깅
        res.status(500).json({ error: error.message });
    }
}
