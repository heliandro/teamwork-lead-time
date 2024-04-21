import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  console.log(`Environment: ${configService.get<string>('ENVIRONMENT')}`);

  // const queues = ['dataloader_commits_queue']

  // for (const queue of queues) {
  //   app.connectMicroservice({
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: ['amqp://admin:admin123@localhost:5672'],
  //       queue,
  //       queueOptions: {
  //         durable: true
  //       },
  //     },
  //   });
  // }

  // await app.startAllMicroservices();
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
