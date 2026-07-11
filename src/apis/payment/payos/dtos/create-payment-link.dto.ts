import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentItemDto {
  @ApiProperty({
    example: 'Gói Premium 1 tháng',
    description: 'Tên sản phẩm/dịch vụ hiển thị trong đơn hàng',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'Số lượng sản phẩm',
  })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    example: 99000,
    description: 'Đơn giá của sản phẩm (VNĐ)',
  })
  @IsInt()
  @IsPositive()
  price: number;
}

/**
 * DTO dùng để tạo "lệnh thu" (Payment Request) - tạo link thanh toán PayOS.
 * Tương ứng API: POST https://api-merchant.payos.vn/v2/payment-requests
 */
export class CreatePaymentLinkDto {
  @ApiProperty({
    example: 1720684800,
    description:
      'Mã đơn hàng do hệ thống merchant sinh ra, phải là số nguyên duy nhất (thường dùng timestamp hoặc auto-increment). PayOS dùng để đối soát giao dịch.',
  })
  @IsInt()
  @IsNotEmpty()
  orderCode: number;

  @ApiProperty({
    example: 100000,
    description: 'Số tiền cần thu, đơn vị VNĐ, không có phần thập phân',
    minimum: 1000,
  })
  @IsInt()
  @Min(1000)
  amount: number;

  @ApiProperty({
    example: 'Thanh toan don hang #1234',
    description:
      'Mô tả giao dịch, tối đa 25 ký tự theo quy định của PayOS (sẽ hiển thị trên nội dung chuyển khoản)',
    maxLength: 25,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'https://yourapp.com/payment/cancel',
    description: 'URL PayOS sẽ redirect về khi khách hàng hủy thanh toán',
  })
  @IsUrl()
  @IsNotEmpty()
  cancelUrl: string;

  @ApiProperty({
    example: 'https://yourapp.com/payment/success',
    description: 'URL PayOS sẽ redirect về khi khách hàng thanh toán thành công',
  })
  @IsUrl()
  @IsNotEmpty()
  returnUrl: string;

  @ApiPropertyOptional({
    type: [PaymentItemDto],
    description: 'Danh sách sản phẩm/dịch vụ trong đơn hàng (hiển thị chi tiết trên trang thanh toán)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDto)
  items?: PaymentItemDto[];

  @ApiPropertyOptional({
    example: 'Nguyen Van A',
    description: 'Tên người mua, dùng để hiển thị và xuất hóa đơn (nếu có)',
  })
  @IsOptional()
  @IsString()
  buyerName?: string;

  @ApiPropertyOptional({
    example: 'nguyenvana@gmail.com',
    description: 'Email người mua',
  })
  @IsOptional()
  @IsEmail()
  buyerEmail?: string;

  @ApiPropertyOptional({
    example: '0987654321',
    description: 'Số điện thoại người mua',
  })
  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @ApiPropertyOptional({
    example: '123 Nguyen Trai, Quan 1, TP.HCM',
    description: 'Địa chỉ người mua',
  })
  @IsOptional()
  @IsString()
  buyerAddress?: string;

  @ApiPropertyOptional({
    example: 1720771200,
    description:
      'Thời điểm hết hạn của link thanh toán, dạng Unix timestamp (giây). Nếu không truyền, PayOS áp dụng thời gian mặc định.',
  })
  @IsOptional()
  @IsNumber()
  expiredAt?: number;
}