import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateTemperatureDto } from './dto/create-temperature.dto';
import { FindAllByDateRangeParams } from './dto/find-all-by-date-range.params';
import { FindAllTemperaturesParams } from './dto/find-all-temperatures.params';
import { TemperaturesService } from './temperatures.service';

@Controller({ path: 'temperatures', version: '1' })
export class TemperaturesController {
  constructor(private readonly temperaturesService: TemperaturesService) {}

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() findAllTemperaturesParams: FindAllTemperaturesParams) {
    return this.temperaturesService.findAll(findAllTemperaturesParams);
  }

  @Get('date-range')
  findAllByDateRange(@Query() findAllByDateRangeParams: FindAllByDateRangeParams) {
    return this.temperaturesService.findAllByDateRange(findAllByDateRangeParams);
  }

  @Get('latest')
  findLatest() {
    return this.temperaturesService.findLatest();
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
