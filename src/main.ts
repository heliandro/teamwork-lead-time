import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  console.log(`Environment: ${configService.get<string>('ENVIRONMENT')}`);
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
