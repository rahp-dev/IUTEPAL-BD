import { Prisma } from '@prisma/client';

export const AddressFields: Prisma.addressSelect = {
  street: true,
  city: true,
  state: true,
  country: { select: { id: true, name: true } },
};

export type Address = {
  street: string;
  city: string;
  state: string;
  country: { id: number; name: string };
};
