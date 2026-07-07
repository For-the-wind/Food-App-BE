import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import ResponseObject from '../etc/response-object';

@Injectable()
export class AppValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        new ResponseObject(
          HttpStatus.BAD_REQUEST,
          'Validation failed',
          null,
          this.formatErrors(errors),
        ),
        HttpStatus.OK,
      );
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]): any {
    return errors.map((e) => ({
      at: e.property,
      message: e.constraints ? Object.values(e.constraints).join(', ') : null,
      chidren: e.children ? this.formatErrors(e.children) : null,
    }));
  }
}
