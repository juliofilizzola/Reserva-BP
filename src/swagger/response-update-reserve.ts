import { ApiProperty } from '@nestjs/swagger';

export class ResponseUpdateReserve {
  @ApiProperty({
    example: 'reserve updated success',
  })
  response: string;
}
