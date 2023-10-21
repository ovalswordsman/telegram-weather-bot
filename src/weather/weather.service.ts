import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private apiKey = process.env.WEATHER_API_KEY;
  private apiUrl = `https://api.openweathermap.org/data/2.5/weather`;

  async getWeather(city: string): Promise<any> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching weather data: ${error.message}`);
    }
  }
}
