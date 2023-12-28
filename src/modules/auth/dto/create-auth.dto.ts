import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @IsString({
    message: 'name is invalid',
  })
  @IsNotEmpty({
    message: 'name is required',
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
  @IsNotEmpty({
    message: 'email is required',
  })
  @ApiProperty({
    required: true,
    example: 'test@test.com',
    type: String,
    description: 'Só é aceito email valido',
  })
  email: string;

  @IsString({
    message: 'password is invalid',
  })
  @IsNotEmpty({
    message: 'password is required',
  })
  @ApiProperty({
    required: true,
    type: String,
    description: 'senha utilizada no sistema',
    example: '123456',
  })
  password: string;

  @IsString({
    message: 'phone is invalid',
  })
  @IsOptional()
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
  @IsNotEmpty({
    message: 'document is required',
  })
  @ApiProperty({
    required: true,
    type: String,
    example: '000.000.000-12',
    description: 'Documento como CPF ou CNPJ',
  })
  document: string;
}
