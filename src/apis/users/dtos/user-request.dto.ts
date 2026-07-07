import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { RoleEnum } from '../../../etc/enum';

export class CreateAccountDto {

  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsEmail()
  role: RoleEnum;

  @ApiProperty()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dob: Date;
}
