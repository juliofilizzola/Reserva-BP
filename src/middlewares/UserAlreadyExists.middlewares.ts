import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class UserAlreadyExistsMiddlewares implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    const userAlreadyExist = await this.userService.alreadyUserByEmail(
      body.email,
    );

    if (userAlreadyExist) {
      throw new BadRequestException({
        message: 'user already exist',
      });
    }

    next();
  }
}
