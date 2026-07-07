import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';

import { AlepayService } from './alepay.service';
import { CreateCardLinkDto } from './dtos/alepay-request.dto';
import CurrentAccount from '../../decorators/current-account.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

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

    @Get('cards')
    getCards(
        @CurrentAccount() user: User,
    ) {
        return this.alepayService.getLinkedCards(
            user.id,
        );
    }

    @Post('one-click-payment')
    oneClick(
        @CurrentAccount() user: User,
        @Body() dto,
    ) {
        return this.alepayService.oneClickPayment(
            user,
        );
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
}