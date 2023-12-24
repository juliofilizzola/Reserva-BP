import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async alreadyUserByEmail(email: string): Promise<boolean> {
    const alreadyUser = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    return !!alreadyUser;
  }
}
