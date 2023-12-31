import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class LocalAuthGuard extends AuthGuard('local') {
  canActive(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException({
        message: `error: ${err?.message}`,
      });
    }

    return user;
  }
}
