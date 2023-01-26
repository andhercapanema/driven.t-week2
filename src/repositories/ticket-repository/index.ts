import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

async function create(createdTicket: CreateTicketParams) {
  return prisma.ticket.create({
    data: {
      ...createdTicket,
      status: "RESERVED",
    },
  });
}

async function findTicketTypeById(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      Enrollment: {
        id: enrollmentId,
      },
    },
    include: {
      TicketType: true,
    },
  });
}

async function findTicketWithTicketTypeById(ticketId: number) {
  return prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    },
  });
}

export type CreateTicketParams = Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">;

const ticketRepository = {
  create,
  findTicketTypeById,
  findTicketWithTicketTypeById,
};

export default ticketRepository;
