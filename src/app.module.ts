import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './apis/users/users.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LogModule } from './logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './apis/auth/auth.module';
import { PaymentModule } from './apis/payment/payment.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LogModule.forRoot(),
    UsersModule, AuthModule, PaymentModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users');
  }
}
