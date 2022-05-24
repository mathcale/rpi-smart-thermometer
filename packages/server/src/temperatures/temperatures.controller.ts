import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TemperaturesService } from './temperatures.service';
import { CreateTemperatureDto } from './dto/create-temperature.dto';
import { FindAllTemperaturesParams } from './dto/find-all-temperatures.params';

@Controller({ path: 'temperatures', version: '1' })
export class TemperaturesController {
  constructor(private readonly temperaturesService: TemperaturesService) {}

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() findAllTemperaturesParams: FindAllTemperaturesParams) {
    return this.temperaturesService.findAll(findAllTemperaturesParams);
  }

  @Get(':externalId')
  findOne(@Param('externalId') externalId: string) {
    return this.temperaturesService.findOne(externalId);
  }

  @MessagePattern('sensors/temperatures/create')
  create(@Payload() createTemperatureDto: CreateTemperatureDto) {
    return this.temperaturesService.create(createTemperatureDto);
  }
}
