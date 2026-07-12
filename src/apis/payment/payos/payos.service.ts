import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import * as crypto from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';

import { CreatePaymentLinkDto } from './dtos/create-payment-link.dto';
import { CreatePayoutDto, PayoutQueryDto } from './dtos/create-payout.dto';
import {
  PaymentLinkResponseDto,
  PaymentWebhookDto,
  PayoutBalanceResponseDto,
  PayoutResponseDto,
} from './dtos/payos-response.dto';
import AppConfig from '../../../etc/app.config';

@Injectable()
export class PayosService {
  private readonly logger = new Logger(PayosService.name);

  private readonly baseUrl = 'https://api-merchant.payos.vn';
  private readonly clientId: string;
  private readonly apiKey: string;
  private readonly checksumKey: string;

  constructor(
    private readonly httpService: HttpService,
  ) {
    this.clientId = AppConfig.PAYOS_CLIENT_ID;
    this.apiKey = AppConfig.PAYOS_API_KEY;
    this.checksumKey = AppConfig.PAYOS_CHECKSUM_KEY;
  }

  private get authHeaders() {
    return {
      'x-client-id': this.clientId,
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  // ==========================================================
  // LỆNH THU (Payment Request) - v2/payment-requests
  // ==========================================================

  /**
   * Tạo chữ ký cho lệnh thu: HMAC-SHA256 của chuỗi
   * "amount=...&cancelUrl=...&description=...&orderCode=...&returnUrl=..."
   * (các field bắt buộc được sắp xếp theo alphabet)
   */
  private signPaymentLink(dto: CreatePaymentLinkDto): string {
    const raw = `amount=${dto.amount}&cancelUrl=${dto.cancelUrl}&description=${dto.description}&orderCode=${dto.orderCode}&returnUrl=${dto.returnUrl}`;
    return crypto.createHmac('sha256', this.checksumKey).update(raw).digest('hex');
  }

  async createPaymentLink(dto: CreatePaymentLinkDto): Promise<PaymentLinkResponseDto> {
    const signature = this.signPaymentLink(dto);

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v2/payment-requests`,
          { ...dto, signature },
          { headers: this.authHeaders },
        ),
      );

      if (data.code !== '00') {
        throw new BadRequestException(data.desc ?? 'Tạo link thanh toán thất bại');
      }

      return data.data as PaymentLinkResponseDto;
    } catch (error) {
      this.handleAxiosError(error, 'createPaymentLink');
    }
  }

  async getPaymentLinkInfo(paymentLinkId: string): Promise<PaymentLinkResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/v2/payment-requests/${paymentLinkId}`, {
          headers: this.authHeaders,
        }),
      );
      return data.data as PaymentLinkResponseDto;
    } catch (error) {
      this.handleAxiosError(error, 'getPaymentLinkInfo');
    }
  }

  async cancelPaymentLink(paymentLinkId: string, reason?: string): Promise<PaymentLinkResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v2/payment-requests/${paymentLinkId}/cancel`,
          { cancellationReason: reason ?? 'Hủy bởi người dùng' },
          { headers: this.authHeaders },
        ),
      );
      return data.data as PaymentLinkResponseDto;
    } catch (error) {
      this.handleAxiosError(error, 'cancelPaymentLink');
    }
  }

  /**
   * Verify chữ ký webhook gửi về từ PayOS trước khi xử lý đơn hàng.
   * PayOS ký trên object `data` đã được sắp xếp key theo alphabet, dạng query-string.
   */
  verifyWebhookSignature(payload: PaymentWebhookDto): boolean {
    const sortedData = Object.keys(payload.data)
      .sort()
      .map((key) => `${key}=${payload.data[key]}`)
      .join('&');

    const expectedSignature = crypto
      .createHmac('sha256', this.checksumKey)
      .update(sortedData)
      .digest('hex');

    return expectedSignature === payload.signature;
  }

  // ==========================================================
  // LỆNH CHI (Payout) - v1/payouts
  // ==========================================================

  /**
   * Chữ ký cho lệnh chi: HMAC-SHA256 của body JSON (đã stringify, key sort theo alphabet)
   */
  private signPayout(dto: CreatePayoutDto): string {
    const sortedBody = Object.keys(dto)
      .sort()
      .reduce((acc, key) => {
        acc[key] = dto[key];
        return acc;
      }, {} as Record<string, unknown>);

    const raw = JSON.stringify(sortedBody);
    return crypto.createHmac('sha256', this.checksumKey).update(raw).digest('hex');
  }

  async createPayout(dto: CreatePayoutDto, idempotencyKey?: string): Promise<PayoutResponseDto> {
    const signature = this.signPayout(dto);

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/v1/payouts`, dto, {
          headers: {
            ...this.authHeaders,
            'x-signature': signature,
            'x-idempotency-key': idempotencyKey ?? uuidv4(),
          },
        }),
      );

      if (data.code !== '00') {
        throw new BadRequestException(data.desc ?? 'Tạo lệnh chi thất bại');
      }

      return data.data as PayoutResponseDto;
    } catch (error) {
      this.handleAxiosError(error, 'createPayout');
    }
  }

  async getPayoutInfo(payoutId: string): Promise<PayoutResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/v1/payouts/${payoutId}`, {
          headers: this.authHeaders,
        }),
      );
      return data.data as PayoutResponseDto;
    } catch (error) {
      this.handleAxiosError(error, 'getPayoutInfo');
    }
  }

  async listPayouts(query: PayoutQueryDto): Promise<PayoutResponseDto[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/v1/payouts`, {
          headers: this.authHeaders,
          params: query,
        }),
      );
      return data.data as PayoutResponseDto[];
    } catch (error) {
      this.handleAxiosError(error, 'listPayouts');
    }
  }

  async getPayoutBalance(): Promise<PayoutBalanceResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/v1/payouts-account/balance`, {
          headers: this.authHeaders,
        }),
      );
      return data.data as PayoutBalanceResponseDto;
    } catch (error) {
      this.handleAxiosError(error, 'getPayoutBalance');
    }
  }

  // ==========================================================
  private handleAxiosError(error: unknown, context: string): never {
    if (error instanceof BadRequestException) {
      throw error;
    }

    const axiosError = error as AxiosError;
    this.logger.error(
      `[${context}] PayOS API error: ${JSON.stringify(axiosError.response?.data ?? axiosError.message)}`,
    );

    throw new InternalServerErrorException(
      `Lỗi khi gọi PayOS API (${context}). Vui lòng thử lại sau.`,
    );
  }
}