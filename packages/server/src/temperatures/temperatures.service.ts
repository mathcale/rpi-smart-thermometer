import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTemperatureDto } from './dto/create-temperature.dto';
import { TemperaturesRepository } from './temperatures.repository';

@Injectable()
export class TemperaturesService {
  private readonly logger = new Logger(TemperaturesService.name);

  constructor(
    @InjectRepository(TemperaturesRepository)
    private readonly temperaturesRepository: TemperaturesRepository,
  ) {}

  findAll() {
    return `This action returns all temperatures`;
  }

  findOne(externalId: string) {
    return `This action returns a #${externalId} temperature`;
  }

  create(createTemperatureDto: CreateTemperatureDto) {
    return 'This action adds a new temperature';
  }
}
