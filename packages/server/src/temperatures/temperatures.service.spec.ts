import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Temperature } from './entities/temperature.entity';
import { TemperaturesRepository } from './temperatures.repository';
import { TemperaturesService } from './temperatures.service';

describe('TemperaturesService', () => {
  let service: TemperaturesService;
  let repository: TemperaturesRepository;

  const temperatureMock: Temperature = {
    id: 1,
    externalId: 'temperature-1',
    temperature: 20.5,
    humidity: 60,
    clientId: 'test-client-id',
    measuredAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemperaturesService,
        TemperaturesRepository,
        {
          provide: getRepositoryToken(TemperaturesRepository),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[temperatureMock], 1]),
            findOne: jest.fn().mockResolvedValue(temperatureMock),
            create: jest.fn().mockReturnValue(temperatureMock),
            save: jest.fn().mockResolvedValue(temperatureMock),
          },
        },
      ],
    }).compile();

    service = module.get<TemperaturesService>(TemperaturesService);
    repository = module.get<TemperaturesRepository>(TemperaturesRepository);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should find temperature by externalId', async () => {
    const repositorySpy = jest.spyOn(repository, 'findOne');
    const temperature = await service.findOne('temperature-1');

    expect(temperature).toBeDefined();
    expect(temperature).toStrictEqual(temperature);
    expect(repositorySpy).toBeCalledTimes(1);
  });

  it('should throw error when temperature with externalId not exists', async () => {
    const repositorySpy = jest.spyOn(repository, 'findOne').mockImplementation(() => {
      throw new NotFoundException();
    });

    await expect(service.findOne('i-do-not-exist')).rejects.toThrowError(NotFoundException);
    expect(repositorySpy).toBeCalledTimes(1);
  });
});
