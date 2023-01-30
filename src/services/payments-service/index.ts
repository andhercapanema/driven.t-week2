import { notFoundError, invalidDataError, unauthorizedError } from "@/errors";
import paymentRepository from "@/repositories/payment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { CreatePaymentWithCardData } from "@/schemas";

import { exclude } from "@/utils/prisma-utils";

async function getPaymentByTicketId(ticketId: number, loggedUserId: number) {
  if (isNaN(ticketId)) throw invalidDataError(["ticketId param not inserted"]);

  const paymentWithUserId = await paymentRepository.findPaymentByTicketId(ticketId);

  if (!paymentWithUserId) throw notFoundError("Payment");

  const paymentUserId = paymentWithUserId?.Ticket?.Enrollment?.userId;
  if (loggedUserId !== paymentUserId) throw unauthorizedError();

  return exclude(paymentWithUserId, "Ticket");
}

async function postNewPayment(params: CreatePaymentWithCardData, loggedUserId: number) {
  const { ticketId, cardData } = params;

  const value = await ticketRepository.findTicketPriceAndUserId(ticketId);

  if (!value.userId) throw notFoundError("Ticket");

  const ticketUserId = value.userId;

  if (loggedUserId !== ticketUserId) throw unauthorizedError();

  await ticketRepository.updateTicketStatusById(ticketId);

  return paymentRepository.createPayment({
    ticketId,
    value: value.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  });
}

const paymentsService = {
  getPaymentByTicketId,
  postNewPayment,
};

export default paymentsService;
