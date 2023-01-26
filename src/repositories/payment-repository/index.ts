import { prisma } from "@/config";

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

const paymentRepository = {
  findPaymentByTicketId,
};

export default paymentRepository;
