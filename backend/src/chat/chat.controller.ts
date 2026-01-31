import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('conversations')
  async getConversations(@Req() req: any) {
    return this.chatService.getUserConversations(req.user.userId);
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

    return messages;
  }
}