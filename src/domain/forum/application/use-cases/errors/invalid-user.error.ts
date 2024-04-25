import { UseCaseError } from '@/core/errors/use-case-error';

export class InvalidUserError extends Error implements UseCaseError {
  constructor() {
    super('Invalid or User not found');
  }
}
