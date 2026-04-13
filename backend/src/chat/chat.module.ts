import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ChatService } from './chat.service';
import { Conversation } from './entities/conversation.entity';
import { ChatController } from './chat.controller';
import { ConversationMember } from './entities/conversation-member.entity';
import { StorageService } from '../storage/storage.service';
import { AiModule } from '../ai/ai.module';
import { MessageReceipt } from './entities/message-receipt.entity';
import { MessageReaction } from './entities/message-reaction.entity';
import { PinnedMessage } from './entities/pinned-message.entity';

@Module({
  imports: [
    JwtModule,
    ConfigModule,
    AiModule,
    TypeOrmModule.forFeature([
      Message,
      Conversation,
      ConversationMember,
      MessageReceipt,
      MessageReaction,
      PinnedMessage,
    ]),
  ],
  providers: [ChatGateway, ChatService, StorageService],
  controllers: [ChatController],
  exports: [StorageService],
})
export class ChatModule {}
