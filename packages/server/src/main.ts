import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { fastifyHelmet } from 'fastify-helmet';

import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.register(fastifyHelmet);

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
