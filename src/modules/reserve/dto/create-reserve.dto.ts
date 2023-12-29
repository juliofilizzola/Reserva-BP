import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReserveDto {
  @ApiProperty({
    description: 'Data of the reserve',
    type: Date,
    example: '2023-01-01T12:00:00Z',
  })
  @IsNotEmpty({
    message: 'data is required',
  })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Duration of the reserve in minutes',
    type: Number,
    example: 60,
  })
  @IsNumber({}, { message: 'duration is invalid' })
  @IsPositive({ message: 'duration is invalid' })
  @IsNotEmpty({ message: 'duration is required' })
  duration: number;

  @ApiProperty({
    description: 'ID of the broker',
    type: String,
    example: 'abc123',
  })
  @IsString({ message: 'id broker invalid' })
  @IsNotEmpty({ message: 'id broker is required' })
  idBroker: string;

  @ApiProperty({
    description: 'Description of the reserve (optional)',
    type: String,
    example: 'Meeting with a client',
    required: false,
  })
  @IsString({ message: 'description is invalid' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Title of the reserve',
    type: String,
    example: 'Client Meeting',
  })
  @IsString({ message: 'title is invalid' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;
}
