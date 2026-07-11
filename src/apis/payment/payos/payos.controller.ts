import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PayosService } from './payos.service';
import { CreatePaymentLinkDto } from './dtos/create-payment-link.dto';
import { CreatePayoutDto, PayoutQueryDto } from './dtos/create-payout.dto';
import {
  PaymentLinkResponseDto,
  PaymentWebhookDto,
  PayoutBalanceResponseDto,
  PayoutResponseDto,
} from './dtos/payos-response.dto';

@ApiTags('PayOS')
@Controller('payos')
export class PayosController {
  constructor(private readonly payosService: PayosService) {}

  // ==========================================================
  // LỆNH THU (Payment Request)
  // ==========================================================

  @Post('payment-requests')
  @ApiOperation({ summary: 'Tạo lệnh thu (payment link) qua PayOS' })
  @ApiResponse({ status: 201, type: PaymentLinkResponseDto })
  createPaymentLink(@Body() dto: CreatePaymentLinkDto): Promise<PaymentLinkResponseDto> {
    return this.payosService.createPaymentLink(dto);
  }

  @Get('payment-requests/:id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một lệnh thu' })
  @ApiResponse({ status: 200, type: PaymentLinkResponseDto })
  getPaymentLinkInfo(@Param('id') id: string): Promise<PaymentLinkResponseDto> {
    return this.payosService.getPaymentLinkInfo(id);
  }

  @Post('payment-requests/:id/cancel')
  @ApiOperation({ summary: 'Hủy một lệnh thu đang PENDING' })
  @ApiResponse({ status: 200, type: PaymentLinkResponseDto })
  cancelPaymentLink(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ): Promise<PaymentLinkResponseDto> {
    return this.payosService.cancelPaymentLink(id, reason);
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Endpoint nhận webhook từ PayOS khi trạng thái lệnh thu thay đổi',
  })
  async handleWebhook(@Body() payload: PaymentWebhookDto) {
    const isValid = this.payosService.verifyWebhookSignature(payload);

    if (!isValid) {
      // Không throw lỗi để tránh PayOS retry vô hạn với payload giả mạo,
      // chỉ log và bỏ qua xử lý nghiệp vụ.
      return { code: '00', desc: 'ignored - invalid signature' };
    }

    // TODO: cập nhật trạng thái đơn hàng trong DB dựa trên payload.data.orderCode
    return { code: '00', desc: 'success' };
  }

  // ==========================================================
  // LỆNH CHI (Payout)
  // ==========================================================

  @Post('payouts')
  @ApiOperation({ summary: 'Tạo lệnh chi (payout) qua PayOS' })
  @ApiResponse({ status: 201, type: PayoutResponseDto })
  createPayout(
    @Body() dto: CreatePayoutDto,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ): Promise<PayoutResponseDto> {
    return this.payosService.createPayout(dto, idempotencyKey);
  }

  @Get('payouts/:id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một lệnh chi' })
  @ApiResponse({ status: 200, type: PayoutResponseDto })
  getPayoutInfo(@Param('id') id: string): Promise<PayoutResponseDto> {
    return this.payosService.getPayoutInfo(id);
  }

  @Get('payouts')
  @ApiOperation({ summary: 'Lấy danh sách lệnh chi, có thể lọc theo trạng thái' })
  @ApiResponse({ status: 200, type: [PayoutResponseDto] })
  listPayouts(@Query() query: PayoutQueryDto): Promise<PayoutResponseDto[]> {
    return this.payosService.listPayouts(query);
  }

  @Get('payouts-account/balance')
  @ApiOperation({ summary: 'Kiểm tra số dư khả dụng của tài khoản chi hộ' })
  @ApiResponse({ status: 200, type: PayoutBalanceResponseDto })
  getPayoutBalance(): Promise<PayoutBalanceResponseDto> {
    return this.payosService.getPayoutBalance();
  }
}