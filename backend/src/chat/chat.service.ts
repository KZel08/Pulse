import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly convoRepo: Repository<Conversation>,
  ) {}

  async getOrCreateConversation(userA: string, userB: string) {
    let convo = await this.convoRepo.findOne({
      where: [
        { userAId: userA, userBId: userB },
        { userAId: userB, userBId: userA },
      ],
    });

    if (!convo) {
      convo = this.convoRepo.create({
        userAId: userA,
        userBId: userB,
      });
      convo = await this.convoRepo.save(convo);
    }

    return convo;
  }

  /**
   * Persist a chat message
   */
  async saveMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ) {
    const message = this.messageRepo.create({
      conversationId,
      senderId,
      content,
    });
    return this.messageRepo.save(message);
  }

  async getConversationMessages(conversationId: string, limit = 50) {
    return this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }
  async getUserConversations(userId: string) {
    const conversations = await this.convoRepo.find({
      where: [
        { userAId: userId },
        { userBId: userId },
      ],
      order: { createdAt: 'DESC' },
    });

    const results: { conversationId: string; otherUserId: string; lastMessage: { content: string; createdAt: Date; senderId: string; } | null; }[] = [];

    for(const convo of conversations){
      const lastMessage = await this.messageRepo.findOne({
        where: { conversationId: convo.id },
        order: { createdAt: 'DESC' },
      });

      const otherUserId = convo.userAId === userId ? convo.userBId : convo.userAId;

      results.push({
        conversationId: convo.id,
        otherUserId,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId,
        }
        : null,
      });
    }
    return results;
  }

  async getMessagesForConversation(
    conversationId: string,
    userId: string,
    limit = 100,
  ) {
    const convo = await this.convoRepo.findOne({
      where: { id: conversationId },
    });
    if(!convo) {
      return null;
    }

    //Access control: user must be a participant
    if(convo.userAId ! == userId && convo.userBId !== userId) {
      return null;
    }

    return this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }
}