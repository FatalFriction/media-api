import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './Dto/CreateUsers.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../users/Entities/Users.entities';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { User } from '@prisma/client';
import { PaginationResult } from 'src/common/types/paginationResultType';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({type: UserEntity})
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<PaginationResult<Pick<User, 'id' | 'name' | 'email' | 'role' | 'createdAt'>>> {
    return this.usersService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOkResponse({type: UserEntity})
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() dto: CreateUsersDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({type: UserEntity})
  update(@Param('id') id: string, @Body() data: Partial<{ email: string; password: string; name: string; role: string }>) {
    return this.usersService.update(+id, data);
  }

  @Delete(':id')
  @ApiOkResponse({type: UserEntity})
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}