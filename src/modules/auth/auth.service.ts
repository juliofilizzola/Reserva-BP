import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { validDocument } from '../../utils/validation/valid-document';
import { formatDocument } from '../../utils/format/format-document';
import { TypeRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createAuthDto: CreateAuthDto) {
    const validDoc = validDocument(createAuthDto.document);

    if (!validDoc) {
      throw new BadRequestException({
        message: 'document is invalid',
      });
    }

    return this.prismaService.user.create({
      data: {
        email: createAuthDto.email,
        type: TypeRole.client,
        document: formatDocument(createAuthDto.document),
        phone: createAuthDto.phone,
        name: createAuthDto.name,
        auth: {
          create: {
            password: bcrypt.hashSync(createAuthDto.password, 10),
          },
        },
      },
    });
  }

  findAll() {
    return 'This action returns all auth';
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
