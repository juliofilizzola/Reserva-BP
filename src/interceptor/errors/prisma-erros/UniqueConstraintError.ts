import { ConflictError } from './base/ConflictError';
import { PrismaClientError } from './enums/PrismaClientError';

export class UniqueConstraintError extends ConflictError {
  constructor(e: PrismaClientError) {
    const uniqueField = e.meta.target;

    super(`A record with this ${uniqueField} already exists.`);
  }
}
