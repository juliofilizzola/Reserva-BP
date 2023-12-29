import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @IsString({
    message: 'name is invalid',
  })
  @ApiProperty({
    example: '14087e68-e669-482b-b908-bc33623a036d',
    required: true,
    description: 'id do usuario',
    type: String,
  })
  id: string;

  @IsString({
    message: 'name is invalid',
  })
  @ApiProperty({
    example: 'Fulano de Tal',
    required: true,
    description: 'nome do novo user',
    type: String,
  })
  name: string;

  @IsEmail(
    {},
    {
      message: 'email is invalid',
    },
  )
  @ApiProperty({
    required: true,
    example: 'test@test.com',
    type: String,
    description: 'Só é aceito email valido',
  })
  email: string;

  @IsString({
    message: 'phone is invalid',
  })
  @ApiProperty({
    required: false,
    type: String,
    example: '3198314323',
    description: 'telefone de contato',
  })
  phone?: string;

  @IsString({
    message: 'document is invalid',
  })
  @ApiProperty({
    required: true,
    type: String,
    example: '00000000012',
    description: 'Documento como CPF ou CNPJ',
  })
  document: string;

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
