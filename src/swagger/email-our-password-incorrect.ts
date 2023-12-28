import { BaseMessage } from './base-message';
import { ApiProperty } from '@nestjs/swagger';

export class EmailOurPasswordIncorrect implements BaseMessage {
  @ApiProperty({
    example: 'error: Email address or password provided is incorrect.',
  })
  message: string;
}
