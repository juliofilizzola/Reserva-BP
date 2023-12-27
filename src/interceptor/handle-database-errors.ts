import { PrismaErrors } from './errors/prisma-erros/enums/PrismaErros.dto';
import { PrismaClientError } from './errors/prisma-erros/enums/PrismaClientError';
import { DatabaseError } from './errors/prisma-erros/base/DatabaseError';
import { UniqueConstraintError } from './errors/prisma-erros/UniqueConstraintError';
import { FailedToParserTheQuery } from './errors/prisma-erros/FailedToParseTheQuery';
import { ForeignKeyFailed } from './errors/prisma-erros/ForeignKeyFailed';

export const handleDatabaseErrors = (error: PrismaClientError) => {
  switch (error.code) {
    case PrismaErrors.UniqueConstraintFail:
      return new UniqueConstraintError(error);
    case PrismaErrors.ConstraintFailedDatabase:
      return new FailedToParserTheQuery(error);
    case PrismaErrors.ForeingKeyFailed:
      return new ForeignKeyFailed(error);
    default:
      return new DatabaseError(error.message);
  }
};
