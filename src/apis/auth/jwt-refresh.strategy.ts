
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import AppConfig from '../../etc/app.config';
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppConfig.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }
  async validate(payload: any) {
    const userId = payload.sub;
    const account = await this.usersService.findOneById(userId);
    if (!account) {
      return null;
    }
    return account;
  }
}
