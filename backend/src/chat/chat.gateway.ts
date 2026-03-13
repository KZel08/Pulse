import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Inject, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';

const onlineUsers = new Map<string, number>();

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers['authorization']?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });

      // Attach user info to socket
      client.data.user = {
        id: payload.sub,
        email: payload.email,
      };

      const userId = client.data.user.id;

      // Increment connection count
      const count = onlineUsers.get(userId) || 0;
      onlineUsers.set(userId, count + 1);

      // Notify others user is online
      client.broadcast.emit('presence', {
        userId,
        status: 'online',
      });

      // Join a room for this user so messages can be targeted to them
      client.join(`user:${userId}`);

      const memberships = await this.chatService.getUserMemberships(userId);
      memberships.forEach((m) => {
        client.join(m.conversationId);
      });
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data?.user;
    if (!user) return;

    const count = onlineUsers.get(user.id) || 0;

    if (count <= 1) {
      onlineUsers.delete(user.id);

      // Notify others user is offline
      client.broadcast.emit('presence', {
        userId: user.id,
        status: 'offline',
      });
    } else {
      onlineUsers.set(user.id, count - 1);
    }
    console.log('Client disconnected:', client.data?.user);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    payload: { conversationId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const sender = client.data.user;

    // Ensure the sender joins the conversation room
    client.join(payload.conversationId);

    const saved = await this.chatService.saveMessage(
      payload.conversationId,
      sender.id,
      payload.content,
    );

    // Broadcast message
    this.server.to(payload.conversationId).emit('new_message', saved);

    // Get all conversation members except sender
    const members = await this.chatService.getConversationMembers(
      payload.conversationId,
    );
    const recipients = members.filter((member) => member.userId !== sender.id);

    // Mark delivered per user and emit real-time events
    for (const recipient of recipients) {
      await this.chatService.markUserDelivered(saved.id, recipient.userId);

      this.server.to(payload.conversationId).emit('message_delivered', {
        messageId: saved.id,
        userId: recipient.userId,
        deliveredAt: new Date(),
      });
    }
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @MessageBody()
    payload: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (!user) return;

    // Notify others in the conversation
    client.to(payload.conversationId).emit('typing', {
      conversationId: payload.conversationId,
      userId: user.id,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(
    @MessageBody()
    payload: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (!user) return;

    client.to(payload.conversationId).emit('typing', {
      conversationId: payload.conversationId,
      userId: user.id,
      isTyping: false,
    });
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @MessageBody()
    payload: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(payload.conversationId);
  }

  @SubscribeMessage('mark_delivered')
  async handleMarkDelivered(
    @MessageBody()
    payload: { messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (!user) return;

    await this.chatService.markUserDelivered(payload.messageId, user.id);
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @MessageBody()
    payload: { messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (!user) return;

    await this.chatService.markAsRead(payload.messageId, user.id);

    // Get message to find conversationId for emitting read event
    const message = await this.chatService.getMessageById(payload.messageId);
    if (message) {
      this.server.to(message.conversationId).emit('messages_read', {
        conversationId: message.conversationId,
        userId: user.id,
        readAt: new Date(),
        messageId: payload.messageId,
      });
    }
  }

  @SubscribeMessage('mark_conversation_as_read')
  async handleMarkConversationAsRead(
    @MessageBody()
    payload: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (!user) return;

    await this.chatService.markConversationAsRead(
      payload.conversationId,
      user.id,
    );
  }

  private isUserOnline(userId: string): boolean {
    return onlineUsers.has(userId);
  }
}
