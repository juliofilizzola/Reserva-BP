import { ResponsePaginationBase } from './response-pagination';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../modules/user/entities/user.entity';

export class ResponsePaginationUser extends ResponsePaginationBase {
  @ApiProperty({
    required: true,
    type: [User],
    description: 'dados da tabela user',
  })
  data: User[];
}
