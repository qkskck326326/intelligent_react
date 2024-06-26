import { getSession } from "next-session";

export default async function handler(req, res) {
  const { orderId } = req.query;

  const session = await getSession(req, res);

  if (session.paymentData && session.paymentData[orderId]) {
    res.json(session.paymentData[orderId]);
  } else {
    res.status(404).send("Payment data not found.");
  }
}
