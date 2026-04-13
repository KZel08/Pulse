import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('pinned_messages')
@Unique(['messageId'])
export class PinnedMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @Column()
  conversationId: string;

  @Column()
  pinnedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
