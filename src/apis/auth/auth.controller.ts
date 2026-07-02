
import { Body, Controller, Post, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import CurrentAccount from '../../decorators/current-account.decorator';
import { User } from '../users/entities/user.entity';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';
import { SignInDto } from './dtos/auth-request.dto';
import ResponseObject from '../../etc/response-object';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('self')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async self(@CurrentAccount() user: User) {
        return user;
    }

    @Post('refresh')
    @UseGuards(JwtRefreshAuthGuard)
    async refreshToken(@CurrentAccount() user: User) {
        const [data, err] = await this.authService.refreshToken(user);
        if (!data) {
            return new ResponseObject(
                HttpStatus.UNAUTHORIZED,
                'Refresh Token Failed',
                null,
                err,
            );
        }
        return new ResponseObject(
            HttpStatus.OK,
            'Refresh Token Success',
            data,
            err,
        );
    }

    @Post('authenticate')
    async authentication(@Body() signInDto: SignInDto) {
        const [data, err] = await this.authService.signIn(signInDto.username, signInDto.password);
        if (!data) {
            return new ResponseObject(
                HttpStatus.UNAUTHORIZED,
                'Login Failed',
                null,
                err,
            );
        }
        return new ResponseObject(HttpStatus.OK, 'Login Success', data, err);
    }
}
