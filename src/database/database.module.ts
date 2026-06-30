import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './datasource.js';
import { DatabaseService } from './database.service';
import { User } from '../apis/users/users.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {
  constructor(private readonly databaseService: DatabaseService) {}

  onModuleInit() {
    this.databaseService.loadAdmin();
  }
}
