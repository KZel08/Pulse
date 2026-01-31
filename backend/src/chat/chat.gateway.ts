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

      console.log('Client connected:', client.data.user);
      // Join a room for this user so messages can be targeted to them
      client.join(`user:${client.data.user.id}`);
      
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.data?.user);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    payload: { toUserId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const sender = client.data.user;

    const convo = await this.chatService.getOrCreateConversation(
      sender.id,
      payload.toUserId,
    );

    const saved = await this.chatService.saveMessage(
      convo.id,
      sender.id,
      payload.content,
    );

    const messageData = {
      conversationId: convo.id,
      from: sender.id,
      content: saved.content,
      createdAt: saved.createdAt,
    };

    // Send to both users
    this.server.to(`user:${sender.id}`).emit('new_message', messageData);
    this.server.to(`user:${payload.toUserId}`).emit('new_message', messageData);
  }
}