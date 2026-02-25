import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  NotFoundException,
  ForbiddenException,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('conversations')
  async getConversations(@Req() req: any) {
    return this.chatService.getUserConversations(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('groups')
  async createGroup(
    @Req() req: any,
    @Body() body: { name: string; memberIds: string[] },
  ) {
    return this.chatService.createGroupConversation(
      body.name,
      req.user.userId,
      body.memberIds,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('conversations/:conversationId/messages')
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Req() req: any,
  ) {
    const messages = await this.chatService.getMessagesForConversation(
      conversationId,
      req.user.userId,
    );

    if (messages === null) {
      throw new ForbiddenException('Access denied');
    }

    // Make any active sockets for this user join the conversation room
    try {
      if (this.chatGateway && this.chatGateway.server) {
        const sockets = await this.chatGateway.server
          .in(`user:${req.user.userId}`)
          .fetchSockets();
        for (const s of sockets) {
          s.join(conversationId);
        }
      }
    } catch (err) {
      // non-fatal; continue returning messages even if join fails
    }

    return messages;
  }

  @UseGuards(JwtAuthGuard)
  @Post('groups/:conversationId/add')
  async addMember(
    @Param('conversationId') conversationId: string,
    @Req() req: any,
    @Body() body: { userId: string },
  ) {
    return this.chatService.addMember(
      conversationId,
      req.user.userId,
      body.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('groups/:conversationId/remove')
  async removeMember(
    @Param('conversationId') conversationId: string,
    @Req() req: any,
    @Body() body: { userId: string },
  ) {
    return this.chatService.removeMember(
      conversationId,
      req.user.userId,
      body.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('groups/:conversationId/leave')
  async leaveGroup(
    @Param('conversationId') conversationId: string,
    @Req() req: any,
  ) {
    return this.chatService.leaveGroup(
      conversationId,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('conversations/:conversationId/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('conversationId') conversationId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const result = await this.chatService.uploadAndSendFile(
      conversationId,
      req.user.userId,
      file,
    );

    return result;
  }
}