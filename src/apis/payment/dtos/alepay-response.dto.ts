import { ApiProperty } from '@nestjs/swagger';

export class CardTokenResponseDto {
  @ApiProperty({
    example: 'TOK_6c4cfa9f2e7b4b1...',
    description: 'Token thanh toán của thẻ',
  })
  token: string;

  @ApiProperty({
    example: '970436******1234',
    description: 'Số thẻ (6 số đầu và 4 số cuối)',
  })
  cardNumber: string;

  @ApiProperty({
    example: 'TRAN VIET CUONG',
    description: 'Tên chủ thẻ',
  })
  cardHolderName: string;

  @ApiProperty({
    example: '12',
    description: 'Tháng hết hạn',
  })
  cardExpireMonth: string;

  @ApiProperty({
    example: '29',
    description: 'Năm hết hạn (2 số cuối)',
  })
  cardExpireYear: string;

  @ApiProperty({
    example: 'VISA',
    description: 'Loại thẻ',
  })
  paymentMethod: string;

  @ApiProperty({
    example: 'VCB',
    description: 'Mã ngân hàng phát hành',
  })
  bankCode: string;
}

export class CustomerCardInfoResponseDto {
  @ApiProperty({
    example: '000',
    description: 'Mã kết quả',
  })
  code: string;

  @ApiProperty({
    example: 'Thành công',
    description: 'Thông báo kết quả',
  })
  message: string;

  @ApiProperty({
    example: 'Tran',
    description: 'Họ khách hàng',
  })
  firstName: string;

  @ApiProperty({
    example: 'Viet Cuong',
    description: 'Tên khách hàng',
  })
  lastName: string;

  @ApiProperty({
    example: 'cuong@example.com',
    description: 'Email khách hàng',
  })
  email: string;

  @ApiProperty({
    example: '0912345678',
    description: 'Số điện thoại',
  })
  phone: string;

  @ApiProperty({
    type: [CardTokenResponseDto],
    description: 'Danh sách các thẻ đã liên kết',
  })
  listCardTokens: CardTokenResponseDto[];
}