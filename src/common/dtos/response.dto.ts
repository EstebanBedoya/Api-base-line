// @package
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Expose()
export class ResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly message: string;

  @ApiProperty()
  readonly data: unknown[];
}
