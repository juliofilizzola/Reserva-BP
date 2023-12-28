import { BaseMessage } from './base-message';
import { ApiProperty } from '@nestjs/swagger';

export class UserNotPermission implements BaseMessage {
  @ApiProperty({
    example: 'error: user not permission!',
  })
  message: string;
}
