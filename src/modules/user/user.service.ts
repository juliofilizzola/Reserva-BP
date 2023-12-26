import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationParams } from '../../utils/paginations/type';
import { paginateResponse } from '../../utils/paginations/pagination';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { validDocument } from '../../utils/validation/valid-document';
import { formatDocument } from '../../utils/format/format-document';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException({
        message: 'user not found',
      });
    }

    return user;
  }

  async findAll(pagination?: PaginationParams) {
    if (pagination) {
      const { page, limit } = pagination;
      const response = await this.prismaService.$transaction([
        this.prismaService.user.count({}),
        this.prismaService.user.findMany({
          where: {},
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);

      return paginateResponse<User>({
        page,
        limit,
        total: response[0],
        result: response[1],
      });
    }

    return this.prismaService.user.findMany({});
  }

  async alreadyUserByEmail(email: string): Promise<boolean> {
    const alreadyUser = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    return !!alreadyUser;
  }

  async delete(id: string) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async update(id: string, updatedUser: UpdateUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException({
        message: 'user not found',
      });
    }

    const validDoc = validDocument(updatedUser.document);

    if (!validDoc) {
      throw new BadRequestException({
        message: 'document is invalid',
      });
    }

    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        email: updatedUser.email || user.email,
        document: formatDocument(updatedUser.document) || user.document,
        name: updatedUser.name || user.name,
        phone: updatedUser.phone || user.phone,
      },
    });
  }
}
