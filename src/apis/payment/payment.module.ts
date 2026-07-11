import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AlepayController } from './alepay.controller';
import { AlepayService } from './alepay.service';
import { SepayController } from './sepay/sepay.controller';
import { SepayCompaniesService, SepayService } from './sepay/sepay.service';

@Module({
  imports: [HttpModule],
  controllers: [AlepayController, SepayController],
  providers: [AlepayService, SepayService, SepayCompaniesService],
  exports: [AlepayService],
})
export class PaymentModule {}