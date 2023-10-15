// @packages
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';

// @scripts
import { AccessJwtStrategy } from './strategies';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './../users/users.module';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    UsersModule,
  ],
  providers: [AuthService, AccessJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
