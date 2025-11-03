// users.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() data: { email: string; password: string; name: string; role?: string }) {
    return this.usersService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<{ email: string; password: string; name: string; role: string }>) {
    return this.usersService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}