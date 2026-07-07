import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';

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


export class PaymentTokenizationDto {
  @ApiProperty({
    example: 'ORDER_202607070001',
    description: 'Mã đơn hàng duy nhất của giao dịch.',
  })
  @IsString()
  orderCode: string;

  @ApiProperty({
    example: 150000,
    description: 'Số tiền thanh toán (đơn vị: VND).',
  })
  @IsInt()
  amount: number;

  @ApiProperty({
    example: 67,
    description: 'Tổng số sản phẩm trong đơn hàng.',
  })
  @IsInt()
  totalItem: number;

  @ApiProperty({
    example: 'Thanh toán đơn hàng #ORDER_202607070001',
    description: 'Mô tả giao dịch hiển thị trên Alepay.',
  })
  @IsString()
  orderDescription: string;

  @ApiProperty({
    example: 'Tran Viet Cuong',
    description: 'Họ và tên người thanh toán.',
  })
  @IsString()
  buyerName: string;

  @ApiProperty({
    example: 'cuong@example.com',
    description: 'Địa chỉ email của người thanh toán.',
  })
  @IsEmail()
  buyerEmail: string;

  @ApiProperty({
    example: '0987654321',
    description: 'Số điện thoại của người thanh toán.',
  })
  @IsString()
  buyerPhone: string;

  @ApiProperty({
    example: '123 Nguyen Hue, District 1',
    description: 'Địa chỉ của người thanh toán.',
  })
  @IsString()
  buyerAddress: string;

  @ApiProperty({
    example: 'Ho Chi Minh',
    description: 'Thành phố của người thanh toán.',
    required: false,
  })
  @IsOptional()
  @IsString()
  buyerCity?: string;

  @ApiProperty({
    example: 'Viet Nam',
    description: 'Đất nước của người thanh toán.',
  })
  @IsString()
  buyerCountry: string;

  @ApiProperty({
    example: false,
    description: 'True: Thanh toán kèm liên kết thẻ. False: Chỉ thanh toán mà không liên kết thẻ.',
  })
  @IsBoolean()
  isCardLink: boolean
}