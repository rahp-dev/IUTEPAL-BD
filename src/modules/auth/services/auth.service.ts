import { compareSync } from 'bcrypt';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { differenceInSeconds } from 'date-fns';

import { SessionInfoType } from '@core/types/sessionInfo.type';
import { AuthRepository } from '@auth/repositories/auth.repositories';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    public readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async generateAccessToken(tokenPayload: {
    id: bigint | number;
    type: number;
    rol: number;
    sede: number;
  }) {
    const { nanoid } = await import('nanoid/async');
    const accessTokenJwtid = await nanoid(32);
    const accessTokenSignOptions: JwtSignOptions = {
      jwtid: accessTokenJwtid,
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_LIFE'),
    };
    const access_token = this.jwtService.sign(
      tokenPayload,
      accessTokenSignOptions,
    );
    const refresh_token = await this.generateRefreshAcessToken(accessTokenJwtid);

    await this.authRepository.updateMetaData(tokenPayload.id);

    return {
      access_token,
      refresh_token,
      expirationInSeconds: parseInt(
        this.configService.get('JWT_ACCESS_TOKEN_LIFE'),
      ),
      type: tokenPayload.type,
      rol: tokenPayload.rol,
      sede: tokenPayload.sede,
    };
  }

  private async generateRefreshAcessToken(accessTokenJwtid: string) {
    const { nanoid } = await import('nanoid/async');
    const refreshTokenJwtid = await nanoid(32);
    const refreshTokenSignOptions: JwtSignOptions = {
      jwtid: refreshTokenJwtid,
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_LIFE'),
    };
    const refresh_token = this.jwtService.sign(
      { atjwtid: accessTokenJwtid },
      refreshTokenSignOptions,
    );

    return refresh_token;
  }

  public async validate(username: string, password: string) {
    const sessionInfo = await this.authRepository.getSessionInfo(username);

    if (!sessionInfo || !compareSync(password, sessionInfo.password)) {
      return false;
    }

    return {
      id: sessionInfo.id,
      type: sessionInfo.typeId,
      rol: sessionInfo.rolId,
    };
  }

  public async logout(tokenInfo: SessionInfoType) {
    await this.addTokenToBlackList(tokenInfo);

    return { message: 'session closed successfully' };
  }

  private async addTokenToBlackList(tokenInfo: SessionInfoType) {
    const jti = tokenInfo.jti;
    const now = Date.now();
    const exp = tokenInfo.exp * 1000;
    const ttl = differenceInSeconds(exp, now);

    if (1 > ttl) {
      return true;
    }

    await this.cacheManager.set(jti, jti, { ttl } as any);

    return true;
  }

  public async refreshToken(
    refreshTokenInfo: SessionInfoType,
    access_token: string,
  ) {
    try {
      const accessTokenInfo: SessionInfoType = this.jwtService.verify(
        access_token,
        {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
          ignoreExpiration: true,
        },
      );

      if (refreshTokenInfo.atjwtid !== accessTokenInfo.jti) {
        throw new BadRequestException();
      }

      await this.addTokenToBlackList(refreshTokenInfo);
      await this.addTokenToBlackList(accessTokenInfo);

      return await this.generateAccessToken({
        id: accessTokenInfo.id,
        type: accessTokenInfo.type,
        rol: accessTokenInfo.rol,
        sede: accessTokenInfo.sede,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  public async isValidSession(sessionInfo: SessionInfoType) {
    const expirationInSeconds = differenceInSeconds(
      sessionInfo.exp * 1000,
      Date.now(),
    );

    return {
      expirationInSeconds,
      type: sessionInfo.type,
    };
  }
}
