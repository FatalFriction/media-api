import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUsersDto } from '../users/Dto/CreateUsers.dto';
import { UpdateUsersDto } from '../users/Dto/UpdateUsers.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import * as bcrypt from 'bcrypt';
import { PaginationResult } from 'src/common/types/paginationResultType';
import { User } from '@prisma/client';

type SafeUser = Pick<User, 'id' | 'name' | 'email' | 'role' | 'createdAt'>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<PaginationResult<SafeUser>> {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async create(dto: CreateUsersDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }

  async update(id: number, dto: UpdateUsersDto) {
    const data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }

  async remove(id: number) {
    await this.prisma.user.delete({ where: { id } });
    return { message: `User with ID ${id} deleted` };
  }
}
