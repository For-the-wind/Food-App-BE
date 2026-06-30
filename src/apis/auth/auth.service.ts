
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordHelper } from '../../utils/password.helper';
import { AuthTokenReturn } from './dtos/auth-response.dto';
import { User } from '../users/users.entity';
import AppConfig from '../../etc/app.config';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async signIn(email: string, password: string) {
        const user = await this.usersService.findOneByEmail(email);
        const isCorrectPassword = await PasswordHelper.comparePassword(
            password,
            user.password,
        );

        if (!isCorrectPassword)
            return [null, 'Password Is Not Correct, Please Check Password Again'];

        const key = await this.generateToken(user);
        return [
            new AuthTokenReturn(key[0], user.role).setRefreshToken(key[1]),
            null,
        ];
    }

    async refreshToken(user: User) {
        const accessToken = await this.jwtService.signAsync(
            {
                sub: user.id,
                username: user.email,
            },
            {
                secret: AppConfig.JWT_SECRET,
                expiresIn: AppConfig.JWT_EXPIRES_IN,
            },
        );
        return [new AuthTokenReturn(accessToken, user.role), null];
    }

    async generateToken(user: User) {
        const username = user.email;
        const id = user.id;
        return await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: id,
                    username: username,
                },
                {
                    secret: AppConfig.JWT_SECRET,
                    expiresIn: AppConfig.JWT_EXPIRES_IN,
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: id,
                    username: username,
                },
                {
                    secret: AppConfig.JWT_REFRESH_SECRET,
                    expiresIn: AppConfig.JWT_REFRESH_EXPIRES_IN,
                },
            ),
        ]);
    }
}
