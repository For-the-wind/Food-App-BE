import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './apis/users/users.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LogModule } from './logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './apis/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    LogModule.forRoot(),
    UsersModule, AuthModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users');
  }
}
