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
import { ChatService } from './chat.service';

const onlineUsers = new Map<string, number>();

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

    const messageData = {
      conversationId: payload.conversationId,
      from: sender.id,
      content: saved.content,
      createdAt: saved.createdAt,
    };

    // Broadcast to all users in the conversation room
    this.server.to(payload.conversationId).emit('new_message', messageData);
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

  private isUserOnline(userId: string): boolean {
    return onlineUsers.has(userId);
  }
}