
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import AppConfig from '../../etc/app.config';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: AppConfig.JWT_SECRET,
            signOptions: { expiresIn: AppConfig.JWT_EXPIRES_IN },
        })
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }
