import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${process.env.MQTT_BROKER_HOST || 'localhost'}:${
        process.env.MQTT_BROKER_PORT || 1883
      }`,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
}

bootstrap();
