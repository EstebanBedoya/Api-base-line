// @packages
import * as bcrypt from 'bcrypt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// @scripts
import { UserService } from '../users/users.service';

// @types
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Tokens } from '../../types';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.userService.findUserByEmail(dto.email);

    if (!user) throw new ForbiddenException('Access Denied.');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) throw new ForbiddenException('Access Denied.');

    const payload = { email: user.email, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(dto: CreateUserDto): Promise<Tokens> {
    const user: User = await this.userService.create(dto);

    const payload = { username: user.email, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getProfile(id: string) {
    const user = await this.userService.findById(id);

    user.password = null;

    return user;
  }

  async hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }
}
