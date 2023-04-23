import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Temperature } from './entities/temperature.entity';
import { TemperaturesController } from './temperatures.controller';
import { TemperaturesRepository } from './temperatures.repository';
import { TemperaturesService } from './temperatures.service';

@Module({
  imports: [TypeOrmModule.forFeature([Temperature])],
  controllers: [TemperaturesController],
  providers: [TemperaturesService, TemperaturesRepository],
})
export class TemperaturesModule {}
