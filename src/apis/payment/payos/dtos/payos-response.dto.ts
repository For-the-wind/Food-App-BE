import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Response trả về sau khi tạo lệnh thu (payment-requests) thành công.
 */
export class PaymentLinkResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-1234-5678-9abc-def012345678', description: 'ID link thanh toán do PayOS sinh ra' })
  paymentLinkId: string;

  @ApiProperty({ example: 1720684800, description: 'Mã đơn hàng tương ứng (orderCode) đã gửi lên' })
  orderCode: number;

  @ApiProperty({ example: 100000, description: 'Số tiền cần thu (VNĐ)' })
  amount: number;

  @ApiProperty({ example: 0, description: 'Số tiền đã thu được (VNĐ)' })
  amountPaid: number;

  @ApiProperty({ example: 100000, description: 'Số tiền còn lại cần thu (VNĐ)' })
  amountRemaining: number;

  @ApiProperty({
    example: 'PENDING',
    description: 'Trạng thái link thanh toán',
    enum: ['PENDING', 'PROCESSING', 'PAID', 'CANCELLED', 'EXPIRED'],
  })
  status: string;

  @ApiProperty({ example: 'VND', description: 'Đơn vị tiền tệ' })
  currency: string;

  @ApiProperty({
    example: 'https://pay.payos.vn/web/a1b2c3d4-1234-5678-9abc-def012345678',
    description: 'URL trang thanh toán để redirect người dùng vào (dùng cho WebView)',
  })
  checkoutUrl: string;

  @ApiProperty({
    example: '00020101021238570010A00000072701270006970436...',
    description: 'Chuỗi dữ liệu QR code VietQR, có thể tự render QR ở client nếu không muốn dùng WebView',
  })
  qrCode: string;

  @ApiProperty({ example: '970436', description: 'Mã BIN ngân hàng thụ hưởng' })
  bin: string;

  @ApiProperty({ example: '0071001234567', description: 'Số tài khoản thụ hưởng' })
  accountNumber: string;

  @ApiProperty({ example: 'CONG TY ABC', description: 'Tên tài khoản thụ hưởng' })
  accountName: string;
}

/**
 * Dữ liệu webhook PayOS gửi về khi trạng thái lệnh thu thay đổi.
 * Endpoint nhận webhook cần verify field `signature` bằng checksum key trước khi xử lý.
 */
export class PaymentWebhookDto {
  @ApiProperty({ example: '00', description: 'Mã kết quả, "00" = thành công' })
  code: string;

  @ApiProperty({ example: 'success', description: 'Mô tả kết quả giao dịch' })
  desc: string;

  @ApiProperty({ example: true, description: 'true nếu giao dịch thành công' })
  success: boolean;

  @ApiProperty({ description: 'Chi tiết dữ liệu giao dịch' })
  data: {
    orderCode: number;
    amount: number;
    description: string;
    accountNumber: string;
    reference: string;
    transactionDateTime: string;
    currency: string;
    paymentLinkId: string;
    code: string;
    desc: string;
  };

  @ApiProperty({
    example: 'b3f1c2...e9',
    description: 'Chữ ký HMAC-SHA256 của trường "data", dùng để xác thực webhook đến từ PayOS',
  })
  signature: string;
}

/**
 * Response trả về sau khi tạo lệnh chi (payout) thành công.
 */
export class PayoutResponseDto {
  @ApiProperty({ example: 'po_8f3a1b2c9d4e', description: 'ID lệnh chi do PayOS sinh ra' })
  id: string;

  @ApiProperty({ example: 'PAYOUT-ORDER-20260711-001', description: 'Mã tham chiếu đã gửi lên (referenceId)' })
  referenceId: string;

  @ApiProperty({ example: 500000, description: 'Số tiền chi (VNĐ)' })
  amount: number;

  @ApiProperty({
    example: 'PROCESSING',
    description: 'Trạng thái duyệt/xử lý lệnh chi',
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'SUCCEEDED', 'FAILED'],
  })
  approvalState: string;

  @ApiPropertyOptional({
    example: 'FT2607110001',
    description: 'Mã giao dịch ngân hàng, chỉ có khi lệnh chi đã xử lý xong',
  })
  transactionId?: string;

  @ApiProperty({ example: '2026-07-11T10:30:00Z', description: 'Thời điểm tạo lệnh chi' })
  createdAt: string;
}

export class PayoutBalanceResponseDto {
  @ApiProperty({ example: 15000000, description: 'Số dư khả dụng trong tài khoản chi hộ (VNĐ)' })
  balance: number;

  @ApiProperty({ example: 'VND', description: 'Đơn vị tiền tệ' })
  currency: string;
}