import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // elimina propiedades que no están en el DTO
    forbidNonWhitelisted: true, // lanza error si mandan propiedades extra
    transform: true, // convierte tipos (ej: string a number)
  }));

  const configService = app.get(ConfigService);
  const APP_PORT = configService.get<number>('APP_PORT') || 3000;

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true, // Habilitar para enviar cookies
  });

  // Aumentar límite de JSON a 10MB
  app.useBodyParser('json', { limit: '10mb' });

  await app.listen(APP_PORT);
  console.log(`Servicio corriendo en http://localhost:${APP_PORT}`);
}
bootstrap();
