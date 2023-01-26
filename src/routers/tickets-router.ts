import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { createTicketSchema } from "@/schemas";
import { getTicketByUser, getTicketTypes, postCreateTicket } from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/", getTicketByUser)
  .post("/", validateBody(createTicketSchema), postCreateTicket)
  .get("/types", getTicketTypes);

export { ticketsRouter };
