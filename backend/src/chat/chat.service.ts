import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  /**
   * Persist a chat message
   */
  async saveMessage(
    senderId: string,
    content: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      senderId,
      content,
    });

    return this.messageRepository.save(message);
  }

  /**
   * (Future) Fetch recent messages
   */
  async getRecentMessages(limit = 50): Promise<Message[]> {
    return this.messageRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}