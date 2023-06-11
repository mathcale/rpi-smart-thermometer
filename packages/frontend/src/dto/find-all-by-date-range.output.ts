import { SimpleTemperature } from './temperature.entity';

export class FindAllByDateRangeOutput {
  count: number;
  data: SimpleTemperature[];
}
