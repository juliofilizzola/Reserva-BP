import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReserveDto {
  @IsNotEmpty({
    message: 'data is required',
  })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNumber(
    {},
    {
      message: 'duration is invalid',
    },
  )
  @IsPositive({
    message: 'duration is invalid',
  })
  @IsNotEmpty({
    message: 'duration is required',
  })
  duration: number;

  @IsString({
    message: 'id broker invalid',
  })
  @IsNotEmpty({
    message: 'id broker is required',
  })
  idBroker: string;

  @IsString({
    message: 'description is invalid',
  })
  @IsOptional()
  description?: string;

  @IsString({
    message: 'title is invalid',
  })
  @IsNotEmpty({
    message: 'title is required',
  })
  title: string;
}
