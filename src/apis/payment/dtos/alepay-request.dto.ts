import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

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


export class OneClickPaymentDto {
  @ApiProperty({
    example: 'cus_123456789',
    description: 'Customer token nhận được sau khi liên kết thẻ',
  })
  @IsString()
  @IsNotEmpty()
  customerToken: string;

  @ApiProperty({
    example: 'ORDER_20260707143000',
    description: 'Mã đơn hàng duy nhất',
  })
  @IsString()
  @IsNotEmpty()
  orderCode: string;

  @ApiProperty({
    example: 250000,
    description: 'Số tiền thanh toán (VND)',
  })
  @IsInt()
  @IsPositive()
  @Min(1000)
  amount: number;

  @ApiProperty({
    example: 'Thanh toán đơn hàng #12345',
    description: 'Mô tả đơn hàng',
  })
  @IsString()
  @IsNotEmpty()
  orderDescription: string;
}

export class CancelLinkCardDto {
  @ApiProperty({
    example: 'cus_123456789',
    description: 'Customer token nhận được sau khi liên kết thẻ',
  })
  @IsString()
  @IsNotEmpty()
  alepayToken: string;
}
