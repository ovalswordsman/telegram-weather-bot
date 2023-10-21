import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './user.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserModel.schema }])],
  controllers: [UserController],
  providers: [UserService, UserModel],
  exports : [UserService]
})
export class UserModule {}