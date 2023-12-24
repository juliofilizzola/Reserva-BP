// import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString({
    message: 'name is invalid',
  })
  @IsNotEmpty({
    message: 'name is required',
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
  email: string;

  @IsString({
    message: 'password is invalid',
  })
  @IsNotEmpty({
    message: 'password is required',
  })
  password: string;

  @IsString({
    message: 'phone is invalid',
  })
  @IsOptional()
  phone: string;

  @IsString({
    message: 'document is invalid',
  })
  @IsNotEmpty({
    message: 'document is required',
  })
  document: string;
}
