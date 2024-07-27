import { Injectable } from '@nestjs/common';

import { MeRepository } from '@me/repositories/me.repository';
import { SessionInfoType } from '@core/types/sessionInfo.type';

@Injectable()
export class MeService {
  constructor(private readonly meRepository: MeRepository) {}

  public async getMyinfo(sessionInfo: SessionInfoType) {
    const { user } = await this.meRepository.findMyInfo(sessionInfo.id);
    return user;
  }
}
