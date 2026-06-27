import { SequelizeModuleOptions } from '@nestjs/sequelize';

export function createSequelizeConfig(
  databasePath = process.env.DATABASE_PATH,
): SequelizeModuleOptions {
  return {
    dialect: 'sqlite',
    storage: databasePath ?? 'database.sqlite',
    autoLoadModels: true,
    synchronize: true,
    logging: false,
  };
}
