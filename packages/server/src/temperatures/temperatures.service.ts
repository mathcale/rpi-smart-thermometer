import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { CreateTemperatureDto } from './dto/create-temperature.dto';
import { FindAllTemperaturesOutput } from './dto/find-all-temperatures.output';
import { FindAllTemperaturesParams } from './dto/find-all-temperatures.params';
import { Temperature } from './entities/temperature.entity';
import { TemperaturesRepository } from './temperatures.repository';

@Injectable()
export class TemperaturesService {
  private readonly logger = new Logger(TemperaturesService.name);

  constructor(
    @InjectRepository(TemperaturesRepository)
    private readonly temperaturesRepository: TemperaturesRepository,
  ) {}

  async findAll({
    page,
    pageSize,
    startDate,
    endDate,
  }: FindAllTemperaturesParams): Promise<FindAllTemperaturesOutput | never> {
    this.logger.log(
      `Starting find all temperatures flow, page: [${page}], pageSize: [${pageSize}], startDate: [${startDate}], endDate: [${endDate}]`,
    );

    const where: FindConditions<Temperature> = {};

    if (startDate) {
      where.measuredAt = MoreThanOrEqual(startDate);
    }

    if (endDate) {
      where.measuredAt = LessThanOrEqual(endDate);
    }

    const [result, total] = await this.temperaturesRepository.findAndCount({
      take: pageSize,
      skip: (page - 1) * pageSize,
      where,
      order: {
        createdAt: 'DESC',
      },
    });

    this.logger.log(`Fetched temperatures, found [${total}]`);

    return {
      count: total,
      pageSize,
      data: result,
    };
  }

  async findOne(externalId: string): Promise<Temperature | never> {
    this.logger.log(`Fetching temperature [${externalId}]...`);

    const foundTemperature = await this.temperaturesRepository.findOne({ externalId });

    if (!foundTemperature) {
      this.logger.warn(`Temperature [${externalId}] not found!`);

      throw new NotFoundException();
    }

    this.logger.log(`Found temperature, returning it...`);

    return foundTemperature;
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
