import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Temperature } from './entities/temperature.entity';

@Injectable()
export class TemperaturesRepository extends Repository<Temperature> {
  constructor(private dataSource: DataSource) {
    super(Temperature, dataSource.createEntityManager());
  }
}
