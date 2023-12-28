import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
  @IsEmail(undefined, {
    message: 'email invalid',
  })
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
    message: 'password has be string',
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
}
