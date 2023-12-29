import { ApiProperty } from '@nestjs/swagger';

export class ResponsePaginationBase {
  @ApiProperty({
    example: 1,
    required: true,
    type: Number,
    description: 'duração da reunião',
  })
  count: number;

  @ApiProperty({
    example: 1,
    required: true,
    type: Number,
    description: 'duração da reunião',
  })
  currentPage: number;

  @ApiProperty({
    example: 1,
    required: true,
    type: Number,
    description: 'duração da reunião',
  })
  nextPage: number;

  @ApiProperty({
    example: 1,
    required: true,
    type: Number,
    description: 'duração da reunião',
  })
  prevPage: number;

  @ApiProperty({
    example: 1,
    required: true,
    type: Number,
    description: 'duração da reunião',
  })
  lastPage: number;
}
