import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BankHubWebhookDto {
  @IsOptional()
  @IsString()
  gateway?: string;

  @IsOptional()
  @IsString()
  transactionDate?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  transferType?: number;

  @IsOptional()
  @IsNumber()
  transferAmount?: number;

  @IsOptional()
  @IsNumber()
  accumulated?: number;

  @IsOptional()
  @IsString()
  subAccount?: string;

  @IsOptional()
  @IsString()
  referenceCode?: string;

  @IsOptional()
  @IsString()
  description?: string;
}