import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SessionInfo } from '@core/decorators/sessionInfo.decorator';
import { SessionInfoType } from '@core/types/sessionInfo.type';
import { MeService } from '@me/services/me.service';

@ApiBearerAuth()
@ApiTags('Me (Información del dueño de la session)')
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  public async getMyinfo(@SessionInfo() sessionInfo: SessionInfoType) {
    return this.meService.getMyinfo(sessionInfo);
  }
}
