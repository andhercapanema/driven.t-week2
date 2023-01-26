import Joi from "joi";

export type CreatePaymentWithCardData = {
  ticketId: number;
  cardData: CardData;
};

type CardData = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: string;
  cvv: number;
};

export const processPaymentSchema = Joi.object<CreatePaymentWithCardData>({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.number().required(),
  }).required(),
});
