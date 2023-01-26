import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
    include: {
      Ticket: {
        select: {
          Enrollment: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
  });
}

async function createPayment(createPaymentParams: CreatePaymentParams) {
  return prisma.payment.create({
    data: createPaymentParams,
  });
}

export type CreatePaymentParams = Omit<Payment, "id" | "createdAt" | "updatedAt">;

const paymentRepository = {
  findPaymentByTicketId,
  createPayment,
};

export default paymentRepository;
