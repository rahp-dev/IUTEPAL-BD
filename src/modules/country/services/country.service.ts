import { Injectable } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { AllCountriesQueryDto } from '@country/dtos/read/all-countries.dto';

@Injectable()
export class CountryService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAllCountries(queryParams: AllCountriesQueryDto) {
    return this.prismaService.country.findMany({
      select: { id: true, name: true },
    });
  }
}
