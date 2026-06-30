
import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import type { User } from './users.model';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from '../../etc/http-exception.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  async create(@Body() createCatDto: User) {
    this.userService.create(createCatDto);
  }

    @Get()
    @UseFilters(HttpExceptionFilter)
    async findAll(): Promise<User[]> {
      return this.userService.findAll();
    }
}
