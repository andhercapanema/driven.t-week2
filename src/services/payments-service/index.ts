import { notFoundError, invalidDataError, unauthorizedError } from "@/errors";
import paymentRepository from "@/repositories/payment-repository";

import { exclude } from "@/utils/prisma-utils";

async function getPaymentByTicketId(ticketId: number, loggedUserId: number) {
  if (isNaN(ticketId)) throw invalidDataError(["ticketId param not inserted"]);

  const paymentWithUserId = await paymentRepository.findPaymentByTicketId(ticketId);

  if (!paymentWithUserId) throw notFoundError("Payment");

  const paymentUserId = paymentWithUserId.Ticket.Enrollment.userId;

  if (loggedUserId !== paymentUserId) throw unauthorizedError();

  return exclude(paymentWithUserId, "Ticket");
}

const paymentsService = {
  getPaymentByTicketId,
};

export default paymentsService;
