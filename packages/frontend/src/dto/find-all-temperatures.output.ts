import { Temperature } from './temperature.entity';

export interface FindAllTemperaturesOutput {
  count: number;
  pageSize: number;
  data: Temperature[];
}
