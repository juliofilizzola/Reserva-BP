import { ConflictError } from './base/ConflictError';
import { PrismaClientError } from './enums/PrismaClientError';

export class ForeignKeyFailed extends ConflictError {
  constructor(e: PrismaClientError) {
    const uniqueField = e.meta.target;

    super(`Error in create foreign key ${uniqueField}.`);
  }
}
