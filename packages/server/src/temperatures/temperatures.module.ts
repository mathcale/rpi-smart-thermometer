import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TemperaturesService } from './temperatures.service';
import { TemperaturesController } from './temperatures.controller';
import { TemperaturesRepository } from './temperatures.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TemperaturesRepository])],
  controllers: [TemperaturesController],
  providers: [TemperaturesService],
})
export class TemperaturesModule {}
