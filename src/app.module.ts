import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './apis/users/users.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LogModule } from './logger/logger.module';

@Module({
  imports: [
    LogModule.forRoot(),
    UsersModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users');
  }
}
