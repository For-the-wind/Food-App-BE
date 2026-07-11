import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum CompanyStatus {
    ACTIVE = 'Active',
    PENDING = 'Pending',
}

export class CreateCompanyDto {
    @IsString()
    full_name: string;

    @IsEnum(CompanyStatus)
    status: CompanyStatus;
}

export class UpdateCompanyDto {
    @IsOptional()
    @IsString()
    full_name?: string;

    @IsOptional()
    @IsEnum(CompanyStatus)
    status?: CompanyStatus;
}

export class ListCompanyDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    per_page?: number = 20;

    @IsOptional()
    @IsString()
    q?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsEnum(['asc', 'desc'])
    'sort[created_at]'?: 'asc' | 'desc' = 'desc';
}