import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  console.log(`Environment: ${configService.get<string>('ENVIRONMENT')}`);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
