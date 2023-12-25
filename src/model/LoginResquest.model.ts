import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @IsEmail(undefined, {
    message: 'email invalid',
  })
  @IsNotEmpty({
    message: 'email is required',
  })
  email: string;

  @IsString({
    message: 'password has be string',
  })
  @IsNotEmpty({
    message: 'password is required',
  })
  password: string;
}