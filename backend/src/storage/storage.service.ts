import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class StorageService {
  private client: Minio.Client;

  constructor() {
    this.client = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    });
  }

  async uploadFile(
    bucket: string,
    fileName: string,
    buffer: Buffer,
    mimeType: string,
  ) {
    await this.client.putObject(bucket, fileName, buffer, undefined, {
      'Content-Type': mimeType,
    });

    return {
      url: `http://localhost:9000/${bucket}/${fileName}`,
    };
  }

  async generateSignedUrl(
    bucket: string,
    fileName: string,
    expirySeconds = 300,
  ) {
    return this.client.presignedGetObject(bucket, fileName, expirySeconds);
  }
}
