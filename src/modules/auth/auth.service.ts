import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { validDocument } from '../../utils/validation/valid-document';
import { formatDocument } from '../../utils/format/format-document';
import { TypeRole, User } from '@prisma/client';
import { UserToken } from '../../model/UserToken.model';
import { UserAuthenticationPayloadModel } from '../../model/UserAuthenticationPayload.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
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

  async login(user: User): Promise<UserToken> {
    const payload: UserAuthenticationPayloadModel = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: `${process.env.JWT_SECRET}`,
      }),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
      include: {
        auth: true,
      },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.auth.password,
      );
      delete user.auth;
      if (isPasswordValid) {
        return user;
      }
    }

    throw new UnauthorizedException({
      message: 'Email address or password provided is incorrect.',
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
