import ticketRepository, { CreateTicketParams } from "@/repositories/ticket-repository";
import { Ticket, TicketType } from "@prisma/client";
import enrollmentsService from "../enrollments-service";

async function createTicket(params: CreateTicket, userId: number): Promise<TicketWithTicketType> {
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);

  const { ticketTypeId } = params;

  const createdTicket = await ticketRepository.create({ ticketTypeId, enrollmentId: enrollment.id });

  const TicketType = await ticketRepository.findTicketTypeById(ticketTypeId);

  return { ...createdTicket, TicketType };
}

export type CreateTicket = Omit<CreateTicketParams, "enrollmentId">;

export type TicketWithTicketType = Ticket & {
  TicketType: TicketType;
};

const ticketsService = {
  createTicket,
};

export default ticketsService;
