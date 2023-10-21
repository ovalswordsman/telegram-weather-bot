import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { WeatherService } from '../weather/weather.service';
import { UserService } from '../user/user.service';
import { UserModel } from '../user/user.model';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UserModule, MongooseModule.forFeature([{ name: 'User', schema: UserModel.schema }])],
  providers: [TelegramService, WeatherService, UserService],
})
export class TelegramModule {}
