// user.service.ts
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async subscribeUser(chatId: number) {
    return await this.userModel.updateOne({ chatId }, { isSubscribed: true });
  }

  async unsubscribeUser(chatId: number) {
    return await this.userModel.updateOne({ chatId }, { isSubscribed: false });
  }

  async findOne(id: number): Promise<User> {
    return this.userModel.findOne({ chatId: id }).exec();
  }

  async save(user: User): Promise<User> {
    return await this.userModel.create(user);
  }
}
