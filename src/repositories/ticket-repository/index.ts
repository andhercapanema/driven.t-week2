import { prisma } from "@/config";
import { Ticket, TicketType } from "@prisma/client";

async function create(createdTicket: CreateTicketParams) {
  return prisma.ticket.create({
    data: {
      ...createdTicket,
      status: "RESERVED",
    },
  });
}

async function findTicketByEnrollmentId(enrollmentId: number): Promise<TicketWithTicketType> {
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

async function findTicketWithTicketTypeById(id: number): Promise<TicketWithTicketType> {
  return prisma.ticket.findUnique({
    where: {
      id,
    },
    include: {
      TicketType: true,
    },
  });
}

async function findAllTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

export type CreateTicketParams = Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">;

export type TicketWithTicketType = Ticket & {
  TicketType: TicketType;
};

const ticketRepository = {
  create,
  findTicketByEnrollmentId,
  findTicketWithTicketTypeById,
  findAllTicketTypes,
};

export default ticketRepository;
