
import { Injectable } from '@nestjs/common';
import { User } from './users.model';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(users: User) {
    this.users.push(users);
  }

  findAll(): User[] {
    return this.users;
  }
}
