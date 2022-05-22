import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TemperaturesService } from './temperatures.service';
import { CreateTemperatureDto } from './dto/create-temperature.dto';

@Controller()
export class TemperaturesController {
  private readonly logger = new Logger(TemperaturesController.name);

  constructor(private readonly temperaturesService: TemperaturesService) {}

  @MessagePattern('sensors/temperatures/all')
  findAll() {
    return this.temperaturesService.findAll();
  }

  @MessagePattern('sensors/temperatures/find')
  findOne(@Payload() externalId: string) {
    return this.temperaturesService.findOne(externalId);
  }

  @MessagePattern('sensors/temperatures/create')
  create(@Payload() createTemperatureDto: CreateTemperatureDto) {
    this.logger.debug(createTemperatureDto);
    return this.temperaturesService.create(createTemperatureDto);
  }
}
