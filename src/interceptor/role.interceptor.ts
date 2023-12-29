import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler<() => void>) {
    const { user } = context.switchToHttp().getRequest();

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      throw new BadRequestException({
        message: 'Route without rule',
      });
    }

    const authUser = await this.prismaService.user.findFirst({
      where: {
        id: user.sub,
      },
    });

    if (!authUser) {
      throw new UnauthorizedException({
        message: 'user not permission!',
      });
    }

    const verifyUserPermission = roles.some((v) => v === authUser.type);

    if (!verifyUserPermission) {
      throw new UnauthorizedException({
        message: 'user not permission!',
      });
    }

    return next.handle();
  }
}
