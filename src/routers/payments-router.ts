import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getPaymentByTicketId, processPayment } from "@/controllers";
import { processPaymentSchema } from "@/schemas";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPaymentByTicketId)
  .post("/process", validateBody(processPaymentSchema), processPayment);

export { paymentsRouter };
