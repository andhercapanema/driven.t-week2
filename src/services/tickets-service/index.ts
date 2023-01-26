import { notFoundError } from "@/errors";
import ticketRepository, { CreateTicketParams } from "@/repositories/ticket-repository";
import { Ticket, TicketType } from "@prisma/client";
import enrollmentsService from "../enrollments-service";

export type CreateTicket = Omit<CreateTicketParams, "enrollmentId">;

export type TicketWithTicketType = Ticket & {
  TicketType: TicketType;
};

async function createTicket(params: CreateTicket, userId: number): Promise<TicketWithTicketType> {
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);

  const { ticketTypeId } = params;

  const createdTicket = await ticketRepository.create({ ticketTypeId, enrollmentId: enrollment.id });

  const createdTicketWithTicketTypeById = (await ticketRepository.findTicketWithTicketTypeById(
    createdTicket.id,
  )) as TicketWithTicketType;

  return createdTicketWithTicketTypeById;
}

async function getTicketByUserId(userId: number): Promise<TicketWithTicketType> {
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);

  const ticket = await ticketRepository.findTicketTypeById(enrollment.id);

  if (!ticket) throw notFoundError("Ticket");

  return ticket;
}

const ticketsService = {
  createTicket,
  getTicketByUserId,
};

export default ticketsService;
