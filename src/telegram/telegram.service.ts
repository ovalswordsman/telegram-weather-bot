import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { WeatherService } from '../weather/weather.service';

import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TelegramService {
  private logger = new Logger(TelegramService.name);
  private readonly bot: TelegramBot;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly weatherService: WeatherService,
    private readonly userService: UserService,
  ) {
    this.bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, {
      polling: true,
    });

    this.bot.on('message', (msg) => {
      if (msg.text !== '/start') {
        this.onMsg(msg);
      }
    });

    // Show a welcome message to new users
    this.bot.onText(/\/start/, (msg) => {
      this.sendWelcomeMessage(msg);
    });
  }
  onMsg = async (msg: any) => {
    this.logger.debug(msg);
    const messageText = msg.text;
    if (messageText === 'subscribe') {
      // Handle the subscribe button click
      this.handleSubscribe(msg);
    } else if (messageText === '/unsubscribe') {
      // Handle the unsubscribe button click
      this.handleUnsubscribe(msg);
    } else {
      // Check if the message is a valid city name
      // if (this.isValidCityName(messageText)) {r
      //   // Handle regular weather queries
      //   this.handleWeatherQuery(chatId, messageText);
      // } else {
      //   // Handle other user messages
      //   this.bot.sendMessage(chatId, 'Please provide a valid city name or use /subscribe to subscribe.');
      // }
      this.handleWeatherQuery(msg);
    }
  };

  private async handleWeatherQuery(msg: any) {
    const city = msg.text;
    if (city) {
      try {
        const weatherData = await this.weatherService.getWeather(city);
        if (weatherData.main && weatherData.weather) {
          const temperature = (weatherData.main.temp - 273.15).toFixed(2); // Convert to Celsius
          const humidity = weatherData.main.humidity;
          const weatherDescription = weatherData.weather[0].description;

          const response = `Weather in ${city}:\nTemperature: ${temperature}°C\nDescription: ${weatherDescription}\nHumidity: ${humidity}`;
          this.bot.sendMessage(msg.chat.id, response);
        } else {
          this.bot.sendMessage(msg.chat.id, 'Weather data not available.');
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        this.bot.sendMessage(
          msg.chat.id,
          'Error fetching weather data. Please check your city name again!',
        );
      }
    } else {
      this.bot.sendMessage(msg.chat.id, 'Please provide a valid city name.');
    }
  }

  private sendWelcomeMessage(msg: any) {
    const keyboard = [[{ text: 'subscribe' }]];

    const chat_id = msg.chat.id;
    const first_name = msg.chat.first_name;
    const last_name = msg.chat.last_name;
    this.bot.sendMessage(
      chat_id,
      `Hello ${first_name} ${last_name}. \n'Welcome to WeatherBot! To receive daily weather updates, click the "Subscribe" button below.`,
      {
        reply_markup: {
          keyboard,
          one_time_keyboard: true,
        },
      },
    );
  }

  private async handleSubscribe(msg: any) {
    const chatId = msg.chat.id;

    // Check if the user is already subscribed
    const user = await this.userService.findOne(chatId);

    if (user) {
      if (user.isSubscribed) {
        // User is already subscribed
        this.bot.sendMessage(
          chatId,
          'You are already subscribed to daily weather updates.',
        );
      } else {
        // User unsubscribed previously; update subscription status
        user.isSubscribed = true;
        await user.save(); // Save the updated user document

        // Send a welcome message
        this.sendWelcomeMessage(msg);
      }
    } else {
      // User is not found in the database; create a new user and subscribe
      const { first_name, last_name } = msg.chat;
      const newUser = new this.userModel({
        chatId: chatId,
        first_name: first_name,
        last_name: last_name,
        isSubscribed: true,
      });

      await newUser.save(); // Save the new user document
      this.bot.sendMessage(
        chatId,
        'You have successfully subscribed. \nYou can enter any city name to get weather updates!',
      );
    }
  }

  private async handleUnsubscribe(msg: any) {
    const chatId = msg.chat.id;

    // Check if the user is subscribed
    const user = await this.userService.findOne(chatId);

    if (user && user.isSubscribed) {
      // User is subscribed; unsubscribe them
      user.isSubscribed = false;
      await user.save(); // Save the updated user document

      this.bot.sendMessage(
        chatId,
        'You have unsubscribed from daily weather updates.',
      );
    } else {
      // User is not subscribed or is already unsubscribed
      this.bot.sendMessage(
        chatId,
        'You are not subscribed to daily weather updates.',
      );
    }
  }
}
