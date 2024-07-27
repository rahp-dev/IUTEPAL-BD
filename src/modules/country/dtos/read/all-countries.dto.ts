import { QueryBase } from '@core/dtos/query-base.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class AllCountriesQueryDto extends QueryBase {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  paginated?: boolean;
}
