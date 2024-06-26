import { getSession } from "next-session";

export default async function handler(req, res) {
  const { orderId } = req.body;

  const session = await getSession(req, res);

  if (session.paymentData && session.paymentData[orderId]) {
    delete session.paymentData[orderId];
    console.log("Deleted data from session:", orderId);
    res.status(200).send("Payment data cleared from session.");
  } else {
    res.status(404).send("Payment data not found.");
  }
}
