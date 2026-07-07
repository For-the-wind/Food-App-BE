import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';

import { AlepayService } from './alepay.service';
import { CreateCardLinkDto, OneClickPaymentDto } from './dtos/alepay-request.dto';
import CurrentAccount from '../../decorators/current-account.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CustomerCardInfoResponseDto } from './dtos/alepay-response.dto';

@Controller('alepay')
export class AlepayController {
    constructor(
        private readonly alepayService: AlepayService,
    ) { }

    @Post('link-card')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    createCardLink(
        @CurrentAccount() user: User,
        @Body() dto: CreateCardLinkDto,
    ) {
        return this.alepayService.createCardLink(
            user,
            dto,
        );
    }

    @ApiOkResponse({
        type: CustomerCardInfoResponseDto,
    })
    @Get('link-cards')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getLinkCards(@CurrentAccount() user: User): Promise<CustomerCardInfoResponseDto> {
        return this.alepayService.getLinkedCards(user.id);
    }

    @Post('one-click-payment')
    async oneClickPayment(@Body() dto: OneClickPaymentDto) {
        return await this.alepayService.oneClickPayment(dto);
    }

    @Post('cancel-card')
    cancel(
        @CurrentAccount() user: User,
        @Body('alepayToken') token: string,
    ) {
        return this.alepayService.cancelCardLink(
            user.id,
        );
    }

    @Get('return')
    async returnUrl(
        @Query() query,
        @Res() res,
    ) {
        const status =
            query.cancel === 'true'
                ? 'cancelled'
                : query.code === '000'
                    ? 'success'
                    : 'failed';

        return res.redirect(
            `yourapp://payment-methods?status=${status}&transactionCode=${query.transactionCode ?? ''}`,
        );
    }

    @Get('cancel')
    async cancelUrl(
        @Query() query,
        @Res() res,
    ) {
        return res.redirect(
            `yourapp://payment-methods?status=cancelled&transactionCode=${query.transactionCode ?? ''
            }`,
        );
    }
}