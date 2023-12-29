import { ResponsePaginationBase } from './response-pagination';
import { Reserve } from '../modules/reserve/entities/reserve.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ResponsePaginationReserve extends ResponsePaginationBase {
  @ApiProperty({
    required: true,
    type: [Reserve],
    description: 'dados da tabela reserve',
  })
  data: Reserve[];
}
