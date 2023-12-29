import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 1,
    minimum: 0,
    required: false,
    type: Number,
  })
  page?: number;

  @IsOptional()
  @ApiProperty({
    example: 1,
    minimum: 0,
    maximum: 300,
    required: false,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'limit pagination, min value 1' })
  @Max(300, { message: 'limit pagination, max value 300' })
  limit?: number;
}
