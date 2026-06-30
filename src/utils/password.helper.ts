import * as bcrypt from 'bcrypt';
import RodeConfig from '../etc/app.config';

export class PasswordHelper {
  static async hashPassword(password: string) {
    return await bcrypt.hash(password, RodeConfig.SALT_ROUND);
  }

  static async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
