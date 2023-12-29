import { ApiProperty } from '@nestjs/swagger';

export class ResponseUpdatePassword {
  @ApiProperty({
    example: 'register new password success!',
  })
  response: string;
}
