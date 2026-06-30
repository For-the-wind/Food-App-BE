import { Injectable, BeforeApplicationShutdown } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AppConfig from '../etc/app.config.js';
import { Log } from '../logger/logger.decorator.js';
import { LogService } from '../logger/logger.service.js';
import { User } from '../apis/users/users.entity.js';
import { RoleEnum } from '../etc/enum.js';
import { PasswordHelper } from '../utils/password.helper.js';

@Injectable()
export class DatabaseService implements BeforeApplicationShutdown {
    constructor(
        @Log('DatabaseService') private readonly logger: LogService,
        @InjectRepository(User)
        private readonly accountRepository: Repository<User>,
    ) { }

    async beforeApplicationShutdown(signal?: string) {
        this.logger.log('beforeApplicationShutdown: ' + signal);
        this.logger.log('Reset isLoggedIn to false for all accounts');
    }

    async loadAdmin() {
        const admin = await this.accountRepository.findOne({
            where: {
                email: AppConfig.ADMIN_EMAIL,
            },
        });
        if (!admin) {
            await this.accountRepository.delete({
                email: AppConfig.ADMIN_EMAIL,
            });
            await this.accountRepository.save({
                fullName: 'Super Admin',
                email: AppConfig.ADMIN_EMAIL,
                dob: new Date(),
                phone: '0123456789',
                studentId: 'SE000000',
                role: RoleEnum.ADMIN,
                isEnabled: true,
                isLocked: false,
                password: await PasswordHelper.hashPassword(AppConfig.ADMIN_DEFAULT_PASSWORD),
            });
        }
    }
}
