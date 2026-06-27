import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createSequelizeConfig } from './database.config';

@Module({
  imports: [SequelizeModule.forRoot(createSequelizeConfig())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
