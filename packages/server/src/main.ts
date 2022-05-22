import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${process.env.MQTT_BROKER_HOST || 'localhost'}:${
        process.env.MQTT_BROKER_PORT || 1883
      }`,
    },
  });

  app.listen();
}

bootstrap();
