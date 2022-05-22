import { Test, TestingModule } from '@nestjs/testing';

import { TemperaturesController } from './temperatures.controller';
import { TemperaturesService } from './temperatures.service';

describe('TemperaturesController', () => {
  let controller: TemperaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemperaturesController],
      providers: [TemperaturesService],
    }).compile();

    controller = module.get<TemperaturesController>(TemperaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
