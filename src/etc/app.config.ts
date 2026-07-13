import * as dotenv from 'dotenv';

dotenv.config();
export default class AppConfig {
  static readonly PORT = Number.parseInt(process.env.PORT || '3000');

  // DATABASE
  static readonly DB_HOST = process.env.DB_HOST || 'localhost';
  static readonly DB_PORT = Number.parseInt(process.env.DB_PORT || '5432');
  static readonly DB_USERNAME = process.env.DB_USERNAME || 'postgres';
  static readonly DB_PASSWORD = process.env.DB_PASSWORD || '12345';
  static readonly DB_DATABASE = process.env.DB_DATABASE || 'food-app-db';

  static readonly ADMIN_EMAIL =
    process.env.ADMIN_EMAIL || 'admin@gmail.com';
  static readonly ADMIN_DEFAULT_PASSWORD =
    process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';

  static readonly JWT_SECRET = process.env.JWT_SECRET || '12345';
  static readonly JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || '123456789';
  static readonly JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d') as any;
  static readonly JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '10d') as any;

  static readonly SALT_ROUND = Number.parseInt(process.env.SALT_ROUND) || 3;

  // PAYMENT
  static readonly ALEPAY_TOKEN_KEY = process.env.ALEPAY_TOKEN_KEY || '';
  static readonly ALEPAY_CHECKSUM_KEY = process.env.ALEPAY_CHECKSUM_KEY || '';
  static readonly ALEPAY_BASE_URL = process.env.ALEPAY_BASE_URL || '';
  static readonly ALEPAY_RETURN_URL = process.env.ALEPAY_RETURN_URL || '';
  static readonly ALEPAY_CANCEL_URL = process.env.ALEPAY_CANCEL_URL || '';

  static readonly BANKHUB_CLIENT_ID = process.env.BANKHUB_CLIENT_ID || '';
  static readonly BANKHUB_CLIENT_SECRET = process.env.BANKHUB_CLIENT_SECRET || '';
  static readonly BANKHUB_BASE_URL = process.env.BANKHUB_BASE_URL || 'https://bankhub-api-sandbox.sepay.vn';

  static readonly PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID || '';
  static readonly PAYOS_API_KEY = process.env.PAYOS_API_KEY || '';
  static readonly PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY || '';

  static readonly PAYOS_PAYOUT_CLIENT_ID = process.env.PAYOS_PAYOUT_CLIENT_ID || '';
  static readonly PAYOS_PAYOUT_API_KEY = process.env.PAYOS_PAYOUT_API_KEY || '';
  static readonly PAYOS_PAYOUT_CHECKSUM_KEY = process.env.PAYOS_PAYOUT_CHECKSUM_KEY || '';
}
