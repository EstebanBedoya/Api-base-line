// @packages
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';

// @scripts
import { UserService } from './users.service';

// @types
import { ResponseDto } from '../../common/dtos/response.dto';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1.0',
})
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({
    summary: 'List all users',
    description: 'List all of the authenticated user',
  })
  @ApiNotFoundResponse({
    description: 'Users not found',
  })
  @ApiOkResponse({
    description: 'Users listed correctly',
    type: ResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get()
  async findAll(@Query() q: string) {
    const users = await this.usersService.findAll(q);

    return {
      data: users,
      message: 'Users listed successfully',
    } as ResponseDto;
  }
}
