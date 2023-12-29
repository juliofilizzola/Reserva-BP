import { ApiProperty } from '@nestjs/swagger';

export class ResponseRemoveReserve {
  @ApiProperty({
    example: 'reserve deleted success',
  })
  response: string;
}
