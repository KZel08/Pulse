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

@Module({
  imports: [JwtModule, ConfigModule, TypeOrmModule.forFeature([Message, Conversation, ConversationMember])],
  providers: [ChatGateway, ChatService, StorageService],
  controllers: [ChatController],
  exports: [StorageService],
})
export class ChatModule {}