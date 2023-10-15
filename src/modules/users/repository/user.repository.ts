// @packages
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

// @types
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(query: { q: string }): Promise<User[]> {
    let filters: mongoose.FilterQuery<UserDocument> = {
      $or: [
        { firstName: new RegExp(query.q, 'i') },
        { email: new RegExp(query.q, 'i') },
      ],
    };

    if (!query.q) {
      filters = {};
    }

    return this.userModel.find(filters).sort({ createdAt: -1 });
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email: email }).exec();
  }

  async updateOne(userId: string, data: any) {
    this.userModel.updateOne({ _id: userId }, { $set: data }).exec();
  }

  async findById(userId: string) {
    return this.userModel.findOne({ id: userId }).exec();
  }

  async delete(id: string) {
    return this.userModel.deleteMany({ _id: id });
  }
}
