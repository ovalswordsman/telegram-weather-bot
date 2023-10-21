import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { TelegramModule } from './telegram/telegram.module';
import { WeatherModule } from './weather/weather.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://kush:ulGWiJm6uTPKfOgO@cluster0.lev8mrc.mongodb.net/?retryWrites=true&w=majority'), // Configure your MongoDB connection
    TelegramModule,
    WeatherModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
