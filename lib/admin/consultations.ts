import {
  isConsultationStatus,
  type AdminConsultation,
  type ConsultationStatus,
} from "@/lib/admin/consultation-record";
import { searchAcross } from "@/lib/admin/table-query";
import { prisma } from "@/lib/prisma";
import type { Consultation } from "@/lib/generated/prisma/client";

const dateField = (value: Date | null) => (value ? value.toISOString().slice(0, 10) : "");

/** The other direction: a date field's value as the UTC midnight it means. */
const dateColumn = (value: string) => (value ? new Date(`${value}T00:00:00.000Z`) : null);

/** The row as the console's one consultation shape. */
const toConsultation = (record: Consultation): AdminConsultation => ({
  id: record.id,
  reference: `#CR-${String(record.reference).padStart(4, "0")}`,
  name: record.name,
  email: record.email,
  phone: record.phone,
  projectType: record.projectType,
  startDate: dateField(record.startDate),
  endDate: dateField(record.endDate),
  budget: record.budget,
  summary: record.summary,
  receivedAt: record.receivedAt.toISOString(),
  status: isConsultationStatus(record.status) ? record.status : "New",
});

export type ConsultationQuery = { search?: string; status?: ConsultationStatus; };

export const listConsultations = async ({ search, status }: ConsultationQuery = {}) => {
  const records = await prisma.consultation.findMany({
    where: {
      ...(status ? { status } : {}),
      ...searchAcross(["name", "email", "projectType"], search),
    },
    orderBy: { receivedAt: "desc" },
  });
  return records.map(toConsultation);
};

/** The overview's "Review project briefs" count — untriaged requests only. */
export const countNewConsultations = () =>
  prisma.consultation.count({ where: { status: "New" } });

export type ConsultationInput = Omit<
  AdminConsultation,
  "id" | "reference" | "receivedAt" | "status"
>;

/** Records a brief off the storefront inquiry form. It always arrives `New`. */
export const createConsultation = async (input: ConsultationInput) => {
  const record = await prisma.consultation.create({
    data: {
      ...input,
      startDate: dateColumn(input.startDate),
      endDate: dateColumn(input.endDate),
    },
  });
  return toConsultation(record);
};

/** The sheet's one write. False if the request has since been deleted. */
export const setConsultationStatus = async (id: string, status: ConsultationStatus) => {
  const { count } = await prisma.consultation.updateMany({ where: { id }, data: { status } });
  return count > 0;
};
