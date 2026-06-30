// sign-in.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'john',
  })
  username: string;

  @ApiProperty({
    example: 'password123',
  })
  password: string;
}