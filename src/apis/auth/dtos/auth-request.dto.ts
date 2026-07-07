// sign-in.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'admin@gmail.com', })
  @IsString()
  email: string;

  @ApiProperty({ example: 'admin123', })
  @IsString()
  password: string;
}