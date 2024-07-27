import { Controller, Get, Query } from '@nestjs/common';

import { Public } from '@auth/decorators/public.decorator';
import { CountryService } from '@country/services/country.service';
import { AllCountriesQueryDto } from '@country/dtos/read/all-countries.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Paises')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Public()
  @Get()
  public async getAllCountries(@Query() queryParams: AllCountriesQueryDto) {
    return this.countryService.getAllCountries(queryParams);
  }
}
