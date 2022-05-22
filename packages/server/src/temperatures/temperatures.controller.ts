import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TemperaturesService } from './temperatures.service';
import { CreateTemperatureDto } from './dto/create-temperature.dto';

@Controller()
export class TemperaturesController {
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
    return this.temperaturesService.create(createTemperatureDto);
  }
}
