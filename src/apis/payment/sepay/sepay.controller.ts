import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Logger,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { SepayCompaniesService, SepayService } from './sepay.service';
import { CreateCompanyDto, ListCompanyDto, UpdateCompanyDto } from './dtos/sepay-request.dto';

@Controller('sepay')
export class SepayController {
    private readonly logger = new Logger(SepayController.name);

    constructor(
        private readonly sepayService: SepayService,
        private readonly sepayCompaniesService: SepayCompaniesService
    ) { }

    /**
     * POST /v1/company/create
     */
    @Post('/companies')
    createCompany(@Body() dto: CreateCompanyDto) {
        return this.sepayCompaniesService.createCompany(dto);
    }

    /**
     * GET /v1/company
     */
    @Get('/companies')
    getCompanies(@Query() query: ListCompanyDto) {
        return this.sepayCompaniesService.getCompanies(query);
    }

    /**
     * GET /v1/company/:xid
     */
    @Get('/companies/:xid')
    getCompany(@Param('xid') xid: string) {
        return this.sepayCompaniesService.getCompany(xid);
    }

    /**
     * POST /v1/company/edit/:xid
     */
    @Put('/companies/:xid')
    updateCompany(
        @Param('xid') xid: string,
        @Body() dto: UpdateCompanyDto,
    ) {
        return this.sepayCompaniesService.updateCompany(xid, dto);
    }

}