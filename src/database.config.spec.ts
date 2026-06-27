import { createSequelizeConfig } from './database.config';

describe('createSequelizeConfig', () => {
  it('uses sqlite with default local database file', () => {
    const config = createSequelizeConfig(undefined);

    expect(config).toMatchObject({
      dialect: 'sqlite',
      storage: 'database.sqlite',
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    });
  });

  it('uses DATABASE_PATH when provided', () => {
    const config = createSequelizeConfig('/tmp/test.sqlite');

    expect(config.storage).toBe('/tmp/test.sqlite');
  });
});
