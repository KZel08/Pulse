import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  storageKey: string;

  @Column()
  conversationId: string;

  @Column()
  uploadedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
