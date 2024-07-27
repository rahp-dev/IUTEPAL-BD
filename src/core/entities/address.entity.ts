export class AddressEntity {
  street: string;
  city: string;
  state: string;
  country: { id: number; name: string };

  constructor(partial: Partial<AddressEntity>) {
    Object.assign(this, partial);
  }
}
