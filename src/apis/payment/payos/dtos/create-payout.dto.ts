import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

/**
 * DTO dùng để tạo "lệnh chi" (Payout) - chi tiền tự động qua PayOS.
 * Tương ứng API: POST https://api-merchant.payos.vn/v1/payouts
 *
 * Lưu ý: request này bắt buộc phải có header `x-idempotency-key` (dùng để
 * tránh chi trùng nếu client gọi lại) và `x-signature` (HMAC-SHA256 của
 * body JSON với checksum key), được xử lý ở tầng service, không đưa vào DTO.
 */
export class CreatePayoutDto {
  @ApiProperty({
    example: 'PAYOUT-ORDER-20260711-001',
    description:
      'Mã tham chiếu do hệ thống merchant sinh ra, duy nhất cho mỗi lệnh chi, dùng để đối soát và tra cứu lại giao dịch',
  })
  @IsString()
  @IsNotEmpty()
  referenceId: string;

  @ApiProperty({
    example: 500000,
    description: 'Số tiền cần chi, đơn vị VNĐ, không có phần thập phân',
    minimum: 10000,
  })
  @IsInt()
  @Min(10000)
  amount: number;

  @ApiProperty({
    example: 'Chi hoa hong thang 7/2026',
    description: 'Nội dung/diễn giải lệnh chi, sẽ hiển thị trên sao kê người nhận',
    maxLength: 25,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '970436',
    description:
      'Mã BIN của ngân hàng thụ hưởng (theo chuẩn Napas, VD: 970436 = Vietcombank, 970422 = MBBank)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  toBin: string;

  @ApiProperty({
    example: '0071001234567',
    description: 'Số tài khoản ngân hàng của người nhận',
  })
  @IsString()
  @IsNotEmpty()
  toAccountNumber: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['salary', 'commission'],
    description: 'Danh mục phân loại lệnh chi, phục vụ mục đích thống kê/báo cáo nội bộ',
  })
  @IsOptional()
  @IsArray()
  category?: string[];
}

export class PayoutQueryDto {
  @ApiPropertyOptional({
    example: 'ALL',
    description: 'Lọc theo trạng thái duyệt lệnh chi',
    enum: ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'SUCCEEDED', 'FAILED'],
  })
  @IsOptional()
  @IsIn(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'SUCCEEDED', 'FAILED'])
  approvalState?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Số trang, bắt đầu từ 1',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Vị trí bắt đầu lấy dữ liệu (offset)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}