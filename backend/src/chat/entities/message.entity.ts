import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationId: string;

  @Column()
  senderId: string;

  @Column('text', { nullable: true })
  content?: string;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ default: false })
  isAIValidated: boolean;

  @Column({ nullable: true })
  safetyScore?: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'tsvector', nullable: true })
  searchVector: string;
}
