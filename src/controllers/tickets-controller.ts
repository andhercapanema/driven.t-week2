import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function postCreateTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const createdTicket = await ticketsService.createTicket(req.body, req.userId);

    return res.status(httpStatus.CREATED).send(createdTicket);

    // return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
  }
}
