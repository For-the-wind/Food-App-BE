import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import AppConfig from '../../etc/app.config';
import * as crypto from 'node:crypto';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlepayService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) { }
  private buildAlepaySignature(
    data: Record<string, unknown>,
    checksumKey: string,
  ): string {
    const sortedKeys = Object.keys(data).sort((a, b) => a.localeCompare(b));

    const queryString = sortedKeys
      .map((key) => {
        const value = data[key];
        return `${key}=${value == null ? '' : value}`;
      })
      .join('&');

    return crypto
      .createHmac('sha256', checksumKey)
      .update(queryString, 'utf8')
      .digest('hex');
  }

  async callAlepay(path: string, body: any) {
    const response = await firstValueFrom(
      this.http.post(`${AppConfig.ALEPAY_BASE_URL}${path}`, body),
    );

    return response.data;
  }

  async createCardLink(user: User, dto: any) {
    const orderCode = `LINK_${user.id}_${Date.now()}`;

    console.log("Return url: ", AppConfig.ALEPAY_RETURN_URL)

    const payload: any = {
      tokenKey: AppConfig.ALEPAY_TOKEN_KEY,
      orderCode,
      amount: 1000,
      currency: 'VND',
      orderDescription: 'Xac thuc lien ket the',
      totalItem: 1,
      checkoutType: 1,
      returnUrl: AppConfig.ALEPAY_RETURN_URL,
      cancelUrl: AppConfig.ALEPAY_CANCEL_URL,

      buyerName: dto.fullName,
      buyerEmail: dto.email,
      buyerPhone: dto.phone,
      buyerAddress: dto.address,
      buyerCity: dto.city,
      buyerCountry: 'Viet Nam',

      paymentHours: 1,

      merchantSideUserId: user.id,

      isCardLink: true,
    };

    payload.signature = this.buildAlepaySignature(
      payload,
      AppConfig.ALEPAY_CHECKSUM_KEY,
    );

    const result = await this.callAlepay(
      '/request-payment',
      payload,
    );

    if (result.code !== '000')
      throw new InternalServerErrorException(result.message);

    return result;
  }

  async getLinkedCards(userId: string) {
    const payload: any = {
      tokenKey: AppConfig.ALEPAY_TOKEN_KEY,
      customerId: userId,
      language: 'vi',
    };

    payload.signature = this.buildAlepaySignature(
      payload,
      AppConfig.ALEPAY_CHECKSUM_KEY,
    );

    const result = await this.callAlepay(
      '/get-customer-info',
      payload,
    );

    if (result.code !== '000') {
      return [];
    }

    return (result.listCardTokens || []).map((card) => ({
      id: card.token,
      brand: card.paymentMethod,
      last4: card.cardNumber.split('-').pop(),
      expiry: `${card.cardExpireMonth.padStart(2, '0')}/${card.cardExpireYear.slice(-2)}`,
      name: card.cardHolderName,
      bankCode: card.bankCode,
    }));
  }

  async oneClickPayment(dto: any) {
    const payload: any = {
      tokenKey: AppConfig.ALEPAY_TOKEN_KEY,
      customerToken: dto.customerToken,
      orderCode: dto.orderCode,
      amount: dto.amount,
      currency: 'VND',
      orderDescription: dto.orderDescription,
      returnUrl: AppConfig.ALEPAY_RETURN_URL,
      cancelUrl: AppConfig.ALEPAY_CANCEL_URL,
      paymentHours: 1,
      language: 'vi',
    };

    payload.signature = this.buildAlepaySignature(
      payload,
      AppConfig.ALEPAY_CHECKSUM_KEY,
    );

    return await this.callAlepay(
      '/request-tokenization-payment',
      payload,
    );
  }

  async cancelCardLink(token: string) {
    const payload: any = {
      tokenKey: AppConfig.ALEPAY_TOKEN_KEY,
      alepayToken: token,
      language: 'vi',
    };

    payload.signature = this.buildAlepaySignature(
      payload,
      AppConfig.ALEPAY_CHECKSUM_KEY,
    );

    return await this.callAlepay(
      '/cancel-profile',
      payload,
    );
  }
}