import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString({
    message: 'name is invalid',
  })
  @IsNotEmpty({
    message: 'name is required',
  })
  @ApiProperty({
    description: 'nome do usuario',
    type: String,
    example: 'Fulano de tal',
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
    description: 'email do usuario',
    type: String,
  })
  email: string;

  @IsString({
    message: 'phone is invalid',
  })
  @IsOptional()
  @ApiProperty({
    description: 'telefone de contado do usuario',
    type: String,
    required: false,
    example: '3198314323',
  })
  phone?: string;

  @IsString({
    message: 'document is invalid',
  })
  @IsNotEmpty({
    message: 'document is required',
  })
  @ApiProperty({
    type: String,
    description: 'documento do usuario (pode ser cpf ou cnpj)',
    example: '00000000012',
  })
  document: string;
}
