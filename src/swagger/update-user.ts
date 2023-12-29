import { ApiProperty } from '@nestjs/swagger';

export class UpdateUser {
  @ApiProperty({
    example: 'user updated success',
  })
  response: string;
}
