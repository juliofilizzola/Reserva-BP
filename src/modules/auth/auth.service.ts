import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { validDocument } from '../../utils/validation/valid-document';
import { formatDocument } from '../../utils/format/format-document';
import { TypeRole, User } from '@prisma/client';
import { UserToken } from '../../model/UserToken.model';
import { UserAuthenticationPayloadModel } from '../../model/UserAuthenticationPayload.model';
import { JwtService } from '@nestjs/jwt';
import { UpdatePasswordDto } from './dto/update-passwword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createAuthDto: CreateAuthDto, typeUser: TypeRole) {
    const validDoc = validDocument(createAuthDto.document);

    if (!validDoc) {
      throw new BadRequestException({
        message: 'document is invalid',
      });
    }

    return this.prismaService.user.create({
      data: {
        email: createAuthDto.email,
        type: typeUser,
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
      if (!isPasswordValid) {
        throw new UnauthorizedException({
          message: 'Email address or password provided is incorrect.',
        });
      }
      return user;
    }

    throw new UnauthorizedException({
      message: 'Email address or password provided is incorrect.',
    });
  }

  async updatedPassword(id: string, data: UpdatePasswordDto) {
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

    const validOldPassWord = await this.validateUser(
      user.email,
      data.oldPassword,
    );

    if (!validOldPassWord) {
      throw new BadRequestException({
        message: 'password invalid!',
      });
    }

    const hashSyncPassword = bcrypt.hashSync(data.newPassword, 10);

    await this.prismaService.auth.update({
      where: {
        userId: id,
      },
      data: {
        password: hashSyncPassword,
      },
    });

    return {
      result: 'register new password success!',
    };
  }
}
