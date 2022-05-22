import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTemperatureDto } from './dto/create-temperature.dto';
import { Temperature } from './entities/temperature.entity';
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

  async create(createTemperatureDto: CreateTemperatureDto): Promise<Temperature | never> {
    try {
      this.logger.log('Saving new temperature reading...');

      const temperature = await this.temperaturesRepository.save(
        this.temperaturesRepository.create(createTemperatureDto),
      );

      this.logger.log('Temperature successfully saved!');

      return temperature;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
