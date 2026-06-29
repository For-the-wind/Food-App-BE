
import { Body, Controller, Get, Post } from '@nestjs/common';
import type { User } from './users.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  async create(@Body() createCatDto: User) {
    this.userService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
