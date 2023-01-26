import { notFoundError } from "@/errors";
import ticketRepository, { CreateTicketParams, TicketWithTicketType } from "@/repositories/ticket-repository";
import { TicketType } from "@prisma/client";
import enrollmentsService from "../enrollments-service";

export type CreateTicket = Omit<CreateTicketParams, "enrollmentId">;

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

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) throw notFoundError("Ticket");

  return ticket;
}

async function getTicketTypes(): Promise<TicketType[]> {
  return await ticketRepository.findAllTicketTypes();
}

const ticketsService = {
  createTicket,
  getTicketByUserId,
  getTicketTypes,
};

export default ticketsService;
