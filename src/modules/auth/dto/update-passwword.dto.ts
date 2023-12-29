import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @IsString({
    message: 'old password has be string',
  })
  @IsNotEmpty({
    message: 'old password is required',
  })
  @ApiProperty({
    required: true,
    type: String,
    description: 'senha atual utilizada no sistema',
    example: '123456',
  })
  oldPassword: string;

  @IsString({
    message: 'new password has be string',
  })
  @IsNotEmpty({
    message: 'new password is required',
  })
  @ApiProperty({
    required: true,
    type: String,
    description: 'nova senha que sera utilizada no sistema',
    example: '123456',
  })
  newPassword: string;
}
