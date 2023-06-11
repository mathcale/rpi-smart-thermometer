import { Temperature } from '../entities/temperature.entity';

export class FindAllByDateRangeOutput {
  count: number;
  data: Temperature[];
}
