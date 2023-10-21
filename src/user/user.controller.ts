import { Controller, Post, Param, Get, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('subscribe/:chatId')
  async subscribeUser(@Param('chatId') chatId: number) {
    return this.userService.subscribeUser(chatId);
  }

  @Post('unsubscribe/:chatId')
  async unsubscribeUser(@Param('chatId') chatId: number) {
    return this.userService.unsubscribeUser(chatId);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    // Error handling: If the user does not exist, throw a NotFoundException.
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    } else {
      return user;
    }
  }
}
