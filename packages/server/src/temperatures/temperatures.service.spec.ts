import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DateRange } from './dto/date-range.enum';
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
            find: jest.fn().mockResolvedValue([temperatureMock]),
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

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('return list of found temperatures', async () => {
    const result = await service.findAll({ page: 1, pageSize: 10 });

    expect(result).toBeDefined();
    expect(result.count).toEqual(1);
    expect(result.data).toStrictEqual([temperatureMock]);
  });

  it('should return empty list when no temperatures found', async () => {
    const repositorySpy = jest.spyOn(repository, 'findAndCount').mockResolvedValue([[], 0]);
    const result = await service.findAll({ page: 1, pageSize: 10 });

    expect(result).toBeDefined();
    expect(result.count).toEqual(0);
    expect(result.data).toStrictEqual([]);
    expect(repositorySpy).toBeCalledTimes(1);
  });

  it('should throw error when trying to find temperatures but something went wrong', async () => {
    const repositorySpy = jest.spyOn(repository, 'findAndCount').mockImplementation(() => {
      throw new InternalServerErrorException();
    });

    await expect(service.findAll({ page: 1, pageSize: 10 })).rejects.toThrowError(
      InternalServerErrorException,
    );

    expect(repositorySpy).toBeCalledTimes(1);
  });

  it('should find temperatures by date range', async () => {
    const result = await service.findAllByDateRange({ range: DateRange.DAY });

    expect(result).toBeDefined();
    expect(result.count).toEqual(1);
    expect(result.data).toStrictEqual([temperatureMock]);
  });

  it('should return empty list when no temperatures found by date range', async () => {
    const repositorySpy = jest.spyOn(repository, 'find').mockResolvedValue([]);
    const result = await service.findAllByDateRange({ range: DateRange.DAY });

    expect(result).toBeDefined();
    expect(result.count).toEqual(0);
    expect(result.data).toStrictEqual([]);
    expect(repositorySpy).toBeCalledTimes(1);
  });

  it('should find latest temperature', async () => {
    const repositorySpy = jest.spyOn(repository, 'findOne');
    const temperature = await service.findLatest();

    expect(temperature).toBeDefined();
    expect(temperature).toStrictEqual(temperature);
    expect(repositorySpy).toBeCalledTimes(1);
  });

  it('should throw error when trying to get latest temperature but non exists', async () => {
    const repositorySpy = jest.spyOn(repository, 'findOne').mockImplementation(() => {
      throw new NotFoundException();
    });

    await expect(service.findLatest()).rejects.toThrowError(NotFoundException);
    expect(repositorySpy).toBeCalledTimes(1);
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

  it('should create new temperature successfully', async () => {
    const newTemperature = await service.create({
      temperature: 20.5,
      humidity: 60,
      clientId: 'test-client-id',
      measuredAt: new Date().toISOString(),
    });

    expect(newTemperature).toBeDefined();
    expect(newTemperature).toStrictEqual(temperatureMock);
  });
});
