import { BaseMessage } from './base-message';
import { ApiProperty } from '@nestjs/swagger';

export class UserAlreadyExist extends BaseMessage {
  @ApiProperty({
    example: 'user already exist',
  })
  message: string;
}
