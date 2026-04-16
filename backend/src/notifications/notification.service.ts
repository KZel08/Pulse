import * as webPush from 'web-push';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor() {
    webPush.setVapidDetails(
      'mailto:test@pulse.app',
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );
  }

  async sendNotification(subscription: any, payload: any) {
    return webPush.sendNotification(subscription, JSON.stringify(payload));
  }
}
