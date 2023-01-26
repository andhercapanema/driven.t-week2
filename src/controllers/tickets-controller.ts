import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function postCreateTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const createdTicket = await ticketsService.createTicket(req.body, req.userId);

    return res.status(httpStatus.CREATED).send(createdTicket);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
  }
}

export async function getTicketByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const userTicket = await ticketsService.getTicketByUserId(userId);

    return res.status(httpStatus.OK).send(userTicket);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
  }
}
