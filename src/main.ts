import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173', 'http://192.168.88.23:5173', 'http://172.28.96.1:5173'],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  console.log('Listening on: http://localhost:3000');
}
bootstrap();
