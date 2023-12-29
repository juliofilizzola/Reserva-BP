import { ApiProperty } from '@nestjs/swagger';

export class UserToken {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NTY0ZDU4YS0wNGUyLTRlZjctOTIyYy0zYzViMGFhOTAxZmEiLCJlbWFpbCI6InBhdWxvQGhvdG1haWwudGVjaCIsIm5hbWUiOiJQYXVsbyBTYWx2YXRvcmUiLCJpYXQiOjE3MDM3Njk5NTUsImV4cCI6MTcwNDM2OTk1NX0.ph_qPhbgrOUFdWou25o4MX4r4umX0odvh6t-m8NHnsw',
    type: String,
    description: 'token de validação',
  })
  access_token: string;
}
