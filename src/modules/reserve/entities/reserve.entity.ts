import { ApiProperty } from '@nestjs/swagger';
import { addDays } from 'date-fns';

export class Reserve {
  @ApiProperty({
    example: '14087e68-e669-482b-b908-bc33623a036d',
    required: true,
    description: 'id da reserva',
    type: String,
  })
  id: string;

  @ApiProperty({
    example: 'reunião inicial',
    required: true,
    type: String,
    description: 'titulo de reunião',
  })
  title: string;

  @ApiProperty({
    required: true,
    type: Date,
    example: addDays(new Date(), 3),
    description: 'campo que retorna quando foi marcado',
  })
  date: string;

  @ApiProperty({
    example: 30,
    required: true,
    type: Number,
    description: 'duração da reunião',
  })
  duration: number;

  @ApiProperty({
    example: '',
    required: false,
    type: String,
    description: 'descrição de reunião',
  })
  description?: string;

  @ApiProperty({
    example: '14087e68-e669-482b-b908-bc33623a036d',
    required: true,
    description: 'id do corretor',
    type: String,
  })
  brokerId: string;

  @ApiProperty({
    example: '14087e68-e669-482b-b908-bc33623a036d',
    required: true,
    description: 'id do cliente',
    type: String,
  })
  clientId: string;

  @ApiProperty({
    required: true,
    type: Date,
    example: new Date(),
    description: 'campo que retorna quando foi criado',
  })
  createdAt: Date;
  @ApiProperty({
    required: true,
    type: Date,
    example: new Date(),
    description: 'campo retorna a ultima atualização',
  })
  updatedAt: string;
  @ApiProperty({
    required: true,
    type: Date,
    example: null,
    description: '',
  })
  deletedAt: string;
}
