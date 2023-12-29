import { ApiProperty } from '@nestjs/swagger';

export class ReserveNotFound {
  @ApiProperty({
    example: 'reserve not found',
  })
  message: string;
}
