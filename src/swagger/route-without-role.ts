import { BaseMessage } from './base-message';
import { ApiProperty } from '@nestjs/swagger';

export class RouteWithoutRole implements BaseMessage {
  @ApiProperty({
    example: 'Route without rule',
  })
  message: string;
}
