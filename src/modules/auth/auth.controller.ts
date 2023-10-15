// @packages
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

// @scripts
import { AuthService } from './auth.service';
import { GetCurrentUserId, Public } from '../../common/decorators';

// @types
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Tokens } from '../../types';
import { User } from '../users/schemas/user.schema';
import { ValidationException } from '../../common/exceptions/validation.exception';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login with a existing user',
    description: 'You can a log into the app with a existing user',
  })
  @ApiBody({ type: AuthDto })
  @ApiOkResponse({
    description: 'Login succesful',
  })
  @ApiUnauthorizedResponse({
    description: 'Incorrect password ',
  })
  @ApiNotFoundResponse({
    description: 'No existing that user',
  })
  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(dto);
    res.cookie('access_cookies', token.access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      path: '/',
      sameSite: 'none',
      secure: true,
    });
    res.send({
      success: true,
      token,
    });
  }

  @ApiOperation({
    summary: 'Register a new user',
    description: 'You can register a new user',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({
    description: 'User registered correctly',
    type: User,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @ApiForbiddenResponse({
    description: 'could not create user',
  })
  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserDto): Promise<Tokens> {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      throw new ValidationException([error.message]);
    }
  }

  @ApiOperation({
    summary: 'Get profile',
    description: 'Get profile about current user',
  })
  @ApiOkResponse({
    description: 'Successful got profile',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get('/profile')
  async profile(@GetCurrentUserId() userId: string) {
    return await this.authService.getProfile(userId);
  }
}
