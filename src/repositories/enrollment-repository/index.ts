import { prisma } from "@/config";
import { Enrollment } from "@prisma/client";
import { parse } from "date-fns";

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  const parsedDate = parse(createdEnrollment.birthday, "yyyy-MM-dd", new Date());

  return prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: { ...createdEnrollment, birthday: parsedDate },
    update: { ...updatedEnrollment, birthday: parsedDate },
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, "id" | "createdAt" | "updatedAt" | "birthday"> & {
  birthday: string;
};
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, "userId">;

const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
};

export default enrollmentRepository;
