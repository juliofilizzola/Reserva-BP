import { ApiProperty } from '@nestjs/swagger';

export class DeleteUser {
  @ApiProperty({
    example: 'user deleted success',
  })
  response: string;
}
