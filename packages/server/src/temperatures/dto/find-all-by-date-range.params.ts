import { IsEnum, IsNotEmpty } from 'class-validator';

import { DateRange } from './date-range.enum';

export class FindAllByDateRangeParams {
  @IsNotEmpty()
  @IsEnum(DateRange)
  range: DateRange;
}
