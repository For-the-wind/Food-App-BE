import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import AppConfig from '../../../etc/app.config';
import {
  CreateCompanyDto,
  ListCompanyDto,
  UpdateCompanyDto,
} from './dtos/sepay-request.dto';

@Injectable()
export class SepayCompaniesService {
  constructor(private readonly http: HttpService) { }

  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${AppConfig.BANKHUB_CLIENT_ID}:${AppConfig.BANKHUB_CLIENT_SECRET}`,
    ).toString('base64');

    const response = await fetch(
      `${AppConfig.BANKHUB_BASE_URL}/v1/token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();

    return data.access_token;
  }

  async createCompany(dto: CreateCompanyDto) {
    return this.post('/company/create', dto);
  }

  async getCompanies(query: ListCompanyDto) {
    return this.get('/company', query);
  }

  async getCompany(xid: string) {
    return this.get(`/company/${xid}`);
  }

  async updateCompany(
    xid: string,
    dto: UpdateCompanyDto,
  ) {
    return this.post(`/company/edit/${xid}`, dto);
  }

  private async get(url: string, params?: any) {
    const accessToken = await this.getAccessToken();
    const response = await firstValueFrom(
      this.http.get(`${AppConfig.BANKHUB_BASE_URL}${url}`, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return response.data;
  }

  private async post(url: string, data?: any) {
    const accessToken = await this.getAccessToken();

    const response = await firstValueFrom(
      this.http.post(`${AppConfig.BANKHUB_BASE_URL}${url}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return response.data;
  }
}

@Injectable()
export class SepayService {
  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${AppConfig.BANKHUB_CLIENT_ID}:${AppConfig.BANKHUB_CLIENT_SECRET}`,
    ).toString('base64');

    const response = await fetch(
      `${AppConfig.BANKHUB_BASE_URL}/v1/token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();

    return data.access_token;
  }

  async createLinkToken(
    companyXid: string,
    purpose = 'LINK_BANK_ACCOUNT',
    redirectUri?: string,
  ) {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `${AppConfig.BANKHUB_BASE_URL}/v1/link-token/create`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_xid: companyXid,
          purpose,
          completion_redirect_uri: redirectUri ?? '',
        }),
      },
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }
}