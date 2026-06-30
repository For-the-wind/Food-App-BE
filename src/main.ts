import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Food App API')
    .setDescription('An API for a food mobile app.')
    .setVersion('0.1')
    .addBearerAuth()
    .addServer('/api/v0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger-ui', app, document);

  await app.listen(process.env.PORT ?? 3000);

  if (process.env.NODE_ENV === 'development') {
    open('http://localhost:3000/swagger-ui');
  }
}
bootstrap();
