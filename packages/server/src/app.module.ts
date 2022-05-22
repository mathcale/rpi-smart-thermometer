import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { TemperaturesModule } from './temperatures/temperatures.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production',
        migrations: [__dirname + '/migrations/*.migration{.ts,.js}'],
        namingStrategy: new SnakeNamingStrategy(),
        cli: {
          migrationsDir: __dirname + '/migrations',
        },
        logging:
          process.env.NODE_ENV !== 'production'
            ? 'all'
            : ['error', 'schema', 'warn', 'info', 'log', 'migration'],
      }),
      inject: [ConfigService],
    }),
    TemperaturesModule,
  ],
})
export class AppModule {}
