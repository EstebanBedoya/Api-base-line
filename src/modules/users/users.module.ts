// @packages
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// @scripts
import { UserRepository } from './repository/user.repository';
import { UsersController } from './users.controller';
import { UserService } from './users.service';

// @types
import { UserSchema, User } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [MongooseModule, UserRepository, UserService],
  providers: [UserService, UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
