import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class FindAllTemperaturesParams {
  @IsInt()
  @Transform(({ value }) => +value)
  page: number = 1;

  @IsInt()
  @Transform(({ value }) => +value)
  pageSize: number = 10;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  endDate?: string;
}
