import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({
    message: 'old password has be string',
  })
  @IsNotEmpty({
    message: 'old password is required',
  })
  oldPassword: string;

  @IsString({
    message: 'new password has be string',
  })
  @IsNotEmpty({
    message: 'new password is required',
  })
  newPassword: string;
}
