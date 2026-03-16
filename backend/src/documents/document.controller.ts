import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentService } from './document.service';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDoc(
    @UploadedFile() file: Express.Multer.File,
    @Body('conversationId') conversationId: string,
    @Req() req: any,
  ) {
    return this.documentService.createDocument(
      file,
      conversationId,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/editor-config')
  async getEditorConfig(@Param('id') id: string, @Req() req: any) {
    return this.documentService.getEditorConfig(id, {
      id: req.user.userId,
      name: req.user.name || 'User',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('conversation/:conversationId')
  async getDocuments(@Param('conversationId') conversationId: string) {
    return this.documentService.getDocumentsByConversation(conversationId);
  }
}
