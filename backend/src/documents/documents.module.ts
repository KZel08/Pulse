import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { StorageService } from '../storage/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  providers: [DocumentService, StorageService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentsModule {}
