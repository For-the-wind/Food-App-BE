import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AlepayController } from './alepay.controller';
import { AlepayService } from './alepay.service';

@Module({
  imports: [HttpModule],
  controllers: [AlepayController],
  providers: [AlepayService],
  exports: [AlepayService],
})
export class PaymentModule {}