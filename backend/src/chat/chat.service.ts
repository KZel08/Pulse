import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { Not, In } from 'typeorm';
import { ConversationMember } from './entities/conversation-member.entity';
import { StorageService } from '../storage/storage.service';
import { ChatGateway } from './chat.gateway';
import { MessageReceipt } from './entities/message-receipt.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly convoRepo: Repository<Conversation>,
    @InjectRepository(ConversationMember)
    private readonly memberRepo: Repository<ConversationMember>,
    @InjectRepository(MessageReceipt)
    private readonly receiptRepo: Repository<MessageReceipt>,
    private readonly storageService: StorageService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
  ) {}

  async markConversationAsRead(conversationId: string, userId: string) {
    const messages = await this.messageRepo.find({
      where: { conversationId },
    });

    const messageIds = messages.map((m) => m.id);

    await this.receiptRepo.update(
      { messageId: In(messageIds), userId },
      { isRead: true },
    );

    // Emit read receipt to all participants in the conversation
    if (this.chatGateway && this.chatGateway.server) {
      this.chatGateway.server.to(conversationId).emit('message_read', {
        conversationId,
      });
    }
  }

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
  async saveMessage(conversationId: string, senderId: string, content: string) {
    const message = this.messageRepo.create({
      conversationId,
      senderId,
      content,
    });

    const savedMessage = await this.messageRepo.save(message);

    // Update search_vector for full-text search
    await this.messageRepo.query(
      `
      UPDATE messages
      SET search_vector = to_tsvector('english', content)
      WHERE id = $1
      `,
      [savedMessage.id],
    );

    // Create message receipts for all conversation members except sender
    const members = await this.memberRepo.find({
      where: { conversationId },
    });

    const receipts = members
      .filter((m) => m.userId !== senderId)
      .map((m) => ({
        messageId: savedMessage.id,
        userId: m.userId,
        isDelivered: false,
        isRead: false,
      }));

    await this.receiptRepo.save(receipts);

    return savedMessage;
  }

  async getConversationMessages(conversationId: string, limit = 50) {
    return this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }

  async searchMessages(query: string, userId: string) {
    return this.messageRepo.query(
      `
      SELECT *
      FROM messages
      WHERE search_vector @@ plainto_tsquery('english', $1)
      ORDER BY createdAt DESC
      LIMIT 50
      `,
      [query],
    );
  }

  async getUserConversations(userId: string) {
    const conversations = await this.convoRepo.find({
      where: [{ userAId: userId }, { userBId: userId }],
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
        content: string | undefined;
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

      // Get all messages in the conversation sent by other users
      const messages = await this.messageRepo.find({
        where: {
          conversationId: convo.id,
          senderId: Not(userId),
        },
      });

      const messageIds = messages.map((m) => m.id);

      // Count unread messages by checking message receipts
      const unreadCount = await this.receiptRepo.count({
        where: {
          messageId: In(messageIds),
          userId,
          isRead: false,
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

      // Get all messages in the conversation sent by other users
      const messages = await this.messageRepo.find({
        where: {
          conversationId: convo.id,
          senderId: Not(userId),
        },
      });

      const messageIds = messages.map((m) => m.id);

      // Count unread messages by checking message receipts
      const unreadCount = await this.receiptRepo.count({
        where: {
          messageId: In(messageIds),
          userId,
          isRead: false,
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
    if (!convo) {
      return null;
    }

    //Access control: user must be a participant
    if (convo.userAId !== userId && convo.userBId !== userId) {
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

    const members = [
      {
        conversationId: convo.id,
        userId: creatorId,
        role: 'admin' as const,
      },
      ...memberIds.map((userId) => ({
        conversationId: convo.id,
        userId,
        role: 'member' as const,
      })),
    ];

    await this.memberRepo.save(members);

    return convo;
  }

  async isAdmin(conversationId: string, userId: string) {
    const member = await this.memberRepo.findOne({
      where: { conversationId, userId },
    });

    return member?.role === 'admin';
  }

  async addMember(
    conversationId: string,
    requesterId: string,
    newUserId: string,
  ) {
    const isAdmin = await this.isAdmin(conversationId, requesterId);
    if (!isAdmin) {
      throw new Error('Not authorized');
    }

    return this.memberRepo.save({
      conversationId,
      userId: newUserId,
      role: 'member',
    });
  }

  async removeMember(
    conversationId: string,
    requesterId: string,
    targetUserId: string,
  ) {
    const isAdmin = await this.isAdmin(conversationId, requesterId);
    if (!isAdmin) {
      throw new Error('Not authorized');
    }

    return this.memberRepo.delete({
      conversationId,
      userId: targetUserId,
    });
  }

  async leaveGroup(conversationId: string, userId: string) {
    const convo = await this.convoRepo.findOne({
      where: { id: conversationId },
    });

    if (!convo || convo.type !== 'group') {
      throw new Error('Invalid group');
    }

    const member = await this.memberRepo.findOne({
      where: { conversationId, userId },
    });

    if (!member) {
      throw new Error('Not a member');
    }

    // Remove the member
    await this.memberRepo.delete({
      conversationId,
      userId,
    });

    // Check remaining members
    const remainingMembers = await this.memberRepo.find({
      where: { conversationId },
    });

    if (remainingMembers.length === 0) {
      // Delete conversation and messages
      await this.messageRepo.delete({ conversationId });
      await this.convoRepo.delete({ id: conversationId });
      return { deleted: true };
    }

    // If user was admin, ensure at least one admin remains
    if (member.role === 'admin') {
      const admins = remainingMembers.filter((m) => m.role === 'admin');

      if (admins.length === 0) {
        // Promote first member
        await this.memberRepo.update(
          { id: remainingMembers[0].id },
          { role: 'admin' },
        );
      }
    }

    return { left: true };
  }

  async markUserDelivered(messageId: string, userId: string) {
    await this.receiptRepo.update(
      { messageId, userId },
      { isDelivered: true, deliveredAt: new Date() },
    );
  }

  async markAsRead(messageId: string, userId: string) {
    await this.receiptRepo.update(
      { messageId, userId },
      { isRead: true, readAt: new Date() },
    );
  }

  async markAsDelivered(messageId: string) {
    await this.receiptRepo.update({ messageId }, { isDelivered: true });
  }

  async getConversationMembers(conversationId: string) {
    return this.memberRepo.find({
      where: { conversationId },
    });
  }

  async getMessageById(messageId: string) {
    return this.messageRepo.findOne({
      where: { id: messageId },
    });
  }

  async getMessageReadStatus(messageId: string) {
    const receipts = await this.receiptRepo.find({
      where: { messageId, isRead: true },
    });

    return {
      messageId,
      seenBy: receipts.map((receipt) => ({
        userId: receipt.userId,
        readAt: receipt.createdAt,
      })),
    };
  }

  async uploadAndSendFile(
    conversationId: string,
    senderId: string,
    file: Express.Multer.File,
  ) {
    const bucket = 'pulse-files';

    const uploaded = await this.storageService.uploadFile(
      bucket,
      `${Date.now()}-${file.originalname}`,
      file.buffer,
      file.mimetype,
    );

    const message = await this.messageRepo.save({
      conversationId,
      senderId,
      fileUrl: uploaded.url,
      fileName: file.originalname,
    });

    // Create message receipts for all conversation members except sender
    const members = await this.memberRepo.find({
      where: { conversationId },
    });

    const receipts = members
      .filter((m) => m.userId !== senderId)
      .map((m) => ({
        messageId: message.id,
        userId: m.userId,
        isDelivered: false,
        isRead: false,
      }));

    await this.receiptRepo.save(receipts);

    return message;
  }
}
