import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { Not } from 'typeorm';
import { ConversationMember } from './entities/conversation-member.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly convoRepo: Repository<Conversation>,
    @InjectRepository(ConversationMember)
    private readonly memberRepo: Repository<ConversationMember>,
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
        type: 'direct',
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

  const memberships = await this.memberRepo.find({
    where: { userId },
  });

  const results: Array<{
    conversationId: string;
    otherUserId: string | null;
    name: string | null;
    type: 'direct' | 'group';
    lastMessage: {
      content: string;
      createdAt: Date;
      senderId: string;
    } | null;
    unreadCount: number;
  }> = [];

  for (const convo of conversations) {
    const otherUserId =
      convo.userAId === userId ? convo.userBId : convo.userAId;

    // Skip if otherUserId is undefined (shouldn't happen in valid data)
    if (!otherUserId) continue;

    const lastMessage = await this.messageRepo.findOne({
      where: { conversationId: convo.id },
      order: { createdAt: 'DESC' },
    });

    const unreadCount = await this.messageRepo.count({
      where: {
        conversationId: convo.id,
        isRead: false,
        senderId: Not(userId),
      },
    });

    results.push({
      conversationId: convo.id,
      otherUserId,
      name: null,
      type: convo.type,
      lastMessage: lastMessage
        ? {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            senderId: lastMessage.senderId,
          }
        : null,
      unreadCount,
    });
  }

  // Add group conversations from memberships
  for (const membership of memberships) {
    const convo = await this.convoRepo.findOne({
      where: { id: membership.conversationId },
    });

    if (!convo || convo.type !== 'group') continue;

    const lastMessage = await this.messageRepo.findOne({
      where: { conversationId: convo.id },
      order: { createdAt: 'DESC' },
    });

    const unreadCount = await this.messageRepo.count({
      where: {
        conversationId: convo.id,
        isRead: false,
        senderId: Not(userId),
      },
    });

    results.push({
      conversationId: convo.id,
      otherUserId: null,
      name: convo.name || null,
      type: convo.type,
      lastMessage: lastMessage
        ? {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            senderId: lastMessage.senderId,
          }
        : null,
      unreadCount,
    });
  }

  return results;
}

  async getUserMemberships(userId: string) {
    return this.memberRepo.find({
      where: { userId },
    });
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
    if(convo.userAId !== userId && convo.userBId !== userId) {
      return null;
    }

    return this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }
  async createGroupConversation(
  name: string,
  creatorId: string,
  memberIds: string[],
) {
  const convo = await this.convoRepo.save({
    type: 'group',
    name,
  });

  const members = [creatorId, ...memberIds].map((userId) => ({
    conversationId: convo.id,
    userId,
  }));

  await this.memberRepo.save(members);

  return convo;
}
}