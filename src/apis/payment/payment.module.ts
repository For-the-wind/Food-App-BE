import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AlepayController } from './alepay/alepay.controller';
import { AlepayService } from './alepay/alepay.service';
import { SepayController } from './sepay/sepay.controller';
import { SepayCompaniesService, SepayService } from './sepay/sepay.service';
import { PayosController } from './payos/payos.controller';
import { PayosService } from './payos/payos.service';

@Module({
  imports: [HttpModule],
  controllers: [AlepayController, SepayController, PayosController],
  providers: [AlepayService, SepayService, SepayCompaniesService, PayosService],
  exports: [AlepayService],
})
export class PaymentModule { }