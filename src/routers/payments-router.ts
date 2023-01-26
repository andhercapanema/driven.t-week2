import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getPaymentByTicketId } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPaymentByTicketId)
  .post("/process", (req, res) => res.send("POST /payments/process"));

export { paymentsRouter };
