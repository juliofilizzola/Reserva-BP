import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as passport from 'passport';

@Injectable()
export class AuthApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const token = req.headers['apikey'];
    if (!token) {
      throw new UnauthorizedException('missing authorization');
    }
    passport.authenticate(
      'headerapikey',
      { session: true, failureRedirect: '/api/unauthorized' },
      (value: boolean) => {
        console.log(value, 'value');
        if (value) {
          next();
        } else {
          throw new UnauthorizedException({
            message: 'user not authorized',
          });
        }
      },
    )(req, res, next);
  }
}
