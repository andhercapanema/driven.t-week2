import { AuthenticatedRequest } from "@/middlewares";
import paymentsService from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPaymentByTicketId(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await paymentsService.getPaymentByTicketId(Number(req.query.ticketId), Number(req.userId));

    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    if (error.name === "InvalidDataError") {
      return res.status(httpStatus.BAD_REQUEST).send(error.details);
    }

    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send("Logged User cannot access the Payment with this tokenId");
    }
  }
}
