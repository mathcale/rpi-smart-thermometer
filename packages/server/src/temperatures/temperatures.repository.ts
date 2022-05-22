import { EntityRepository, Repository } from 'typeorm';

import { Temperature } from './entities/temperature.entity';

@EntityRepository(Temperature)
export class TemperaturesRepository extends Repository<Temperature> {}
