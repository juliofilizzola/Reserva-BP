import { BaseMessage } from './base-message';
import { ApiProperty } from '@nestjs/swagger';

export class UserNotFound implements BaseMessage {
  @ApiProperty({
    example: 'user not found',
  })
  message: string;
}
