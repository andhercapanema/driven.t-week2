import { AddressEnrollment, ViaCEPAddressResponse } from "@/protocols";
import { getAddress, ViaCEPAddressError } from "@/utils/cep-service";
import { notFoundError } from "@/errors";
import addressRepository, { CreateAddressParams } from "@/repositories/address-repository";
import enrollmentRepository, { CreateEnrollmentParams } from "@/repositories/enrollment-repository";
import { exclude } from "@/utils/prisma-utils";
import { Address, Enrollment } from "@prisma/client";

async function getAddressFromCEP(cep: string): Promise<AddressEnrollment> {
  const result = await getAddress(cep);

  const viaCEPAddressError = result as ViaCEPAddressError;
  if (viaCEPAddressError.erro) throw notFoundError("CEP");

  const CEPData = result as ViaCEPAddressResponse;
  const { logradouro, complemento, bairro, localidade, uf } = CEPData;

  return { logradouro, complemento, bairro, cidade: localidade, uf };
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw notFoundError("Enrollment With Address");

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, "userId", "createdAt", "updatedAt", "Address"),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, "userId" | "createdAt" | "updatedAt">;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, "createdAt", "updatedAt", "enrollmentId");
}

type GetAddressResult = Omit<Address, "createdAt" | "updatedAt" | "enrollmentId">;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, "address");
  const address = getAddressForUpsert(params.address);

  await getAddressFromCEP(address.cep);

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, "userId"));

  await addressRepository.upsert(newEnrollment.id, address, address);

  if (newEnrollment.createdAt === newEnrollment.updatedAt) {
    return "insert";
  }
  return "update";
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};

export default enrollmentsService;
