import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly repo: Repository<Document>,
    private readonly storageService: StorageService,
  ) {}

  async createDocument(
    file: Express.Multer.File,
    conversationId: string,
    userId: string,
  ) {
    const key = `${Date.now()}_${file.originalname}`;

    await this.storageService.uploadFile(
      'pulse-files',
      key,
      file.buffer,
      file.mimetype,
    );

    return this.repo.save({
      fileName: file.originalname,
      storageKey: key,
      conversationId,
      uploadedBy: userId,
    });
  }

  async getEditorConfig(docId: string, user: { id: string; name: string }) {
    const doc = await this.repo.findOneBy({ id: docId });

    if (!doc) {
      throw new Error('Document not found');
    }

    const fileUrl = await this.storageService.generateSignedUrl(
      'pulse-files',
      doc.storageKey,
    );

    return {
      document: {
        title: doc.fileName,
        url: fileUrl,
        fileType: doc.fileName.split('.').pop(),
        key: doc.id,
      },
      editorConfig: {
        mode: 'edit',
        user: {
          id: user.id,
          name: user.name,
        },
      },
    };
  }

  async getDocumentsByConversation(conversationId: string) {
    return this.repo.find({
      where: { conversationId },
      order: { createdAt: 'DESC' },
    });
  }
}
