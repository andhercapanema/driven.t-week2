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

async function findTicketTypeById(ticketTypeId: number) {
  return prisma.ticketType.findUnique({
    where: {
      id: ticketTypeId,
    },
  });
}

export type CreateTicketParams = Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">;

const ticketRepository = {
  create,
  findTicketTypeById,
};

export default ticketRepository;
