// @packages
import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(errors: string[]) {
    super(errors.join(', '));
  }
}
