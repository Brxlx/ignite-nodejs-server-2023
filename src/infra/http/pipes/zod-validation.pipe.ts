import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, _: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
      // return value;
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestException({
          message: 'Error validating input fields',
          statusCode: 400,
          errors: fromZodError(err).details,
        });
      }
      throw new BadRequestException('Unhandled unknown error');
    }
  }
}
