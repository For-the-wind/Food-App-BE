import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateCardLinkDto {
  @ApiProperty({
    example: 'Tran Viet Cuong',
    description: 'Full name of card holder',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'cuong@example.com',
    description: 'Customer email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '0912345678',
    description: 'Customer phone number',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: '123 Nguyen Hue',
    description: 'Street address',
  })
  @IsString()
  address: string;

  @ApiProperty({
    example: 'Ho Chi Minh',
    description: 'City',
  })
  @IsString()
  city: string;

  @ApiProperty({
    example: 'Ho Chi Minh',
    description: 'State / Province',
  })
  @IsString()
  state: string;

  @ApiProperty({
    example: '700000',
    description: 'Postal code',
  })
  @IsString()
  postalCode: string;
}