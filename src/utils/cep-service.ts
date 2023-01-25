import { RequestError, ViaCEPAddress } from "@/protocols";
import { request } from "./request";

async function getAddress(cep: string): Promise<ViaCEPAddress | ViaCEPAddressError> {
  const result = await request.get(`https://viacep.com.br/ws/${cep}/json/`);

  const requestError = result as RequestError;
  if (requestError.name === "RequestError") {
    throw result;
  }

  return result.data;
}

export type ViaCEPAddressError = {
  erro: boolean;
};

export { getAddress };
