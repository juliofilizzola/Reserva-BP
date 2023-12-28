import { BaseMessage } from './base-message';
import { ApiProperty } from '@nestjs/swagger';

export class MissingToken implements BaseMessage {
  @ApiProperty({
    example: 'missing token',
  })
  message: string;
}
