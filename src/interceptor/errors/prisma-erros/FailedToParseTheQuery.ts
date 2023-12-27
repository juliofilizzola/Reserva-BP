import { ConflictError } from './base/ConflictError';
import { PrismaClientError } from './enums/PrismaClientError';

export class FailedToParserTheQuery extends ConflictError {
  constructor(e: PrismaClientError) {
    const uniqueField = e.meta.target;

    super(`Failed to parse the query ${uniqueField}`);
  }
}
