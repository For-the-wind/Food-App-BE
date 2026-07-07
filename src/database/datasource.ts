import AppConfig from '../etc/app.config';
import { DataSource } from 'typeorm';
import * as path from 'node:path';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: AppConfig.DB_HOST,
    port: AppConfig.DB_PORT,
    username: AppConfig.DB_USERNAME,
    password: AppConfig.DB_PASSWORD,
    database: AppConfig.DB_DATABASE,
    entities: [path.resolve(__dirname + '/../**/*.entity{.js,.ts}')],
    migrations: [path.resolve(__dirname + '/../migrations', '*{.js,.ts}')],
    synchronize: true,
    ssl: { rejectUnauthorized: false },
    logger: 'advanced-console',
    logging: 'all',
});

console.log("Database Options: ", AppDataSource.options);

export default AppDataSource;
