import { Temperature } from '../entities/temperature.entity';

export class FindAllTemperaturesOutput {
  count: number;
  pageSize: number;
  data: Temperature[];
}
