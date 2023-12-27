import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { catchError, Observable } from 'rxjs';
import { DatabaseError } from './errors/prisma-erros/base/DatabaseError';
import { handleDatabaseErrors } from './handle-database-errors';
import { IsPrismaError } from './errors/prisma-erros/isPrismaError';

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (IsPrismaError(error)) {
          error = handleDatabaseErrors(error);
        }
        if (error instanceof DatabaseError) {
          throw new BadRequestException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
