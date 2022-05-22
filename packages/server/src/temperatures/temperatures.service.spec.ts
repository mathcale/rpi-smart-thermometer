import { Test, TestingModule } from '@nestjs/testing';

import { TemperaturesService } from './temperatures.service';

describe('TemperaturesService', () => {
  let service: TemperaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemperaturesService],
    }).compile();

    service = module.get<TemperaturesService>(TemperaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
