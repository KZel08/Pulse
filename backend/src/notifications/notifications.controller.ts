import { Controller, Post, Body, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
  ) {}

  @Post('subscribe')
  async subscribe(@Body() body, @Req() req) {
    return this.subscriptionRepo.save({
      userId: req.user.id,
      subscription: body,
    });
  }
}
